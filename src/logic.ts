/**
 * Lógica pura da aplicação Safe Place (desacoplada do DOM para testes unitários e clareza).
 * Responsável por:
 * - Cálculo da Dica do Dia determinística por data
 * - Busca simples e tolerante a acentos nas páginas ativas
 * - Avaliação do Checklist "Posso confiar nesta loja?"
 * - Cálculo de progresso do Checklist de Proteção pessoal
 * - Cálculo de escala de fonte, filtros de golpes e etapas passo a passo no celular
 */

export interface SearchableItem {
  id: string;
  type: 'golpe' | 'aprender' | 'ferramenta';
  title: string;
  summary: string;
  keywords: string[];
  route: string;
}

export interface ChecklistAnswerMap {
  [questionId: string]: 'yes' | 'no' | undefined;
}

export interface ProtectionCompletedMap {
  [itemId: string]: boolean | undefined;
}

export interface ChecklistQuestion {
  id: string;
  question: string;
  helpText: string;
  /** Se a resposta "yes" ou "no" representa risco. */
  riskWhen: 'yes' | 'no';
  /** Peso do risco: 'critical' (forte indício de golpe) ou 'warning' (sinal de atenção). */
  severity: 'critical' | 'warning';
  reasonIfRisk: string;
}

export interface ChecklistEvaluation {
  status: 'safe' | 'caution' | 'danger' | 'incomplete';
  title: string;
  summary: string;
  reasons: string[];
  answeredCount: number;
  totalQuestions: number;
}

/**
 * Remove acentos e coloca em minúsculas para facilitar a busca de quem digita sem acento.
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Escolhe a dica do dia de forma determinística baseada na data local (ano, mês, dia).
 */
export function getDailyTipIndex(date: Date, totalTips: number): number {
  if (totalTips <= 0) return 0;
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const daySeed = year * 10000 + month * 100 + day;
  return Math.abs((daySeed * 31 + day * 7) % totalTips);
}

/**
 * Filtra itens buscáveis por palavras digitadas, ignorando acentos e maiúsculas.
 */
export function searchItems(query: string, items: SearchableItem[]): SearchableItem[] {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return [];

  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  const scored = items
    .map((item) => {
      const titleNorm = normalizeText(item.title);
      const summaryNorm = normalizeText(item.summary);
      const keywordsNorm = item.keywords.map(normalizeText).join(' ');
      const fullText = `${titleNorm} ${summaryNorm} ${keywordsNorm}`;

      let score = 0;
      for (const term of terms) {
        if (titleNorm.includes(term)) score += 5;
        if (keywordsNorm.includes(term)) score += 3;
        if (summaryNorm.includes(term)) score += 1;
        if (!fullText.includes(term)) {
          return { item, score: 0 };
        }
      }
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((entry) => entry.item);
}

/**
 * Avalia as respostas do checklist "Posso confiar nesta loja?" e retorna
 * o veredito ("Parece seguro", "Cuidado", "Provável golpe") e os motivos claros.
 */
export function evaluateStoreChecklist(
  questions: ChecklistQuestion[],
  answers: ChecklistAnswerMap
): ChecklistEvaluation {
  const totalQuestions = questions.length;
  let answeredCount = 0;
  let criticalCount = 0;
  let warningCount = 0;
  const reasons: string[] = [];

  for (const q of questions) {
    const ans = answers[q.id];
    if (ans === 'yes' || ans === 'no') {
      answeredCount++;
      if (ans === q.riskWhen) {
        if (q.severity === 'critical') {
          criticalCount++;
        } else {
          warningCount++;
        }
        reasons.push(q.reasonIfRisk);
      }
    }
  }

  if (answeredCount < totalQuestions) {
    return {
      status: 'incomplete',
      title: 'Responda todas as perguntas para ver o resultado',
      summary: `Você respondeu ${answeredCount} de ${totalQuestions} perguntas.`,
      reasons,
      answeredCount,
      totalQuestions,
    };
  }

  if (criticalCount >= 1 || warningCount >= 3) {
    return {
      status: 'danger',
      title: 'Provável golpe — Melhor não comprar!',
      summary:
        'Encontramos sinais muito fortes de loja falsa. Golpistas usam exatamente essas armadilhas para enganar quem está comprando de boa-fé.',
      reasons,
      answeredCount,
      totalQuestions,
    };
  }

  if (warningCount >= 1) {
    return {
      status: 'caution',
      title: 'Cuidado — Pesquise mais antes de pagar',
      summary:
        'Alguns detalhes pedem atenção. Não tenha pressa: confira a reputação da loja no Reclame Aqui e nunca pague por Pix se tiver qualquer dúvida.',
      reasons,
      answeredCount,
      totalQuestions,
    };
  }

  return {
    status: 'safe',
    title: 'Parece seguro — Mesmo assim, siga boas práticas',
    summary:
      'A loja passou nos principais sinais de confiança! Ainda assim, prefira pagar com cartão de crédito virtual e guarde os comprovantes.',
    reasons: [
      'O preço está dentro da realidade do mercado.',
      'A loja aceita cartão de crédito e mostra CNPJ e canais claros de atendimento.',
      'Você conferiu o endereço do site e pesquisou a reputação antes.',
    ],
    answeredCount,
    totalQuestions,
  };
}

/**
 * Calcula o progresso do Checklist de Proteção pessoal.
 */
export function summarizeProtectionProgress(
  itemIds: string[],
  completedMap: ProtectionCompletedMap
): { completedCount: number; totalCount: number; percent: number; allDone: boolean } {
  const totalCount = itemIds.length;
  if (totalCount === 0) {
    return { completedCount: 0, totalCount: 0, percent: 0, allDone: false };
  }

  let completedCount = 0;
  for (const id of itemIds) {
    if (completedMap[id] === true) {
      completedCount++;
    }
  }

  const percent = Math.round((completedCount / totalCount) * 100);
  return {
    completedCount,
    totalCount,
    percent,
    allDone: completedCount === totalCount,
  };
}

/**
 * Limita o nível de tamanho de fonte entre 0 (Padrão 19px), 1 (Grande 21.5px), 2 (Extra Grande 24px) e -1 (Levemente menor 17px).
 */
export function clampFontStep(step: number): number {
  if (Number.isNaN(step)) return 0;
  return Math.max(-1, Math.min(2, Math.round(step)));
}

/**
 * Converte o nível de fonte para tamanho em pixels no elemento raiz.
 */
export function fontStepToPx(step: number): number {
  const clamped = clampFontStep(step);
  const map: Record<number, number> = {
    '-1': 17,
    '0': 19,
    '1': 21.5,
    '2': 24,
  };
  return map[clamped] ?? 19;
}

export type ScamFilterCategory = 'todos' | 'whatsapp' | 'pix' | 'compras' | 'links';

const SCAM_CATEGORY_SLUGS: Record<Exclude<ScamFilterCategory, 'todos'>, string[]> = {
  whatsapp: ['whatsapp-clonado', 'parente-numero-novo', 'link-malicioso', 'falso-pix'],
  pix: ['loja-falsa', 'parente-numero-novo', 'falso-pix'],
  compras: ['loja-falsa', 'link-malicioso'],
  links: ['link-malicioso', 'loja-falsa'],
};

/**
 * Filtra os 5 golpes ativos pelas etiquetas de pílula ("Todos", "WhatsApp", "Pix", "Compras", "Links").
 */
export function filterScamsByCategory<T extends { slug: string }>(
  scams: T[],
  category: ScamFilterCategory
): T[] {
  if (category === 'todos') return scams;
  const allowed = SCAM_CATEGORY_SLUGS[category] || [];
  return scams.filter((scam) => allowed.includes(scam.slug));
}

/**
 * Calcula o índice do cartão visível no carrossel horizontal a partir da posição de rolagem.
 */
export function computeCarouselActiveIndex(
  scrollLeft: number,
  cardStride: number,
  totalItems: number
): number {
  if (totalItems <= 1 || cardStride <= 0) return 0;
  const rawIndex = Math.round(Math.max(0, scrollLeft) / cardStride);
  return Math.max(0, Math.min(totalItems - 1, rawIndex));
}

/**
 * Limita o índice do passo a passo (0 até totalQuestions, onde totalQuestions representa a tela final de resultado).
 */
export function clampWizardStep(step: number, totalQuestions: number): number {
  if (totalQuestions <= 0 || Number.isNaN(step)) return 0;
  return Math.max(0, Math.min(totalQuestions, Math.round(step)));
}

/**
 * Retorna a primeira pergunta ainda não respondida (0..N-1), ou N (tela de resultado) quando todas já foram respondidas.
 */
export function getInitialWizardStep(
  itemIds: string[],
  answers: Record<string, string | undefined>
): number {
  for (let i = 0; i < itemIds.length; i++) {
    const val = answers[itemIds[i]];
    if (!val) return i;
  }
  return itemIds.length;
}

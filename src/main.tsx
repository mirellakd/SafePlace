/**
 * Safe Place — Controlador principal em JavaScript/TypeScript puro (sem frameworks, sem backend).
 *
 * PÁGINAS ATIVAS DO SITE:
 * 1. Início (#inicio)
 * 2. Preciso de ajuda agora (#ajuda — triagem interativa com passo a passo)
 * 3. Golpes (#golpes + 5 guias: loja-falsa, link-malicioso, whatsapp-clonado, parente-numero-novo, falso-pix)
 * 4. Compras: checklist "Posso confiar nesta loja?" (#compras-seguras)
 * 5. Checklist de proteção (#protecao)
 * 6. Aprender: 4 lições de celular (#aprender + videochamada, tirar-print, aumentar-a-letra, instalar-app-seguranca)
 *
 * Mantém o design tátil lilás/azul-escuro/branco, controles de acessibilidade (A-/A+, Contraste, Ouvir página),
 * salvamento em localStorage e adaptações mobile (<= 768px) com carrosséis horizontais, acordeões e passo a passo.
 */

import './index.css';
import {
  DAILY_TIPS,
  LEARN_LESSONS,
  SCAMS_DATA,
  STORE_CHECKLIST_QUESTIONS,
  buildSearchIndex,
  type LearnLesson,
  type ScamPageData,
} from './data';
import {
  clampFontStep,
  clampWizardStep,
  evaluateStoreChecklist,
  filterScamsByCategory,
  fontStepToPx,
  getDailyTipIndex,
  getInitialWizardStep,
  searchItems,
  summarizeProtectionProgress,
  type ChecklistAnswerMap,
  type ProtectionCompletedMap,
  type ScamFilterCategory,
} from './logic';
import {
  EMERGENCY_TRIAGE_CASES,
  PROTECTION_CHECKLIST_ITEMS,
  type ProtectionChecklistItem,
} from './extraData';
import { Icons } from './icons';
import { Illustrations } from './illustrations';
import { initMobileCarousels, renderMobileCarousel } from './carousel';

// Chaves salvas localmente no navegador (localStorage)
const STORAGE_KEYS = {
  fontStep: 'safeplace_font_step',
  highContrast: 'safeplace_high_contrast',
  marqueePaused: 'safeplace_marquee_paused',
  completedLessons: 'safeplace_completed_lessons',
  checklistAnswers: 'safeplace_store_checklist',
  protectionCompleted: 'safeplace_protection_checklist',
};

interface AppState {
  fontStep: number;
  highContrast: boolean;
  marqueePaused: boolean;
  completedLessons: string[];
  checklistAnswers: ChecklistAnswerMap;
  protectionCompleted: ProtectionCompletedMap;
  checklistStep: number;
  scamCategoryFilter: ScamFilterCategory;
  showAllScamsStacked: boolean;
  showAllProtectionStacked: boolean;
  emergencyCaseId: string;
  searchQuery: string;
  extraTipOffset: number;
  isSpeaking: boolean;
}

const SEARCH_INDEX = buildSearchIndex();
const VALID_LESSON_IDS = new Set(LEARN_LESSONS.map((l) => l.id));

function loadInitialState(): AppState {
  let fontStep = 0;
  let highContrast = false;
  let marqueePaused = false;
  let completedLessons: string[] = [];
  let checklistAnswers: ChecklistAnswerMap = {};
  let protectionCompleted: ProtectionCompletedMap = {};

  try {
    const savedFont = localStorage.getItem(STORAGE_KEYS.fontStep);
    if (savedFont !== null) fontStep = clampFontStep(Number(savedFont));

    highContrast = localStorage.getItem(STORAGE_KEYS.highContrast) === 'true';
    marqueePaused = localStorage.getItem(STORAGE_KEYS.marqueePaused) === 'true';

    const savedLessons = localStorage.getItem(STORAGE_KEYS.completedLessons);
    if (savedLessons) {
      const parsed = JSON.parse(savedLessons);
      if (Array.isArray(parsed)) {
        completedLessons = parsed.filter(
          (id): id is string => typeof id === 'string' && VALID_LESSON_IDS.has(id)
        );
      }
    }

    const savedChecklist = localStorage.getItem(STORAGE_KEYS.checklistAnswers);
    if (savedChecklist) {
      const parsed = JSON.parse(savedChecklist);
      if (parsed && typeof parsed === 'object') checklistAnswers = parsed;
    }

    const savedProtection = localStorage.getItem(STORAGE_KEYS.protectionCompleted);
    if (savedProtection) {
      const parsed = JSON.parse(savedProtection);
      if (parsed && typeof parsed === 'object') protectionCompleted = parsed;
    }
  } catch {
    // Segue valores padrão caso localStorage esteja restrito
  }

  const checklistIds = STORE_CHECKLIST_QUESTIONS.map((q) => q.id);

  return {
    fontStep,
    highContrast,
    marqueePaused,
    completedLessons,
    checklistAnswers,
    protectionCompleted,
    checklistStep: getInitialWizardStep(checklistIds, checklistAnswers),
    scamCategoryFilter: 'todos',
    showAllScamsStacked: false,
    showAllProtectionStacked: false,
    emergencyCaseId: EMERGENCY_TRIAGE_CASES[0].id,
    searchQuery: '',
    extraTipOffset: 0,
    isSpeaking: false,
  };
}

const state: AppState = loadInitialState();

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function stripLeadingQuestionNumber(text: string): string {
  return text.replace(/^\d+\.\s*/, '');
}

function announce(message: string): void {
  const el = document.getElementById('live-announcer');
  if (el) el.textContent = message;
}

// Aplica tamanho de fonte, alto contraste e estado de pausa da faixa em movimento
function applyAccessibilityPreferences(): void {
  const px = fontStepToPx(state.fontStep);
  document.documentElement.style.setProperty('--base-font-size', `${px}px`);
  document.documentElement.classList.toggle('high-contrast', state.highContrast);
  document.body.classList.toggle('marquee-paused', state.marqueePaused);

  const btnContrast = document.getElementById('btn-contrast');
  if (btnContrast) {
    btnContrast.setAttribute('aria-pressed', String(state.highContrast));
  }

  const btnMarquee = document.getElementById('btn-toggle-marquee');
  const lblMarquee = document.getElementById('label-marquee-toggle');
  if (btnMarquee && lblMarquee) {
    btnMarquee.setAttribute('aria-pressed', String(state.marqueePaused));
    lblMarquee.textContent = state.marqueePaused ? 'Animar' : 'Pausar';
  }

  const btnDecrease = document.getElementById('btn-font-decrease') as HTMLButtonElement | null;
  const btnIncrease = document.getElementById('btn-font-increase') as HTMLButtonElement | null;
  if (btnDecrease) btnDecrease.disabled = state.fontStep <= -1;
  if (btnIncrease) btnIncrease.disabled = state.fontStep >= 2;

  try {
    localStorage.setItem(STORAGE_KEYS.fontStep, String(state.fontStep));
    localStorage.setItem(STORAGE_KEYS.highContrast, String(state.highContrast));
    localStorage.setItem(STORAGE_KEYS.marqueePaused, String(state.marqueePaused));
  } catch {
    // Ignora caso restrito
  }
}

// ============================================================================
// LEITURA EM VOZ ALTA (WEB SPEECH API EM PT-BR)
// ============================================================================
function updateSpeakButtonUI(): void {
  const btnSpeak = document.getElementById('btn-speak');
  const iconSpeak = document.getElementById('icon-speak');
  const labelSpeak = document.getElementById('label-speak');
  if (!btnSpeak || !iconSpeak || !labelSpeak) return;

  btnSpeak.setAttribute('aria-pressed', String(state.isSpeaking));
  if (state.isSpeaking) {
    iconSpeak.innerHTML = Icons.stopSquare;
    labelSpeak.textContent = 'Parar voz';
  } else {
    iconSpeak.innerHTML = Icons.volume;
    labelSpeak.textContent = 'Ouvir esta página';
  }
}

function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  state.isSpeaking = false;
  updateSpeakButtonUI();
}

function toggleSpeakCurrentPage(): void {
  if (!('speechSynthesis' in window)) {
    announce('Seu navegador não possui suporte para leitura em voz alta.');
    return;
  }

  if (state.isSpeaking) {
    stopSpeaking();
    announce('Leitura em voz alta interrompida.');
    return;
  }

  const mainEl = document.getElementById('conteudo-principal');
  if (!mainEl) return;

  const readableText = mainEl.innerText.replace(/\s+/g, ' ').trim();
  if (!readableText) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(readableText);
  utterance.lang = 'pt-BR';
  utterance.rate = 0.95;

  const voices = window.speechSynthesis.getVoices();
  const ptBrVoice =
    voices.find((v) => v.lang.toLowerCase() === 'pt-br') ||
    voices.find((v) => v.lang.toLowerCase().startsWith('pt'));
  if (ptBrVoice) utterance.voice = ptBrVoice;

  utterance.onend = () => {
    state.isSpeaking = false;
    updateSpeakButtonUI();
  };
  utterance.onerror = () => {
    state.isSpeaking = false;
    updateSpeakButtonUI();
  };

  state.isSpeaking = true;
  updateSpeakButtonUI();
  window.speechSynthesis.speak(utterance);
}

// ============================================================================
// FAIXA DIVISÓRIA EM MOVIMENTO E ACORDEÃO MOBILE (>= 56PX DE TOQUE)
// ============================================================================
function renderDividerMarquee(text = 'PARE ✦ RESPIRE ✦ CONFIRA ✦ DÚVIDA? NÃO RESPONDA ✦ '): string {
  const repeated = `${text}${text}${text}`;
  return `
    <div class="marquee-divider" aria-hidden="true">
      <div class="marquee-track">
        <span>${escapeHtml(repeated)}</span>
        <span>${escapeHtml(repeated)}</span>
      </div>
    </div>
  `;
}

/**
 * Renderiza uma caixa de destaque que permanece 100% aberta no computador (> 768px)
 * e funciona como um bloco acordeão (abre e fecha com área de toque >= 56px) no celular (<= 768px).
 */
function renderResponsiveAccordionSection(params: {
  id: string;
  panelClass: string;
  iconHtml: string;
  title: string;
  bodyHtml: string;
  defaultOpenMobile?: boolean;
  extraTopBadgeHtml?: string;
}): string {
  const {
    id,
    panelClass,
    iconHtml,
    title,
    bodyHtml,
    defaultOpenMobile = false,
    extraTopBadgeHtml = '',
  } = params;

  const contentId = `${id}-content`;
  const headingId = `${id}-heading`;

  return `
    <section
      class="alert-panel ${panelClass} mobile-accordion ${defaultOpenMobile ? 'is-open' : ''}"
      aria-labelledby="${headingId}"
      data-mobile-accordion
    >
      ${extraTopBadgeHtml}
      <h2 id="${headingId}" style="margin: 0;">
        <button
          type="button"
          class="mobile-accordion-trigger"
          aria-expanded="${defaultOpenMobile ? 'true' : 'false'}"
          aria-controls="${contentId}"
          data-accordion-trigger
        >
          <span class="mobile-accordion-title-left">
            ${iconHtml}
            <span>${escapeHtml(title)}</span>
          </span>
          <span class="mobile-accordion-chevron-wrap" aria-hidden="true">
            ${Icons.chevronDown}
          </span>
        </button>
      </h2>
      <div id="${contentId}" class="mobile-accordion-content">
        ${bodyHtml}
      </div>
    </section>
  `;
}

// ============================================================================
// BUSCA INSTANTÂNEA NA PÁGINA INICIAL (SOMENTE PÁGINAS ATIVAS)
// ============================================================================
function renderSearchResultsInline(query: string): string {
  if (!query.trim()) return '';

  const matches = searchItems(query, SEARCH_INDEX);

  if (matches.length === 0) {
    return `
      <div class="page-hero-card" style="margin-top: 1.5rem; margin-bottom: 0;" role="region" aria-label="Resultados da busca">
        <p style="font-weight: 700; margin-bottom: 0.45rem;">
          Não achamos nada exato para "${escapeHtml(query)}".
        </p>
        <p style="margin-bottom: 1rem;">
          Tente palavras curtas como <strong>Pix</strong>, <strong>WhatsApp</strong>, <strong>loja</strong>, <strong>print</strong> ou <strong>proteção</strong>.
        </p>
        <a href="#ajuda" class="pill-btn pill-btn-navy">
          ${Icons.lifeBuoy}
          <span>Ir para ajuda imediata</span>
        </a>
      </div>
    `;
  }

  const typeLabelMap = {
    golpe: 'Guia de Golpe',
    aprender: 'Lição de Celular',
    ferramenta: 'Checklist e Ajuda',
  };

  const slides = matches.slice(0, 6).map(
    (item) => `
      <a href="#${item.route}" class="tactile-card tactile-card-white" style="grid-column: span 3;">
        <div>
          <span class="kicker-label">${typeLabelMap[item.type]}</span>
          <h3 class="card-title-bold">${escapeHtml(item.title)}</h3>
          <p class="card-desc">${escapeHtml(item.summary)}</p>
        </div>
        <span class="card-cta-line">
          <span>Abrir agora</span>
          ${Icons.arrowRight}
        </span>
      </a>
    `
  );

  return `
    <div style="margin-top: 1.4rem;" role="region" aria-label="Resultados da busca">
      <p style="font-weight: 700; margin-bottom: 0.85rem;">
        Achamos ${matches.length} ${matches.length === 1 ? 'resultado' : 'resultados'} para "${escapeHtml(query)}":
      </p>
      ${renderMobileCarousel({
        id: 'home-search-carousel',
        ariaLabel: 'Resultados encontrados na busca',
        desktopGridClass: 'editorial-scams-grid',
        slidesHtml: slides,
      })}
    </div>
  `;
}

// ============================================================================
// 1. PÁGINA INICIAL (#inicio)
// ============================================================================
function renderHomePage(): string {
  const baseTipIndex = getDailyTipIndex(new Date(), DAILY_TIPS.length);
  const currentTipIndex = (baseTipIndex + state.extraTipOffset) % DAILY_TIPS.length;
  const dailyTip = DAILY_TIPS[currentTipIndex];
  const featuredScam = SCAMS_DATA.find((s) => s.slug === 'parente-numero-novo') || SCAMS_DATA[0];

  const pathSlides = [
    `
      <a href="#golpe/link-malicioso" class="tactile-card path-span-7">
        <div class="path-card-inner">
          ${Illustrations.hookMessage}
          <div>
            <h3 class="card-title-bold">Recebi uma mensagem ou link estranho</h3>
            <p class="card-desc">
              SMS de encomenda presa, prêmio, parente com número novo ou falso Pix? Confira antes de tocar!
            </p>
          </div>
        </div>
        <span class="card-cta-line">
          <span>Conferir se é isca de golpe</span>
          ${Icons.arrowRight}
        </span>
      </a>
    `,
    `
      <a href="#compras-seguras" class="tactile-card tactile-card-lilac path-span-5">
        <div class="path-card-inner">
          ${Illustrations.shoppingCart}
          <div>
            <h3 class="card-title-bold">Quero comprar com segurança</h3>
            <p class="card-desc">
              Responda 7 perguntas rápidas de Sim ou Não no checklist "Posso confiar nesta loja?".
            </p>
          </div>
        </div>
        <span class="card-cta-line">
          <span>Testar loja agora</span>
          ${Icons.arrowRight}
        </span>
      </a>
    `,
    `
      <a href="#ajuda" class="tactile-card tactile-card-white path-span-5" style="border-width: 3px;">
        <div class="path-card-inner">
          ${Illustrations.safeHeartPadlock}
          <div>
            <h3 class="card-title-bold">Acho que caí em um golpe</h3>
            <p class="card-desc">
              Respire fundo, a culpa nunca é sua. Veja a triagem passo a passo do que fazer agora mesmo.
            </p>
          </div>
        </div>
        <span class="card-cta-line">
          <span>Ver passo a passo urgente</span>
          ${Icons.arrowRight}
        </span>
      </a>
    `,
    `
      <a href="#aprender" class="tactile-card path-span-7">
        <div class="path-card-inner">
          ${Illustrations.smartphoneFriendly}
          <div>
            <h3 class="card-title-bold">Quero aprender a usar o celular</h3>
            <p class="card-desc">
              4 lições práticas: fazer videochamada, tirar print, aumentar a letra e instalar apps com segurança.
            </p>
          </div>
        </div>
        <span class="card-cta-line">
          <span>Abrir as 4 lições</span>
          ${Icons.arrowRight}
        </span>
      </a>
    `,
  ];

  const threeStepsSlides = [
    `
      <div class="tactile-card tactile-card-white">
        ${Illustrations.handStop}
        <span class="step-pill-label">PASSO 1 · Pare</span>
        <h3 class="card-title-bold">Solte o celular e respire</h3>
        <p class="card-desc">
          Mensagem dando susto, prêmio ou pressa? Pare na hora. Quem fala a verdade pode esperar 5 minutos.
        </p>
      </div>
    `,
    `
      <div class="tactile-card tactile-card-lilac step-card-offset-2">
        ${Illustrations.magnifier}
        <span class="step-pill-label">PASSO 2 · Confira</span>
        <h3 class="card-title-bold">Chame pelo canal antigo</h3>
        <p class="card-desc">
          Dúvida? Não responda por ali. Ligue para o número antigo do seu filho ou abra você mesma o app do banco.
        </p>
      </div>
    `,
    `
      <div class="tactile-card tactile-card-white step-card-offset-3">
        ${Illustrations.shieldLock}
        <span class="step-pill-label">PASSO 3 · Só então responda</span>
        <h3 class="card-title-bold">Aja com tranquilidade</h3>
        <p class="card-desc">
          Confirmou que é real e conferiu o nome de quem recebe na tela final do Pix? Só então siga em frente!
        </p>
      </div>
    `,
  ];

  const topScamsSlides = SCAMS_DATA.map(
    (scam, index) => `
      <a href="#golpe/${scam.slug}" class="tactile-card ${index % 2 === 1 ? 'tactile-card-white' : ''}">
        <div>
          <span class="kicker-label">Golpe 0${scam.number} · ${escapeHtml(scam.categoryLabel)}</span>
          <h3 class="card-title-bold">${escapeHtml(scam.shortTitle)}</h3>
          <p class="card-desc">${escapeHtml(scam.whatIsIt)}</p>
        </div>
        <span class="card-cta-line">
          <span>Ver mensagem de exemplo</span>
          ${Icons.arrowRight}
        </span>
      </a>
    `
  );

  return `
    <!-- BANDA 1: SAUDAÇÃO + BUSCA (+ MOLDURA ILUSTRADA NO COMPUTADOR) -->
    <section class="band band-lilac" aria-labelledby="titulo-boas-vindas">
      <div class="band-inner">
        <div class="hero-grid">
          <div>
            <span class="hero-kicker">Calma. Confere antes de clicar.</span>
            <h1 id="titulo-boas-vindas" class="display-title hero-display-title">
              COMO POSSO TE AJUDAR HOJE?
            </h1>
            <p class="hero-subcopy">
              Qualquer pessoa pode cair — golpista é profissional. Aqui você tira dúvidas sem pressa, sem palavras difíceis e sem culpa.
            </p>

            <form id="home-search-form" class="tactile-search-form" role="search">
              <div class="tactile-input-wrap">
                <label for="home-search-input" class="sr-only">Busque por Pix, WhatsApp, compras ou assunto</label>
                <span class="tactile-input-icon">${Icons.search}</span>
                <input
                  type="search"
                  id="home-search-input"
                  class="tactile-search-input"
                  placeholder="Busque por: Pix, WhatsApp, compras..."
                  value="${escapeHtml(state.searchQuery)}"
                  autocomplete="off"
                />
              </div>
              <button type="submit" class="pill-btn pill-btn-navy">
                ${Icons.search}
                <span>Buscar</span>
              </button>
            </form>
          </div>

          <div class="hero-frame-card hero-frame-card-home">
            <div class="sticker-badge-corner sticker-badge-float">
              ${Illustrations.stickerNoBlame}
            </div>
            ${Illustrations.heroScene}
          </div>
        </div>

        <div id="home-search-results">
          ${renderSearchResultsInline(state.searchQuery)}
        </div>
      </div>
    </section>

    <!-- BANDA 2: ESCOLHA SEU CAMINHO (Carrossel no celular, Grade assimétrica no computador) -->
    <section class="band band-white" aria-labelledby="atalhos-principais-heading">
      <div class="band-inner">
        <h2 id="atalhos-principais-heading" class="display-title section-heading-lg">
          ESCOLHA SEU CAMINHO
        </h2>
        <p class="section-lead">
          Toque no cartão que combina com o que está acontecendo agora:
        </p>

        ${renderMobileCarousel({
          id: 'home-paths-carousel',
          ariaLabel: 'Escolha seu caminho principal',
          desktopGridClass: 'asymmetric-paths-grid',
          slidesHtml: pathSlides,
        })}
      </div>
    </section>

    <!-- FAIXA EM MOVIMENTO ENTRE SEÇÕES (Exibida no computador) -->
    <div class="desktop-only-view">
      ${renderDividerMarquee('PARE ✦ RESPIRE ✦ CONFIRA ✦ GOLPISTA É PROFISSIONAL, VOCÊ NÃO TEM CULPA ✦ ')}
    </div>

    <!-- BANDA 3: GOLPE DA SEMANA + DICA DO DIA -->
    <section class="band band-lilac" aria-labelledby="golpe-semana-heading">
      <div class="band-inner">
        <!-- Versão Computador (> 768px): Dupla lado a lado -->
        <div class="desktop-only-view">
          <div class="spotlight-duo-grid">
            <div class="scam-week-card">
              <div>
                <div class="danger-meter-row" aria-label="Nível de perigo 3 de 3: Muito frequente">
                  <span>PERIGO ALTO</span>
                  <span class="danger-dots" aria-hidden="true">
                    <span class="danger-dot is-filled"></span>
                    <span class="danger-dot is-filled"></span>
                    <span class="danger-dot is-filled"></span>
                  </span>
                </div>
                <span class="kicker-label" style="margin-top: 1rem;">Golpe da semana</span>
                <h2 id="golpe-semana-heading" class="display-title section-heading-lg">
                  ${escapeHtml(featuredScam.shortTitle)}
                </h2>
                <p style="font-size: 1.08rem; margin-bottom: 0;">
                  Alguém usa a foto real do seu filho ou sobrinho dizendo que trocou de chip e pede um Pix urgente para pagar uma conta. Nunca transfira sem ligar para o número antigo!
                </p>
              </div>
              <div>
                <a href="#golpe/${featuredScam.slug}" class="pill-btn pill-btn-navy">
                  ${Icons.shield}
                  <span>Ver como me proteger</span>
                </a>
              </div>
            </div>

            <div class="daily-tip-box">
              <div class="sticker-badge-corner sticker-badge-float">
                ${Illustrations.stickerDailyTip}
              </div>
              <div>
                <span class="kicker-label">Pílula diária de sossego</span>
                <h2 class="display-title" style="font-size: clamp(1.65rem, 3.2vw, 2.35rem); margin-bottom: 0.85rem;">
                  DICA DO DIA
                </h2>
                <p class="daily-tip-text-sync" style="font-size: 1.06rem; margin-bottom: 0;">
                  ${escapeHtml(dailyTip)}
                </p>
              </div>
              <div>
                <button type="button" class="pill-btn pill-btn-white" data-action-next-tip>
                  ${Icons.refresh}
                  <span>Sortear outra dica</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Versão Celular (<= 768px): Cartão "Golpe da semana" + Acordeão para Dica do Dia e os 5 Golpes -->
        <div class="mobile-only-view">
          <div class="scam-week-card" style="padding: 1.35rem 1.2rem;">
            <div>
              <div class="danger-meter-row" aria-label="Nível de perigo 3 de 3: Muito frequente">
                <span>PERIGO ALTO</span>
                <span class="danger-dots" aria-hidden="true">
                  <span class="danger-dot is-filled"></span>
                  <span class="danger-dot is-filled"></span>
                  <span class="danger-dot is-filled"></span>
                </span>
              </div>
              <span class="kicker-label" style="margin-top: 0.75rem;">Golpe da semana</span>
              <h2 class="display-title section-heading-lg">
                ${escapeHtml(featuredScam.shortTitle)}
              </h2>
              <p style="font-size: 1rem; margin-bottom: 0;">
                Usam a foto real do seu filho dizendo que trocou de chip e pedem Pix urgente. Ligue sempre para o número antigo antes!
              </p>
            </div>
            <div>
              <a href="#golpe/${featuredScam.slug}" class="pill-btn pill-btn-navy" style="width: 100%;">
                ${Icons.shield}
                <span>Ver como me proteger</span>
              </a>
            </div>
          </div>

          <div style="margin-top: 1rem;">
            ${renderResponsiveAccordionSection({
              id: 'mobile-home-more-scams',
              panelClass: 'alert-panel-calm',
              iconHtml: Icons.lightbulb,
              title: 'Dica do dia e golpes mais comuns',
              defaultOpenMobile: false,
              bodyHtml: `
                <div style="margin-bottom: 1.25rem; padding-bottom: 1.15rem; border-bottom: 2px solid var(--ink);">
                  <span class="kicker-label">Dica do dia</span>
                  <p class="daily-tip-text-sync" style="margin-bottom: 0.9rem;">${escapeHtml(dailyTip)}</p>
                  <button type="button" class="pill-btn pill-btn-white" data-action-next-tip style="width: 100%;">
                    ${Icons.refresh}
                    <span>Sortear outra dica</span>
                  </button>
                </div>

                <h3 class="card-title-bold" style="margin-bottom: 0.5rem;">Os 5 golpes mais comuns</h3>
                ${renderMobileCarousel({
                  id: 'home-common-scams-mobile-carousel',
                  ariaLabel: 'Os golpes mais comuns agora',
                  desktopGridClass: 'editorial-scams-grid',
                  slidesHtml: topScamsSlides,
                })}

                <div style="margin-top: 1.1rem; display: flex; flex-direction: column; gap: 0.75rem;">
                  <a href="#golpes" class="pill-btn pill-btn-navy">
                    ${Icons.shield}
                    <span>Ver todos os 5 golpes</span>
                  </a>
                  <a href="#protecao" class="pill-btn pill-btn-white">
                    ${Icons.listChecks}
                    <span>Abrir Checklist de Proteção</span>
                  </a>
                </div>
              `,
            })}
          </div>
        </div>
      </div>
    </section>

    <!-- BANDA 4: A REGRA DOS 3 PASSOS (Carrossel no celular, Trio escalonado no computador) -->
    <section class="band band-light" aria-labelledby="tres-passos-heading">
      <div class="band-inner">
        <h2 id="tres-passos-heading" class="display-title section-heading-xl">
          A REGRA DOS 3 PASSOS
        </h2>
        <p class="section-lead">
          Toda vez que chegar um pedido urgente no celular, faça este ritual de 30 segundos:
        </p>

        ${renderMobileCarousel({
          id: 'home-three-steps-carousel',
          ariaLabel: 'Os 3 passos: Pare, Confira e Só então responda',
          desktopGridClass: 'steps-trio-grid',
          slidesHtml: threeStepsSlides,
        })}

        <!-- Atalho visível no celular para o Checklist de Proteção -->
        <div class="mobile-only-view" style="margin-top: 1.35rem;">
          <a href="#protecao" class="pill-btn pill-btn-navy" style="width: 100%;">
            ${Icons.listChecks}
            <span>Conferir meu Checklist de Proteção</span>
          </a>
        </div>
      </div>
    </section>

    <!-- BANDA 5 (COMPUTADOR): FRASE CENTRAL AZUL-ESCURO COM ETIQUETAS INCLINADAS -->
    <section class="band band-navy desktop-only-view" aria-labelledby="frase-destaque-heading">
      <div class="band-inner statement-arena">
        <div class="scattered-pills-row" aria-label="Temas de atenção rápida">
          <a href="#golpe/whatsapp-clonado" class="tilted-tag tilted-tag-lilac tilt-left-1">WHATSAPP</a>
          <a href="#golpe/falso-pix" class="tilted-tag tilted-tag-white tilt-right-1">FALSO PIX</a>
          <a href="#golpe/link-malicioso" class="tilted-tag tilted-tag-light tilt-left-2">LINK MALICIOSO</a>
          <a href="#compras-seguras" class="tilted-tag tilted-tag-lilac tilt-right-2">COMPRAS</a>
        </div>

        <h2 id="frase-destaque-heading" class="display-title statement-giant-quote">
          GOLPISTA TEM PRESSA. VOCÊ NÃO PRECISA TER.
        </h2>

        <p class="statement-sub">
          Quer deixar seu celular e seu WhatsApp protegidos de uma vez por todas? Confira nosso checklist prático!
        </p>

        <div class="scattered-pills-row">
          <a href="#golpe/loja-falsa" class="tilted-tag tilted-tag-white tilt-right-1">LOJA FALSA</a>
          <a href="#protecao" class="tilted-tag tilted-tag-lilac tilt-left-2">PROTEÇÃO</a>
          <a href="#golpe/parente-numero-novo" class="tilted-tag tilted-tag-light tilt-right-2">NÚMERO NOVO</a>
        </div>

        <div style="margin-top: 0.75rem;">
          <a href="#protecao" class="pill-btn pill-btn-lilac">
            ${Icons.listChecks}
            <span>Abrir meu Checklist de Proteção</span>
          </a>
        </div>
      </div>
    </section>

    <!-- BANDA 6 (COMPUTADOR): OS 5 GOLPES MAIS COMUNS EM MOSAICO -->
    <section class="band band-white desktop-only-view" aria-labelledby="titulo-golpes-comuns">
      <div class="band-inner">
        <h2 id="titulo-golpes-comuns" class="display-title section-heading-xl">
          OS 5 GOLPES MAIS COMUNS AGORA
        </h2>
        <p class="section-lead">
          Veja como cada conversa começa na tela do celular e como se proteger sem susto:
        </p>

        <div class="editorial-scams-grid">
          ${topScamsSlides.join('')}
        </div>

        <div style="margin-top: 2rem; display: flex; flex-wrap: wrap; gap: 1rem;">
          <a href="#golpes" class="pill-btn pill-btn-navy">
            ${Icons.shield}
            <span>Ver os 5 golpes explicados</span>
          </a>
          <a href="#protecao" class="pill-btn pill-btn-lilac">
            ${Icons.listChecks}
            <span>Conferir Checklist de Proteção</span>
          </a>
        </div>
      </div>
    </section>
  `;
}

// ============================================================================
// 2. LISTA DOS 5 GOLPES (#golpes)
// ============================================================================
function renderScamsIndexPage(): string {
  const filterOptions: { key: ScamFilterCategory; label: string }[] = [
    { key: 'todos', label: 'Todos (5)' },
    { key: 'whatsapp', label: 'WhatsApp' },
    { key: 'pix', label: 'Pix' },
    { key: 'compras', label: 'Compras' },
    { key: 'links', label: 'Links' },
  ];

  const filteredScams = filterScamsByCategory(SCAMS_DATA, state.scamCategoryFilter);

  const scamCardsHtml = filteredScams.map(
    (scam, i) => `
      <a href="#golpe/${scam.slug}" class="tactile-card ${i % 2 === 0 ? 'tactile-card-white' : ''}" style="grid-column: span 3;">
        <div>
          <span class="kicker-label">Guia ${scam.number} de ${SCAMS_DATA.length} · ${escapeHtml(scam.categoryLabel)}</span>
          <h2 class="card-title-bold">${escapeHtml(scam.title)}</h2>
          <p class="card-desc">${escapeHtml(scam.whatIsIt)}</p>
        </div>
        <span class="card-cta-line">
          <span>Ver sinais e como agir</span>
          ${Icons.arrowRight}
        </span>
      </a>
    `
  );

  const allScamsFullListHtml = SCAMS_DATA.map(
    (scam, i) => `
      <a href="#golpe/${scam.slug}" class="tactile-card ${i % 2 === 0 ? 'tactile-card-white' : ''}" style="margin-bottom: 1rem;">
        <div>
          <span class="kicker-label">Guia ${scam.number} de ${SCAMS_DATA.length} · ${escapeHtml(scam.categoryLabel)}</span>
          <h2 class="card-title-bold">${escapeHtml(scam.title)}</h2>
          <p class="card-desc">${escapeHtml(scam.whatIsIt)}</p>
        </div>
        <span class="card-cta-line">
          <span>Ver sinais e como agir</span>
          ${Icons.arrowRight}
        </span>
      </a>
    `
  ).join('');

  return `
    <section class="band band-light" aria-labelledby="titulo-lista-golpes">
      <div class="band-inner">
        <div class="back-nav-row">
          <a href="#inicio" class="pill-btn pill-btn-white">
            ${Icons.arrowLeft}
            <span>Início</span>
          </a>
          <a href="#protecao" class="pill-btn pill-btn-lilac">
            ${Icons.listChecks}
            <span>Checklist de Proteção</span>
          </a>
        </div>

        <div class="page-hero-card">
          <div class="sticker-badge-corner sticker-badge-float desktop-only-view">
            ${Illustrations.stickerNoBlame}
          </div>
          <span class="kicker-label">Guia direto ao ponto · ${SCAMS_DATA.length} golpes explicados</span>
          <h1 id="titulo-lista-golpes" class="display-title section-heading-xl">
            CONHEÇA AS ISCAS DOS GOLPISTAS
          </h1>
          <p style="font-size: 1.05rem; max-width: 60ch; margin-bottom: 0;">
            Loja falsa, link malicioso, WhatsApp clonado, parente com número novo e falso Pix. Escolha um abaixo para ver exemplos reais:
          </p>
        </div>

        <!-- Etiquetas de filtro em pílula com rolagem lateral no celular -->
        <div class="filter-pills-bar" role="group" aria-label="Filtrar golpes por tema">
          ${filterOptions
            .map((opt) => {
              const isActive = state.scamCategoryFilter === opt.key;
              return `
                <button
                  type="button"
                  class="pill-btn ${isActive ? 'pill-btn-navy' : 'pill-btn-white'}"
                  data-scam-filter="${opt.key}"
                  aria-pressed="${isActive}"
                >
                  <span>${escapeHtml(opt.label)}</span>
                </button>
              `;
            })
            .join('')}
        </div>

        <!-- Computador (> 768px): Grade normal sempre visível -->
        <div class="desktop-only-view">
          <div class="editorial-scams-grid">
            ${scamCardsHtml.join('')}
          </div>
        </div>

        <!-- Celular (<= 768px): Carrossel compacto por padrão + Botão "Ver todos os 5 golpes" -->
        <div class="mobile-only-view">
          ${
            state.showAllScamsStacked
              ? `
                <div role="region" aria-label="Lista completa de todos os golpes">
                  ${allScamsFullListHtml}
                </div>
              `
              : renderMobileCarousel({
                  id: 'scams-list-carousel',
                  ariaLabel: 'Lista de golpes',
                  desktopGridClass: 'editorial-scams-grid',
                  slidesHtml: scamCardsHtml,
                })
          }

          <div style="margin-top: 1.25rem;">
            <button
              type="button"
              id="btn-toggle-all-scams"
              class="pill-btn pill-btn-navy"
              style="width: 100%;"
              aria-expanded="${state.showAllScamsStacked}"
            >
              ${Icons.listChecks}
              <span>${
                state.showAllScamsStacked
                  ? 'Voltar para visualização em carrossel'
                  : `Ver todos os ${SCAMS_DATA.length} golpes`
              }</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ============================================================================
// PÁGINA INDIVIDUAL DE CADA GOLPE (#golpe/<slug>)
// ============================================================================
function renderScamDetailPage(scam: ScamPageData): string {
  const prevScam = SCAMS_DATA.find((s) => s.number === scam.number - 1);
  const nextScam = SCAMS_DATA.find((s) => s.number === scam.number + 1);

  const renderNumberedSteps = (items: string[]): string => `
    <ol class="step-list">
      ${items
        .map(
          (item, i) => `
          <li class="step-list-item">
            <span class="num-circle" aria-hidden="true">${i + 1}</span>
            <span>${escapeHtml(item)}</span>
          </li>
        `
        )
        .join('')}
    </ol>
  `;

  return `
    <section class="band band-light">
      <article class="band-narrow" aria-labelledby="scam-page-title">
        <div class="back-nav-row">
          <a href="#golpes" class="pill-btn pill-btn-white">
            ${Icons.arrowLeft}
            <span>Todos os golpes</span>
          </a>
          <a href="#inicio" class="pill-btn pill-btn-white">
            ${Icons.home}
            <span>Início</span>
          </a>
        </div>

        <!-- 1. O que é -->
        <header class="page-hero-card">
          <span class="kicker-label">Golpe ${scam.number} de ${SCAMS_DATA.length} · ${escapeHtml(scam.categoryLabel)}</span>
          <h1 id="scam-page-title" class="display-title section-heading-lg">
            ${escapeHtml(scam.title)}
          </h1>
          <p style="font-size: 1.08rem; margin-bottom: 0;">${escapeHtml(scam.whatIsIt)}</p>
        </header>

        <!-- 2. Exemplo realista da mensagem -->
        <section class="mockup-frame" aria-labelledby="exemplo-realista-heading">
          <h2 id="exemplo-realista-heading" class="alert-panel-title">
            ${Icons.smartphone}
            <span>Como aparece na prática (${escapeHtml(scam.mockup.channel)})</span>
          </h2>

          <div class="phone-window" role="region" aria-label="Simulação ilustrativa de mensagem">
            <div class="phone-header-bar">
              <span class="phone-sender-title">${escapeHtml(scam.mockup.senderName)}</span>
              <span class="phone-sender-meta">${escapeHtml(scam.mockup.senderDetail)}</span>
            </div>
            <div class="phone-messages-area">
              ${scam.mockup.messages
                .map(
                  (msg) => `
                <div class="message-bubble">
                  <span>${escapeHtml(msg)}</span>
                  <span class="message-time">${escapeHtml(scam.mockup.time)}</span>
                </div>
              `
                )
                .join('')}
            </div>
          </div>

          <p style="margin-bottom: 0; font-weight: 700;">
            Repare bem: ${escapeHtml(scam.mockup.caption)}
          </p>
        </section>

        <!-- 3. Sinais de alerta (Aberto por padrão no celular, acordeão tocável >= 56px) -->
        ${renderResponsiveAccordionSection({
          id: 'scam-sinais-alerta',
          panelClass: 'alert-panel-warn',
          iconHtml: Icons.alertTriangle,
          title: 'Sinais de alerta — Desconfie na hora',
          defaultOpenMobile: true,
          bodyHtml: renderNumberedSteps(scam.warningSigns),
        })}

        <!-- 4. O que fazer (Verde) -->
        ${renderResponsiveAccordionSection({
          id: 'scam-oque-fazer',
          panelClass: 'alert-panel-safe',
          iconHtml: Icons.checkCircle,
          title: 'O que fazer para ficar segura',
          defaultOpenMobile: false,
          bodyHtml: renderNumberedSteps(scam.whatToDo),
        })}

        <!-- 5. O que NUNCA fazer (Vermelho) -->
        ${renderResponsiveAccordionSection({
          id: 'scam-nunca-faca',
          panelClass: 'alert-panel-danger',
          iconHtml: Icons.xOctagon,
          title: 'Nunca faça',
          defaultOpenMobile: false,
          bodyHtml: renderNumberedSteps(scam.neverDo),
        })}

        <!-- 6. Se já caí, o que fazer -->
        ${renderResponsiveAccordionSection({
          id: 'scam-ja-cai',
          panelClass: 'alert-panel-calm',
          iconHtml: Icons.heartHandshake,
          title: 'Se já aconteceu com você, o que fazer',
          defaultOpenMobile: false,
          extraTopBadgeHtml: `
            <div class="sticker-badge-corner sticker-badge-float desktop-only-view">
              ${Illustrations.stickerNoBlame}
            </div>
          `,
          bodyHtml: `
            <p style="margin-bottom: 1.1rem;">
              Primeiro: <strong>zero culpa</strong>. Golpistas treinam o dia inteiro para enganar pessoas boas. Siga estes passos com calma:
            </p>
            ${renderNumberedSteps(scam.ifFellForIt)}
          `,
        })}

        <!-- Navegação anterior / próximo -->
        <nav aria-label="Outros golpes explicados" style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; margin-top: 1.75rem;">
          ${
            prevScam
              ? `<a href="#golpe/${prevScam.slug}" class="pill-btn pill-btn-white">
                  ${Icons.arrowLeft}
                  <span>Anterior: ${escapeHtml(prevScam.shortTitle)}</span>
                </a>`
              : `<span></span>`
          }
          ${
            nextScam
              ? `<a href="#golpe/${nextScam.slug}" class="pill-btn pill-btn-navy">
                  <span>Próximo: ${escapeHtml(nextScam.shortTitle)}</span>
                  ${Icons.arrowRight}
                </a>`
              : `<a href="#compras-seguras" class="pill-btn pill-btn-lilac">
                  ${Icons.shoppingBag}
                  <span>Testar Compras Seguras</span>
                </a>`
          }
        </nav>
      </article>
    </section>
  `;
}

// ============================================================================
// 3. COMPRAS: CHECKLIST "POSSO CONFIAR NESTA LOJA?" (#compras-seguras)
// ============================================================================
function renderChecklistVerdictHTML(isMobileWizard = false): string {
  const evaluation = evaluateStoreChecklist(STORE_CHECKLIST_QUESTIONS, state.checklistAnswers);

  if (evaluation.status === 'incomplete') {
    return `
      <div class="alert-panel alert-panel-calm" role="status" aria-live="polite">
        <h3 class="alert-panel-title">
          ${Icons.shoppingBag}
          <span>${escapeHtml(evaluation.title)}</span>
        </h3>
        <p style="margin-bottom: 0;">
          ${escapeHtml(evaluation.summary)} Responda <strong>Sim</strong> ou <strong>Não</strong> em todas as 7 perguntas para ver seu resultado!
        </p>
      </div>
    `;
  }

  const panelClass =
    evaluation.status === 'danger'
      ? 'alert-panel-danger'
      : evaluation.status === 'caution'
      ? 'alert-panel-warn'
      : 'alert-panel-safe';

  const panelIcon =
    evaluation.status === 'danger'
      ? Icons.xOctagon
      : evaluation.status === 'caution'
      ? Icons.alertTriangle
      : Icons.checkCircle;

  const whatToDoNext =
    evaluation.status === 'danger'
      ? 'Feche esse site e não faça Pix nem digite dados do seu cartão. Se quiser muito o produto, abra você mesma o aplicativo oficial de uma loja conhecida.'
      : evaluation.status === 'caution'
      ? 'Pesquise o nome da loja + "Reclame Aqui" no Google antes de decidir. Se resolver comprar, pague apenas com Cartão de Crédito Virtual (nunca Pix!).'
      : 'Use um Cartão de Crédito Virtual gerado no app do seu banco, confira o nome da empresa antes de confirmar e tire print do pedido.';

  return `
    <div class="alert-panel ${panelClass}" role="region" aria-label="Resultado do teste da loja">
      <h3 class="alert-panel-title">
        ${panelIcon}
        <span>Resultado: ${escapeHtml(evaluation.title)}</span>
      </h3>
      <p style="font-size: 1.06rem; margin-bottom: 1rem;">
        ${escapeHtml(evaluation.summary)}
      </p>
      <p style="font-weight: 700; margin-bottom: 0.75rem;">Por que chegamos a esse resultado:</p>
      <ol class="step-list">
        ${evaluation.reasons
          .map(
            (reason, idx) => `
          <li class="step-list-item">
            <span class="num-circle" aria-hidden="true">${idx + 1}</span>
            <span>${escapeHtml(reason)}</span>
          </li>
        `
          )
          .join('')}
      </ol>
      <div style="margin-top: 1.15rem; padding-top: 1rem; border-top: 2px solid currentColor;">
        <p style="margin-bottom: 0;"><strong>O que fazer agora:</strong> ${escapeHtml(whatToDoNext)}</p>
      </div>
      <div style="margin-top: 1.4rem; display: flex; flex-wrap: wrap; gap: 0.85rem;">
        ${
          isMobileWizard
            ? `
              <button type="button" id="btn-checklist-prev" class="pill-btn pill-btn-white">
                ${Icons.arrowLeft}
                <span>Voltar</span>
              </button>
            `
            : ''
        }
        <button type="button" data-reset-checklist class="pill-btn pill-btn-navy">
          ${Icons.refresh}
          <span>Testar outra loja</span>
        </button>
      </div>
    </div>
  `;
}

function renderMobileChecklistWizardHTML(): string {
  const total = STORE_CHECKLIST_QUESTIONS.length;
  const step = clampWizardStep(state.checklistStep, total);

  if (step >= total) {
    return renderChecklistVerdictHTML(true);
  }

  const q = STORE_CHECKLIST_QUESTIONS[step];
  const currentAnswer = state.checklistAnswers[q.id];
  const progressPercent = Math.round(((step + 1) / total) * 100);

  return `
    <div class="wizard-card" role="region" aria-label="Passo a passo: Posso confiar nesta loja?">
      <div class="wizard-step-header">
        <span>Pergunta ${step + 1} de ${total}</span>
        <span>${progressPercent}%</span>
      </div>
      <div
        class="wizard-progress-bar"
        role="progressbar"
        aria-label="Progresso do checklist"
        aria-valuemin="1"
        aria-valuemax="${total}"
        aria-valuenow="${step + 1}"
      >
        <div class="wizard-progress-fill" style="width: ${progressPercent}%;"></div>
      </div>

      <h2 class="wizard-question-title">${escapeHtml(stripLeadingQuestionNumber(q.question))}</h2>
      <p style="margin-bottom: 0;">${escapeHtml(q.helpText)}</p>

      <div class="wizard-stacked-buttons" role="group" aria-label="Escolha Sim ou Não">
        <button
          type="button"
          class="wizard-big-choice-btn ${currentAnswer === 'yes' ? 'is-selected' : ''}"
          data-wizard-checklist-id="${q.id}"
          data-wizard-checklist-answer="yes"
          aria-pressed="${currentAnswer === 'yes'}"
        >
          ${Icons.checkCircle}
          <span>Sim</span>
        </button>
        <button
          type="button"
          class="wizard-big-choice-btn ${currentAnswer === 'no' ? 'is-selected' : ''}"
          data-wizard-checklist-id="${q.id}"
          data-wizard-checklist-answer="no"
          aria-pressed="${currentAnswer === 'no'}"
        >
          ${Icons.xOctagon}
          <span>Não</span>
        </button>
      </div>

      <div class="wizard-footer-nav">
        <button
          type="button"
          id="btn-checklist-prev"
          class="pill-btn pill-btn-white"
          ${step === 0 ? 'disabled style="opacity: 0.45; box-shadow: none; cursor: not-allowed;"' : ''}
        >
          ${Icons.arrowLeft}
          <span>Voltar</span>
        </button>

        ${
          Object.keys(state.checklistAnswers).length > 0
            ? `
              <button type="button" data-reset-checklist class="pill-btn pill-btn-light">
                ${Icons.refresh}
                <span>Recomeçar</span>
              </button>
            `
            : ''
        }
      </div>
    </div>
  `;
}

function renderSafeShoppingPage(): string {
  return `
    <section class="band band-lilac">
      <div class="band-narrow">
        <div class="back-nav-row">
          <a href="#inicio" class="pill-btn pill-btn-white">
            ${Icons.arrowLeft}
            <span>Voltar para o Início</span>
          </a>
          <a href="#golpe/loja-falsa" class="pill-btn pill-btn-white">
            ${Icons.shield}
            <span>Guia: Loja falsa</span>
          </a>
        </div>

        <header class="page-hero-card" aria-labelledby="compras-seguras-title">
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 1.25rem;">
            <div class="desktop-only-view">
              ${Illustrations.shoppingCart}
            </div>
            <div style="flex: 1; min-width: 220px;">
              <span class="kicker-label">Checklist de Compras Seguras</span>
              <h1 id="compras-seguras-title" class="display-title section-heading-lg">
                POSSO CONFIAR NESTA LOJA?
              </h1>
              <p style="margin-bottom: 0;">
                Calma antes de passar o cartão ou fazer Pix! Responda estas 7 perguntas rápidas sobre o site:
              </p>
            </div>
          </div>
        </header>

        <!-- CELULAR (<= 768px): UMA PERGUNTA POR VEZ EM TELA CHEIA -->
        <div class="mobile-only-view">
          ${renderMobileChecklistWizardHTML()}
        </div>

        <!-- COMPUTADOR (> 768px): LISTA COMPLETA EMPILHADA -->
        <div class="desktop-only-view">
          <section aria-label="Perguntas para verificar se a loja é confiável">
            ${STORE_CHECKLIST_QUESTIONS.map((q) => {
              const currentAnswer = state.checklistAnswers[q.id];
              return `
                <div class="question-card">
                  <h2 class="card-title-bold" style="font-size: 1.15rem;">${escapeHtml(q.question)}</h2>
                  <p style="margin-bottom: 0;">${escapeHtml(q.helpText)}</p>
                  <div class="binary-choices" role="group" aria-label="${escapeHtml(q.question)}">
                    <button
                      type="button"
                      class="choice-pill ${currentAnswer === 'yes' ? 'is-selected' : ''}"
                      data-question-id="${q.id}"
                      data-answer="yes"
                      aria-pressed="${currentAnswer === 'yes'}"
                    >
                      ${Icons.checkCircle}
                      <span>Sim</span>
                    </button>
                    <button
                      type="button"
                      class="choice-pill ${currentAnswer === 'no' ? 'is-selected' : ''}"
                      data-question-id="${q.id}"
                      data-answer="no"
                      aria-pressed="${currentAnswer === 'no'}"
                    >
                      ${Icons.xOctagon}
                      <span>Não</span>
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </section>

          <div id="checklist-verdict-container">
            ${renderChecklistVerdictHTML(false)}
          </div>
        </div>

        ${renderResponsiveAccordionSection({
          id: 'compras-formas-pagamento',
          panelClass: 'alert-panel-safe',
          iconHtml: Icons.checkCircle,
          title: 'Formas de pagamento mais seguras',
          defaultOpenMobile: false,
          bodyHtml: `
            <ol class="step-list">
              <li class="step-list-item">
                <span class="num-circle" aria-hidden="true">1</span>
                <span><strong>1º lugar — Cartão de Crédito Virtual:</strong> gere no aplicativo do seu banco. Se a loja sumir, é muito mais fácil pedir cancelamento à operadora e apagar o cartão virtual sem perder seu cartão físico!</span>
              </li>
              <li class="step-list-item">
                <span class="num-circle" aria-hidden="true">2</span>
                <span><strong>Pix só em lojas famosas digitadas por você:</strong> confira sempre se o nome de quem recebe na tela final do banco é o CNPJ da loja verdadeira (nunca nome de pessoa desconhecida!).</span>
              </li>
              <li class="step-list-item">
                <span class="num-circle" aria-hidden="true">3</span>
                <span><strong>Evite cartão de débito online:</strong> o dinheiro sai na hora da conta corrente e dá mais trabalho para estornar.</span>
              </li>
            </ol>
          `,
        })}

        ${renderResponsiveAccordionSection({
          id: 'compras-guardar-provas',
          panelClass: 'alert-panel-warn',
          iconHtml: Icons.alertTriangle,
          title: 'Como guardar provas da sua compra',
          defaultOpenMobile: false,
          bodyHtml: `
            <ol class="step-list">
              <li class="step-list-item">
                <span class="num-circle" aria-hidden="true">1</span>
                <span>Tire um <strong>print (foto da tela)</strong> do anúncio mostrando preço e prazo prometido.</span>
              </li>
              <li class="step-list-item">
                <span class="num-circle" aria-hidden="true">2</span>
                <span>Tire outro print do <strong>número do pedido confirmado</strong> e guarde a Nota Fiscal recebida no e-mail.</span>
              </li>
            </ol>
            <div style="margin-top: 1.25rem;">
              <a href="#aprender/tirar-print" class="pill-btn pill-btn-navy">
                ${Icons.smartphone}
                <span>Aprender como tirar print</span>
              </a>
            </div>
          `,
        })}
      </div>
    </section>
  `;
}

// ============================================================================
// 4. CHECKLIST DE PROTEÇÃO (#protecao)
// ============================================================================
function renderProtectionItemCardHTML(item: ProtectionChecklistItem, index: number, stackedMobile = false): string {
  const isDone = state.protectionCompleted[item.id] === true;
  const cardBgClass = isDone
    ? 'tactile-card-lilac'
    : index % 2 === 0
    ? 'tactile-card-white'
    : '';

  return `
    <article
      class="tactile-card ${cardBgClass}"
      style="grid-column: span 3; ${stackedMobile ? 'margin-bottom: 1rem;' : ''} ${
        isDone ? 'border-width: 3px;' : ''
      }"
      aria-labelledby="prot-title-${item.id}"
    >
      <div>
        <span class="kicker-label">
          Cuidado ${index + 1} de ${PROTECTION_CHECKLIST_ITEMS.length} · ${escapeHtml(item.category)}
          ${isDone ? ' · ✓ Concluído' : ''}
        </span>
        <h2 id="prot-title-${item.id}" class="card-title-bold">${escapeHtml(item.title)}</h2>
        <p style="margin-bottom: 0.75rem;">
          <strong>Por que protege você:</strong> ${escapeHtml(item.whyItMatters)}
        </p>
        <p style="margin-bottom: 0;">
          <strong>Como fazer:</strong> ${escapeHtml(item.howToDoIt)}
        </p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.7rem; margin-top: 0.4rem;">
        <button
          type="button"
          class="pill-btn ${isDone ? 'pill-btn-white' : 'pill-btn-navy'}"
          style="width: 100%;"
          data-toggle-protection="${item.id}"
          aria-pressed="${isDone}"
        >
          ${Icons.checkCircle}
          <span>${isDone ? 'Feito! (Toque para desmarcar)' : 'Marcar: Já fiz!'}</span>
        </button>

        ${
          item.relatedRoute && item.relatedLabel
            ? `
              <a href="#${item.relatedRoute}" class="pill-btn pill-btn-light" style="width: 100%;">
                <span>${escapeHtml(item.relatedLabel)}</span>
                ${Icons.arrowRight}
              </a>
            `
            : ''
        }
      </div>
    </article>
  `;
}

function renderProtectionChecklistPage(): string {
  const itemIds = PROTECTION_CHECKLIST_ITEMS.map((item) => item.id);
  const progress = summarizeProtectionProgress(itemIds, state.protectionCompleted);

  const protectionSlidesHtml = PROTECTION_CHECKLIST_ITEMS.map((item, idx) =>
    renderProtectionItemCardHTML(item, idx, false)
  );

  const protectionStackedHtml = PROTECTION_CHECKLIST_ITEMS.map((item, idx) =>
    renderProtectionItemCardHTML(item, idx, true)
  ).join('');

  return `
    <section class="band band-light" aria-labelledby="protecao-title">
      <div class="band-inner">
        <div class="back-nav-row">
          <a href="#inicio" class="pill-btn pill-btn-white">
            ${Icons.arrowLeft}
            <span>Voltar para o Início</span>
          </a>
          <a href="#compras-seguras" class="pill-btn pill-btn-lilac">
            ${Icons.shoppingBag}
            <span>Posso confiar nesta loja?</span>
          </a>
        </div>

        <header class="page-hero-card">
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 1.4rem;">
            <div class="desktop-only-view">
              ${Illustrations.shieldLock}
            </div>
            <div style="flex: 1; min-width: 220px;">
              <span class="kicker-label">
                Seu escudo pessoal · ${progress.completedCount} de ${progress.totalCount} cuidados concluídos
              </span>
              <h1 id="protecao-title" class="display-title section-heading-lg">
                CHECKLIST DE PROTEÇÃO
              </h1>
              <p style="margin-bottom: 1rem;">
                Faça no seu tempo, um por vez. Cada item marcado fecha uma porta contra golpistas e fica salvo automaticamente neste aparelho!
              </p>

              <p style="font-weight: 700; margin-bottom: 0.45rem;">
                Progresso: ${progress.percent}% (${progress.completedCount} de ${progress.totalCount} concluídos)
              </p>
              <div
                class="wizard-progress-bar"
                style="margin-bottom: 0;"
                role="progressbar"
                aria-label="Progresso do checklist de proteção"
                aria-valuemin="0"
                aria-valuemax="${progress.totalCount}"
                aria-valuenow="${progress.completedCount}"
              >
                <div class="wizard-progress-fill" style="width: ${progress.percent}%;"></div>
              </div>
            </div>
          </div>
        </header>

        ${
          progress.allDone
            ? `
              <div class="alert-panel alert-panel-safe" role="status" aria-live="polite">
                <h2 class="alert-panel-title">
                  ${Icons.award}
                  <span>Parabéns! Todos os ${progress.totalCount} cuidados estão em dia!</span>
                </h2>
                <p style="margin-bottom: 0;">
                  Seu celular, seu WhatsApp e suas compras estão muito bem protegidos. Continue sempre seguindo a regra de ouro: parar, respirar e conferir antes de clicar!
                </p>
              </div>
            `
            : ''
        }

        <!-- Computador (> 768px): Grade de 2 colunas com todos os 8 cuidados -->
        <div class="desktop-only-view">
          <div class="editorial-scams-grid">
            ${protectionSlidesHtml.join('')}
          </div>
        </div>

        <!-- Celular (<= 768px): Carrossel horizontal compacto + botão para ver todos em lista -->
        <div class="mobile-only-view">
          ${
            state.showAllProtectionStacked
              ? `
                <div role="region" aria-label="Lista completa de cuidados de proteção">
                  ${protectionStackedHtml}
                </div>
              `
              : renderMobileCarousel({
                  id: 'protection-checklist-carousel',
                  ariaLabel: 'Itens do checklist de proteção',
                  desktopGridClass: 'editorial-scams-grid',
                  slidesHtml: protectionSlidesHtml,
                })
          }

          <div style="margin-top: 1.25rem;">
            <button
              type="button"
              id="btn-toggle-all-protection"
              class="pill-btn pill-btn-navy"
              style="width: 100%;"
              aria-expanded="${state.showAllProtectionStacked}"
            >
              ${Icons.listChecks}
              <span>${
                state.showAllProtectionStacked
                  ? 'Voltar para visualização em carrossel'
                  : `Ver todos os ${progress.totalCount} cuidados`
              }</span>
            </button>
          </div>
        </div>

        ${
          progress.completedCount > 0
            ? `
              <div style="margin-top: 1.5rem; display: flex; flex-wrap: wrap; gap: 0.85rem;">
                <button type="button" id="btn-reset-protection" class="pill-btn pill-btn-white">
                  ${Icons.refresh}
                  <span>Desmarcar todos os itens</span>
                </button>
              </div>
            `
            : ''
        }
      </div>
    </section>
  `;
}

// ============================================================================
// 5. APRENDER: 4 LIÇÕES DE CELULAR (#aprender e #aprender/<id>)
// ============================================================================
function renderLearnIndexPage(): string {
  const completedCount = state.completedLessons.filter((id) => VALID_LESSON_IDS.has(id)).length;

  const lessonSlidesHtml = LEARN_LESSONS.map((lesson, idx) => {
    const isDone = state.completedLessons.includes(lesson.id);
    return `
      <a href="#aprender/${lesson.id}" class="tactile-card ${idx % 2 === 1 ? 'tactile-card-white' : ''}" style="grid-column: span 3;">
        <div>
          <span class="kicker-label">
            Lição ${idx + 1} de ${LEARN_LESSONS.length} · ${escapeHtml(lesson.deviceLabel)} · ${escapeHtml(lesson.duration)}
            ${isDone ? ' · ✓ Concluída' : ''}
          </span>
          <h2 class="card-title-bold">${escapeHtml(lesson.title)}</h2>
          <p class="card-desc">${escapeHtml(lesson.summary)}</p>
        </div>
        <span class="card-cta-line">
          <span>${isDone ? 'Rever explicação' : 'Abrir passo a passo'}</span>
          ${Icons.arrowRight}
        </span>
      </a>
    `;
  });

  return `
    <section class="band band-white">
      <div class="band-inner">
        <div class="back-nav-row">
          <a href="#inicio" class="pill-btn pill-btn-light">
            ${Icons.arrowLeft}
            <span>Início</span>
          </a>
          <a href="#protecao" class="pill-btn pill-btn-lilac">
            ${Icons.listChecks}
            <span>Checklist de Proteção</span>
          </a>
        </div>

        <header class="page-hero-card" style="background-color: var(--lilac-light);" aria-labelledby="aprender-title">
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 1.4rem;">
            <div class="desktop-only-view">
              ${Illustrations.smartphoneFriendly}
            </div>
            <div style="flex: 1; min-width: 220px;">
              <span class="kicker-label">
                4 lições de celular · ${completedCount} de ${LEARN_LESSONS.length} concluídas
              </span>
              <h1 id="aprender-title" class="display-title section-heading-lg">
                APRENDER A USAR O CELULAR
              </h1>
              <p style="margin-bottom: 0;">
                Explicações curtas e passo a passo para fazer videochamada, tirar print, aumentar a letra e instalar aplicativos com segurança:
              </p>
            </div>
          </div>
        </header>

        ${renderMobileCarousel({
          id: 'learn-lessons-carousel',
          ariaLabel: 'As 4 lições passo a passo de celular',
          desktopGridClass: 'editorial-scams-grid',
          slidesHtml: lessonSlidesHtml,
        })}
      </div>
    </section>
  `;
}

function renderLearnDetailPage(lesson: LearnLesson): string {
  const isCompleted = state.completedLessons.includes(lesson.id);
  const currentIndex = LEARN_LESSONS.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? LEARN_LESSONS[currentIndex - 1] : undefined;
  const nextLesson =
    currentIndex >= 0 && currentIndex < LEARN_LESSONS.length - 1
      ? LEARN_LESSONS[currentIndex + 1]
      : undefined;

  return `
    <section class="band band-light">
      <article class="band-narrow" aria-labelledby="lesson-title">
        <div class="back-nav-row">
          <a href="#aprender" class="pill-btn pill-btn-white">
            ${Icons.arrowLeft}
            <span>Todas as 4 lições</span>
          </a>
          <a href="#inicio" class="pill-btn pill-btn-white">
            ${Icons.home}
            <span>Início</span>
          </a>
        </div>

        <header class="page-hero-card">
          <span class="kicker-label">
            Lição ${currentIndex + 1} de ${LEARN_LESSONS.length} · ${escapeHtml(lesson.deviceLabel)} · Leitura de ${escapeHtml(lesson.duration)}
          </span>
          <h1 id="lesson-title" class="display-title section-heading-lg">${escapeHtml(lesson.title)}</h1>
          <p style="font-size: 1.06rem; margin-bottom: 0;">
            <strong>Por que ajuda no dia a dia:</strong> ${escapeHtml(lesson.whyUseful)}
          </p>
        </header>

        <section class="alert-panel alert-panel-safe" aria-labelledby="passo-a-passo-heading">
          <h2 id="passo-a-passo-heading" class="alert-panel-title">
            ${Icons.checkCircle}
            <span>Passo a passo sem pressa</span>
          </h2>
          <ol class="step-list">
            ${lesson.steps
              .map(
                (s, index) => `
              <li class="step-list-item">
                <span class="num-circle" aria-hidden="true">${index + 1}</span>
                <div>
                  <strong style="display: block; font-size: 1.08rem; margin-bottom: 0.2rem;">${escapeHtml(s.title)}</strong>
                  <span>${escapeHtml(s.detail)}</span>
                </div>
              </li>
            `
              )
              .join('')}
          </ol>
        </section>

        ${renderResponsiveAccordionSection({
          id: 'lesson-dica-ouro',
          panelClass: 'alert-panel-warn',
          iconHtml: Icons.lightbulb,
          title: 'Dica de ouro',
          defaultOpenMobile: true,
          bodyHtml: `<p style="margin-bottom: 0; font-size: 1.05rem;">${escapeHtml(lesson.goldenTip)}</p>`,
        })}

        <div class="page-hero-card" style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1.15rem; margin-bottom: 0;">
          <div>
            <strong style="display: block; font-size: 1.1rem;">Deu tudo certo com esta lição?</strong>
            <span>Guarde seu progresso neste aparelho com um toque.</span>
          </div>
          <button
            type="button"
            id="btn-toggle-lesson"
            data-lesson-id="${lesson.id}"
            class="pill-btn ${isCompleted ? 'pill-btn-lilac' : 'pill-btn-navy'}"
            aria-pressed="${isCompleted}"
          >
            ${Icons.checkCircle}
            <span>${isCompleted ? 'Lição concluída (Desmarcar)' : 'Marcar: Já aprendi!'}</span>
          </button>
        </div>

        <nav aria-label="Outras lições de celular" style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; margin-top: 1.75rem;">
          ${
            prevLesson
              ? `<a href="#aprender/${prevLesson.id}" class="pill-btn pill-btn-white">
                  ${Icons.arrowLeft}
                  <span>Lição anterior</span>
                </a>`
              : `<span></span>`
          }
          ${
            nextLesson
              ? `<a href="#aprender/${nextLesson.id}" class="pill-btn pill-btn-navy">
                  <span>Próxima lição</span>
                  ${Icons.arrowRight}
                </a>`
              : `<a href="#protecao" class="pill-btn pill-btn-lilac">
                  ${Icons.listChecks}
                  <span>Checklist de Proteção</span>
                </a>`
          }
        </nav>
      </article>
    </section>
  `;
}

// ============================================================================
// 6. PÁGINA "PRECISO DE AJUDA AGORA" (#ajuda — Triagem com passo a passo)
// ============================================================================
function renderEmergencyHelpPage(): string {
  const selectedCase =
    EMERGENCY_TRIAGE_CASES.find((c) => c.id === state.emergencyCaseId) || EMERGENCY_TRIAGE_CASES[0];

  const triageSlides = EMERGENCY_TRIAGE_CASES.map((item) => {
    const isSelected = item.id === selectedCase.id;
    return `
      <button
        type="button"
        class="tactile-card ${isSelected ? 'tactile-card-lilac' : 'tactile-card-white'}"
        data-triage-id="${item.id}"
        aria-pressed="${isSelected}"
        style="grid-column: span 3; text-align: left; cursor: pointer; border-width: ${isSelected ? '3px' : '2px'};"
      >
        <div>
          <h3 class="card-title-bold" style="font-size: 1.15rem;">${escapeHtml(item.title)}</h3>
          <p class="card-desc">${escapeHtml(item.shortDesc)}</p>
        </div>
        <span class="card-cta-line">
          ${Icons.checkCircle}
          <span>${isSelected ? 'Selecionado — veja abaixo' : 'Ver o que fazer neste caso'}</span>
        </span>
      </button>
    `;
  });

  const phoneSlides = [
    `
      <div class="tactile-card" style="grid-column: span 3;">
        <div>
          <span class="kicker-label">Emergência imediata</span>
          <h3 class="card-title-bold">Polícia Militar: 190</h3>
          <p class="card-desc">Ligação gratuita 24h em caso de ameaça ou perigo imediato.</p>
        </div>
      </div>
    `,
    `
      <div class="tactile-card" style="grid-column: span 3;">
        <div>
          <span class="kicker-label">Boletim de Ocorrência</span>
          <h3 class="card-title-bold">Polícia Civil: 197</h3>
          <p class="card-desc">Orientação gratuita sobre Delegacia Virtual e registro de estelionato.</p>
        </div>
      </div>
    `,
  ];

  return `
    <section class="band band-light">
      <article class="band-narrow" aria-labelledby="ajuda-urgente-title">
        <div class="back-nav-row">
          <a href="#inicio" class="pill-btn pill-btn-white">
            ${Icons.arrowLeft}
            <span>Voltar para o Início</span>
          </a>
        </div>

        <header class="page-hero-card">
          <div class="sticker-badge-corner sticker-badge-float desktop-only-view">
            ${Illustrations.stickerNoBlame}
          </div>
          <span class="kicker-label">Acolhimento imediato · Triagem passo a passo</span>
          <h1 id="ajuda-urgente-title" class="display-title section-heading-lg">
            RESPIRE FUNDO. VOCÊ NÃO ESTÁ SOZINHA.
          </h1>
          <p style="font-size: 1.05rem; margin-bottom: 0;">
            Qualquer pessoa pode cair — golpista é profissional. Toque abaixo no que aconteceu para ver exatamente o que fazer agora:
          </p>
        </header>

        <section aria-labelledby="escolha-situacao-heading" style="margin-bottom: 1.75rem;">
          <h2 id="escolha-situacao-heading" class="card-title-bold" style="margin-bottom: 0.75rem;">
            O que aconteceu agora?
          </h2>
          ${renderMobileCarousel({
            id: 'emergency-triage-carousel',
            ariaLabel: 'Situações de emergência para escolher',
            desktopGridClass: 'editorial-scams-grid',
            slidesHtml: triageSlides,
          })}
        </section>

        <section id="triage-detail-box" class="alert-panel alert-panel-safe" aria-labelledby="passos-urgentes-title">
          <h2 id="passos-urgentes-title" class="alert-panel-title">
            ${Icons.checkCircle}
            <span>Faça nesta ordem: ${escapeHtml(selectedCase.title)}</span>
          </h2>
          <p style="font-size: 1.05rem; margin-bottom: 1.15rem;">
            ${escapeHtml(selectedCase.reassurance)}
          </p>
          <ol class="step-list">
            ${selectedCase.immediateSteps
              .map(
                (step, idx) => `
              <li class="step-list-item">
                <span class="num-circle" aria-hidden="true">${idx + 1}</span>
                <span>${escapeHtml(step)}</span>
              </li>
            `
              )
              .join('')}
          </ol>
          <div style="margin-top: 1.4rem; padding-top: 1.1rem; border-top: 2px solid var(--ink);">
            <p style="margin-bottom: 1rem;"><strong>Quem acionar agora:</strong> ${escapeHtml(selectedCase.whoToCall)}</p>
            <a href="#${selectedCase.relatedRoute}" class="pill-btn pill-btn-navy">
              ${Icons.shield}
              <span>${escapeHtml(selectedCase.relatedButtonLabel)}</span>
            </a>
          </div>
        </section>

        ${renderResponsiveAccordionSection({
          id: 'ajuda-segundo-golpe',
          panelClass: 'alert-panel-danger',
          iconHtml: Icons.xOctagon,
          title: 'Cuidado com o "segundo golpe"',
          defaultOpenMobile: false,
          bodyHtml: `
            <ol class="step-list">
              <li class="step-list-item">
                <span class="num-circle" aria-hidden="true">1</span>
                <span><strong>Nunca pague supostos "hackers ou escritórios" na internet que prometem recuperar seu Pix cobrando taxa adiantada!</strong> Só o seu banco (via MED gratuito) e a Polícia cuidam disso.</span>
              </li>
              <li class="step-list-item">
                <span class="num-circle" aria-hidden="true">2</span>
                <span>Sempre pegue o telefone do banco no <strong>verso físico do seu cartão</strong>, nunca em anúncios no topo do Google.</span>
              </li>
            </ol>
          `,
        })}

        <section class="page-hero-card" style="margin-bottom: 0;" aria-labelledby="telefones-uteis-heading">
          <h2 id="telefones-uteis-heading" class="alert-panel-title">
            ${Icons.phoneCall}
            <span>Telefones públicos oficiais</span>
          </h2>
          ${renderMobileCarousel({
            id: 'emergency-phones-carousel',
            ariaLabel: 'Telefones públicos oficiais',
            desktopGridClass: 'editorial-scams-grid',
            slidesHtml: phoneSlides,
          })}
        </section>
      </article>
    </section>
  `;
}

// ============================================================================
// ROTEADOR E EVENTOS GLOBAIS
// ============================================================================
function getCurrentRoute(): string {
  const hash = window.location.hash.replace(/^#/, '').trim();
  return hash || 'inicio';
}

function updateActiveNavHighlights(route: string): void {
  let activeKey = 'inicio';
  if (route === 'golpes' || route.startsWith('golpe/')) activeKey = 'golpes';
  else if (route === 'compras-seguras') activeKey = 'compras-seguras';
  else if (route === 'protecao') activeKey = 'protecao';
  else if (route === 'aprender' || route.startsWith('aprender/')) activeKey = 'aprender';
  else if (route === 'ajuda') activeKey = 'ajuda';

  document.querySelectorAll<HTMLAnchorElement>('.desktop-nav-link').forEach((link) => {
    const isActive = link.dataset.nav === activeKey;
    link.classList.toggle('is-active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  const mobileActiveKey =
    activeKey === 'compras-seguras' || activeKey === 'protecao' ? 'inicio' : activeKey;
  document.querySelectorAll<HTMLAnchorElement>('.mobile-nav-item').forEach((link) => {
    const isActive = link.dataset.mobileNav === mobileActiveKey;
    link.classList.toggle('is-active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  const floatingBtn = document.getElementById('floating-help-btn');
  if (floatingBtn) {
    floatingBtn.classList.toggle('is-hidden-on-help', activeKey === 'ajuda');
  }
}

function saveChecklistAnswers(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.checklistAnswers, JSON.stringify(state.checklistAnswers));
  } catch {
    // Ignora
  }
}

function saveProtectionCompleted(): void {
  try {
    localStorage.setItem(
      STORAGE_KEYS.protectionCompleted,
      JSON.stringify(state.protectionCompleted)
    );
  } catch {
    // Ignora
  }
}

function renderApp(scrollToTop = true): void {
  stopSpeaking();

  const route = getCurrentRoute();
  const mainEl = document.getElementById('conteudo-principal');
  if (!mainEl) return;

  let html = '';

  if (route === 'inicio') {
    html = renderHomePage();
  } else if (route === 'golpes') {
    html = renderScamsIndexPage();
  } else if (route.startsWith('golpe/')) {
    const slug = route.slice('golpe/'.length);
    const scam = SCAMS_DATA.find((s) => s.slug === slug);
    html = scam ? renderScamDetailPage(scam) : renderScamsIndexPage();
  } else if (route === 'compras-seguras') {
    html = renderSafeShoppingPage();
  } else if (route === 'protecao') {
    html = renderProtectionChecklistPage();
  } else if (route === 'aprender') {
    html = renderLearnIndexPage();
  } else if (route.startsWith('aprender/')) {
    const lessonId = route.slice('aprender/'.length);
    const lesson = LEARN_LESSONS.find((l) => l.id === lessonId);
    html = lesson ? renderLearnDetailPage(lesson) : renderLearnIndexPage();
  } else if (route === 'ajuda') {
    html = renderEmergencyHelpPage();
  } else {
    html = renderHomePage();
  }

  mainEl.innerHTML = html;
  updateActiveNavHighlights(route);
  bindPageEvents();
  initMobileCarousels();

  if (scrollToTop) {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}

function bindPageEvents(): void {
  // 0. Acordeões responsivos no celular (<= 768px)
  document.querySelectorAll<HTMLButtonElement>('[data-accordion-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      if (window.innerWidth > 768) return;
      const accordionSection = trigger.closest<HTMLElement>('[data-mobile-accordion]');
      if (!accordionSection) return;

      const isNowOpen = !accordionSection.classList.contains('is-open');
      accordionSection.classList.toggle('is-open', isNowOpen);
      trigger.setAttribute('aria-expanded', String(isNowOpen));

      if (isNowOpen) {
        initMobileCarousels();
      }
    });
  });

  // 1. Busca na Página Inicial
  const searchForm = document.getElementById('home-search-form') as HTMLFormElement | null;
  const searchInput = document.getElementById('home-search-input') as HTMLInputElement | null;
  const searchResultsEl = document.getElementById('home-search-results');

  if (searchInput && searchResultsEl) {
    searchInput.addEventListener('input', () => {
      state.searchQuery = searchInput.value;
      searchResultsEl.innerHTML = renderSearchResultsInline(state.searchQuery);
      initMobileCarousels();
    });
  }

  if (searchForm && searchInput && searchResultsEl) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      state.searchQuery = searchInput.value;
      searchResultsEl.innerHTML = renderSearchResultsInline(state.searchQuery);
      initMobileCarousels();
    });
  }

  // 2. Sortear outra dica na Dica do Dia (sincroniza mobile e desktop)
  document.querySelectorAll<HTMLButtonElement>('[data-action-next-tip]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.extraTipOffset = (state.extraTipOffset + 1) % DAILY_TIPS.length;
      const baseIndex = getDailyTipIndex(new Date(), DAILY_TIPS.length);
      const nextTip = DAILY_TIPS[(baseIndex + state.extraTipOffset) % DAILY_TIPS.length];
      document.querySelectorAll<HTMLElement>('.daily-tip-text-sync').forEach((el) => {
        el.textContent = nextTip;
      });
      announce('Nova dica exibida.');
    });
  });

  // 3A. Filtros em pílula e botão "Ver todos os golpes" na Lista de Golpes
  document.querySelectorAll<HTMLButtonElement>('[data-scam-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.scamFilter as ScamFilterCategory | undefined;
      if (!cat) return;
      state.scamCategoryFilter = cat;
      state.showAllScamsStacked = false;
      renderApp(false);
      announce(`Mostrando golpes do tema ${btn.textContent?.trim() || cat}.`);
    });
  });

  const btnToggleAllScams = document.getElementById('btn-toggle-all-scams');
  if (btnToggleAllScams) {
    btnToggleAllScams.addEventListener('click', () => {
      state.showAllScamsStacked = !state.showAllScamsStacked;
      renderApp(false);
      announce(
        state.showAllScamsStacked
          ? 'Mostrando lista completa de todos os golpes.'
          : 'Voltando para carrossel de golpes.'
      );
    });
  }

  // 3B. Checklist Compras Seguras — Versão Computador (empilhada)
  document.querySelectorAll<HTMLButtonElement>('[data-question-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const qId = btn.dataset.questionId;
      const answer = btn.dataset.answer as 'yes' | 'no' | undefined;
      if (!qId || (answer !== 'yes' && answer !== 'no')) return;

      state.checklistAnswers[qId] = answer;
      state.checklistStep = getInitialWizardStep(
        STORE_CHECKLIST_QUESTIONS.map((q) => q.id),
        state.checklistAnswers
      );
      saveChecklistAnswers();
      renderApp(false);
      announce('Resposta marcada no teste da loja.');
    });
  });

  // 3C. Checklist Compras Seguras — Versão Celular (Passo a passo 1 pergunta por vez)
  document.querySelectorAll<HTMLButtonElement>('[data-wizard-checklist-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const qId = btn.dataset.wizardChecklistId;
      const answer = btn.dataset.wizardChecklistAnswer as 'yes' | 'no' | undefined;
      if (!qId || (answer !== 'yes' && answer !== 'no')) return;

      state.checklistAnswers[qId] = answer;
      state.checklistStep = clampWizardStep(
        state.checklistStep + 1,
        STORE_CHECKLIST_QUESTIONS.length
      );
      saveChecklistAnswers();
      renderApp(false);

      if (state.checklistStep >= STORE_CHECKLIST_QUESTIONS.length) {
        announce('Checklist concluído. Confira o resultado da loja.');
      } else {
        announce(`Pergunta ${state.checklistStep + 1} de ${STORE_CHECKLIST_QUESTIONS.length}.`);
      }
    });
  });

  const btnChecklistPrev = document.getElementById('btn-checklist-prev') as HTMLButtonElement | null;
  if (btnChecklistPrev) {
    btnChecklistPrev.addEventListener('click', () => {
      if (state.checklistStep <= 0) return;
      state.checklistStep = clampWizardStep(
        state.checklistStep - 1,
        STORE_CHECKLIST_QUESTIONS.length
      );
      renderApp(false);
      announce(`Voltando para pergunta ${state.checklistStep + 1} de ${STORE_CHECKLIST_QUESTIONS.length}.`);
    });
  }

  document.querySelectorAll<HTMLButtonElement>('[data-reset-checklist]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.checklistAnswers = {};
      state.checklistStep = 0;
      try {
        localStorage.removeItem(STORAGE_KEYS.checklistAnswers);
      } catch {
        // Ignora
      }
      renderApp(false);
      announce('Respostas apagadas. Começando pela pergunta 1.');
    });
  });

  // 4. Checklist de Proteção (#protecao)
  document.querySelectorAll<HTMLButtonElement>('[data-toggle-protection]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const protId = btn.dataset.toggleProtection;
      if (!protId) return;

      const isNowDone = !state.protectionCompleted[protId];
      if (isNowDone) {
        state.protectionCompleted[protId] = true;
      } else {
        delete state.protectionCompleted[protId];
      }

      saveProtectionCompleted();
      renderApp(false);
      announce(isNowDone ? 'Cuidado marcado como concluído!' : 'Cuidado desmarcado.');
    });
  });

  const btnToggleAllProtection = document.getElementById('btn-toggle-all-protection');
  if (btnToggleAllProtection) {
    btnToggleAllProtection.addEventListener('click', () => {
      state.showAllProtectionStacked = !state.showAllProtectionStacked;
      renderApp(false);
      announce(
        state.showAllProtectionStacked
          ? 'Mostrando todos os cuidados em lista.'
          : 'Voltando para carrossel de proteção.'
      );
    });
  }

  const btnResetProtection = document.getElementById('btn-reset-protection');
  if (btnResetProtection) {
    btnResetProtection.addEventListener('click', () => {
      state.protectionCompleted = {};
      try {
        localStorage.removeItem(STORAGE_KEYS.protectionCompleted);
      } catch {
        // Ignora
      }
      renderApp(false);
      announce('Checklist de proteção desmarcado.');
    });
  }

  // 5. Concluir lição de celular (#aprender/<id>)
  const btnToggleLesson = document.getElementById('btn-toggle-lesson') as HTMLButtonElement | null;
  if (btnToggleLesson) {
    btnToggleLesson.addEventListener('click', () => {
      const lessonId = btnToggleLesson.dataset.lessonId;
      if (!lessonId) return;

      const idx = state.completedLessons.indexOf(lessonId);
      if (idx >= 0) {
        state.completedLessons.splice(idx, 1);
        announce('Lição desmarcada.');
      } else {
        state.completedLessons.push(lessonId);
        announce('Parabéns! Lição marcada como aprendida.');
      }

      try {
        localStorage.setItem(
          STORAGE_KEYS.completedLessons,
          JSON.stringify(state.completedLessons)
        );
      } catch {
        // Ignora
      }
      renderApp(false);
    });
  }

  // 6. Triagem de Ajuda Urgente (#ajuda)
  document.querySelectorAll<HTMLButtonElement>('[data-triage-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const triageId = btn.dataset.triageId;
      if (!triageId) return;
      state.emergencyCaseId = triageId;
      renderApp(false);
      const box = document.getElementById('triage-detail-box');
      box?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      announce('Mostrando orientações para o caso escolhido.');
    });
  });
}

function initStaticShell(): void {
  const iconContrast = document.getElementById('icon-contrast');
  if (iconContrast) iconContrast.innerHTML = Icons.contrast;

  const iconHeaderCta = document.getElementById('icon-header-cta');
  if (iconHeaderCta) iconHeaderCta.innerHTML = Icons.lifeBuoy;

  const iconFloatingHelp = document.getElementById('icon-floating-help');
  if (iconFloatingHelp) iconFloatingHelp.innerHTML = Icons.lifeBuoy;

  document.querySelectorAll<HTMLElement>('.mobile-nav-icon').forEach((span) => {
    const iconName = span.dataset.icon as keyof typeof Icons | undefined;
    if (iconName && Icons[iconName]) {
      span.innerHTML = Icons[iconName];
    }
  });

  updateSpeakButtonUI();

  document.getElementById('btn-font-decrease')?.addEventListener('click', () => {
    state.fontStep = clampFontStep(state.fontStep - 1);
    applyAccessibilityPreferences();
    announce('Tamanho da letra diminuído.');
  });

  document.getElementById('btn-font-increase')?.addEventListener('click', () => {
    state.fontStep = clampFontStep(state.fontStep + 1);
    applyAccessibilityPreferences();
    announce('Tamanho da letra aumentado.');
  });

  document.getElementById('btn-contrast')?.addEventListener('click', () => {
    state.highContrast = !state.highContrast;
    applyAccessibilityPreferences();
    announce(state.highContrast ? 'Alto contraste ativado.' : 'Alto contraste desativado.');
  });

  document.getElementById('btn-toggle-marquee')?.addEventListener('click', () => {
    state.marqueePaused = !state.marqueePaused;
    applyAccessibilityPreferences();
    announce(state.marqueePaused ? 'Faixa em movimento pausada.' : 'Faixa em movimento ativada.');
  });

  document.getElementById('btn-speak')?.addEventListener('click', () => {
    toggleSpeakCurrentPage();
  });

  window.addEventListener('hashchange', () => {
    renderApp(true);
  });
}

applyAccessibilityPreferences();
initStaticShell();
renderApp(true);

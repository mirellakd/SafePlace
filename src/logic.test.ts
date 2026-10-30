import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeText,
  getDailyTipIndex,
  searchItems,
  evaluateStoreChecklist,
  clampFontStep,
  fontStepToPx,
  summarizeProtectionProgress,
  filterScamsByCategory,
  computeCarouselActiveIndex,
  clampWizardStep,
  getInitialWizardStep,
  type ChecklistQuestion,
  type SearchableItem,
} from './logic';

const sampleQuestions: ChecklistQuestion[] = [
  {
    id: 'q1',
    question: 'O preço está muito abaixo das lojas conhecidas (metade do preço ou menos)?',
    helpText: 'Descontos exagerados são a isca número 1.',
    riskWhen: 'yes',
    severity: 'critical',
    reasonIfRisk: 'Preço milagroso quase sempre indica loja falsa.',
  },
  {
    id: 'q2',
    question: 'A loja aceita APENAS pagamento por Pix ou boleto (sem opção de cartão de crédito)?',
    helpText: 'Lojas sérias aceitam cartão.',
    riskWhen: 'yes',
    severity: 'critical',
    reasonIfRisk: 'Exigir apenas Pix impede o cancelamento fácil do pagamento.',
  },
  {
    id: 'q3',
    question: 'Você pesquisou o nome da loja no Reclame Aqui e viu boas avaliações antigas?',
    helpText: 'Veja se a loja existe há mais de 1 ano.',
    riskWhen: 'no',
    severity: 'warning',
    reasonIfRisk: 'Você ainda não confirmou o histórico da loja no Reclame Aqui.',
  },
  {
    id: 'q4',
    question: 'Você chegou ao site por um anúncio patrocinado em rede social?',
    helpText: 'Muitos anúncios em redes sociais são criados por golpistas.',
    riskWhen: 'yes',
    severity: 'warning',
    reasonIfRisk: 'Anúncios em redes sociais costumam levar a páginas clonadas.',
  },
];

test('normalizeText removes accents and lowercases cleanly', () => {
  assert.equal(normalizeText('Cartão de Crédito & Pix!'), 'cartao de credito & pix!');
  assert.equal(normalizeText('  Você Ganhou  '), 'voce ganhou');
});

test('getDailyTipIndex returns deterministic valid index across dates', () => {
  const d1 = new Date(2026, 9, 28);
  const d2 = new Date(2026, 9, 28);
  const d3 = new Date(2026, 9, 29);

  const idx1 = getDailyTipIndex(d1, 10);
  const idx2 = getDailyTipIndex(d2, 10);
  const idx3 = getDailyTipIndex(d3, 10);

  assert.equal(idx1, idx2);
  assert.ok(idx1 >= 0 && idx1 < 10);
  assert.ok(idx3 >= 0 && idx3 < 10);
  assert.notEqual(idx1, idx3);
});

test('searchItems matches accent-insensitive queries and ranks title/keyword matches', () => {
  const items: SearchableItem[] = [
    {
      id: 'falso-pix',
      type: 'golpe',
      title: 'Falso Pix, comprovante falso e Pix por engano',
      summary: 'Como conferir seu extrato antes de devolver valores.',
      keywords: ['pix', 'comprovante', 'transferencia', 'banco'],
      route: 'golpe/falso-pix',
    },
    {
      id: 'whatsapp-clonado',
      type: 'golpe',
      title: 'WhatsApp clonado e celular invadido',
      summary: 'Ative a confirmação em duas etapas.',
      keywords: ['whatsapp', 'zap', 'codigo', 'sms'],
      route: 'golpe/whatsapp-clonado',
    },
  ];

  const resPix = searchItems('transferência', items);
  assert.equal(resPix.length, 1);
  assert.equal(resPix[0].id, 'falso-pix');

  const resZap = searchItems('codigo zap', items);
  assert.equal(resZap.length, 1);
  assert.equal(resZap[0].id, 'whatsapp-clonado');
});

test('evaluateStoreChecklist handles incomplete, safe, caution, and danger verdicts', () => {
  const incomplete = evaluateStoreChecklist(sampleQuestions, { q1: 'no' });
  assert.equal(incomplete.status, 'incomplete');
  assert.equal(incomplete.answeredCount, 1);

  const safe = evaluateStoreChecklist(sampleQuestions, {
    q1: 'no',
    q2: 'no',
    q3: 'yes',
    q4: 'no',
  });
  assert.equal(safe.status, 'safe');

  const caution = evaluateStoreChecklist(sampleQuestions, {
    q1: 'no',
    q2: 'no',
    q3: 'no',
    q4: 'no',
  });
  assert.equal(caution.status, 'caution');
  assert.equal(caution.reasons.length, 1);

  const danger = evaluateStoreChecklist(sampleQuestions, {
    q1: 'yes',
    q2: 'no',
    q3: 'yes',
    q4: 'no',
  });
  assert.equal(danger.status, 'danger');
  assert.ok(danger.reasons[0].includes('Preço milagroso'));
});

test('clampFontStep and fontStepToPx keep accessible base sizes', () => {
  assert.equal(clampFontStep(0), 0);
  assert.equal(clampFontStep(5), 2);
  assert.equal(clampFontStep(-4), -1);
  assert.equal(fontStepToPx(0), 19);
  assert.equal(fontStepToPx(2), 24);
});

test('summarizeProtectionProgress computes completion counts and percentages accurately', () => {
  const ids = ['p1', 'p2', 'p3', 'p4'];
  assert.deepEqual(summarizeProtectionProgress(ids, {}), {
    completedCount: 0,
    totalCount: 4,
    percent: 0,
    allDone: false,
  });

  assert.deepEqual(summarizeProtectionProgress(ids, { p1: true, p3: true }), {
    completedCount: 2,
    totalCount: 4,
    percent: 50,
    allDone: false,
  });

  assert.deepEqual(summarizeProtectionProgress(ids, { p1: true, p2: true, p3: true, p4: true }), {
    completedCount: 4,
    totalCount: 4,
    percent: 100,
    allDone: true,
  });
});

test('filterScamsByCategory filters the 5 active scams accurately', () => {
  const scams = [
    { slug: 'loja-falsa' },
    { slug: 'link-malicioso' },
    { slug: 'whatsapp-clonado' },
    { slug: 'parente-numero-novo' },
    { slug: 'falso-pix' },
  ];
  assert.equal(filterScamsByCategory(scams, 'todos').length, 5);
  assert.deepEqual(
    filterScamsByCategory(scams, 'compras').map((s) => s.slug),
    ['loja-falsa', 'link-malicioso']
  );
  assert.deepEqual(
    filterScamsByCategory(scams, 'pix').map((s) => s.slug),
    ['loja-falsa', 'parente-numero-novo', 'falso-pix']
  );
});

test('computeCarouselActiveIndex computes nearest slide within bounds', () => {
  assert.equal(computeCarouselActiveIndex(0, 300, 4), 0);
  assert.equal(computeCarouselActiveIndex(160, 300, 4), 1);
  assert.equal(computeCarouselActiveIndex(610, 300, 4), 2);
  assert.equal(computeCarouselActiveIndex(5000, 300, 4), 3);
});

test('clampWizardStep and getInitialWizardStep support one-question-at-a-time flows', () => {
  assert.equal(clampWizardStep(-2, 7), 0);
  assert.equal(clampWizardStep(3, 7), 3);
  assert.equal(clampWizardStep(99, 7), 7);

  const ids = ['q1', 'q2', 'q3'];
  assert.equal(getInitialWizardStep(ids, {}), 0);
  assert.equal(getInitialWizardStep(ids, { q1: 'yes' }), 1);
  assert.equal(getInitialWizardStep(ids, { q1: 'yes', q2: 'no', q3: 'yes' }), 3);
});

test('active pages keep-list and internal data routes have zero broken references', async () => {
  const { SCAMS_DATA, LEARN_LESSONS, buildSearchIndex } = await import('./data');
  const { EMERGENCY_TRIAGE_CASES, PROTECTION_CHECKLIST_ITEMS } = await import('./extraData');

  assert.deepEqual(
    SCAMS_DATA.map((s) => s.slug),
    ['loja-falsa', 'link-malicioso', 'whatsapp-clonado', 'parente-numero-novo', 'falso-pix']
  );

  assert.deepEqual(
    LEARN_LESSONS.map((l) => l.id),
    ['videochamada', 'tirar-print', 'aumentar-a-letra', 'instalar-app-seguranca']
  );

  const allowedRoutes = new Set<string>([
    'inicio',
    'ajuda',
    'golpes',
    'compras-seguras',
    'protecao',
    'aprender',
    ...SCAMS_DATA.map((s) => `golpe/${s.slug}`),
    ...LEARN_LESSONS.map((l) => `aprender/${l.id}`),
  ]);

  for (const item of buildSearchIndex()) {
    assert.ok(allowedRoutes.has(item.route), `Unexpected search route: ${item.route}`);
  }

  for (const triage of EMERGENCY_TRIAGE_CASES) {
    assert.ok(allowedRoutes.has(triage.relatedRoute), `Unexpected triage route: ${triage.relatedRoute}`);
  }

  for (const prot of PROTECTION_CHECKLIST_ITEMS) {
    if (prot.relatedRoute) {
      assert.ok(allowedRoutes.has(prot.relatedRoute), `Unexpected protection route: ${prot.relatedRoute}`);
    }
  }
});

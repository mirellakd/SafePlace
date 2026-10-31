/**
 * Dados complementares das páginas ativas do Safe Place:
 * - Triagem interativa passo a passo de "Preciso de ajuda agora" (#ajuda)
 * - Itens práticos do "Checklist de proteção" (#protecao)
 */

export interface EmergencyTriageCase {
  id: string;
  title: string;
  shortDesc: string;
  reassurance: string;
  immediateSteps: string[];
  whoToCall: string;
  relatedRoute: string;
  relatedButtonLabel: string;
}

export interface ProtectionChecklistItem {
  id: string;
  category: string;
  title: string;
  whyItMatters: string;
  howToDoIt: string;
  relatedRoute?: string;
  relatedLabel?: string;
}

export const EMERGENCY_TRIAGE_CASES: EmergencyTriageCase[] = [
  {
    id: 'fiz-pix',
    title: 'Fiz um Pix ou paguei para um golpista',
    shortDesc: 'Enviei dinheiro para loja falsa, falso parente ou chave Pix suspeita.',
    reassurance:
      'Agir rápido é o mais importante agora. Existe um recurso oficial do Banco Central chamado MED criado exatamente para tentar bloquear a conta do golpista.',
    immediateSteps: [
      'Ligue AGORA para o número oficial escrito no verso do seu cartão do banco (ou abra o atendimento dentro do aplicativo do seu banco).',
      'Fale claramente: "Sofri um golpe e quero solicitar a abertura do MED (Mecanismo Especial de Devolução) para este Pix". Anote o número do protocolo!',
      'Salve o comprovante do pagamento e tire fotos da tela (prints) da conversa ou do site falso — não apague as mensagens.',
      'Registre um Boletim de Ocorrência pela Delegacia Virtual da Polícia Civil do seu estado e envie o número do B.O. para o seu banco.',
    ],
    whoToCall: 'Telefone oficial no verso do seu cartão bancário + Delegacia Virtual da Polícia Civil (ou 197).',
    relatedRoute: 'golpe/falso-pix',
    relatedButtonLabel: 'Entender o golpe do Falso Pix',
  },
  {
    id: 'cliquei-link-senha',
    title: 'Toquei em um link estranho ou digitei minha senha / cartão',
    shortDesc: 'Abri um SMS dos Correios, promoção, pontos vencendo ou página suspeita.',
    reassurance:
      'Calma! Se você apenas abriu o link e fechou sem digitar nada, quase sempre nada acontece. Se digitou dados, bloquear agora resolve o risco.',
    immediateSteps: [
      'Feche imediatamente a janela ou aba onde o link abriu.',
      'Se você digitou dados do CARTÃO: abra o aplicativo oficial do seu banco agora mesmo e toque em "Bloquear cartão" (se foi cartão virtual, exclua-o e gere outro depois).',
      'Se você digitou SENHA (do banco, e-mail, Instagram ou Gov.br): entre diretamente pelo aplicativo verdadeiro e troque a senha na mesma hora.',
      'Fique de olho no extrato bancário hoje e nos próximos dias; qualquer cobrança estranha, avise o banco.',
    ],
    whoToCall: 'Aplicativo oficial do seu banco (opção Cartões / Senhas).',
    relatedRoute: 'golpe/link-malicioso',
    relatedButtonLabel: 'Entender o golpe do Link Malicioso',
  },
  {
    id: 'instalei-app',
    title: 'Instalei um aplicativo a pedido de alguém ou fora da loja oficial',
    shortDesc: 'Alguém pediu para instalar "módulo de segurança", acesso remoto ou abri arquivo .apk.',
    reassurance:
      'Cortar a internet do aparelho interrompe na hora qualquer acesso remoto do golpista! Vamos fazer isso primeiro.',
    immediateSteps: [
      'AGORA MESMO: ative o "Modo Avião" no seu celular ou desligue o aparelho de Wi-Fi da tomada! Sem internet, o golpista fica cego e não mexe mais na sua tela.',
      'Com a internet desligada, vá em Configurações → Aplicativos, procure o aplicativo instalado hoje e toque em "Desinstalar".',
      'Usando o telefone de um familiar de confiança, ligue para o número no verso do seu cartão do banco e peça o bloqueio preventivo da sua conta e senhas.',
      'Peça a um filho, parente de confiança ou assistência técnica conhecida para revisar seu aparelho antes de religar o Wi-Fi.',
    ],
    whoToCall: 'Desligue a internet primeiro! Depois ligue de OUTRO telefone para o verso do cartão do seu banco.',
    relatedRoute: 'aprender/instalar-app-seguranca',
    relatedButtonLabel: 'Ver como instalar apps com segurança',
  },
  {
    id: 'clonaram-whatsapp',
    title: 'Passei um código de 6 números ou clonaram meu WhatsApp',
    shortDesc: 'Meu WhatsApp desconectou sozinho ou estão pedindo dinheiro em meu nome.',
    reassurance:
      'Você consegue retomar seu número rapidamente, e avisar a família corta a chance de alguém mandar dinheiro.',
    immediateSteps: [
      'Pegue emprestado um telefone comum e ligue para os familiares mais próximos (filhos, irmãos, marido) avisando: "Clonaram meu WhatsApp, não façam nenhum Pix!".',
      'No seu celular, abra o WhatsApp, digite o SEU número de telefone com DDD e peça um novo código por SMS ou ligação. Assim que você digitar o código novo, o golpista é expulso!',
      'Mesmo se aparecer uma tela pedindo senha de duas etapas criada pelo criminoso (que pede 7 dias de espera), fique tranquila: o golpista JÁ FOI DESCONECTADO da sua conta!',
      'Assim que recuperar o acesso, ative sua própria senha em Configurações → Conta → Confirmação em duas etapas.',
    ],
    whoToCall: 'Avise familiares por ligação comum e, se precisar, envie e-mail para support@whatsapp.com.',
    relatedRoute: 'golpe/whatsapp-clonado',
    relatedButtonLabel: 'Entender o golpe do WhatsApp Clonado',
  },
];

export const PROTECTION_CHECKLIST_ITEMS: ProtectionChecklistItem[] = [
  {
    id: 'prot-whatsapp-pin',
    category: 'WhatsApp Blindado',
    title: 'Ativei a senha de 6 números (Confirmação em duas etapas) no WhatsApp',
    whyItMatters:
      'Impede que golpistas tomem sua conta do WhatsApp mesmo se descobrirem algum código de SMS.',
    howToDoIt:
      'No WhatsApp, toque nos três pontinhos (ou Configurações) → Conta → Confirmação em duas etapas → Ativar. Escolha 6 números fáceis para você e cadastre seu e-mail.',
    relatedRoute: 'golpe/whatsapp-clonado',
    relatedLabel: 'Ver guia do WhatsApp clonado',
  },
  {
    id: 'prot-whatsapp-conectados',
    category: 'WhatsApp Blindado',
    title: 'Conferi se não há computadores estranhos em "Aparelhos conectados"',
    whyItMatters:
      'Garante que mais ninguém esteja lendo suas conversas à distância pelo computador.',
    howToDoIt:
      'Na tela principal do WhatsApp, toque nos três pontinhos (ou Configurações) → Aparelhos conectados. Se houver algum aparelho que você não conhece, toque nele e escolha "Desconectar".',
    relatedRoute: 'golpe/whatsapp-clonado',
    relatedLabel: 'Ver sinais de invasão no WhatsApp',
  },
  {
    id: 'prot-bloqueio-tela',
    category: 'Celular Seguro',
    title: 'Coloquei bloqueio na tela do celular (digital, rosto ou senha)',
    whyItMatters:
      'Se você esquecer ou perder o celular na rua, ninguém consegue abrir seus aplicativos ou conversas.',
    howToDoIt:
      'Abra Configurações (engrenagem) → Tela de bloqueio (ou Segurança / Face ID e Código) e ative sua impressão digital ou uma senha de 6 números.',
  },
  {
    id: 'prot-limite-pix',
    category: 'Banco e Pix',
    title: 'Ajustei um limite diário e noturno confortável para o meu Pix',
    whyItMatters:
      'Deixar um limite menor para o dia a dia protege suas economias contra transferências altas inesperadas.',
    howToDoIt:
      'Abra o aplicativo oficial do seu banco → Área Pix → Meus Limites Pix e diminua o valor máximo para o que você realmente usa na rotina.',
    relatedRoute: 'golpe/falso-pix',
    relatedLabel: 'Ver cuidados com Falso Pix',
  },
  {
    id: 'prot-cartao-virtual',
    category: 'Compras na Internet',
    title: 'Uso apenas Cartão Virtual ao comprar em sites na internet',
    whyItMatters:
      'Se algum site tiver problema, você bloqueia ou apaga o cartão virtual com um toque sem perder o cartão de plástico da bolsa.',
    howToDoIt:
      'Dentro do aplicativo do seu banco, toque em "Cartões" → "Cartão Virtual" e use esse número exclusivo nas compras online.',
    relatedRoute: 'compras-seguras',
    relatedLabel: 'Abrir checklist de Compras Seguras',
  },
  {
    id: 'prot-lojas-oficiais-apps',
    category: 'Aplicativos',
    title: 'Só instalo aplicativos pela Play Store ou App Store oficial',
    whyItMatters:
      'Evita programas espiões enviados por arquivos ".apk" no WhatsApp ou falsos alertas de vírus em sites.',
    howToDoIt:
      'Sempre procure novos aplicativos abrindo você mesma a Play Store (Android) ou App Store (iPhone) — nunca instale nada por links de mensagens.',
    relatedRoute: 'aprender/instalar-app-seguranca',
    relatedLabel: 'Aprender a instalar app com segurança',
  },
  {
    id: 'prot-combinado-familia',
    category: 'Família Protegida',
    title: 'Combinei com meus filhos de sempre ligar no número antigo ou por vídeo',
    whyItMatters:
      'Corta na hora o golpe do "parente com número novo" pedindo dinheiro emprestado com pressa.',
    howToDoIt:
      'Avise a família: "Se alguém mandar mensagem dizendo que trocou de chip e pedir Pix, vou ligar primeiro no número antigo ou chamar por vídeo!".',
    relatedRoute: 'aprender/videochamada',
    relatedLabel: 'Aprender como fazer videochamada',
  },
  {
    id: 'prot-caderninho-casa',
    category: 'Senhas Seguras',
    title: 'Guardo minhas senhas em um caderninho em casa (nunca no WhatsApp)',
    whyItMatters:
      'Se alguém tiver acesso ao seu celular, não encontrará suas senhas buscando a palavra "senha" nas mensagens.',
    howToDoIt:
      'Anote suas senhas com tranquilidade em um caderninho guardado na gaveta de casa e apague mensagens antigas onde tenha escrito senhas.',
  },
];

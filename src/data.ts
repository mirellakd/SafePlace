/**
 * Conteúdo completo em Português do Brasil para o Safe Place.
 * Inclui exclusivamente as páginas ativas:
 * - Dicas diárias de sossego
 * - 5 Golpes essenciais: loja falsa, link malicioso, WhatsApp clonado, parente com número novo e falso Pix
 * - Checklist de Compras Seguras: "Posso confiar nesta loja?"
 * - 4 Lições práticas de celular: videochamada, tirar print, aumentar a letra e instalar app com segurança
 * - Índice unificado de busca apontando somente para páginas existentes
 */

import type { ChecklistQuestion, SearchableItem } from './logic';

export interface ScamPageData {
  slug: string;
  number: number;
  shortTitle: string;
  title: string;
  categoryLabel: string;
  isTopCommon?: boolean;
  /** O que é (2 frases claras e diretas) */
  whatIsIt: string;
  /** Exemplo realista da mensagem ou situação */
  mockup: {
    channel: 'WhatsApp' | 'SMS' | 'Ligação / Áudio' | 'Site / Anúncio' | 'Boleto / Pagamento';
    senderName: string;
    senderDetail: string;
    time: string;
    messages: string[];
    caption: string;
  };
  /** Sinais de alerta (caixa amarela) */
  warningSigns: string[];
  /** O que fazer para se proteger (caixa verde) */
  whatToDo: string[];
  /** O que NUNCA fazer (caixa vermelha) */
  neverDo: string[];
  /** Se já caí, o que fazer (passo a passo acolhedor) */
  ifFellForIt: string[];
  keywords: string[];
}

export interface LearnLesson {
  id: string;
  device: 'celular';
  deviceLabel: string;
  title: string;
  summary: string;
  duration: string;
  whyUseful: string;
  steps: {
    title: string;
    detail: string;
  }[];
  goldenTip: string;
  keywords: string[];
}

export const DAILY_TIPS: string[] = [
  'Nenhum banco liga pedindo sua senha ou pedindo para você fazer um Pix de "teste" ou "estorno". Se ligarem, desligue na hora sem medo de parecer mal-educada.',
  'Recebeu áudio ou mensagem urgente de um filho ou parente pedindo dinheiro de um número novo? Pare, respire e ligue para o número antigo dele antes de responder.',
  'Antes de pagar qualquer Pix, olhe com calma o nome de quem vai receber na tela final do banco. Se aparecer o nome de uma pessoa desconhecida no lugar da loja, cancele!',
  'Desconfie sempre de promoções com pressa ("só nos próximos 10 minutos!"). A pressa é a principal ferramenta do golpista para não deixar você pensar.',
  'Os Correios e transportadoras nunca cobram taxas por SMS com links estranhos para liberar encomendas. Consulte sempre pelo site ou aplicativo oficial.',
  'Quando for comprar pela internet, dê preferência ao Cartão Virtual (aquele que você gera dentro do aplicativo do seu banco). Se der problema, é muito mais fácil cancelar a compra do que no Pix.',
  'Nunca passe o código de 6 números que chega por SMS para ninguém — nem para amigos, nem para "atendentes", nem para anúncios de vendas.',
  'Só instale aplicativos pela loja oficial do seu celular (Play Store no Android ou App Store no iPhone). Nunca toque em arquivos terminados em ".apk" no WhatsApp.',
  'Se algo der errado, lembre-se: golpistas trabalham o dia inteiro treinando para enganar médicos, juízes, professores e famílias inteiras. A culpa NUNCA é da vítima.',
  'Para criar uma senha forte e fácil de lembrar, junte 3 ou 4 palavras que fazem sentido para você, como "CafeQuenteManha2026", em vez de usar sua data de nascimento.',
];

export const SCAMS_DATA: ScamPageData[] = [
  {
    slug: 'loja-falsa',
    number: 1,
    shortTitle: 'Loja falsa na internet',
    title: 'Loja falsa e compra em site não confiável',
    categoryLabel: 'Compras na internet',
    isTopCommon: true,
    whatIsIt:
      'Golpistas criam sites muito bonitos, parecidos com lojas famosas, anunciando eletrodomésticos, roupas ou celulares pela metade do preço. Depois que você paga (quase sempre por Pix), o produto nunca é entregue e o site desaparece.',
    mockup: {
      channel: 'Site / Anúncio',
      senderName: 'Anúncio Patrocinado • Super Oferta Hoje',
      senderDetail: 'liquidacao-magalu-oferta-hoje.site',
      time: 'Agora',
      messages: [
        'ÚLTIMAS 3 UNIDADES! Jogo de Panelas Antiaderente 10 Peças + Fritadeira Elétrica de R$ 899,00 por apenas R$ 149,90 no Pix!',
        'Frete Grátis para todo o Brasil. Pagamento exclusivo via Pix com liberação imediata. Selo Site 100% Blindado!',
      ],
      caption:
        'Repare no endereço estranho (.site), no desconto exagerado e na exigência de pagar só por Pix.',
    },
    warningSigns: [
      'Preço bom demais para ser verdade (metade do valor das outras lojas).',
      'O site aceita pagamento APENAS por Pix ou boleto, dizendo que o sistema de cartão está "em manutenção".',
      'Na hora de pagar o Pix, aparece o nome de uma pessoa física desconhecida (CPF) ou uma empresa com nome totalmente diferente da loja.',
      'Site recém-criado, sem CNPJ no rodapé ou com imagens de "Site Seguro" que não abrem nada quando você toca nelas.',
      'Você chegou até a página clicando em um anúncio no Instagram, Facebook ou WhatsApp.',
    ],
    whatToDo: [
      'Antes de comprar, abra o Google e pesquise o nome da loja junto com as palavras "Reclame Aqui" ou "é confiável".',
      'Digite você mesma o endereço da loja famosa no navegador (ex: magazineluiza.com.br, casasbahia.com.br) em vez de clicar em anúncios.',
      'Verifique se o site tem CNPJ no final da página e se aceita cartão de crédito normalmente.',
      'Prefira sempre pagar compras online usando o cartão de crédito virtual do seu banco.',
    ],
    neverDo: [
      'Nunca faça Pix para o nome de uma pessoa física quando estiver comprando de uma loja.',
      'Nunca confie apenas em "selos de segurança" desenhados na página ou em comentários elogiosos dentro do próprio anúncio.',
      'Nunca compre no impulso por causa de relógios de contagem regressiva ("acaba em 5 minutos").',
    ],
    ifFellForIt: [
      'Avise seu banco imediatamente pelo aplicativo ou telefone oficial. Se pagou por Pix, peça a abertura do "MED" (Mecanismo Especial de Devolução) por motivo de golpe.',
      'Se pagou com cartão de crédito, peça ao banco a contestação da compra por mercadoria não entregue / site fraudulento e bloqueie o cartão virtual usado.',
      'Tire fotos da tela (prints) do anúncio, do site, da conversa e guarde o comprovante de pagamento.',
      'Registre um Boletim de Ocorrência (pode ser pela Delegacia Virtual do seu estado) e envie o número ao seu banco.',
    ],
    keywords: ['loja falsa', 'site falso', 'compra', 'pix', 'cnpj', 'desconto', 'anuncio', 'instagram', 'reclame aqui'],
  },
  {
    slug: 'link-malicioso',
    number: 2,
    shortTitle: 'Link malicioso',
    title: 'Link malicioso por SMS, WhatsApp ou e-mail',
    categoryLabel: 'Mensagens e Links',
    isTopCommon: true,
    whatIsIt:
      'Você recebe uma mensagem dizendo que sua encomenda ficou presa na alfândega, que seu CPF será bloqueado, que seus pontos vão vencer ou que você ganhou um brinde. O objetivo é fazer você tocar em um link falso para roubar sua senha ou cobrar uma taxa inventada.',
    mockup: {
      channel: 'SMS',
      senderName: 'SMS • 29084',
      senderDetail: 'Mensagem de texto',
      time: '10:42',
      messages: [
        'CORREIOS INFORMA: Seu pacote foi retido por falta de pagamento de taxa postal (R$ 47,80). Regularize hoje para evitar devolucao: http://rastreio-taxa-urgente.com/pagar',
      ],
      caption:
        'Empresas oficiais não mandam links com endereços esquisitos cobrando taxas urgentes por SMS.',
    },
    warningSigns: [
      'Mensagens que causam susto ou urgência: "CPF irregular na Receita", "Conta bloqueada hoje", "Encomenda retida".',
      'Promessas de prêmios, cestas de chocolate, perfumes grátis ou pontos de cartão prestes a vencer.',
      'Links com palavras misturadas ou finais estranhos (como ".top", ".xyz", ".site", "taxa-urgente.com").',
      'Erros de português ou falta de acentos na mensagem.',
    ],
    whatToDo: [
      'Se estiver esperando uma encomenda, feche a mensagem e abra diretamente o aplicativo oficial dos Correios ou a loja onde você comprou.',
      'Se a mensagem falar em banco ou pontos, abra o aplicativo do seu banco normalmente (sem tocar no link da mensagem) para ver se existe algum aviso lá dentro.',
      'Apague a mensagem e bloqueie o remetente.',
    ],
    neverDo: [
      'Nunca toque em links recebidos por SMS de números desconhecidos.',
      'Nunca digite sua senha do banco, senha do Gov.br ou número do cartão em páginas abertas por links de mensagem.',
      'Nunca pague taxas de entrega enviadas por SMS ou WhatsApp sem antes conferir no site onde fez a compra.',
    ],
    ifFellForIt: [
      'Se você APENAS clicou no link, mas não digitou nada nem baixou arquivo: feche a aba do navegador. Na maioria das vezes, só abrir a página e fechar já evita o problema.',
      'Se você DIGITOU alguma senha (banco, e-mail, Gov.br ou rede social): troque essa senha imediatamente entrando pelo aplicativo oficial.',
      'Se você DIGITOU dados do cartão: entre no aplicativo do banco agora mesmo e bloqueie esse cartão.',
      'Se o celular baixou algum arquivo estranho: não abra o arquivo, apague-o da pasta "Downloads" e peça ajuda a alguém de confiança para revisar os aplicativos instalados.',
    ],
    keywords: ['link', 'link malicioso', 'sms', 'email', 'correios', 'encomenda', 'retida', 'cpf', 'pontos', 'voce ganhou', 'cliquei'],
  },
  {
    slug: 'whatsapp-clonado',
    number: 3,
    shortTitle: 'WhatsApp clonado',
    title: 'WhatsApp clonado e celular invadido',
    categoryLabel: 'WhatsApp e Celular',
    isTopCommon: true,
    whatIsIt:
      'O golpista engana a vítima para conseguir o código de 6 números enviado por SMS ou faz a pessoa ler um código QR no computador dele. Com isso, ele entra no seu WhatsApp e passa a pedir dinheiro emprestado para seus amigos e familiares fingindo ser você.',
    mockup: {
      channel: 'WhatsApp',
      senderName: 'Restaurante Sorteio VIP',
      senderDetail: '+55 11 99812-0041',
      time: '14:15',
      messages: [
        'Olá! Você foi selecionada para ganhar um jantar com acompanhante! 🎉',
        'Acabamos de enviar um código de 6 dígitos por SMS para o seu celular só para confirmar sua reserva. Pode me falar qual número chegou aí?',
      ],
      caption:
        'Esse código de 6 dígitos é a chave do seu WhatsApp! Quem recebe esse número consegue tomar sua conta.',
    },
    warningSigns: [
      'Alguém pede um código de 6 números que acabou de chegar por SMS no seu celular (dizendo ser de um anúncio, sorteio, pesquisa do IBGE ou suporte).',
      'Seu WhatsApp sai da conta sozinho de repente, dizendo que seu número foi registrado em outro aparelho.',
      'Amigos ligam perguntando se está tudo bem ou dizendo que você pediu dinheiro emprestado no WhatsApp.',
      'Mensagens aparecem como lidas sem você ter aberto, ou surgem conversas que você não lembra de ter feito.',
    ],
    whatToDo: [
      'Ative hoje mesmo a "Confirmação em duas etapas" no WhatsApp: toque nos três pontinhos (ou Configurações) → Conta → Confirmação em duas etapas → Ativar (crie uma senha de 6 números só sua).',
      'Confira se ninguém está espionando seu WhatsApp: abra o WhatsApp → três pontinhos (ou Configurações) → Aparelhos conectados. Se tiver algum computador que você não reconhece, toque nele e escolha "Desconectar".',
      'Desconfie de qualquer ligação ou mensagem pedindo códigos recebidos por SMS.',
    ],
    neverDo: [
      'Nunca informe códigos recebidos por SMS para NINGUÉM, sob nenhuma justificativa.',
      'Nunca aponte a câmera do seu WhatsApp para ler um QR Code enviado por desconhecidos.',
    ],
    ifFellForIt: [
      'Avise imediatamente seus familiares e amigos (por ligação telefônica comum ou pedindo para alguém postar nos grupos) que seu WhatsApp foi invadido e para ninguém fazer Pix.',
      'Tente entrar novamente no WhatsApp no seu celular digitando seu número de telefone e pedindo um novo código por SMS ou ligação — isso derruba o golpista do aparelho principal.',
      'Se o golpista colocou uma senha de duas etapas, o WhatsApp pedirá 7 dias para liberar sem senha (durante essa espera, o golpista já é desconectado assim que você valida o SMS!).',
      'Envie um e-mail para support@whatsapp.com com o assunto "Perdido/Roubado: desative minha conta" informando seu número completo com +55 e DDD.',
    ],
    keywords: ['whatsapp', 'zap', 'clonado', 'invadido', 'codigo', '6 digitos', 'aparelhos conectados', 'duas etapas'],
  },
  {
    slug: 'parente-numero-novo',
    number: 4,
    shortTitle: 'Parente com número novo',
    title: 'Golpe do "parente ou filho com número novo"',
    categoryLabel: 'WhatsApp e Família',
    isTopCommon: true,
    whatIsIt:
      'Uma pessoa manda mensagem no WhatsApp usando a foto real do seu filho, filha, sobrinho ou neto (pega nas redes sociais), dizendo que trocou de número porque o celular quebrou. Logo depois, pede para você pagar uma conta ou fazer um Pix urgente porque o aplicativo do banco dele "ainda não liberou no celular novo".',
    mockup: {
      channel: 'WhatsApp',
      senderName: 'Número Desconhecido (com foto do seu filho)',
      senderDetail: '+55 21 98700-1122',
      time: '16:08',
      messages: [
        'Oi mãe! Tudo bem? Salva meu número novo aí, o outro chip queimou e deixei o celular no conserto.',
        'Mãe, tô num aperto aqui... o app do meu banco pede 24h pra liberar no aparelho novo e preciso pagar o mecânico agora (R$ 980). Você faz esse Pix pra mim e amanhã cedo te devolvo?',
      ],
      caption:
        'A foto é verdadeira, mas a pessoa por trás do número novo é um golpista.',
    },
    warningSigns: [
      'Alguém da família chama dizendo "Oi mãe / tia / vó, troquei de número, salva esse aqui".',
      'Logo nos primeiros minutos de conversa, surge uma emergência financeira.',
      'A pessoa diz que não pode atender ligação de voz ou vídeo porque "o microfone/câmera está estragado" ou "está em reunião".',
      'O Pix pedido vai para o nome de uma terceira pessoa desconhecida ("é a conta do fornecedor / mecânico / amigo").',
    ],
    whatToDo: [
      'Ligue imediatamente por chamada telefônica normal para o NÚMERO ANTIGO do seu filho ou parente — quase sempre ele vai atender normalmente!',
      'Se não conseguir falar no número antigo, ligue para outra pessoa que mora ou trabalha perto dele.',
      'Faça uma pergunta que só seu familiar saberia responder (por exemplo: o nome do primeiro bichinho de estimação ou o que vocês comeram juntos no domingo).',
    ],
    neverDo: [
      'Nunca faça transferência para números recém-adicionados sem ouvir a voz da pessoa em uma conversa de verdade ou fazer chamada de vídeo.',
      'Nunca apague o número antigo do seu familiar antes de confirmar pessoalmente que ele trocou mesmo de chip.',
    ],
    ifFellForIt: [
      'Entre em contato com o seu banco na mesma hora e informe que sofreu o golpe do falso parente, solicitando o bloqueio cautelar via MED (Mecanismo Especial de Devolução do Pix).',
      'Guarde prints de toda a conversa, do número de telefone do golpista e do comprovante do Pix.',
      'Avise o restante da família para que mais ninguém responda àquele número.',
      'Faça um Boletim de Ocorrência (online ou presencial) anexando os comprovantes.',
    ],
    keywords: ['filho', 'parente', 'numero novo', 'mae', 'troquei de numero', 'familia', 'whatsapp', 'emprestado'],
  },
  {
    slug: 'falso-pix',
    number: 5,
    shortTitle: 'Falso Pix',
    title: 'Falso Pix, comprovante falso e Pix por engano',
    categoryLabel: 'Banco e Pix',
    isTopCommon: true,
    whatIsIt:
      'Existem duas armadilhas comuns: na primeira, alguém envia uma imagem montada de "comprovante de Pix" (ou Pix agendado) sem o dinheiro ter caído de verdade. Na segunda, o golpista faz um Pix para você, diz que mandou por engano chorando e pede para você devolver para OUTRA chave Pix — e depois pede ao banco o estorno do primeiro Pix, levando seu dinheiro em dobro.',
    mockup: {
      channel: 'WhatsApp',
      senderName: 'Desconhecido',
      senderDetail: '+55 31 99144-5530',
      time: '11:20',
      messages: [
        'Moça, pelo amor de Deus me ajuda!! Acabei de fazer um Pix de R$ 500 errado pro seu número de celular, era o dinheiro do remédio da minha filha!',
        'Faz a devolução pra mim nessa chave Pix da conta da minha esposa: 123.456.789-00? Tô desesperado!',
      ],
      caption:
        'Atenção: devolver para OUTRA chave Pix faz você perder dinheiro do seu próprio bolso se o golpista pedir estorno ao banco!',
    },
    warningSigns: [
      'Comprovantes enviados em foto ou PDF, mas o saldo da sua conta não aumentou.',
      'Comprovante escrito bem pequeno "Pix Agendado" em vez de pagamento concluído.',
      'Desconhecido dizendo que fez um Pix por engano e pedindo para você devolver para uma chave Pix DIFERENTE da conta que enviou.',
      'Comprador apressado mandando motorista de aplicativo buscar um produto antes de você conferir o extrato do banco.',
    ],
    whatToDo: [
      'Sempre abra o aplicativo do SEU banco e olhe o EXTRATO real. Comprovante enviado em conversa não vale como dinheiro na conta!',
      'Se alguém realmente mandou um Pix por engano e o valor caiu no seu extrato, use APENAS o botão oficial "Devolver Pix" (ou "Reembolsar") que fica dentro do próprio extrato do seu banco.',
      'Ao usar o botão "Devolver Pix", o dinheiro volta exatamente para a conta de origem e você fica 100% protegida.',
    ],
    neverDo: [
      'Nunca devolva um "Pix por engano" fazendo um NOVO Pix para outra chave informada por mensagem.',
      'Nunca entregue um produto vendido confiando apenas na imagem do comprovante que a pessoa mostrou.',
    ],
    ifFellForIt: [
      'Contate seu banco pelo canal oficial na mesma hora explicando a situação e mostre as mensagens recebidas.',
      'Peça a abertura do MED (Mecanismo Especial de Devolução) caso tenha enviado um novo Pix para a conta do golpista.',
      'Salve prints da conversa, dos comprovantes e registre Boletim de Ocorrência.',
    ],
    keywords: ['pix', 'falso pix', 'comprovante falso', 'pix por engano', 'agendado', 'devolver pix', 'extrato', 'estorno'],
  },
];

export const STORE_CHECKLIST_QUESTIONS: ChecklistQuestion[] = [
  {
    id: 'price_too_low',
    question: '1. O preço do produto está MUITO mais barato que nas outras lojas (metade do preço ou desconto exagerado)?',
    helpText: 'Exemplo: uma geladeira ou celular que custa R$ 2.000 sendo vendido por R$ 690.',
    riskWhen: 'yes',
    severity: 'critical',
    reasonIfRisk:
      'Descontos milagrosos são a armadilha número 1 das lojas falsas para fazer a gente comprar sem pensar.',
  },
  {
    id: 'only_pix',
    question: '2. Na hora de pagar, a loja aceita APENAS Pix ou boleto (sem aceitar cartão de crédito)?',
    helpText: 'Às vezes o site até mostra figuras de cartões, mas na tela final diz que só funciona Pix.',
    riskWhen: 'yes',
    severity: 'critical',
    reasonIfRisk:
      'Lojas sérias aceitam cartão de crédito. Golpistas exigem Pix porque o dinheiro vai direto na hora.',
  },
  {
    id: 'pix_person_name',
    question: '3. Se você testou o Pix ou boleto, apareceu o nome de uma PESSOA desconhecida em vez do nome da loja?',
    helpText: 'Lojas verdadeiras recebem em conta empresarial (CNPJ) com o nome da própria empresa.',
    riskWhen: 'yes',
    severity: 'critical',
    reasonIfRisk:
      'Fazer Pix para nome de pessoa física ao comprar em site é sinal certeiro de golpe!',
  },
  {
    id: 'weird_url',
    question: '4. O endereço do site lá em cima tem palavras estranhas ou diferente do oficial?',
    helpText: 'Exemplos suspeitos: "ofertas-americanas-hoje.site", "promo-magalu.loja.top". Lojas brasileiras usam ".com.br".',
    riskWhen: 'yes',
    severity: 'critical',
    reasonIfRisk:
      'O endereço do site imita uma marca famosa, mas usa palavras extras ou finais estranhos.',
  },
  {
    id: 'from_social_ad',
    question: '5. Você abriu essa loja clicando em um anúncio no Instagram, Facebook ou mensagem de WhatsApp?',
    helpText: 'Qualquer pessoa pode pagar para colocar um anúncio patrocinado nas redes sociais.',
    riskWhen: 'yes',
    severity: 'warning',
    reasonIfRisk:
      'Você veio por um anúncio em rede social — vale redobrar o cuidado e abrir o site oficial digitando no navegador.',
  },
  {
    id: 'checked_reclame_aqui',
    question: '6. Você pesquisou o nome da loja no Google / Reclame Aqui e viu que ela existe há bastante tempo e responde os clientes?',
    helpText: 'Se a loja não existe no Reclame Aqui ou só tem reclamações de "comprei e não recebi", fuja!',
    riskWhen: 'no',
    severity: 'warning',
    reasonIfRisk:
      'Ainda falta pesquisar o nome da loja no Reclame Aqui para ver se outras pessoas receberam suas compras.',
  },
  {
    id: 'has_cnpj_contact',
    question: '7. Lá no final da página (rodapé), o site mostra CNPJ, endereço físico e telefone de atendimento claros?',
    helpText: 'Pela lei brasileira, toda loja na internet precisa informar seu CNPJ e canais de contato.',
    riskWhen: 'no',
    severity: 'warning',
    reasonIfRisk:
      'A loja esconde o CNPJ ou não mostra endereço e telefone claros no final da página.',
  },
];

export const LEARN_LESSONS: LearnLesson[] = [
  {
    id: 'videochamada',
    device: 'celular',
    deviceLabel: 'No Celular',
    title: 'Como fazer videochamada no WhatsApp e regular o som',
    summary:
      'Converse olhando no rosto dos filhos e netos — e use isso também para desmascarar números falsos em segundos!',
    duration: '3 minutos',
    whyUseful:
      'Mata a saudade de quem está longe e confirma na hora se é realmente seu familiar falando.',
    steps: [
      {
        title: 'Abra a conversa da pessoa no WhatsApp',
        detail: 'Toque no nome do seu filho, amiga ou parente na lista de conversas.',
      },
      {
        title: 'Toque no desenho da filmadora lá no canto de cima à direita',
        detail:
          'Ao lado do nome da pessoa há dois desenhos: uma filmadora (videochamada) e um telefone (chamada só de voz). Toque na filmadora e confirme se o aplicativo perguntar.',
      },
      {
        title: 'Se a voz estiver baixa, aperte o botão lateral do celular',
        detail:
          'Durante a chamada, aperte o botão físico de "Aumentar Volume" na lateral do aparelho. Na videochamada, o viva-voz já liga sozinho.',
      },
      {
        title: 'Quer mostrar algo da sua casa (como uma planta ou receita)?',
        detail:
          'Toque no botão com duas setinhas girando na tela para virar para a câmera de trás do celular. Toque de novo para voltar para o seu rosto.',
      },
    ],
    goldenTip:
      'Golpistas NUNCA aceitam chamada de vídeo clara porque não têm o rosto do seu familiar!',
    keywords: ['videochamada', 'video', 'chamada de video', 'whatsapp', 'camera', 'volume', 'som', 'ligar', 'celular'],
  },
  {
    id: 'tirar-print',
    device: 'celular',
    deviceLabel: 'No Celular',
    title: 'Como tirar "print" (foto da tela) no celular',
    summary:
      'Guarde comprovantes de pagamento, números de pedido, anúncios e conversas importantes com um toque.',
    duration: '3 minutos',
    whyUseful:
      'Ter uma foto da tela ajuda a guardar comprovantes, mostrar uma dúvida para um filho ou registrar provas de uma compra.',
    steps: [
      {
        title: 'No celular Android (Samsung, Motorola, Xiaomi)',
        detail:
          'Aperte AO MESMO TEMPO e solte rapidinho dois botões na lateral do celular: o botão de "Diminuir Volume" + o botão de "Ligar/Desligar". A tela vai piscar e salvar a foto!',
      },
      {
        title: 'No iPhone',
        detail:
          'Aperte ao mesmo tempo e solte rápido o botão lateral direito (Ligar) + o botão de "Aumentar Volume" na lateral esquerda.',
      },
      {
        title: 'Onde encontrar a foto salva no celular?',
        detail:
          'Abra o aplicativo "Galeria" ou "Fotos" do seu celular e procure o álbum chamado "Capturas de tela" (ou "Screenshots").',
      },
      {
        title: 'Como enviar o print pelo WhatsApp',
        detail:
          'Abra a conversa de quem vai receber, toque no desenho do clipe (ou no sinal de "+"), escolha "Fotos / Galeria" e selecione a captura que acabou de fazer.',
      },
    ],
    goldenTip:
      'Se não acertar os dois botões de primeira, não tem problema! O segredo é apertar os dois juntos e soltar rápido, sem ficar segurando.',
    keywords: ['tirar print', 'print', 'foto da tela', 'captura de tela', 'celular', 'comprovante', 'galeria'],
  },
  {
    id: 'aumentar-a-letra',
    device: 'celular',
    deviceLabel: 'No Celular',
    title: 'Como aumentar a letra do celular sem forçar a vista',
    summary:
      'Deixe as mensagens do WhatsApp, os menus e os sites grandes e confortáveis de ler todos os dias.',
    duration: '3 minutos',
    whyUseful:
      'Descansa os olhos e ajuda você a ler com clareza nomes de lojas e valores na tela do banco sem errar.',
    steps: [
      {
        title: 'No celular Android (Samsung, Motorola, Xiaomi)',
        detail:
          'Abra o ícone da engrenagem ("Configurações") → toque em "Visor" (ou "Tela") → procure "Tamanho e estilo da fonte" e arraste a bolinha para a direita até ficar ótimo para você.',
      },
      {
        title: 'No iPhone',
        detail:
          'Abra o ícone da engrenagem ("Ajustes") → toque em "Tela e Brilho" → "Tamanho do Texto" e arraste o controle para a direita. Se quiser letras mais firmes, ative também "Negrito".',
      },
      {
        title: 'Aumentar só as conversas dentro do WhatsApp',
        detail:
          'No WhatsApp Android, toque nos três pontinhos → Configurações → Conversas → Tamanho da fonte e escolha "Grande".',
      },
      {
        title: 'Dar zoom rápido em uma foto ou site',
        detail:
          'Apoie dois dedos juntos na tela e afaste um do outro devagar (movimento de pinça) para aproximar qualquer imagem pequena.',
      },
    ],
    goldenTip:
      'Aumentar a letra é uma função oficial que já vem de fábrica no seu celular — nunca instale aplicativos que prometem "lupa mágica" cheios de propaganda!',
    keywords: ['aumentar a letra', 'letra grande', 'fonte', 'tamanho da letra', 'visor', 'tela', 'celular', 'zoom'],
  },
  {
    id: 'instalar-app-seguranca',
    device: 'celular',
    deviceLabel: 'No Celular',
    title: 'Como instalar aplicativos com segurança no celular',
    summary:
      'Aprenda a usar somente a loja oficial do seu aparelho e a fugir de aplicativos falsos ou espiões.',
    duration: '4 minutos',
    whyUseful:
      'Impede a entrada de programas falsos que tentam imitar bancos, Gov.br ou jogos cheios de armadilhas.',
    steps: [
      {
        title: 'Abra SEMPRE a loja oficial que já vem no seu celular',
        detail:
          'No Android (Samsung, Motorola, Xiaomi), use apenas a "Play Store" (ícone do triângulo colorido). No iPhone, use apenas a "App Store" (ícone azul com a letra A).',
      },
      {
        title: 'Pesquise pelo nome e confira quem criou o aplicativo',
        detail:
          'Antes de tocar em "Instalar" (ou "Obter"), leia logo abaixo do título o nome da empresa criadora (por exemplo: "Serviços e Informações do Brasil" no app Gov.br) e veja se milhões de pessoas já baixaram.',
      },
      {
        title: 'Nunca instale aplicativos enviados por link ou WhatsApp',
        detail:
          'Bancos, INSS e gerentes NUNCA mandam aplicativos por conversa! Se alguém enviar um arquivo terminado em ".apk" ou pedir para instalar "módulo de segurança", recuse na hora.',
      },
      {
        title: 'Ignore avisos piscando em sites dizendo "Seu celular tem vírus!"',
        detail:
          'Essas janelas que vibram ou apitam quando você está lendo uma receita ou notícia na internet são propagandas falsas. Apenas feche a aba do navegador e não baixe nenhum "limpador".',
      },
    ],
    goldenTip:
      'Se um aplicativo simples (como lanterna, bíblia ou jogo) pedir permissão para "ler toda a tela" ou "Acessibilidade", não aceite e desinstale imediatamente!',
    keywords: ['instalar app', 'instalar aplicativo', 'play store', 'app store', 'apk', 'virus', 'seguranca', 'celular', 'baixar aplicativo'],
  },
];

/**
 * Monta a lista unificada de busca apontando exclusivamente para as páginas que existem no site.
 */
export function buildSearchIndex(): SearchableItem[] {
  const scamItems: SearchableItem[] = SCAMS_DATA.map((scam) => ({
    id: `golpe-${scam.slug}`,
    type: 'golpe',
    title: scam.title,
    summary: scam.whatIsIt,
    keywords: scam.keywords,
    route: `golpe/${scam.slug}`,
  }));

  const lessonItems: SearchableItem[] = LEARN_LESSONS.map((lesson) => ({
    id: `aprender-${lesson.id}`,
    type: 'aprender',
    title: lesson.title,
    summary: lesson.summary,
    keywords: lesson.keywords,
    route: `aprender/${lesson.id}`,
  }));

  const toolItems: SearchableItem[] = [
    {
      id: 'ferramenta-compras-seguras',
      type: 'ferramenta',
      title: 'Compras: Posso confiar nesta loja? (Checklist)',
      summary:
        'Responda 7 perguntas rápidas de Sim ou Não antes de comprar em qualquer site para descobrir se é confiável.',
      keywords: ['compras', 'loja', 'confiar', 'seguro', 'checklist', 'pix', 'cartao', 'site confiavel'],
      route: 'compras-seguras',
    },
    {
      id: 'ferramenta-protecao',
      type: 'ferramenta',
      title: 'Checklist de Proteção Pessoal',
      summary:
        'Confira passo a passo os 8 cuidados simples para blindar seu celular, WhatsApp, Pix e senhas no dia a dia.',
      keywords: ['protecao', 'checklist de protecao', 'cuidados', 'blindar', 'senha', 'duas etapas', 'bloqueio', 'limite pix'],
      route: 'protecao',
    },
    {
      id: 'ferramenta-ajuda-agora',
      type: 'ferramenta',
      title: 'Preciso de ajuda agora — Acho que caí em um golpe',
      summary: 'Escolha o que aconteceu e veja o passo a passo calmo e imediato do que fazer.',
      keywords: ['ajuda', 'socorro', 'cai em um golpe', 'emergencia', 'banco', 'med', 'boletim de ocorrencia'],
      route: 'ajuda',
    },
  ];

  return [...toolItems, ...scamItems, ...lessonItems];
}

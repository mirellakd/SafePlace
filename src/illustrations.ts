/**
 * Ilustrações autorais em SVG inline feitas à mão para o Safe Place.
 * Estilo unificado:
 * - Contorno grosso de 3px na cor azul-escuro (var(--ink) = #15174D)
 * - Preenchimentos chapados (sem gradientes): branco (#FFFFFF), lilás principal (#CDB9F7) e lilás claro (#EDE6FD)
 * - Formas levemente orgânicas, simpáticas e sem rostos assustadores
 * - Inclui também os selos redondos giratórios ("DICA DO DIA" e "SEM CULPA")
 */

export const Illustrations = {
  /**
   * Grande ilustração do Hero: Celular simpático protegido por escudo, lupa e mão amiga de "Pare e confira".
   */
  heroScene: `
    <svg class="illus-hero-svg" viewBox="0 0 460 320" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustração acolhedora mostrando um celular protegido por um escudo, uma lupa de conferência e um sinal amigável de calma">
      <!-- Estrelinhas de 4 pontas desenhadas à mão -->
      <path d="M58 52 L63 66 L77 71 L63 76 L58 90 L53 76 L39 71 L53 66 Z" fill="var(--surface-white)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>
      <path d="M402 44 L406 55 L417 59 L406 63 L402 74 L398 63 L387 59 L398 55 Z" fill="var(--lilac-main)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="88" cy="256" r="10" fill="var(--lilac-main)" stroke="var(--ink)" stroke-width="3"/>
      <circle cx="392" cy="252" r="8" fill="var(--surface-white)" stroke="var(--ink)" stroke-width="3"/>

      <!-- Balão de mensagem à esquerda (com anzolzinho cortado/barrado de forma leve) -->
      <g transform="rotate(-5 95 155)">
        <path d="M36 122 C36 108 48 98 64 98 H134 C150 98 162 108 162 122 V166 C162 180 150 190 134 190 H86 L62 208 L66 190 H64 C48 190 36 180 36 166 Z" fill="var(--surface-white)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>
        <line x1="58" y1="128" x2="138" y2="128" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/>
        <line x1="58" y1="148" x2="118" y2="148" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/>
        <rect x="58" y="162" width="52" height="14" rx="7" fill="var(--lilac-main)" stroke="var(--ink)" stroke-width="2.5"/>
      </g>

      <!-- Aparelho Celular Central simpático -->
      <g transform="rotate(2 235 162)">
        <rect x="168" y="42" width="134" height="236" rx="28" fill="var(--lilac-main)" stroke="var(--ink)" stroke-width="3"/>
        <rect x="180" y="64" width="110" height="186" rx="18" fill="var(--surface-white)" stroke="var(--ink)" stroke-width="3"/>
        <line x1="218" y1="53" x2="252" y2="53" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/>
        <circle cx="235" cy="264" r="6" fill="var(--surface-white)" stroke="var(--ink)" stroke-width="3"/>

        <!-- Rostinho simpático e tranquilo dentro do celular -->
        <circle cx="216" cy="120" r="4.5" fill="var(--ink)"/>
        <circle cx="254" cy="120" r="4.5" fill="var(--ink)"/>
        <path d="M220 136 Q235 149 250 136" stroke="var(--ink)" stroke-width="3" stroke-linecap="round" fill="none"/>

        <!-- Escudo protetor no peito da tela -->
        <path d="M235 160 L267 172 V198 C267 218 252 232 235 239 C218 232 203 218 203 198 V172 Z" fill="var(--lilac-light)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>
        <path d="M223 198 L232 207 L249 188" stroke="var(--ink)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
      </g>

      <!-- Mão com sinal calmo de "Pare / Respire" à direita -->
      <g transform="rotate(6 358 148)">
        <rect x="308" y="92" width="104" height="114" rx="26" fill="var(--surface-white)" stroke="var(--ink)" stroke-width="3"/>
        <!-- Desenho de mão aberta arredondada -->
        <path d="M337 166 V128 C337 123 345 123 345 128 V150 M345 148 V118 C345 113 354 113 354 118 V148 M354 148 V120 C354 115 363 115 363 120 V150 M363 150 V128 C363 123 371 123 371 128 V164 C371 180 359 190 347 190 C334 190 325 180 325 166 V148 C325 143 333 143 335 149 L337 156" fill="var(--lilac-light)" stroke="var(--ink)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </g>

      <!-- Lupa sobreposta na base esquerda -->
      <g transform="translate(116, 198)">
        <circle cx="34" cy="34" r="26" fill="var(--lilac-light)" stroke="var(--ink)" stroke-width="3"/>
        <circle cx="34" cy="34" r="16" fill="var(--surface-white)" stroke="var(--ink)" stroke-width="3"/>
        <line x1="53" y1="53" x2="74" y2="74" stroke="var(--ink)" stroke-width="7" stroke-linecap="round"/>
        <line x1="53" y1="53" x2="74" y2="74" stroke="var(--lilac-main)" stroke-width="2.5" stroke-linecap="round"/>
      </g>
    </svg>
  `,

  /** Mão com sinal de PARE (Passo 1) */
  handStop: `
    <svg class="illus-spot" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="60" cy="60" r="50" fill="var(--lilac-main)" stroke="var(--ink)" stroke-width="3"/>
      <path d="M41 72 V39 C41 34 49 34 49 39 V58 M49 56 V31 C49 26 58 26 58 31 V56 M58 56 V33 C58 28 67 28 67 33 V58 M67 58 V41 C67 36 75 36 75 41 V71 C75 86 64 95 52 95 C39 95 31 85 31 71 V55 C31 50 38 50 40 56 L41 62" fill="var(--surface-white)" stroke="var(--ink)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  /** Lupa de conferência (Passo 2) */
  magnifier: `
    <svg class="illus-spot" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="14" y="14" width="92" height="92" rx="28" fill="var(--surface-white)" stroke="var(--ink)" stroke-width="3"/>
      <circle cx="53" cy="52" r="24" fill="var(--lilac-main)" stroke="var(--ink)" stroke-width="3"/>
      <circle cx="53" cy="52" r="13" fill="var(--surface-white)" stroke="var(--ink)" stroke-width="3"/>
      <path d="M71 70 L90 89" stroke="var(--ink)" stroke-width="8" stroke-linecap="round"/>
    </svg>
  `,

  /** Escudo + Cadeado tranquilo (Passo 3) */
  shieldLock: `
    <svg class="illus-spot" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M60 14 L98 29 V59 C98 84 81 101 60 109 C39 101 22 84 22 59 V29 Z" fill="var(--lilac-main)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>
      <rect x="44" y="55" width="32" height="26" rx="7" fill="var(--surface-white)" stroke="var(--ink)" stroke-width="3"/>
      <path d="M50 55 V45 C50 39 70 39 70 45 V55" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/>
      <circle cx="60" cy="68" r="3.5" fill="var(--ink)"/>
    </svg>
  `,

  /** Balão de mensagem + Anzol (Isca de mensagem estranha) */
  hookMessage: `
    <svg class="illus-spot" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20 44 C20 33 29 25 40 25 H82 C93 25 102 33 102 44 V74 C102 85 93 93 82 93 H50 L32 106 L35 93 H40 C29 93 20 85 20 74 Z" fill="var(--lilac-light)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>
      <!-- Anzol (isca) desenhado de forma clara -->
      <line x1="62" y1="25" x2="62" y2="58" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/>
      <path d="M62 58 C62 72 45 72 45 59 C45 54 49 51 52 51" stroke="var(--ink)" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M45 57 L52 51 L51 60" stroke="var(--ink)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="79" cy="58" r="8" fill="var(--surface-white)" stroke="var(--ink)" stroke-width="3"/>
    </svg>
  `,

  /** Carrinho de compras seguras */
  shoppingCart: `
    <svg class="illus-spot" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="60" cy="60" r="48" fill="var(--surface-white)" stroke="var(--ink)" stroke-width="3"/>
      <path d="M26 36 H37 L46 74 H84 L92 46 H40" fill="var(--lilac-main)" stroke="var(--ink)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="51" cy="88" r="7" fill="var(--lilac-light)" stroke="var(--ink)" stroke-width="3"/>
      <circle cx="79" cy="88" r="7" fill="var(--lilac-light)" stroke="var(--ink)" stroke-width="3"/>
      <path d="M56 59 L63 66 L76 52" stroke="var(--ink)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  /** Cadeado / Socorro Sem Culpa */
  safeHeartPadlock: `
    <svg class="illus-spot" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="26" y="48" width="68" height="54" rx="16" fill="var(--surface-white)" stroke="var(--ink)" stroke-width="3"/>
      <path d="M42 48 V34 C42 22 78 22 78 34 V48" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/>
      <path d="M60 85 L49 74 C44 69 48 61 55 63 C58 64 60 67 60 67 C60 67 62 64 65 63 C72 61 76 69 71 74 Z" fill="var(--lilac-main)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>
    </svg>
  `,

  /** Celular amigável com ícones grandes (para as 4 lições de celular) */
  smartphoneFriendly: `
    <svg class="illus-spot" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="60" cy="60" r="48" fill="var(--lilac-light)" stroke="var(--ink)" stroke-width="3"/>
      <rect x="36" y="18" width="48" height="84" rx="12" fill="var(--surface-white)" stroke="var(--ink)" stroke-width="3"/>
      <line x1="52" y1="26" x2="68" y2="26" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/>
      <rect x="44" y="35" width="14" height="14" rx="4" fill="var(--lilac-main)" stroke="var(--ink)" stroke-width="2.5"/>
      <rect x="62" y="35" width="14" height="14" rx="4" fill="var(--lilac-light)" stroke="var(--ink)" stroke-width="2.5"/>
      <rect x="44" y="54" width="32" height="16" rx="5" fill="var(--lilac-main)" stroke="var(--ink)" stroke-width="2.5"/>
      <line x1="45" y1="79" x2="75" y2="79" stroke="var(--ink)" stroke-width="2.8" stroke-linecap="round"/>
      <circle cx="60" cy="92" r="4" fill="var(--lilac-main)" stroke="var(--ink)" stroke-width="2.5"/>
    </svg>
  `,

  /**
   * Selo redondo (sticker) com texto girando em círculo: "DICA DO DIA"
   */
  stickerDailyTip: `
    <svg class="round-sticker-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="60" cy="60" r="55" fill="var(--surface-white)" stroke="var(--ink)" stroke-width="3"/>
      <circle cx="60" cy="60" r="24" fill="var(--lilac-main)" stroke="var(--ink)" stroke-width="2.5"/>
      <path d="M60 49 L63 57 L71 60 L63 63 L60 71 L57 63 L49 60 L57 57 Z" fill="var(--ink)"/>
      <defs>
        <path id="circlePathTip" d="M 60, 60 m -39, 0 a 39,39 0 1,1 78,0 a 39,39 0 1,1 -78,0"/>
      </defs>
      <text fill="var(--ink)" font-size="11.2" font-weight="700" letter-spacing="2.1">
        <textPath href="#circlePathTip" startOffset="0%">DICA DO DIA ✦ DICA DO DIA ✦ </textPath>
      </text>
    </svg>
  `,

  /**
   * Selo redondo (sticker) com texto girando em círculo: "SEM CULPA"
   */
  stickerNoBlame: `
    <svg class="round-sticker-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="60" cy="60" r="55" fill="var(--lilac-main)" stroke="var(--ink)" stroke-width="3"/>
      <circle cx="60" cy="60" r="24" fill="var(--surface-white)" stroke="var(--ink)" stroke-width="2.5"/>
      <path d="M52 60 L58 66 L69 54" fill="none" stroke="var(--ink)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
      <defs>
        <path id="circlePathBlame" d="M 60, 60 m -39, 0 a 39,39 0 1,1 78,0 a 39,39 0 1,1 -78,0"/>
      </defs>
      <text fill="var(--ink)" font-size="11.4" font-weight="700" letter-spacing="2.3">
        <textPath href="#circlePathBlame" startOffset="0%">ACOLHIMENTO ✦ SEM CULPA ✦ </textPath>
      </text>
    </svg>
  `,
};

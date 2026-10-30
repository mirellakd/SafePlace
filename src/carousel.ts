/**
 * Safe Place — Controlador de Carrosséis Horizontais no Celular (telas de até 768px)
 *
 * Funcionalidades e regras de acessibilidade:
 * 1. Transforma grades normais de computador (> 768px) em carrosséis horizontais com CSS scroll-snap no celular (<= 768px).
 * 2. Nunca usa rolagem automática (zero autoplay).
 * 3. Preserva a rolagem vertical natural da página (touch-action: pan-y pinch-zoom no CSS).
 * 4. Atualiza em tempo real:
 *    - Bolinhas grandes de paginação (a atual preenchida, as demais vazadas com contorno)
 *    - Botões grandes de seta ("Cartão anterior" e "Próximo cartão", mín. 56px), desativados no início/fim
 * 5. Exibe a dica curta "Deslize para o lado →" acima do carrossel e a esconde de vez após o primeiro deslize,
 *    salvando a preferência no localStorage.
 * 6. Suporta navegação por teclado (Setas Esquerda/Direita, Home, End) e respeita prefers-reduced-motion.
 */

import { Icons } from './icons';
import { computeCarouselActiveIndex } from './logic';

export const CAROUSEL_SWIPE_STORAGE_KEY = 'safeplace_carousel_swiped_once';

export interface MobileCarouselOptions {
  /** Identificador único do carrossel na página */
  id: string;
  /** Rótulo descritivo anunciado por leitores de tela (role="region") */
  ariaLabel: string;
  /** Classe de grade usada no computador (> 768px), mantendo o layout desktop intacto */
  desktopGridClass: string;
  /** Lista de cartões em HTML (cada cartão vira um slide com scroll-snap-align: start no celular) */
  slidesHtml: string[];
}

/**
 * Verifica no localStorage se a pessoa já deslizou algum carrossel anteriormente.
 */
export function hasUserSwipedCarouselBefore(): boolean {
  try {
    return localStorage.getItem(CAROUSEL_SWIPE_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Marca no localStorage que a pessoa já aprendeu a deslizar para o lado e oculta os avisos na tela.
 */
export function markCarouselSwipedOnce(): void {
  try {
    localStorage.setItem(CAROUSEL_SWIPE_STORAGE_KEY, 'true');
  } catch {
    // Segue normalmente caso o armazenamento esteja restrito
  }

  document.querySelectorAll<HTMLElement>('[data-carousel-swipe-hint]').forEach((hintEl) => {
    hintEl.classList.add('is-dismissed');
    hintEl.setAttribute('aria-hidden', 'true');
  });
}

/**
 * Gera o HTML completo de uma região que funciona como:
 * - Grade normal no computador (telas > 768px)
 * - Carrossel com scroll-snap, dica de deslize, bolinhas grandes e botões de seta >= 56px no celular (<= 768px)
 */
export function renderMobileCarousel(options: MobileCarouselOptions): string {
  const { id, ariaLabel, desktopGridClass, slidesHtml } = options;
  const total = slidesHtml.length;

  if (total === 0) return '';

  // Se houver apenas 1 cartão, não exibe paginação nem dica de deslize
  if (total === 1) {
    return `
      <div class="mobile-carousel-region" role="region" aria-label="${ariaLabel}">
        <div class="${desktopGridClass}">
          ${slidesHtml[0]}
        </div>
      </div>
    `;
  }

  const hideSwipeHint = hasUserSwipedCarouselBefore();

  const dotsHtml = slidesHtml
    .map(
      (_, index) => `
        <button
          type="button"
          class="carousel-dot-btn ${index === 0 ? 'is-active' : ''}"
          data-carousel-dot="${index}"
          aria-label="Ir para cartão ${index + 1} de ${total}"
          aria-current="${index === 0 ? 'true' : 'false'}"
        >
          <span class="carousel-dot-visual" aria-hidden="true"></span>
        </button>
      `
    )
    .join('');

  return `
    <div
      class="mobile-carousel-region"
      role="region"
      aria-label="${ariaLabel}"
      data-mobile-carousel="${id}"
    >
      <p
        class="carousel-swipe-hint ${hideSwipeHint ? 'is-dismissed' : ''}"
        data-carousel-swipe-hint
        ${hideSwipeHint ? 'aria-hidden="true"' : ''}
      >
        Deslize para o lado →
      </p>

      <div
        class="mobile-carousel-track ${desktopGridClass}"
        data-carousel-track
        tabindex="0"
        aria-label="${ariaLabel} — use as setas para navegar"
      >
        ${slidesHtml.join('')}
      </div>

      <div class="mobile-carousel-controls" aria-label="Navegação do carrossel">
        <div class="carousel-dots-row" role="group" aria-label="Posição no carrossel">
          ${dotsHtml}
        </div>

        <div class="carousel-arrows-pair">
          <button
            type="button"
            class="carousel-arrow-btn"
            data-carousel-prev
            aria-label="Cartão anterior"
            disabled
          >
            ${Icons.arrowLeft}
            <span>Anterior</span>
          </button>

          <button
            type="button"
            class="carousel-arrow-btn"
            data-carousel-next
            aria-label="Próximo cartão"
          >
            <span>Próximo</span>
            ${Icons.arrowRight}
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Verifica se o usuário ativou redução de movimento no sistema operacional/navegador.
 */
function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Inicializa todos os carrosséis renderizados na página atual, conectando:
 * - Evento de rolagem (scroll) com requestAnimationFrame para atualizar bolinhas e setas
 * - Clique nas setas ("Cartão anterior" / "Próximo cartão") e nas bolinhas de paginação
 * - Teclas Seta Esquerda / Seta Direita / Home / End para acessibilidade por teclado
 * - Ocultação permanente do aviso "Deslize para o lado →" após o primeiro deslize
 */
export function initMobileCarousels(): void {
  const regions = document.querySelectorAll<HTMLElement>('[data-mobile-carousel]');

  regions.forEach((region) => {
    const track = region.querySelector<HTMLElement>('[data-carousel-track]');
    const prevBtn = region.querySelector<HTMLButtonElement>('[data-carousel-prev]');
    const nextBtn = region.querySelector<HTMLButtonElement>('[data-carousel-next]');
    const dotBtns = Array.from(region.querySelectorAll<HTMLButtonElement>('[data-carousel-dot]'));

    if (!track) return;

    const slides = Array.from(track.children) as HTMLElement[];
    const total = slides.length;
    if (total <= 1) return;

    let currentIndex = 0;
    let initialScrollCaptured = false;
    let rafPending = false;

    /**
     * Descobre a distância horizontal entre o início do 1º e do 2º cartão (largura + espaçamento de 16px).
     */
    const getCardStride = (): number => {
      if (slides.length >= 2) {
        const diff = slides[1].offsetLeft - slides[0].offsetLeft;
        if (diff > 0) return diff;
      }
      return slides[0]?.offsetWidth ? slides[0].offsetWidth + 16 : track.clientWidth * 0.84;
    };

    /**
     * Atualiza visualmente qual bolinha está preenchida e ativa/desativa as setas nas extremidades.
     */
    const syncIndicators = (activeIdx: number): void => {
      currentIndex = Math.max(0, Math.min(total - 1, activeIdx));

      dotBtns.forEach((dot, idx) => {
        const isCurrent = idx === currentIndex;
        dot.classList.toggle('is-active', isCurrent);
        dot.setAttribute('aria-current', isCurrent ? 'true' : 'false');
      });

      if (prevBtn) {
        prevBtn.disabled = currentIndex <= 0;
      }
      if (nextBtn) {
        const maxScrollLeft = track.scrollWidth - track.clientWidth;
        const isAtRightEnd = currentIndex >= total - 1 || (maxScrollLeft > 0 && track.scrollLeft >= maxScrollLeft - 8);
        nextBtn.disabled = isAtRightEnd;
      }
    };

    /**
     * Rola o carrossel até um cartão específico respeitando prefers-reduced-motion.
     */
    const scrollToSlide = (targetIndex: number): void => {
      const clamped = Math.max(0, Math.min(total - 1, targetIndex));
      const targetSlide = slides[clamped];
      if (!targetSlide) return;

      const targetLeft = targetSlide.offsetLeft - slides[0].offsetLeft;
      track.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });

      syncIndicators(clamped);
      if (clamped > 0) {
        markCarouselSwipedOnce();
      }
    };

    // Monitora o deslize com o dedo ou barra de rolagem sem pesar o navegador
    track.addEventListener(
      'scroll',
      () => {
        if (rafPending) return;
        rafPending = true;

        window.requestAnimationFrame(() => {
          rafPending = false;
          const stride = getCardStride();
          const detectedIndex = computeCarouselActiveIndex(track.scrollLeft, stride, total);
          syncIndicators(detectedIndex);

          // Assim que a pessoa desliza além de 24px pela primeira vez, esconde o aviso "Deslize para o lado →"
          if (!initialScrollCaptured && track.scrollLeft > 24) {
            initialScrollCaptured = true;
            markCarouselSwipedOnce();
          }
        });
      },
      { passive: true }
    );

    // Botão "Cartão anterior"
    prevBtn?.addEventListener('click', () => {
      scrollToSlide(currentIndex - 1);
    });

    // Botão "Próximo cartão"
    nextBtn?.addEventListener('click', () => {
      scrollToSlide(currentIndex + 1);
    });

    // Toque direto em qualquer bolinha de paginação
    dotBtns.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = Number(dot.dataset.carouselDot);
        if (!Number.isNaN(idx)) {
          scrollToSlide(idx);
        }
      });
    });

    // Navegação acessível por teclado (Setas Esquerda e Direita, Home e End)
    region.addEventListener('keydown', (event: KeyboardEvent) => {
      // Só intercepta no layout de celular (<= 768px)
      if (window.innerWidth > 768) return;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollToSlide(currentIndex + 1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollToSlide(currentIndex - 1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        scrollToSlide(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        scrollToSlide(total - 1);
      }
    });

    // Estado inicial sincronizado
    syncIndicators(0);
  });
}

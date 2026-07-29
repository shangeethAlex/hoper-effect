import { useEffect } from 'react';

/** Single IntersectionObserver that activates all [data-reveal] and [data-stagger] elements. */
export function useScrollAnimations() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-stagger]');

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = Number(el.dataset.delay ?? 0);
            setTimeout(() => el.classList.add('rv-visible'), delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/** Lightweight parallax — shifts element vertically based on scroll position. */
export function useParallax(selector: string, factor = 0.18) {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(selector);
    if (!els.length) return;

    const onScroll = () => {
      const sy = window.scrollY;
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const center = sy + rect.top + rect.height / 2;
        const delta = (sy + window.innerHeight / 2 - center) * factor;
        el.style.transform = `translateY(${delta}px)`;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [selector, factor]);
}

/** Counter animation for number stats. */
export function useCounters() {
  useEffect(() => {
    const counters = document.querySelectorAll<HTMLElement>('[data-count]');

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const target = Number(el.dataset.count);
          const suffix = el.dataset.suffix ?? '';
          const duration = 1400;
          const start = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);
}

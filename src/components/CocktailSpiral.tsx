import { useEffect, useRef, useState } from 'react';
import { Martini } from 'lucide-react';
import type { Cocktail } from '../data/cocktails';
import { PLACEHOLDER_PRICE } from '../data/cocktails';
import { CocktailCard } from './CocktailCard';

/* Sticky-pinned scroll wheel: a tall runway with a sticky viewport pinned
   over it. Cocktails sit on a wide arc (a Ferris-wheel slice) — the item
   nearest the front (offset 0 from the current scroll position) sits low,
   large and centred; neighbours curve up and away to either side, shrinking
   and dimming with distance, same as a cover-flow carousel. Scrolling moves
   a continuous `floatIndex` through the list (0 → n-1 across the runway),
   so the wheel turns smoothly and a new cocktail settles into the centre
   spot — its name, blurb and price fade in there, while every other item
   is a plain image swatch. Clicking any swatch re-centres the wheel on it
   by smooth-scrolling to that index's position in the runway, so click and
   scroll drive the exact same mechanism. All positioning is driven
   imperatively via refs on scroll/resize — a 60fps-per-frame transform
   update across a dozen-plus elements would thrash React's render cycle if
   it went through state. */

const ANGLE_STEP = 30; // deg of wheel rotation between adjacent cocktails
const SCROLL_VH = 360; // outer runway height, in vh — controls how long the pin lasts

function useReducedMotion() {
  const ref = useRef(false);
  useEffect(() => {
    ref.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);
  return ref.current;
}

export function CocktailSpiral({ cocktails }: { cocktails: Cocktail[] }) {
  const reducedMotion = useReducedMotion();
  const outerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>(cocktails.map(() => null));
  const heroRefs = useRef<(HTMLDivElement | null)[]>(cocktails.map(() => null));
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const n = cocktails.length;

  const handleSelect = (i: number) => {
    const outer = outerRef.current;
    if (!outer || n <= 1) return;
    const rect = outer.getBoundingClientRect();
    const docTop = rect.top + window.scrollY;
    const total = outer.offsetHeight - window.innerHeight;
    window.scrollTo({ top: docTop + (total * i) / (n - 1), behavior: 'smooth' });
  };

  useEffect(() => {
    if (reducedMotion) return;
    const outer = outerRef.current;
    const stage = stageRef.current;
    if (!outer || !stage) return;

    let raf = 0;
    let cardWidth = 200;
    let radiusX = 320;
    let arcRise = 220;

    const measure = () => {
      const stageWidth = stage.clientWidth || window.innerWidth;
      cardWidth = Math.min(200, Math.max(120, stageWidth * 0.12));
      radiusX = Math.min(420, Math.max(240, stageWidth * 0.3));
      arcRise = Math.min(280, Math.max(160, (stage.clientHeight || 700) * 0.32));
      cardRefs.current.forEach((el) => {
        if (el) el.style.width = `${cardWidth}px`;
      });
    };

    const render = () => {
      raf = 0;
      const rect = outer.getBoundingClientRect();
      const total = outer.offsetHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      const floatIndex = progress * (n - 1);

      const nearest = Math.round(floatIndex);
      if (nearest !== activeIndexRef.current) {
        activeIndexRef.current = nearest;
        setActiveIndex(nearest);
      }

      cocktails.forEach((_cocktail, i) => {
        const card = cardRefs.current[i];
        const hero = heroRefs.current[i];
        if (!card) return;

        const offset = i - floatIndex;
        const rad = (offset * ANGLE_STEP * Math.PI) / 180;
        const x = radiusX * Math.sin(rad);
        const y = -arcRise * (1 - Math.cos(rad));
        const cos = Math.cos(rad);

        const baseScale = Math.max(0.16, 0.46 + 0.54 * cos);
        const heroBoost = Math.max(0, 1 - Math.abs(offset));
        const scale = baseScale * (1 + heroBoost * 0.7);
        const opacity = Math.max(0, Math.min(1, (baseScale - 0.05) / 0.35));

        card.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`;
        card.style.opacity = `${opacity}`;
        card.style.zIndex = `${Math.round(scale * 100)}`;

        if (hero) {
          const cardHalfHeight = ((cardWidth * 4) / 3 / 2) * scale;
          const heroOpacity = Math.max(0, 1 - Math.abs(offset) * 1.8);
          hero.style.opacity = `${heroOpacity}`;
          hero.style.transform = `translate(${x}px, ${y + cardHalfHeight + 16}px) translate(-50%, 0)`;
          hero.style.pointerEvents = heroOpacity > 0.6 ? 'auto' : 'none';
        }
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    render();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reducedMotion, cocktails, n]);

  if (reducedMotion) {
    return (
      <section className="bg-navy-900 py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-widest2 text-orange-400">
            The Full Spiral
          </p>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-tightest text-white sm:text-5xl">
            Every drink, one wild spin
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cocktails.map((cocktail, i) => (
              <CocktailCard key={cocktail.slug} cocktail={cocktail} delay={(i % 4) * 100} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={outerRef} className="relative bg-navy-900" style={{ height: `${SCROLL_VH}vh` }}>
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-navy-900 via-transparent to-navy-900"
          aria-hidden="true"
        />

        <div
          className="relative z-20 mx-auto w-full max-w-[1400px] px-5 pt-20 sm:px-8 sm:pt-24"
          data-reveal="up"
        >
          <p className="font-sans text-[11px] font-semibold uppercase tracking-widest2 text-orange-400">
            The Full Spiral
          </p>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-tightest text-white sm:text-5xl">
            Every drink, one wild spin
          </h2>
        </div>

        <div ref={stageRef} className="relative flex-1">
          {cocktails.map((cocktail, i) => (
            <button
              key={cocktail.slug}
              type="button"
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              onClick={() => handleSelect(i)}
              aria-label={`Centre ${cocktail.name}`}
              className="group absolute left-1/2 top-1/2 overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10 transition-shadow duration-200 hover:ring-orange-400/50"
              style={{ aspectRatio: '3 / 4' }}
            >
              <img
                src={cocktail.img}
                alt={cocktail.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/5 to-transparent" />
            </button>
          ))}

          {/* Hero caption — fades in only for the cocktail currently
              centred by the wheel; every other item is a plain swatch. */}
          {cocktails.map((cocktail, i) => (
            <div
              key={`hero-${cocktail.slug}`}
              ref={(el) => {
                heroRefs.current[i] = el;
              }}
              className="pointer-events-none absolute left-1/2 top-1/2 z-40 w-64 -translate-x-1/2 text-center opacity-0"
            >
              <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
                {cocktail.name}
              </h3>
              <p className="mx-auto mt-2 max-w-xs font-serif text-sm italic leading-relaxed text-white/70">
                {cocktail.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-md">
                <Martini className="h-4 w-4 text-orange-300" aria-hidden="true" />
                £{cocktail.price ?? PLACEHOLDER_PRICE}
              </span>
            </div>
          ))}
        </div>

        <p aria-live="polite" className="sr-only">
          {cocktails[activeIndex]?.name}, {activeIndex + 1} of {n}
        </p>

        <p className="relative z-20 pb-8 text-center font-serif text-sm italic text-white/40">
          Scroll or click a drink to bring it centre-stage.
        </p>
      </div>
    </section>
  );
}

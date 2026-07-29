import { useEffect, useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { Badge } from './Primitives';
import { IslandLocation, MenuTab } from '../data/locations';

/* Branch menu — the three menus (Sri Lankan Cuisine, Lunch, Cocktails) shown
   as attached photos of the printed menu. Tabbed switcher on the left of the
   heading, the active menu's page images stacked below. Cuisine & Lunch differ
   per branch; cocktails share drinks but carry branch prices — so every tab
   just reads its own image set from location.menus. Tap an image to open it
   full-screen (lightbox). If an image hasn't been dropped in yet, a styled
   "menu coming soon" card stands in — no broken image, swap is drop-a-file. */

/** One menu page image with graceful fallback + click-to-zoom. */
function MenuImage({
  src,
  alt,
  onZoom,
}: {
  src: string;
  alt: string;
  onZoom: (src: string, alt: string) => void;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-3 bg-navy-50 p-8 text-center ring-1 ring-navy-500/10">
        <span className="font-['Permanent_Marker'] text-2xl -rotate-2 text-orange-500">
          Menu coming soon
        </span>
        <p className="max-w-xs font-serif text-base italic text-navy-500/60">
          Ask us at the bar or book a table — the full spread is waiting for you.
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onZoom(src, alt)}
      className="group relative block w-full overflow-hidden shadow-xl ring-1 ring-navy-500/10 transition-transform duration-200 hover:-translate-y-1"
      aria-label={`Zoom ${alt}`}
    >
      <img
        src={src}
        alt={alt}
        onError={() => setFailed(true)}
        loading="lazy"
        className="w-full object-contain"
      />
      <span className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-navy-900/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest2 text-white opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
        <ZoomIn className="h-3.5 w-3.5" /> Tap to zoom
      </span>
    </button>
  );
}

export function MenuSection({ location }: { location: IslandLocation }) {
  const [active, setActive] = useState<MenuTab>(location.menus[0]);
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);

  // Close lightbox on Escape.
  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setZoom(null);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [zoom]);

  return (
    <section id="menu" className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div className="grain absolute inset-0 opacity-10" />
      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        {/* Header + tabs */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between" data-reveal="up">
          <div className="max-w-xl">
            <Badge tone="orange" rotate={-5}>The Menus</Badge>
            <h2 className="mt-5 font-display text-4xl font-bold tracking-tightest text-navy-500 sm:text-5xl">
              Eat & drink in
              <span className="block font-serif italic font-medium text-orange-500">{location.name}</span>
            </h2>
            <p className="mt-4 font-serif text-lg italic leading-relaxed text-navy-500/65">
              {active.note ?? 'Our full spread, straight from the pass.'}
            </p>
          </div>

          {/* Tab switcher */}
          <div
            role="tablist"
            aria-label="Menu type"
            className="flex flex-wrap gap-2 sm:gap-3"
          >
            {location.menus.map((tab) => {
              const on = tab.kind === active.kind;
              return (
                <button
                  key={tab.kind}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(tab)}
                  className={`rounded-full px-5 py-3 text-[12px] font-bold uppercase tracking-widest2 shadow-sm transition-all duration-200 active:scale-95 ${
                    on
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-navy-50 text-navy-500/70 ring-1 ring-navy-500/10 hover:bg-navy-100'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active menu images */}
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-8" data-reveal="up">
          {active.images.map((src, i) => (
            <MenuImage
              key={src}
              src={src}
              alt={`${location.name} — ${active.label} menu${active.images.length > 1 ? ` (page ${i + 1})` : ''}`}
              onZoom={(s, a) => setZoom({ src: s, alt: a })}
            />
          ))}
        </div>

        <p className="mt-10 text-center font-sans text-[11px] uppercase tracking-widest2 text-navy-500/45">
          Menus subject to change · Prices shown are for {location.name}
        </p>
      </div>

      {/* Lightbox */}
      {zoom && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-900/90 p-4 backdrop-blur-sm sm:p-10"
          onClick={() => setZoom(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Menu image"
        >
          <button
            type="button"
            onClick={() => setZoom(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white ring-1 ring-white/20 transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={zoom.src}
            alt={zoom.alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full object-contain shadow-2xl"
          />
        </div>
      )}
    </section>
  );
}

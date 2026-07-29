import { useEffect, useState } from 'react';

const HOLD_MS = 2200;
const TRANSITION_MS = 650;

/**
 * Auto-cycling vertical card stack: content scrolls upward through a set of
 * slides on a timer, looping seamlessly by appending a duplicate of the first
 * slide to the end of the track and snapping back once it lands there.
 *
 * Height comes from a fixed aspect-ratio (matched to the sibling image cards'
 * own width/height ratio in ShowcaseSection) rather than stretching to fill
 * its CSS Grid row — relying on grid auto-row stretch here created a circular
 * sizing dependency that Chromium resolved inconsistently at extreme viewport
 * heights. An aspect-ratio derives height purely from this element's own
 * width, so it's stable at any viewport size.
 */
export function StackedCardCycle({
  slides,
  header,
}: {
  slides: React.ReactNode[];
  header?: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => i + 1), HOLD_MS + TRANSITION_MS);
    return () => clearInterval(id);
  }, [slides.length]);

  useEffect(() => {
    if (!instant) return;
    const id = requestAnimationFrame(() => setInstant(false));
    return () => cancelAnimationFrame(id);
  }, [instant]);

  const track = [...slides, slides[0]];

  return (
    <div className="relative aspect-[0.56]" data-reveal="left" data-delay="200">
      {/* Decorative peeking stack — suggests more cards behind the active one */}
      <div aria-hidden className="absolute -top-3.5 inset-x-6 h-8 rounded-t-2xl bg-navy-100/60" />
      <div aria-hidden className="absolute -top-1.5 inset-x-3 h-9 rounded-t-2xl bg-navy-50" />

      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-navy-500/10">
        {header}

        <div className="relative min-h-0 flex-1 overflow-hidden">
          <div
            className="flex flex-col"
            style={{
              height: `${track.length * 100}%`,
              transform: `translateY(-${(index / track.length) * 100}%)`,
              transition: instant ? 'none' : `transform ${TRANSITION_MS}ms cubic-bezier(.65,0,.35,1)`,
            }}
            onTransitionEnd={() => {
              if (index === slides.length) {
                setInstant(true);
                setIndex(0);
              }
            }}
          >
            {track.map((slide, i) => (
              <div key={i} className="w-full" style={{ height: `${100 / track.length}%` }}>
                {slide}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

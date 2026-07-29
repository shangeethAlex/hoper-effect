import { Link } from 'react-router-dom';
import { Badge } from './Primitives';

/**
 * Home-page gift-card teaser: an oversized envelope sits centred at the bottom
 * of the section, mostly cropped so only its top ~40% shows. Hovering lifts the
 * card peeking out of it.
 */
export function GiftCardsTeaser() {
  return (
    <section
      id="gift-cards"
      className="group/env relative overflow-hidden bg-navy-500 pt-20 sm:pt-28"
    >
      <div className="grain absolute inset-0 opacity-30" />

      <div className="relative z-0 mx-auto max-w-[1400px] px-5 text-center sm:px-8">
        <Badge tone="orange" rotate={-6}>Gift Cards</Badge>
        <h2 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tightest text-white sm:text-7xl lg:text-8xl">
          Give the gift
          <span className="block font-serif italic font-medium text-yellow-400">of island vibes</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl font-serif text-xl italic leading-relaxed text-white/75 sm:text-2xl">
          Island flavours, sealed in an envelope.
        </p>
        <Link
          to="/gift-cards"
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-4 text-[13px] font-bold uppercase tracking-widest2 text-white shadow-lg transition-all duration-200 hover:bg-orange-600 active:scale-[0.98]"
        >
          Explore gift cards →
        </Link>
      </div>

      {/* Oversized envelope — 70% of the section width, only its top 40% visible */}
      <div className="relative z-10 -mt-10 flex justify-center sm:-mt-16">
        {/* Clip window: shows 40% of the envelope's height */}
        <div className="relative w-[88%] max-w-[1200px] overflow-hidden [aspect-ratio:16/4.2]">
          <div className="absolute inset-x-0 top-0 [aspect-ratio:16/10.5]">
            {/* Card peeking out — lifts on hover */}
            <div className="absolute inset-x-[3%] top-[5%] z-10 origin-bottom translate-y-0 transition-transform duration-500 ease-out group-hover/env:-translate-y-8">
              <div className="paper-grain relative rounded-sm bg-gradient-to-br from-orange-500 to-orange-600 px-6 py-5 text-left text-white shadow-2xl ring-1 ring-white/10 sm:px-8 sm:py-7">
                <div className="flex items-start justify-between">
                  <span className="font-display text-xl font-bold tracking-tightest sm:text-3xl">The Coconut Island</span>
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                </div>
                <p className="mt-4 font-sans text-[10px] uppercase tracking-widest2 text-white/60 sm:mt-6">Gift Card</p>
                <p className="mt-1 font-display text-3xl font-bold tracking-tightest sm:text-5xl">£50</p>
              </div>
            </div>

            {/* Envelope body */}
            <div className="absolute inset-0 top-[14%] z-20 rounded-b-sm bg-gradient-to-b from-[#f4ead8] to-[#e7d9be] shadow-[0_-10px_40px_rgba(0,0,0,0.35)]">
              {/* Front flap fold lines */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-px left-0 h-[70%] w-1/2 origin-top-left skew-y-[18deg] border-r border-black/5 bg-gradient-to-br from-[#efe3cd] to-[#e3d3b4]" />
                <div className="absolute -top-px right-0 h-[70%] w-1/2 origin-top-right -skew-y-[18deg] border-l border-black/5 bg-gradient-to-bl from-[#efe3cd] to-[#e3d3b4]" />
              </div>
              {/* Wax seal */}
              <div className="absolute left-1/2 top-[38%] z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-orange-600 font-display text-sm font-bold text-white shadow-lg ring-2 ring-orange-700/40 sm:h-16 sm:w-16 sm:text-base">
                CI
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

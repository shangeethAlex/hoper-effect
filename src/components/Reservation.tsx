import { Badge } from './Primitives';
import { IslandLocation, LOCATION_LIST } from '../data/locations';

/**
 * Booking section. With a `location` prop it books that branch only
 * (location pages); without it, it offers both branches (home page).
 *
 * Sits on the light paper ground, not navy — it follows the navy gift-card
 * teaser and precedes the navy newsletter, so a third blue panel in a row
 * would read as one long block. The booking card inverts to navy instead,
 * which keeps the CTA as the darkest thing on screen.
 */
export function Reservation({ location }: { location?: IslandLocation }) {
  const locations = location ? [location] : LOCATION_LIST;

  return (
    <section
      id="reserver"
      className="paper-grain relative overflow-hidden border-b border-navy-500/10 bg-orange-50 py-20 sm:py-28"
    >
      <div className="grain absolute inset-0 opacity-[0.12]" />
      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div data-reveal="left">
            <Badge tone="orange" rotate={-6}>Reservation</Badge>
            <h2 className="mt-5 font-display text-4xl font-bold leading-[1.02] tracking-tightest text-navy-500 sm:text-5xl lg:text-6xl">
              Book
              <span className="block font-serif italic font-medium text-orange-500">your table</span>
            </h2>
            <p className="mt-5 max-w-md font-serif text-lg italic leading-relaxed text-navy-500/75">
              No table needed for small groups — just walk in and enjoy the vibes.
              For parties of 6 or more, book ahead via OpenTable.
            </p>

            <div className="mt-8 space-y-6" data-stagger>
              {locations.map((loc) => (
                <div key={loc.slug} className="space-y-3 font-sans text-sm text-navy-500/75">
                  {!location && (
                    <p className="font-display text-lg font-bold text-navy-500">{loc.name}</p>
                  )}
                  {loc.hours.map((h) => (
                    <p key={h.days} className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                      {h.days} · {h.time}
                    </p>
                  ))}
                  <p className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                    {loc.addressLines.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Reservation card — links out to OpenTable */}
          <div data-reveal="right">
            <div className="relative bg-navy-500 p-7 shadow-2xl ring-1 ring-navy-900/20 sm:p-10 lg:rotate-1">
              <div className="grain absolute inset-0 opacity-25" />
              <div className="relative border-b border-white/15 pb-4">
                <p className="font-sans text-[10px] uppercase tracking-widest2 text-white/50">Reservations</p>
                <h3 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">
                  Reserve on OpenTable
                </h3>
              </div>

              <p className="relative mt-5 font-serif text-base italic leading-relaxed text-white/70">
                Check live availability and book your table in a couple of taps —
                no account needed.
              </p>

              <div className="relative mt-6 space-y-3">
                {locations.map((loc) => (
                  <a
                    key={loc.slug}
                    href={loc.openTableUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-orange-500 px-6 py-4 text-[12px] font-bold uppercase tracking-widest2 text-white shadow-lg transition-all duration-200 hover:bg-orange-600 active:scale-[0.98]"
                  >
                    <span className="relative z-10">
                      {location ? 'Reserve a table →' : `Reserve — ${loc.name} →`}
                    </span>
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                  </a>
                ))}
              </div>

              <p className="relative mt-4 text-center font-sans text-[11px] uppercase tracking-widest2 text-white/40">
                via opentable.co.uk
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

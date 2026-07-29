/* Island poster showcase — 3rd section, inserted between ShowcaseSection and
   SplitSections. Vintage-poster set in the venue's own voice: bold display
   logotype, a playful tagline, and a small italic caption, on three tinted
   paper cards. */

const POSTERS = [
  {
    bg: '#f0ece1',
    ink: '#3a6ea8',
    rotate: -4,
    tagline: (
      <>
        This isn't a restaurant,
        <br />
        it's <em className="font-serif italic">an island</em> escape.
      </>
    ),
  },
  {
    bg: '#5b5e2f',
    ink: '#f2c9c2',
    rotate: 2,
    tagline: (
      <>
        There's a <em className="font-serif italic">taste of</em>
        <br />
        Sri Lanka.
      </>
    ),
  },
  {
    bg: '#f0c6c2',
    ink: '#8a3d2c',
    rotate: -2,
    tagline: (
      <>
        Put some <em className="font-serif italic">spice</em>
        <br />
        in your life.
      </>
    ),
  },
];

export function FugaPosters() {
  return (
    <section className="relative overflow-hidden bg-[#e4ede0] py-20 sm:py-28">
      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="mb-14 text-center" data-reveal="up">
          <p className="font-sans text-[11px] uppercase tracking-widest2 text-navy-500/50">The Campaign</p>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-tightest text-navy-500 sm:text-5xl">
            #PureIslandVibes
          </h2>
        </div>

        <div className="flex flex-col items-stretch gap-10 lg:flex-row lg:gap-8 xl:gap-12">
          {/* Decorative mask — full (uncropped) image, sized to match the
              card row's own height via flex stretch rather than a fixed
              pixel/viewport size, so it can never overlap the cards at any
              screen width. The source PNG has an opaque white background
              rather than real alpha, so mix-blend-multiply drops the white
              out against the section background instead of showing a box. */}
          <div className="hidden shrink-0 items-center justify-center lg:flex lg:w-[160px] xl:w-[200px]">
            <img
              src="/images/mask1.png"
              alt=""
              aria-hidden="true"
              className="h-full w-auto max-w-full object-contain mix-blend-multiply"
            />
          </div>

          <div className="flex flex-1 flex-col items-center gap-10 sm:flex-row sm:items-center sm:justify-center sm:gap-0">
          {POSTERS.map((poster, i) => {
            return (
              <div
                key={i}
                className="paper-grain relative w-full max-w-[300px] shrink-0 shadow-2xl sm:-ml-8 sm:first:ml-0"
                style={{
                  backgroundColor: poster.bg,
                  transform: `rotate(${poster.rotate}deg)`,
                  aspectRatio: '3 / 4',
                  zIndex: i,
                }}
                data-reveal="up"
                data-delay={i * 150}
              >
                <div className="flex h-full flex-col px-7 py-8">
                  <h3
                    className="text-center font-display text-5xl font-black uppercase tracking-tight sm:text-6xl"
                    style={{ color: poster.ink }}
                  >
                    Island
                  </h3>

                  <p
                    className="mt-auto text-center font-display text-lg font-bold leading-snug sm:text-xl"
                    style={{ color: poster.ink }}
                  >
                    {poster.tagline}
                  </p>
                  <p
                    className="mt-3 text-center font-serif text-[11px] italic opacity-60"
                    style={{ color: poster.ink }}
                  >
                    You're not done escaping yet.
                  </p>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}

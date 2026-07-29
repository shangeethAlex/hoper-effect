/* Sri Lanka identity showcase — portfolio-style split section reproducing the
   reference's asymmetric grid: a tall hero poster on the left, and on the
   right a header row (title + tags) sitting above two square image cards. */


export function IslandShowcase() {
  return (
    <section id="bistro" className="relative overflow-hidden bg-white py-14 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
          {/* ── Left: tall hero poster ── */}
          <div
            className="brush-edges relative aspect-[4/5] overflow-hidden bg-cover bg-center sm:aspect-[3/4] lg:aspect-[608/1088]"
            style={{ backgroundImage: "url('/images/rickshaw.jpg')" }}
            data-reveal="left"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-navy-900/55 via-navy-900/10 to-navy-900/50" />

            <div className="relative flex items-center gap-2.5 p-5 sm:p-9">
              <span className="font-sans text-sm font-bold uppercase tracking-widest2 text-white">
                The Coconut Island ©
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-7 px-6 text-center sm:px-16 lg:bottom-auto lg:top-[52%]">
              <p className="font-display text-xl font-black uppercase leading-snug tracking-tight text-white sm:text-2xl">
                The spirit of the island,
                <br />
                the warmth of home.
              </p>
            </div>
          </div>

          {/* ── Right: header row + two square cards, anchored to the bottom
                so the whole cluster matches the hero poster's height ── */}
          <div className="flex flex-col justify-end gap-6 lg:gap-8">
            <div className="h-44 overflow-hidden sm:h-80 lg:h-auto lg:flex-1" data-reveal="right">
              <video
                className="h-full w-full object-cover"
                src="/videos/jaffna-street.mp4"
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
              />
            </div>

            <div
              className="flex flex-wrap items-end justify-between gap-4"
              data-reveal="right"
            >
              <div>
                <h2 className="font-display text-4xl font-bold tracking-tightest text-navy-500 sm:text-5xl">
                  Sri Lanka
                </h2>
                <p className="mt-1 font-serif text-lg italic text-navy-500/60">
                  Where our story began.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              {/* Card A — photo with logotype overlay */}
              <div
                className="relative aspect-square overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: "url('/images/jaffna-culture.jpg')" }}
                data-reveal="up"
              >
                <div className="absolute inset-0 bg-navy-900/35" />
                <div className="relative flex h-full flex-col justify-between p-4 sm:p-6">
                  <h3 className="font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
                    Sri Lanka
                  </h3>
                  <div>
                    <div className="flex items-end justify-between gap-2">
                      <p className="font-sans text-[9px] font-bold uppercase leading-tight tracking-widest text-white/85">
                        Island
                        <br />
                        Heritage
                      </p>
                      <p className="text-right font-sans text-[9px] font-bold uppercase leading-tight tracking-widest text-white/85">
                        Island
                        <br />
                        Roots
                      </p>
                    </div>
                    <p className="mt-3 text-center font-sans text-[9px] font-bold uppercase tracking-widest2 text-white/70">
                      The Coconut Island ©
                    </p>
                  </div>
                </div>
              </div>

              {/* Card B — video section */}
              <div
                className="relative aspect-square overflow-hidden"
                data-reveal="up"
                data-delay="150"
              >
                <video
                  className="h-full w-full object-cover"
                  src="https://res.cloudinary.com/dkvujyej2/video/upload/q_auto,f_auto,w_1280/v1785051904/Comp_1_66_nyphjm.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
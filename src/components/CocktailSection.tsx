
/* Signature cocktails — one viewport tall, never more. The venue's real wall
   paintings hang on the navy wainscot behind (gentle parallax drift); in
   front, one cocktail at a time in a horizontal snap carousel (proximity —
   the wheel is never trapped). Cards scale/dim as they leave the centre, so
   the transition is scroll-linked, not a jump cut. Swipe, use the arrows or
   the dots. Drink photos are the real menu from thecoconutisland.com,
   self-hosted in /images/cocktails; paintings in /images/paintings.
   Full drink data lives in data/cocktails.ts — this filmstrip renders a
   curated subset (see `onHomepage`); the /cocktails page renders all of them. */

const PAINTINGS = [
  { src: '/images/paintings/painting-lion-blue.jpg', pos: 'left-[-4%] top-[8%] w-40 sm:w-56', tilt: '-rotate-6' },
  { src: '/images/paintings/painting-guitarist.jpg', pos: 'right-[-3%] bottom-[6%] hidden w-48 sm:block lg:w-64', tilt: 'rotate-3' },
  { src: '/images/paintings/painting-nine-arch.jpg', pos: 'left-[38%] bottom-[-6%] hidden w-52 lg:block', tilt: 'rotate-2' },
];



const FEATURED = [
  {
    name: 'Aliya',
    img: '/images/cocktails/aliya.webp',
    alt: 'Aliya — Ceylon arrack and coconut water cocktail at The Coconut Island',
    tilt: '-rotate-6',
    z: 'z-[1]',
  },
  {
    name: 'Skull on Fire',
    img: '/images/cocktails/skull-on-fire.webp',
    alt: 'Skull on Fire flaming cocktail at The Coconut Island',
    tilt: 'rotate-0',
    z: 'z-[2] -mt-4 sm:-mt-6',
  },
  {
    name: 'Mango Chilli Margarita',
    img: '/images/cocktails/mango-chilli-margarita.webp',
    alt: 'Mango Chilli Margarita at The Coconut Island',
    tilt: 'rotate-6',
    z: 'z-[1]',
  },
];


export function CocktailSection() {
  return (
    <section id="cocktails" className="relative overflow-hidden bg-navy-900 py-20 sm:py-28">
      {/* Gallery wall — rotation lives on the img so the parallax transform
          on the wrapper doesn't overwrite it */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none opacity-30">
        {PAINTINGS.map((p) => (
          <div key={p.src} className={`absolute ${p.pos}`} data-parallax>
            <img
              src={p.src}
              alt=""
              loading="lazy"
              draggable={false}
              className={`w-full border-[6px] border-white/20 shadow-2xl ${p.tilt}`}
            />
          </div>
        ))}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-900/90 via-navy-900/40 to-navy-900/90"
      />

      <div className="relative mx-auto grid w-full max-w-[1400px] items-center gap-12 px-5 sm:px-8 md:grid-cols-2 md:gap-8">
        {/* The heads-up */}
        <div data-reveal="up">
          <p className="font-sans text-[11px] uppercase tracking-widest2 text-orange-400">
            Signature Cocktails
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tightest text-white sm:text-5xl">
            Savour the island
          </h2>
          <p className="mt-4 max-w-md font-serif text-lg italic text-white/70 sm:text-xl">
            Island vibes in every glass — Ceylon arrack, island spice and a little fire, shaken
            behind the bar.
          </p>
          <p className="mt-5">
            <span className="inline-block -rotate-2 font-['Permanent_Marker'] text-lg text-yellow-400 sm:text-xl">
              12 signature pours — the full list waits at the bar.
            </span>
          </p>
          <div className="mt-8">
            <a
              href="#reserver"
              className="group inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-4 text-[12px] font-bold uppercase tracking-widest2 text-white shadow-lg transition-all duration-200 hover:bg-orange-600 hover:shadow-xl active:scale-95"
            >
              <span>Book a table &amp; try them</span>
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 transition-transform group-hover:scale-125" />
            </a>
          </div>
        </div>

        {/* Coaster fan — three pours, the rest a rumour */}
        <div className="relative flex items-center justify-center" data-reveal="up" data-delay="150">
          <div className="flex items-center">
            {FEATURED.map((c, i) => (
              <div
                key={c.name}
                className={`group relative aspect-[3/4] w-32 shrink-0 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/15 transition-transform duration-300 ease-out hover:z-[3] hover:-translate-y-2 hover:rotate-0 motion-reduce:transition-none sm:w-44 lg:w-52 ${c.tilt} ${c.z} ${i > 0 ? '-ml-8 sm:-ml-10' : ''}`}
              >
                <img
                  src={c.img}
                  alt={c.alt}
                  loading="lazy"
                  draggable={false}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-transparent to-transparent" />
                <p className="absolute inset-x-0 bottom-0 p-3 text-center font-display text-sm font-bold text-white sm:p-4 sm:text-base">
                  {c.name}
                </p>
              </div>
            ))}
          </div>
          <span
            aria-hidden="true"
            className="absolute -bottom-6 right-2 rotate-3 font-['Permanent_Marker'] text-base text-yellow-400/90 sm:right-8 sm:text-lg"
          >
            + 9 more…
          </span>
        </div>
      </div>
    </section>
  );
}

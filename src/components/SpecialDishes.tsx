import { Badge } from './Primitives';

/* "House Specials" — the food editorial: a Dishoom-style two-column spread.
   Left is the story (eyebrow, headline, paragraphs, two CTAs); right is a
   photo grid — one hero plate over two smaller shots. No prices or heat
   scale here; the full menu (#carte) carries those. Names mirror
   MENU_SECTIONS in SplitSections.tsx — keep in sync. */

/* Faded wall prints in the corners, edges bleeding off-canvas — mirrored
   arrangement of the FindYourIsland wall so the two white walls don't twin.
   Colour kept (no hover bloom here): they read as old paint on the plaster. */
const WALL_ART: { src: string; className: string; tilt: string; mobile?: boolean }[] = [
  { src: '/images/palm-tree.png', className: 'left-[-4%] top-[-6%] w-32 sm:w-40 lg:w-48', tilt: 'rotate-6' },
  { src: '/images/kolam-yaka-transparent.png', className: 'right-[-5%] top-[-24px] w-24 sm:w-32 md:top-[-7%] lg:w-44', tilt: '-rotate-12', mobile: true },
  { src: '/images/peacock_yaka.png', className: 'left-[-4%] bottom-[-9%] w-44 sm:w-52 lg:w-64', tilt: '-rotate-6' },
  { src: '/images/mask1-cutout.png', className: 'right-[-3%] bottom-[-8%] w-40 sm:w-48 lg:w-60', tilt: 'rotate-6' },
];

/* Photos for the editorial grid — hero plate first, then two supporting
   shots. Placeholders (pexels) — swap for real Coconut Island photography. */
const HERO_SHOT = {
  img: 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=1600',
  alt: 'A spread of Sri Lankan curries, sambols and rice',
  caption: 'the whole island, one plate',
};

const SIDE_SHOTS = [
  {
    img: 'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Beef kothu — chopped godhamba roti stir-fried on a hot griddle',
    caption: 'Beef Kothu',
    tilt: '-rotate-3',
  },
  {
    img: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Devilled fried chicken in a sticky chilli glaze',
    caption: 'Angry Bird',
    tilt: 'rotate-3',
  },
];

export function SpecialDishes() {
  return (
    <section id="specials" className="paper-grain relative overflow-hidden bg-white py-20 sm:py-28">
      {/* Painted wall behind the spread — faded prints */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none [mask-image:linear-gradient(to_bottom,transparent_0,black_10%,black_90%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0,black_10%,black_90%,transparent_100%)]"
      >
        {WALL_ART.map((a, i) => (
          <div
            key={a.src}
            className={`sd-art absolute opacity-[0.12] ${a.mobile ? 'block' : 'hidden md:block'} ${a.className}`}
            style={{ animationDelay: `${i * -2.7}s` }}
          >
            <img
              src={a.src}
              alt=""
              className={`h-auto w-full mix-blend-multiply ${a.tilt}`}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          {/* Left — the story */}
          <div data-reveal="left">
            <span className="block h-1 w-14 rounded-full bg-orange-500" />
            <p className="mt-6 font-sans text-[12px] font-bold uppercase tracking-widest2 text-orange-500">
              Island Comfort Food
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tightest text-navy-500 sm:text-5xl lg:text-6xl">
              Island on a plate
            </h2>

            <div className="mt-6 space-y-5 font-serif text-lg leading-relaxed text-navy-500/80">
              <p className="dropcap text-navy-500">At The Coconut Island, you'll taste all of Sri Lanka.</p>
              <p>
                …its street stalls, home kitchens and roadside grills. This food evokes
                fond memories: the clatter of kothu roti chopped on a screaming griddle,
                the fire of a devilled fry, the fragrant warmth of a rice &amp; curry spread
                shared with friends.
              </p>
              <p>
                Begin light with hoppers and pol sambol, or a bowl of kool. Then unfurl
                into the evening with smoky grills, sticky-glazed Angry Bird and robust,
                spicy curries — all cooked the way the island taught us.
              </p>
              <p>
                Jostling with our beloved favourites are plentiful delectable dishes. Come,
                savour Beef Kothu, Goan-spiced curries and everything in between.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#reserver"
                className="group inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-4 text-[12px] font-bold uppercase tracking-widest2 text-white shadow-lg transition-all duration-200 hover:bg-orange-600 hover:shadow-xl active:scale-95"
              >
                <span>Book a table</span>
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 transition-transform group-hover:scale-125" />
              </a>
              <a
                href="#find-your-island"
                className="inline-flex items-center rounded-full border border-navy-500/25 px-8 py-4 text-[12px] font-bold uppercase tracking-widest2 text-navy-500 transition-all duration-200 hover:border-navy-500 hover:bg-navy-500 hover:text-white active:scale-95"
              >
                Find your island
              </a>
            </div>
          </div>

          {/* Right — pinned-up polaroids: hero plate over two snapshots */}
          <div data-reveal="right" className="relative mx-auto w-full max-w-md lg:max-w-none">
            {/* Hero polaroid, sticker in the corner */}
            <div className="polaroid relative rotate-2 lg:mx-auto lg:w-[82%]">
              <img
                src={HERO_SHOT.img}
                alt={HERO_SHOT.alt}
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
              <Badge tone="orange" rotate={-8} className="absolute -left-3 -top-3">
                House Specials
              </Badge>
              <p className="absolute inset-x-0 bottom-3 text-center font-['Permanent_Marker'] text-xl text-navy-500">
                {HERO_SHOT.caption}
              </p>
            </div>

            {/* Two snapshots, tacked up at opposing tilts */}
            <div className="mt-8 grid grid-cols-2 gap-5 sm:gap-7 lg:mx-auto lg:w-[82%] lg:gap-6">
              {SIDE_SHOTS.map((shot) => (
                <div key={shot.img} className={`polaroid relative ${shot.tilt}`}>
                  <img
                    src={shot.img}
                    alt={shot.alt}
                    className="aspect-square w-full object-cover"
                    loading="lazy"
                  />
                  <p className="absolute inset-x-0 bottom-2.5 text-center font-['Permanent_Marker'] text-base text-navy-500">
                    {shot.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

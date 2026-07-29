import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LOCATION_LIST } from '../data/locations';
import { UK_VIEWBOX, UK_OUTLINE_D, UK_PINS } from '../data/ukOutline';

type Branch = 'brighton' | 'london';

/* Ink-sketch doodles pinned around the postcards — Brighton things on the
   left shore, Angel things on the right. They sit as faint pencil marks;
   hovering (or keyboard-focusing) a postcard wakes its branch's set up by
   opacity alone — no colour change. */
const INK = {
  fill: 'none',
  stroke: '#1f394f',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/* `tilt` lives on the inner <svg>, not the wrapper — the fyi-doodle float
   animation owns the wrapper's `transform`, so any rotate there is ignored. */
const DOODLES: { branch: Branch; className: string; tilt?: string; viewBox: string; paths: ReactNode }[] = [
  {
    // seagull pair over the sea
    branch: 'brighton',
    className: 'left-[5%] top-[13%] w-16 sm:w-20',
    tilt: '-rotate-6',
    viewBox: '0 0 32 18',
    paths: (
      <>
        <path d="M2 12 C6 5 11 6 15.5 10 C20 6 25 5 30 12" />
        <path d="M9 16.5 C11.5 13 14 13.5 16 15.5 C18 13.5 20.5 13 23 16.5" />
      </>
    ),
  },
  {
    // sun over waves
    branch: 'brighton',
    className: 'left-[2%] top-[34%] hidden w-24 md:block',
    viewBox: '0 0 48 32',
    paths: (
      <>
        <circle cx="38" cy="9" r="4.5" />
        <path d="M38 1.5 V0.5 M43.5 3.5 L44.5 2.5 M45.5 9 H47 M43.5 14.5 L44.5 15.5 M32.5 3.5 L31.5 2.5 M30.5 9 H29" />
        <path d="M2 22 Q7 17 12 22 T22 22 T32 22 T42 22" />
        <path d="M8 28 Q13 23 18 28 T28 28 T38 28" />
      </>
    ),
  },
  {
    // beach umbrella, planted at a tilt
    branch: 'brighton',
    className: 'left-[9%] bottom-[7%] hidden w-16 md:block sm:w-20',
    tilt: 'rotate-6',
    viewBox: '0 0 36 40',
    paths: (
      <>
        <path d="M3 16 A15 15 0 0 1 33 16" />
        <path d="M3 16 Q6 13 9 16 Q12 13 15 16 Q18 13 21 16 Q24 13 27 16 Q30 13 33 16" />
        <path d="M18 1.5 L9 16 M18 1.5 L27 16 M18 1.5 V16" />
        <path d="M18 16 L21 38" />
      </>
    ),
  },
  {
    // coconut cocktail — the Aliya
    branch: 'brighton',
    className: 'left-[30%] top-[6%] hidden w-12 lg:block',
    tilt: 'rotate-3',
    viewBox: '0 0 32 38',
    paths: (
      <>
        <path d="M16 11 C24 11 28 17 28 24.5 C28 31.5 23 35 16 35 C9 35 4 31.5 4 24.5 C4 17 8 11 16 11" />
        <path d="M11 14 Q16 11 21 14" />
        <path d="M19 12.5 L23 3 L27.5 4" />
        <path d="M7 27.5 Q9.5 30.5 13 31.5" />
      </>
    ),
  },
  {
    // palm by the header
    branch: 'brighton',
    className: 'left-[17%] top-[7%] hidden w-14 lg:block',
    tilt: '-rotate-3',
    viewBox: '0 0 36 44',
    paths: (
      <>
        <path d="M17 42 C18.5 32 19.5 24 18 16" />
        <path d="M18 16 C12 10 6 10 2 14 M18 16 C14 8 9 5 4 6 M18 16 C20 7 24 4 30 5 M18 16 C24 10 29 11 34 15 M18 16 C17.5 9 18 5 20.5 2" />
        <circle cx="15" cy="18.5" r="2" />
        <circle cx="21" cy="18.5" r="2" />
      </>
    ),
  },
  {
    // angel wings + halo, for Angel
    branch: 'london',
    className: 'right-[4%] top-[12%] w-20 sm:w-24',
    tilt: 'rotate-6',
    viewBox: '0 0 48 32',
    paths: (
      <>
        <ellipse cx="24" cy="4.5" rx="7" ry="2.4" />
        <path d="M22 12 C14 8 6 10 2 18 M22 16 C16 13 10 14 6 21 M22 20 C18 18 13 19 10 25" />
        <path d="M26 12 C34 8 42 10 46 18 M26 16 C32 13 38 14 42 21 M26 20 C30 18 35 19 38 25" />
      </>
    ),
  },
  {
    // tuk-tuk, street-food express
    branch: 'london',
    className: 'right-[2%] bottom-[26%] hidden w-24 md:block',
    tilt: '-rotate-3',
    viewBox: '0 0 44 34',
    paths: (
      <>
        <path d="M6 25 L6 14 Q6 6 14 6 L27 6 Q35 6 37.5 14 L39 25" />
        <path d="M14 6 V25 M26 6 V25" />
        <path d="M29 11 Q34 11 35.5 16 L36 19 H29 Z" />
        <circle cx="12" cy="27" r="4" />
        <circle cx="32" cy="27" r="4" />
        <path d="M10 6 H30" />
      </>
    ),
  },
  {
    // drum with crossed sticks — adding music to the food
    branch: 'london',
    className: 'right-[30%] top-[6%] hidden w-14 lg:block',
    tilt: '-rotate-6',
    viewBox: '0 0 36 32',
    paths: (
      <>
        <path d="M12 8 L22 1 M24 8 L14 1" />
        <path d="M6 13 Q18 7.5 30 13" />
        <path d="M6 13 L8 26 M30 13 L28 26" />
        <path d="M8 26 Q18 31 28 26" />
        <path d="M10 15.5 L13 23.5 M15.5 14 L16.5 24.5 M21 14 L20 24.5 M26 15.5 L23 23.5" />
      </>
    ),
  },
  {
    // yaka mask grin
    branch: 'london',
    className: 'right-[17%] top-[7%] hidden w-12 lg:block',
    tilt: 'rotate-12',
    viewBox: '0 0 32 42',
    paths: (
      <>
        <path d="M16 10 C23.5 10 26.5 15 26.5 22.5 C26.5 32.5 22 38 16 38 C10 38 5.5 32.5 5.5 22.5 C5.5 15 8.5 10 16 10" />
        <path d="M6 13 L8.5 5 L11.5 11 L14.5 3 L17 10 L20 3 L23 11 L25.5 5 L26.5 13" />
        <circle cx="11.5" cy="20.5" r="2.3" />
        <circle cx="20.5" cy="20.5" r="2.3" />
        <path d="M15 26.5 Q16 28.5 17 26.5" />
        <path d="M9.5 31 Q16 35.5 22.5 31" />
        <path d="M12.5 32.2 V34 M16 33.4 V35.2 M19.5 32.2 V34" />
      </>
    ),
  },
];

/* Real wall art — the venue's yaka masks (and palms for the seaside) hung as
   faded prints down both shores of the wall, edges bleeding off-canvas. Idle
   they sit as pale grayscale ghosts; hovering (or focusing) a postcard blooms
   its branch's set into full colour while the other side fades away; `both`
   pieces bloom with either card. Mostly md+ (no hover on mobile) — the two
   `mobile` corner pieces stay as faint watermarks on phones.
   `tilt` sits on the <img>, not the wrapper: the fyi-doodle float animation
   owns the wrapper's `transform`, so rotate/scale there would be ignored. */
const WALL_ART: {
  branch: Branch | 'both';
  src: string;
  className: string;
  tilt: string;
  mobile?: boolean;
}[] = [
  // Brighton — left shore, top to bottom
  { branch: 'brighton', src: '/images/kolam-yaka-transparent.png', className: 'left-[-3%] top-[-6%] w-32 sm:w-40 lg:w-48', tilt: 'rotate-12' },
  { branch: 'brighton', src: '/images/peacock_yaka.png', className: 'left-[-6%] top-[16%] w-36 sm:w-44 lg:w-56', tilt: '-rotate-12' },
  { branch: 'brighton', src: '/images/mask1-cutout.png', className: 'left-[-3%] top-[44%] w-52 sm:w-64 lg:w-80', tilt: '-rotate-6' },
  // mobile pieces: % offsets scale with the tall stacked section on phones, so
  // they need gentler offsets below md or they slide fully off-canvas
  { branch: 'brighton', src: '/images/palm-tree.png', className: 'left-[-4%] bottom-[-70px] w-36 sm:w-44 md:bottom-[-9%] lg:w-56', tilt: 'rotate-3', mobile: true },
  // Angel — right shore, top to bottom
  { branch: 'london', src: '/images/mask1-cutout.png', className: 'right-[-3%] top-[-30px] w-28 sm:w-40 md:top-[-6%] lg:w-52', tilt: '-rotate-12', mobile: true },
  { branch: 'london', src: '/images/palm-tree.png', className: 'right-[-5%] top-[15%] w-28 sm:w-32 lg:w-40', tilt: '-rotate-3' },
  { branch: 'london', src: '/images/peacock_yaka.png', className: 'right-[-3%] top-[32%] w-56 sm:w-72 lg:w-[22rem]', tilt: 'rotate-6' },
  { branch: 'london', src: '/images/kolam-yaka-transparent.png', className: 'right-[-4%] bottom-[-9%] w-44 sm:w-56 lg:w-72', tilt: '-rotate-6' },
  // Shared — a palm rooted under the route gap, below the cards
  { branch: 'both', src: '/images/palm-tree.png', className: 'left-[46%] bottom-[-10%] w-32 lg:w-40', tilt: 'rotate-2' },
];

/* Dashed "travel route" arc drawn between the two postcards — Brighton (left)
   to Angel (right). Coordinates live in the SVG viewBox (0 0 1000 180). */
const ROUTE_D = 'M 60 170 C 300 10, 700 10, 940 170';

/** Postmark text per branch — top line is the real postcode district. */
const STAMP: Record<string, [string, string]> = {
  brighton: ['BN1', 'Seaside'],
  london: ['N1', 'Islington'],
};

/**
 * "Find your island" — the two branches as postcards pinned side by side.
 * Arrival choreography (all class-driven, see index.css "FIND YOUR ISLAND"):
 * cards toss in from opposite edges and settle at a slight tilt, the dashed
 * route wipes on between them, a coconut-orange dot rides the route from
 * Brighton to Angel, then the postmark stamps thump down.
 */
export function FindYourIsland() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const dotAnimRef = useRef<SVGElement | null>(null);
  const [hovered, setHovered] = useState<Branch | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let dotTimer: number | undefined;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        section.classList.add('fyi-in');
        if (!reduced) {
          // Launch the travelling dot once the route has finished drawing.
          dotTimer = window.setTimeout(() => {
            (dotAnimRef.current as unknown as { beginElement?: () => void } | null)?.beginElement?.();
          }, 1200);
        }
        io.disconnect();
      },
      { threshold: 0.25, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(section);

    return () => {
      io.disconnect();
      window.clearTimeout(dotTimer);
    };
  }, []);

  return (
    <section
      id="find-your-island"
      ref={sectionRef}
      className="paper-grain relative overflow-hidden bg-white"
    >
      {/* Sketch wall — faint restaurant doodles; the hovered branch's set
          wakes up (opacity only), the other recedes further */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none [mask-image:linear-gradient(to_bottom,transparent_0,black_10%,black_90%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0,black_10%,black_90%,transparent_100%)]"
      >
        {/* Faint, geographically-accurate Great Britain silhouette — the backmost
            watermark. Each city's pin blooms to coconut-orange when its card is
            hovered or keyboard-focused (reuses `hovered`); the whole outline lifts
            a touch on any hover. Real coords projected offline — see ukOutline.ts. */}
        <div className="fyi-ghostmap absolute left-1/2 top-1/2 hidden h-[540px] -translate-x-1/2 -translate-y-1/2 md:block">
          <svg viewBox={UK_VIEWBOX} className="h-full w-auto" fill="none">
            <path
              d={UK_OUTLINE_D}
              stroke="#1f394f"
              strokeWidth={1.4}
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeOpacity={hovered ? 0.16 : 0.08}
              className="transition-[stroke-opacity] duration-300"
            />
            {LOCATION_LIST.map((loc) => {
              const p = UK_PINS[loc.slug];
              const active = hovered === loc.slug;
              return (
                <g key={loc.slug}>
                  {/* soft bloom halo — only present when active */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={active ? 13 : 0}
                    fill="#f0803c"
                    opacity={active ? 0.18 : 0}
                    className="transition-all duration-300"
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={active ? 5 : 3.4}
                    fill={active ? '#f0803c' : '#1f394f'}
                    opacity={active ? 0.9 : hovered ? 0.1 : 0.32}
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}
          </svg>
        </div>
        {WALL_ART.map((a, i) => {
          const lit = hovered !== null && (hovered === a.branch || a.branch === 'both');
          return (
            <div
              key={`${a.src}-${i}`}
              className={`fyi-art absolute transition-opacity duration-500 ${
                a.mobile ? 'block' : 'hidden md:block'
              } ${a.className} ${
                lit ? 'opacity-40' : hovered ? 'opacity-[0.04]' : 'opacity-[0.13]'
              }`}
              style={{ animationDelay: `${i * -2.3}s` }}
            >
              <img
                src={a.src}
                alt=""
                className={`h-auto w-full mix-blend-multiply transition-[transform,filter] duration-500 ${a.tilt} ${
                  lit ? 'scale-100 grayscale-0' : 'scale-95 grayscale'
                }`}
                loading="lazy"
              />
            </div>
          );
        })}
        {DOODLES.map((d, i) => (
          <div
            key={`${d.branch}-${i}`}
            className={`fyi-doodle absolute transition-opacity duration-300 ${d.className} ${
              hovered === d.branch
                ? 'opacity-30'
                : hovered
                  ? 'opacity-[0.04]'
                  : 'opacity-[0.09]'
            }`}
            style={{ animationDelay: `${(i % 5) * -1.4}s` }}
          >
            <svg viewBox={d.viewBox} className={`h-auto w-full ${d.tilt ?? ''}`} {...INK}>
              {d.paths}
            </svg>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mb-16 text-center sm:mb-20 lg:mb-24" data-reveal="up">
          <p className="font-sans text-[11px] uppercase tracking-widest2 text-orange-500">
            Two shores, one island
          </p>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-tightest text-navy-500 sm:text-5xl lg:text-6xl">
            Find your island
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-serif text-lg italic text-navy-500/70">
            Born by the sea in Brighton, now lighting up Angel — same spice, same
            music. Pick your shore.
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-14">
          {/* Travel route — sits behind the cards; the path ends tuck under them. */}
          <svg
            className="pointer-events-none absolute inset-x-0 -top-24 hidden w-full md:block"
            style={{ aspectRatio: '1000 / 180' }}
            viewBox="0 0 1000 180"
            aria-hidden="true"
          >
            <defs>
              <mask id="fyi-route-mask" maskUnits="userSpaceOnUse">
                <path
                  className="fyi-route-reveal"
                  d={ROUTE_D}
                  pathLength={1}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={36}
                  strokeDasharray="1"
                  strokeLinecap="round"
                />
              </mask>
            </defs>
            <g mask="url(#fyi-route-mask)">
              <path
                d={ROUTE_D}
                pathLength={1}
                fill="none"
                stroke="#1f394f"
                strokeOpacity={0.28}
                strokeWidth={3.5}
                strokeDasharray="0.008 0.016"
                strokeLinecap="round"
              />
            </g>
            <circle className="fyi-dot" r={7} fill="#f0803c" stroke="#fff" strokeWidth={2.5}>
              {/* calcMode left at default "paced" — Chromium mishandles
                  keyPoints/keySplines on animateMotion (dot never moves). */}
              <animateMotion
                ref={dotAnimRef}
                begin="indefinite"
                dur="3s"
                fill="freeze"
                path={ROUTE_D}
              />
            </circle>
          </svg>

          {LOCATION_LIST.map((loc) => {
            const short = loc.slug === 'london' ? 'Angel' : 'Brighton';
            const [stampTop, stampBottom] = STAMP[loc.slug];
            return (
              <article
                key={loc.slug}
                className={`fyi-card fyi-card-${loc.slug} group relative z-10 bg-white shadow-2xl ring-1 ring-navy-500/10`}
                onMouseEnter={() => setHovered(loc.slug as Branch)}
                onMouseLeave={() => setHovered(null)}
                onFocusCapture={() => setHovered(loc.slug as Branch)}
                onBlurCapture={() => setHovered(null)}
              >
                <Link
                  to={`/${loc.slug}`}
                  className="relative block h-52 overflow-hidden md:h-64"
                  aria-label={`The Coconut Island ${loc.name}`}
                >
                  <img
                    src={loc.image}
                    alt={`The Coconut Island ${loc.name}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* mobile: flat scrim behind the plaque; md+: original bottom gradient */}
                  <div className="absolute inset-0 bg-navy-900/25 md:bg-gradient-to-t md:from-navy-900/60 md:via-navy-900/10 md:to-transparent" />

                  {/* Postmark stamp */}
                  <div className="fyi-stamp absolute right-4 top-4 grid h-16 w-16 place-items-center sm:h-20 sm:w-20 rounded-full border-2 border-dashed border-white/80 bg-navy-900/25 backdrop-blur-[2px]">
                    <p className="text-center font-sans text-[9px] font-bold uppercase leading-[1.6] tracking-[0.22em] text-white">
                      {stampTop}
                      <br />
                      {stampBottom}
                    </p>
                  </div>

                  {/* Mobile only — plaque with the branch name, no blurb */}
                  <div className="absolute inset-x-6 bottom-6 border border-white/70 bg-white/90 px-5 py-4 text-center backdrop-blur-[2px] md:hidden">
                    <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-navy-500">
                      {short}
                    </h3>
                    <span className="mt-2 inline-block font-sans text-lg leading-none text-navy-500/70">
                      →
                    </span>
                  </div>

                  {/* md+ — original caption */}
                  <div className="absolute bottom-4 left-5 right-5 hidden md:block">
                    <p className="font-sans text-[10px] uppercase tracking-widest2 text-yellow-400">
                      {loc.tagline}
                    </p>
                    <h3 className="mt-1 font-display text-3xl font-bold tracking-tight text-white">
                      {loc.name}
                    </h3>
                  </div>
                </Link>

                {/* md+ — full detail body; mobile stays image-only */}
                <div className="hidden p-6 md:block lg:p-7">
                  <p className="font-serif text-base italic leading-relaxed text-navy-500/70">
                    {loc.blurb}
                  </p>
                  <div className="mt-5 space-y-1.5 font-sans text-[12px] text-navy-500/60">
                    <p>{loc.addressLines.join(' · ')}</p>
                    <p>{loc.hours.map((h) => `${h.days} ${h.time}`).join(' · ')}</p>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-navy-500/15 pt-5">
                    <a
                      href={loc.openTableUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-orange-500 px-5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-widest2 text-white shadow-md transition-colors hover:bg-orange-600"
                    >
                      Book {short}
                    </a>
                    <Link
                      to={`/${loc.slug}`}
                      className="inline-flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-widest2 text-orange-500 transition-colors hover:text-orange-600"
                    >
                      Visit {short}
                      <span className="transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

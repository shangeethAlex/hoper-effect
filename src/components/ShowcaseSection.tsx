import { ArrowUpRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StackedCardCycle } from './StackedCardCycle';

/* The "Featured Work" showcase section — insert as 2nd section after Hero */

const IMAGES = [
  {
    src: '/images/angel.jpg',
    alt: 'The Coconut Island bar — bottles and glassware',
    caption: 'Angel',
    sub: '9 White Lion St · Islington',
    to: '/london',
  },
  {
    src: '/images/brighton.jpg',
    alt: 'The Coconut Island dining room ambiance',
    caption: 'Brighton',
    sub: '103 Western Rd · Where it began',
    to: '/brighton',
  },
];

/* The auto-cycling "brochure" card on the right — header stays put while the
   content below it slides upward through highlights on a timer. */

function BrochureHeader() {
  return (
    <div className="shrink-0 bg-navy-500 px-7 py-5">
      <p className="font-sans text-[10px] uppercase tracking-widest2 text-yellow-400">The Coconut Island</p>
      <p className="mt-1 font-display text-xl font-bold text-white">Menu & Specials</p>
    </div>
  );
}

function SlideSignature() {
  return (
    <div className="flex h-full flex-col p-7">
      <div className="overflow-hidden rounded-xl">
        <img
          src="https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt="Sri Lankan street food"
          className="h-28 w-full object-cover sm:h-32"
          loading="lazy"
        />
      </div>
      <p className="mt-4 font-display text-xl font-bold text-navy-500 sm:text-2xl">Island Kitchen</p>
      <p className="mt-1 font-serif text-sm italic text-navy-500/60">Kothu · Hoppers · Devils</p>
      <span className="mt-auto inline-flex w-fit items-center rounded-full bg-navy-50 px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-widest text-navy-500/70">
        The Coconut Island
      </span>
    </div>
  );
}

function SlideMenuDuJour() {
  return (
    <div
      className="relative flex h-full flex-col justify-end bg-cover bg-center p-7"
      style={{ backgroundImage: "url('https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&w=600')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/75 via-navy-900/25 to-transparent" />
      <div className="relative rounded-xl bg-white p-4 shadow-lg">
        <p className="font-display text-4xl font-black text-navy-500">£15</p>
        <p className="mt-1 font-sans text-[10px] font-bold uppercase tracking-widest text-orange-500">Lunch Special</p>
        <p className="mt-1 font-sans text-[11px] text-navy-500/60">Rice &amp; Curry · Kothu · Roti</p>
      </div>
    </div>
  );
}

function SlideAvis() {
  return (
    <div
      className="relative flex h-full flex-col justify-end bg-cover bg-center p-7"
      style={{ backgroundImage: "url('https://images.pexels.com/photos/776538/pexels-photo-776538.jpeg?auto=compress&cs=tinysrgb&w=600')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/30 to-transparent" />
      <div className="relative">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 font-sans text-[10px] font-bold text-navy-500">
          <Star className="h-3 w-3 fill-orange-500 text-orange-500" />
          4.9 · 661 reviews
        </span>
        <div className="rounded-xl bg-white p-4 shadow-lg">
          <p className="font-serif text-sm italic leading-snug text-navy-500/80">
            "Amazing flavours, brilliant music, proper island vibes — the best Sri Lankan food in Brighton."
          </p>
          <p className="mt-2 font-sans text-[10px] font-bold uppercase tracking-widest text-navy-500/50">
            — TripAdvisor · #3 in Brighton
          </p>
        </div>
      </div>
    </div>
  );
}

function SlideMask() {
  return (
    <div
      className="relative flex h-full flex-col justify-end bg-cover bg-top p-7"
      style={{ backgroundImage: "url('/images/mask-hoodie.png')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/10 to-transparent" />
      <div className="relative rounded-xl bg-white p-4 shadow-lg">
        <p className="font-display text-xl font-bold text-navy-500 sm:text-2xl">
          #AddingMusicToTheFood
        </p>
        <p className="mt-1 font-serif text-sm italic text-navy-500/60">
          Sri Lankan spirit, island energy
        </p>
      </div>
    </div>
  );
}

export function ShowcaseSection() {
  return (
    <section
      className="relative z-0 w-full bg-navy-500 bg-cover bg-center pb-10"
      style={{ backgroundImage: "url('/images/blue.png')" }}
    >
      {/*
        Outer gutter wrapper — intentionally identical to the other sections'
        "mx-auto max-w-[1400px] px-5 sm:px-8" content wrapper, so the white
        sheet lands at the same width and edges at every viewport size.
        No negative-margin overlap here: IslandJourney above is a pinned
        filmstrip and its final chapter must stay uncovered through its tail
        dwell — this section starts only after the journey's runway ends.
      */}
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        {/* White sheet — covers all of this section's content before
            rounding off at the bottom back to the navy page background. */}
        <div className=" bg-white pb-20 pt-28 sm:pt-36 lg:pb-28 lg:pt-44">

        {/*
          ── Split layout: left column stacks the title/tags row above the
          two image cards; right column is a tall grey panel that stretches
          (default grid stretch) to match the LEFT column's full natural
          height, with the auto-cycling card centered inside it — matching
          the reference's "title+images block" vs. "tall side panel" split.
        */}
        <div className="px-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-10">
          {/* LEFT column */}
          <div>
            {/* Title */}
            <div data-reveal="up">
              {/* Small eyebrow */}
              <p className="font-sans text-[11px] font-semibold uppercase tracking-widest2 text-navy-500/50">
                Our World
              </p>

              {/* Large display heading — exact reference style: big, bold, tight */}
              <h2
                className="mt-2 font-display font-black uppercase leading-[0.9] tracking-tightest text-navy-500"
                style={{ fontSize: 'clamp(2.8rem, 6.5vw, 6.5rem)' }}
              >
                Pick Your<br />
                <span className="text-orange-500">Flavour.</span>
              </h2>

              {/* Subtitle */}
              <p className="mt-4 max-w-sm font-serif text-xl italic text-navy-500/60">
                Street food, music and island energy — spice, sharing and soul.
              </p>
            </div>

            {/* Two image cards, side by side beneath the title row */}
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {IMAGES.map((img, i) => (
                <Link
                  to={img.to}
                  key={img.alt}
                  className="group relative block overflow-hidden rounded-3xl"
                  style={{ aspectRatio: '10/7' }}
                  data-reveal={i === 0 ? 'up' : 'up'}
                  data-delay={i * 120}
                  aria-label={`The Coconut Island ${img.caption} — location details`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Dark gradient at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-navy-900/10 to-transparent" />

                  {/* Caption overlay — bottom of card */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="font-display text-2xl font-bold text-white">{img.caption}</p>
                    <p className="mt-1 font-sans text-[11px] uppercase tracking-widest2 text-white/60">
                      {img.sub}
                    </p>
                  </div>

                  {/* Arrow badge — top right */}
                  <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4 text-white" />
                  </div>

                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT column — tall grey panel, card centered, full height of left column */}
          <div className="hidden rounded-3xl bg-navy-50 p-8 lg:flex lg:items-center lg:justify-center">
            <div className="w-full max-w-[260px]">
              <StackedCardCycle
                header={<BrochureHeader />}
                slides={[
                  <SlideSignature key="signature" />,
                  <SlideMenuDuJour key="menu" />,
                  <SlideAvis key="avis" />,
                  <SlideMask key="mask" />,
                ]}
              />
            </div>
          </div>
        </div>

        {/* ── Bottom row: CTA link ── */}
        <div className="mt-10 px-8 flex items-center justify-between border-t border-navy-500/10 pt-8" data-reveal="up">
          <p className="font-serif text-base italic text-navy-500/60">
            Every plate tells a story of the island.
          </p>
          <a
            href="#carte"
            className="group flex items-center gap-2 font-sans text-[12px] font-bold uppercase tracking-widest2 text-navy-500 transition-colors hover:text-orange-500"
          >
            View the menu
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
        </div>
      </div>
    </section>
  );
}

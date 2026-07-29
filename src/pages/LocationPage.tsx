import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, Mail, MapPin, Phone, UtensilsCrossed, Wine, Music, Navigation } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MenuSection } from '../components/MenuSection';
import { Reservation } from '../components/Reservation';
import { Badge } from '../components/Primitives';
import { useScrollAnimations } from '../hooks/useScrollAnimations';
import { useSeo, SITE_URL } from '../hooks/useSeo';
import { IslandLocation, LOCATIONS } from '../data/locations';

export function LocationPage({ location }: { location: IslandLocation }) {
  useScrollAnimations();

  useSeo({
    title: `The Coconut Island — ${location.name}`,
    description: location.metaDescription,
    path: `/${location.slug}`,
    image: location.image,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        {
          '@type': 'ListItem',
          position: 2,
          name: location.name,
          item: `${SITE_URL}/${location.slug}`,
        },
      ],
    },
  });

  const other = location.slug === 'brighton' ? LOCATIONS.london : LOCATIONS.brighton;

  // Keyless Google Maps embed centred on the branch coordinates.
  const mapEmbed = `https://www.google.com/maps?q=${location.coords.lat},${location.coords.lng}&z=15&output=embed`;

  const features = [
    {
      Icon: UtensilsCrossed,
      title: 'Sri Lankan street food',
      body: 'Hoppers, kothu, devilled everything — the bold, spice-forward plates that put us on the map, cooked fresh all night.',
    },
    {
      Icon: Wine,
      title: 'Tropical cocktails',
      body: 'Rum-soaked, coconut-kissed and built for the islands. A drinks list that turns any evening into a getaway.',
    },
    {
      Icon: Music,
      title: 'Island nights',
      body: 'Warm light, good music and that unmistakable island energy — the kind of room you settle into and never want to leave.',
    },
  ];

  return (
    <div className="min-h-screen bg-navy-500 text-navy-500">
      <Header location={location} />

      <main>
        {/* ── Location hero — editorial "island postcard" spread.
              Deliberately unlike the home dolly: no full-bleed photo behind the
              text, no centered cinematic stack. Instead an asymmetric split —
              a serif masthead + narrative lede on the left, the venue photo
              mounted as a rotated postcard (white frame, wax-stamp postmark,
              handwritten caption) on the right. Magazine, not landing page. ── */}
        <section className="relative overflow-hidden bg-navy-900 pt-28 pb-16 sm:pt-32 sm:pb-24">
          <div className="grain absolute inset-0 opacity-25" />
          {/* Warm island glow bleeding from behind the postcard */}
          <div className="pointer-events-none absolute -right-40 top-10 h-[40rem] w-[40rem] rounded-full bg-orange-500/15 blur-[120px]" />

          <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* Left — editorial masthead + lede */}
            <div data-reveal="left">
              <div className="flex items-center gap-3 font-sans text-[11px] font-bold uppercase tracking-widest2 text-orange-400">
                <span className="h-px w-8 bg-orange-400/60" />
                The Coconut Island · Est. 2023
              </div>

              <h1 className="mt-5">
                <span className="block font-sans text-sm font-bold uppercase tracking-widest2 text-white/50">
                  Our island in
                </span>
                <span
                  className="mt-2 block font-serif font-medium leading-[0.95] tracking-tight text-white"
                  style={{ fontSize: 'clamp(3rem, 6.5vw, 5.5rem)' }}
                >
                  {location.name}
                  <span className="text-orange-400">.</span>
                </span>
              </h1>

              <p className="mt-7 max-w-lg font-serif text-xl italic leading-relaxed text-white/80">
                {location.blurb}
              </p>

              {/* Editorial meta line — address · hours, rules not pills */}
              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-[12px] uppercase tracking-widest2 text-white/55">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-orange-400" />
                  {location.addressLines.join(', ')}
                </span>
                {location.hours.map((h) => (
                  <span key={h.days} className="flex items-center gap-2 before:mr-2 before:hidden before:h-3 before:w-px before:bg-white/25 before:content-[''] sm:before:inline-block">
                    <Clock className="h-4 w-4 text-orange-400 sm:hidden" />
                    {h.days} · {h.time}
                  </span>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href={location.openTableUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-full bg-orange-500 px-7 py-4 text-[12px] font-bold uppercase tracking-widest2 text-white shadow-lg transition-all duration-200 hover:bg-orange-600 active:scale-95"
                >
                  <span className="relative z-10">Book a table →</span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                </a>
                <a
                  href="#menu"
                  className="group flex items-center gap-2 font-sans text-[12px] font-bold uppercase tracking-widest2 text-white/80 transition-colors hover:text-yellow-400"
                >
                  View menus
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 transition-transform group-hover:scale-125" />
                </a>
                <a
                  href={location.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 font-sans text-[12px] font-bold uppercase tracking-widest2 text-white/80 transition-colors hover:text-yellow-400"
                >
                  Get directions
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>

            {/* Right — the venue mounted as a postcard */}
            <div data-reveal="right" className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md rotate-2 transition-transform duration-300 hover:rotate-0">
                {/* Wax-stamp postmark */}
                <div className="absolute -left-3 -top-3 z-20 flex h-24 w-24 -rotate-12 items-center justify-center rounded-full border-2 border-dashed border-orange-400/70 bg-navy-900/85 text-center shadow-xl backdrop-blur sm:-left-5 sm:-top-5">
                  <span className="px-3 font-sans text-[8px] font-bold uppercase leading-[1.3] tracking-widest2 text-orange-300">
                    Coconut Island<br />{location.area}<br />Est · 2023
                  </span>
                </div>

                {/* White photo mount */}
                <div className="paper-grain bg-white p-3 pb-4 shadow-2xl ring-1 ring-navy-500/10">
                  <div className="overflow-hidden">
                    <img
                      src={location.image}
                      alt={`The Coconut Island ${location.name}`}
                      className="aspect-[4/5] w-full object-cover"
                      loading="eager"
                    />
                  </div>
                  {/* Handwritten caption strip */}
                  <div className="flex items-end justify-between gap-3 px-1 pt-3">
                    <p className="font-serif text-lg italic leading-tight text-navy-500">
                      {location.tagline}
                    </p>
                    <p className="shrink-0 font-sans text-[10px] uppercase tracking-widest2 text-navy-500/45">
                      {location.coords.lat.toFixed(2)}°N · {Math.abs(location.coords.lng).toFixed(2)}°W
                    </p>
                  </div>
                </div>

                {/* Corner stamp */}
                <div className="absolute -bottom-4 -right-3 z-20">
                  <Badge tone="yellow" rotate={-8}>★ Pure Island Vibes</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── What to expect — branded feature cards ── */}
        <section className="relative overflow-hidden bg-navy-500 py-20 sm:py-28">
          <div className="grain absolute inset-0 opacity-20" />
          <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="max-w-xl" data-reveal="up">
              <Badge tone="orange" rotate={-5}>What awaits you</Badge>
              <h2 className="mt-5 font-display text-4xl font-bold tracking-tightest text-white sm:text-5xl">
                A little taste of
                <span className="block font-serif italic font-medium text-yellow-400">the islands in {location.area}</span>
              </h2>
              <p className="mt-4 font-serif text-lg italic leading-relaxed text-white/70">
                {location.tagline} — here's what you're walking into.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3" data-stagger>
              {features.map(({ Icon, title, body }) => (
                <div
                  key={title}
                  className="group relative border-t-2 border-orange-500 bg-navy-700 p-8 ring-1 ring-white/5 transition-transform duration-200 hover:-translate-y-1"
                >
                  <Icon className="h-10 w-10 text-orange-400" />
                  <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-white">{title}</h3>
                  <p className="mt-3 font-serif text-base italic leading-relaxed text-white/70">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── The three menus (Cuisine / Lunch / Cocktails) — image-based ── */}
        <MenuSection location={location} />

        {/* ── Plan your visit — hours & contact beside a live map ── */}
        <section className="relative bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-2 lg:gap-14">
              {/* Details */}
              <div data-reveal="left">
                <Badge tone="navy" rotate={-5}>Plan your visit</Badge>
                <h2 className="mt-5 font-display text-4xl font-bold tracking-tightest text-navy-500 sm:text-5xl">
                  Find us in
                  <span className="block font-serif italic font-medium text-orange-500">{location.name}</span>
                </h2>

                <div className="mt-8 space-y-5">
                  <div className="flex items-start gap-4">
                    <MapPin className="mt-0.5 h-6 w-6 shrink-0 text-orange-500" />
                    <div>
                      <p className="font-sans text-[10px] uppercase tracking-widest2 text-navy-500/45">Address</p>
                      <p className="mt-1 font-serif text-lg text-navy-500">{location.addressLines.join(', ')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="mt-0.5 h-6 w-6 shrink-0 text-orange-500" />
                    <div>
                      <p className="font-sans text-[10px] uppercase tracking-widest2 text-navy-500/45">Opening hours</p>
                      <div className="mt-1 space-y-0.5">
                        {location.hours.map((h) => (
                          <p key={h.days} className="font-serif text-lg text-navy-500">
                            <span className="font-sans text-sm font-bold uppercase tracking-wide text-navy-500/60">{h.days}</span>
                            {' · '}{h.time}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-8 gap-y-5 pt-1">
                    <a href={location.phoneHref} className="flex items-start gap-4 transition-colors hover:text-orange-500">
                      <Phone className="mt-0.5 h-6 w-6 shrink-0 text-orange-500" />
                      <span>
                        <span className="block font-sans text-[10px] uppercase tracking-widest2 text-navy-500/45">Call</span>
                        <span className="mt-1 block font-serif text-lg text-navy-500">{location.phone}</span>
                      </span>
                    </a>
                    <a href={`mailto:${location.email}`} className="flex items-start gap-4 transition-colors hover:text-orange-500">
                      <Mail className="mt-0.5 h-6 w-6 shrink-0 text-orange-500" />
                      <span>
                        <span className="block font-sans text-[10px] uppercase tracking-widest2 text-navy-500/45">Email</span>
                        <span className="mt-1 block font-serif text-lg text-navy-500">{location.email}</span>
                      </span>
                    </a>
                  </div>
                </div>

                <a
                  href={location.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-8 inline-flex items-center gap-2 rounded-full bg-navy-500 px-7 py-4 text-[12px] font-bold uppercase tracking-widest2 text-white shadow-lg transition-all duration-200 hover:bg-navy-700 active:scale-95"
                >
                  <Navigation className="h-4 w-4" />
                  Get directions
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>

              {/* Live map */}
              <div data-reveal="right" className="min-h-[360px] overflow-hidden shadow-2xl ring-1 ring-navy-500/10 lg:min-h-full">
                <iframe
                  title={`Map to The Coconut Island ${location.name}`}
                  src={mapEmbed}
                  className="h-full min-h-[360px] w-full border-0 grayscale-[0.2]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Booking section (location-specific) ── */}
        <Reservation location={location} />

        {/* ── Cross-link to the other branch ── */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8">
            <div
              className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-navy-50 p-8 sm:flex-row sm:items-center sm:p-10"
              data-reveal="up"
            >
              <div>
                <p className="font-sans text-[10px] uppercase tracking-widest2 text-navy-500/45">
                  Our other island
                </p>
                <p className="mt-2 font-display text-3xl font-bold tracking-tight text-navy-500">
                  Also in{' '}
                  <span className="font-serif italic font-medium text-orange-500">{other.name}</span>
                </p>
                <p className="mt-2 max-w-md font-serif text-base italic text-navy-500/60">
                  {other.addressLines.join(', ')}
                </p>
              </div>
              <Link
                to={`/${other.slug}`}
                className="group flex items-center gap-2 rounded-full bg-navy-500 px-7 py-4 text-[12px] font-bold uppercase tracking-widest2 text-white shadow-lg transition-all duration-200 hover:bg-navy-700 active:scale-95"
              >
                Visit {other.name}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { IslandLocation, LOCATION_LIST } from '../data/locations';

const NAV = [
  { label: 'Our Story', href: '/#bistro' },
  { label: 'Cocktails', href: '/cocktails' },
  { label: 'Journal', href: '/blog' },
  { label: 'Gift Cards', href: '/gift-cards' },
  { label: 'Book a Table', href: '/#reserver' },
];

export function Header({ location }: { location?: IslandLocation }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lightNav, setLightNav] = useState(false);

  useEffect(() => {
    // The logo artwork is near-white, so it disappears over a light section.
    // Sections that render on a pale ground opt in with `data-light-nav`, and
    // the logo flips to navy while one of them sits under the header band.
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const band = 96;
      setLightNav(
        [...document.querySelectorAll<HTMLElement>('[data-light-nav]')].some((el) => {
          const r = el.getBoundingClientRect();
          return r.top < band && r.bottom > 0;
        })
      );
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // On a location page the CTA books that branch directly; on the home page
  // it scrolls to the reservation section where both branches are offered.
  const bookHref = location ? location.openTableUrl : '#reserver';
  const bookExternal = Boolean(location);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
      >
        <div className="relative mx-auto flex max-w-[1400px] items-center justify-between px-5 sm:px-8">
          {/* Logo — centered */}
          <Link
            to="/"
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 sm:block"
            aria-label="The Coconut Island — home"
          >
            {lightNav ? (
              // Same artwork, masked to solid navy so it reads on a pale
              // ground. The link's aria-label carries the accessible name.
              <span
                aria-hidden="true"
                className="block h-10 w-auto aspect-[300/257] bg-navy-500 sm:h-12"
                style={{
                  WebkitMaskImage: 'url(/images/logo-tci.svg)',
                  maskImage: 'url(/images/logo-tci.svg)',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                }}
              />
            ) : (
              <img src="/images/logo-tci.svg" alt="The Coconut Island" className="h-10 w-auto sm:h-12" />
            )}
          </Link>

          {/* MENU trigger — top left, rounded white */}
          <button
            onClick={() => setOpen(true)}
            className="group flex items-center gap-3 rounded-full bg-white/95 px-5 py-3 shadow-lg ring-1 ring-navy-500/10 backdrop-blur transition-transform duration-200 hover:scale-[1.03] active:scale-95"
            aria-label="Open menu"
          >
            <span className="flex flex-col gap-[5px]">
              <span className="block h-[2px] w-5 bg-navy-500 transition-transform duration-200 group-hover:translate-x-0.5" />
              <span className="block h-[2px] w-5 bg-navy-500 transition-transform duration-200 group-hover:-translate-x-0.5" />
            </span>
            <span className="text-[12px] font-bold uppercase tracking-widest2 text-navy-500">Menu</span>
          </button>

          {/* BOOK CTA — top right, bright orange */}
          <a
            href={bookHref}
            {...(bookExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="group relative overflow-hidden rounded-full bg-orange-500 px-6 py-3.5 text-[12px] font-bold uppercase tracking-widest2 text-white shadow-lg ring-1 ring-navy-500/10 transition-all duration-200 hover:bg-orange-600 hover:shadow-xl active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 transition-transform group-hover:scale-125" />
              Book{location ? ` ${location.slug === 'london' ? 'Angel' : 'Brighton'}` : ''}
            </span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          </a>
        </div>
      </header>

      {/* Fullscreen menu overlay */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-200 ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div
          className="absolute inset-0 bg-navy-900/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <nav
          className={`absolute left-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-8 shadow-2xl transition-transform duration-200 sm:p-12 ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-2xl font-bold tracking-tightest text-navy-500">The Coconut Island</span>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-2 ring-1 ring-navy-500/15 transition-colors hover:bg-navy-50"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-navy-500" />
            </button>
          </div>

          <div className="mt-12 flex flex-col gap-1">
            {NAV.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-4 border-b border-navy-500/10 py-5 transition-colors hover:bg-navy-50"
                style={{ transitionDelay: `${i * 25}ms` }}
              >
                <span className="font-sans text-xs text-navy-500/40">0{i + 1}</span>
                <span className="font-display text-4xl font-medium tracking-tight text-navy-500 transition-transform duration-200 group-hover:translate-x-2 sm:text-5xl">
                  {item.label}
                </span>
              </a>
            ))}
          </div>

          {/* Locations */}
          <div className="mt-10">
            <p className="uppercase tracking-widest2 text-[10px] text-navy-500/40">Our Locations</p>
            <div className="mt-3 flex flex-col gap-1">
              {LOCATION_LIST.map((loc) => (
                <Link
                  key={loc.slug}
                  to={`/${loc.slug}`}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline justify-between border-b border-navy-500/10 py-4 transition-colors hover:bg-navy-50"
                >
                  <span className="font-display text-2xl font-medium tracking-tight text-navy-500 transition-transform duration-200 group-hover:translate-x-2">
                    {loc.name}
                  </span>
                  <span className="font-sans text-[11px] uppercase tracking-widest2 text-navy-500/40">
                    {loc.area}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 font-sans text-sm text-navy-500/70">
            {LOCATION_LIST.map((loc) => (
              <div key={loc.slug} className="space-y-1.5">
                <p className="uppercase tracking-widest2 text-[10px] text-navy-500/40">{loc.name} · Hours</p>
                {loc.hours.map((h) => (
                  <p key={h.days}>{h.days} · {h.time}</p>
                ))}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}

import { Instagram, Facebook, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LOCATION_LIST } from '../data/locations';
import { SOCIAL } from '../data/social';

export function Footer() {
  return (
    <footer id="contact" className="relative bg-white">
      {/* Spacer row — kept for vertical rhythm where the stamp row used to be */}
      <div className="border-b border-navy-500/10 py-5 sm:py-10" />

      {/* Footer content */}
      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 sm:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-5" data-stagger>
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-display text-3xl font-bold tracking-tightest text-navy-500">
              Coconut
              <span className="block font-serif italic font-medium text-orange-500">Island</span>
            </h3>
            <p className="mt-4 max-w-xs font-serif text-base italic leading-relaxed text-navy-500/65">
              Sri Lankan street food, tropical cocktails &amp; island vibes.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-sans text-[10px] uppercase tracking-widest2 text-navy-500/45">Navigation</p>
            <ul className="mt-4 space-y-2.5 font-sans text-sm text-navy-500/75">
              <li><a href="/#bistro" className="transition-colors hover:text-orange-500">Our Story</a></li>
              <li><Link to="/cocktails" className="transition-colors hover:text-orange-500">Cocktails</Link></li>
              <li><Link to="/gift-cards" className="transition-colors hover:text-orange-500">Gift Cards</Link></li>
              <li><a href="/#reserver" className="transition-colors hover:text-orange-500">Book</a></li>
            </ul>
          </div>

          {/* Locations */}
          {LOCATION_LIST.map((loc) => (
            <div key={loc.slug}>
              <p className="font-sans text-[10px] uppercase tracking-widest2 text-navy-500/45">
                <Link to={`/${loc.slug}`} className="transition-colors hover:text-orange-500">
                  {loc.name}
                </Link>
              </p>
              <ul className="mt-4 space-y-2.5 break-words font-sans text-sm text-navy-500/75">
                {loc.addressLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
                <li>
                  <a href={loc.phoneHref} className="transition-colors hover:text-orange-500">
                    {loc.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${loc.email}`} className="transition-colors hover:text-orange-500">
                    {loc.email}
                  </a>
                </li>
              </ul>
            </div>
          ))}

          {/* Social */}
          <div>
            <p className="font-sans text-[10px] uppercase tracking-widest2 text-navy-500/45">Follow us</p>
            <div className="mt-4 flex gap-3">
              {[
                { Icon: Instagram, label: 'Instagram', href: SOCIAL.instagram },
                { Icon: Facebook, label: 'Facebook', href: SOCIAL.facebook },
                { Icon: Mail, label: 'Email', href: `mailto:${LOCATION_LIST[0].email}` },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-500/20 text-navy-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-navy-500 hover:text-yellow-400"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-navy-500/15 pt-6 text-center sm:mt-14 sm:gap-3 sm:text-left sm:flex-row">
          <p className="font-sans text-[11px] text-navy-500/50">
            © {new Date().getFullYear()} The Coconut Island — All rights reserved
          </p>
          <p className="font-sans text-[11px] uppercase tracking-widest2 text-navy-500/40">
            Brighton · Angel, London
          </p>
        </div>
      </div>
    </footer>
  );
}

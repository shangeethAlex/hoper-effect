import { Gift, CreditCard, Mail, Sparkles } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Badge } from '../components/Primitives';
import { useScrollAnimations } from '../hooks/useScrollAnimations';
import { useSeo, SITE_URL } from '../hooks/useSeo';

/** Fixed gift-card denominations plus an open "your amount" option. */
const DENOMINATIONS = [
  { amount: 25, blurb: 'A round of tropical cocktails, on you.' },
  { amount: 50, blurb: 'Dinner for two with island vibes.', featured: true },
  { amount: 75, blurb: 'A proper feast — starters to dessert.' },
  { amount: 100, blurb: 'The full experience for the whole crew.' },
];

const STEPS = [
  {
    Icon: CreditCard,
    title: 'Pick an amount',
    body: 'Choose a set value or enter your own — from £10 up to £250.',
  },
  {
    Icon: Mail,
    title: 'Delivered instantly',
    body: 'The digital card lands in their inbox with your message attached.',
  },
  {
    Icon: Gift,
    title: 'Spend at either branch',
    body: 'Redeemable in Brighton or Angel, London. Valid for 12 months.',
  },
];

export function GiftCards() {
  useScrollAnimations();

  useSeo({
    title: 'Gift Cards | The Coconut Island',
    description:
      'Give the gift of island vibes — Coconut Island gift cards for Sri Lankan street food & tropical cocktails. Redeemable in Brighton and Angel, London.',
    path: '/gift-cards',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Gift Cards', item: `${SITE_URL}/gift-cards` },
      ],
    },
  });

  return (
    <div className="min-h-screen bg-navy-500 text-navy-500">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-navy-700 pt-32 pb-20 sm:pt-40 sm:pb-28">
          <div className="grain absolute inset-0 opacity-30" />
          <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div data-reveal="left">
                <Badge tone="yellow" rotate={-6}>Gift Cards</Badge>
                <h1 className="mt-5 font-display text-5xl font-bold leading-[0.98] tracking-tightest text-white sm:text-6xl lg:text-7xl">
                  Give the gift
                  <span className="block font-serif italic font-medium text-orange-400">of island vibes</span>
                </h1>
                <p className="mt-6 max-w-md font-serif text-lg italic leading-relaxed text-white/75">
                  Sri Lankan street food, tropical cocktails and pure island energy —
                  wrapped up in a gift card they can spend at either branch. The easiest
                  way to send a taste of the tropics.
                </p>
              </div>

              {/* Tilted gift-card mock */}
              <div data-reveal="right" className="flex justify-center lg:justify-end">
                <div className="paper-grain relative w-full max-w-md rotate-2 bg-gradient-to-br from-orange-500 to-orange-600 p-9 text-white shadow-2xl ring-1 ring-white/10">
                  <div className="flex items-start justify-between">
                    <span className="font-display text-2xl font-bold tracking-tightest">The Coconut Island</span>
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  </div>
                  <p className="mt-12 font-sans text-[10px] uppercase tracking-widest2 text-white/60">Gift Card</p>
                  <p className="mt-1 font-display text-6xl font-bold tracking-tightest">£50</p>
                  <p className="mt-10 font-serif text-sm italic text-white/80">#pureislandvibes</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Denominations — white plank wall, cards pinned like postcards */}
        <section className="paper-grain relative bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="max-w-xl" data-reveal="up">
              <Badge tone="orange" rotate={-5}>Choose a value</Badge>
              <h2 className="mt-5 font-display text-4xl font-bold tracking-tightest text-navy-500 sm:text-5xl">
                Pick your amount
              </h2>
              <p className="mt-4 font-serif text-lg italic text-navy-500/70">
                Every card works the same — spend it all at once or a little at a time.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
              {DENOMINATIONS.map((d, i) => (
                <div
                  key={d.amount}
                  className={`paper-grain relative flex flex-col bg-white p-7 shadow-xl ring-1 ring-navy-500/10 transition-transform duration-200 hover:-translate-y-2 hover:rotate-0 ${
                    ['-rotate-1', 'rotate-[0.8deg]', '-rotate-[0.8deg]', 'rotate-1'][i % 4]
                  } ${d.featured ? 'lg:-mt-3' : ''}`}
                >
                  {d.featured && (
                    <span className="absolute -top-3 left-7">
                      <Badge tone="yellow" rotate={-8}>Most loved</Badge>
                    </span>
                  )}
                  <p className="font-sans text-[10px] uppercase tracking-widest2 text-navy-500/45">Gift Card</p>
                  <p className="mt-1 font-display text-5xl font-bold tracking-tightest text-navy-500">£{d.amount}</p>
                  <p className="mt-4 flex-1 font-serif text-base italic leading-relaxed text-navy-500/70">
                    {d.blurb}
                  </p>
                  {/* Placeholder — wire to gift-card provider checkout when live */}
                  <a
                    href="#"
                    aria-disabled="true"
                    onClick={(e) => e.preventDefault()}
                    className="group mt-6 flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3.5 text-[12px] font-bold uppercase tracking-widest2 text-white shadow-lg transition-all duration-200 hover:bg-orange-600 active:scale-[0.98]"
                  >
                    Buy £{d.amount} →
                  </a>
                </div>
              ))}
            </div>

            {/* Custom amount */}
            <div
              className="mt-6 flex flex-col items-center justify-between gap-5 bg-navy-700 p-8 text-white ring-1 ring-white/10 sm:flex-row sm:p-10"
              data-reveal="up"
            >
              <div className="flex items-center gap-4">
                <Sparkles className="h-8 w-8 shrink-0 text-yellow-400" />
                <div>
                  <p className="font-display text-2xl font-bold tracking-tight">Your own amount</p>
                  <p className="mt-1 font-serif text-base italic text-white/70">
                    Anything from £10 to £250 — you decide.
                  </p>
                </div>
              </div>
              <a
                href="#"
                aria-disabled="true"
                onClick={(e) => e.preventDefault()}
                className="rounded-full bg-white px-7 py-3.5 text-[12px] font-bold uppercase tracking-widest2 text-navy-500 shadow-lg transition-all duration-200 hover:bg-yellow-400 active:scale-[0.98]"
              >
                Choose amount →
              </a>
            </div>

            <p className="mt-6 text-center font-sans text-[11px] uppercase tracking-widest2 text-navy-500/40">
              Online purchases coming soon
            </p>
          </div>
        </section>

        {/* How it works — navy wainscot band */}
        <section className="relative overflow-hidden bg-navy-500 py-20 sm:py-28">
          <div className="grain absolute inset-0 opacity-30" />
          <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="max-w-xl" data-reveal="up">
              <Badge tone="yellow" rotate={-5}>How it works</Badge>
              <h2 className="mt-5 font-display text-4xl font-bold tracking-tightest text-white sm:text-5xl">
                Three easy steps
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3" data-stagger>
              {STEPS.map(({ Icon, title, body }, i) => (
                <div key={title} className="relative border-t-2 border-orange-500 pt-6">
                  <span className="inline-block -rotate-3 font-['Permanent_Marker'] text-xl text-yellow-400">0{i + 1}</span>
                  <Icon className="mt-4 h-9 w-9 text-orange-400" />
                  <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-white">{title}</h3>
                  <p className="mt-2 font-serif text-base italic leading-relaxed text-white/70">{body}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 border-t border-white/10 pt-8">
              <p className="max-w-2xl font-sans text-sm leading-relaxed text-white/60">
                Coconut Island gift cards are redeemable in person at our Brighton and Angel,
                London branches, valid for 12 months from purchase, and can be used across
                multiple visits until the balance runs out. Not exchangeable for cash.
                Prefer to buy in person or for a larger corporate order?{' '}
                <a
                  href="mailto:hello@thecoconutisland.com?subject=Gift%20Card%20Enquiry"
                  className="font-bold text-orange-400 transition-colors hover:text-orange-300"
                >
                  Drop us an email
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Badge, SectionHeading } from '../components/Primitives';
import { CocktailFeature } from '../components/CocktailFeature';
import { CocktailCard } from '../components/CocktailCard';
import { CocktailSpiral } from '../components/CocktailSpiral';
import { useScrollAnimations } from '../hooks/useScrollAnimations';
import { useSeo } from '../hooks/useSeo';
import { COCKTAILS, FEATURED_COCKTAILS, MARGARITAS } from '../data/cocktails';

/* Full cocktail menu page. Structure mirrors an editorial "spotlight + grid"
   pattern: a dark full-bleed hero, two alternating feature blocks for the
   standout serves, a photo grid for the rest of the list, and a themed
   closing row for the margaritas — all built from the shared cocktail data
   in data/cocktails.ts, and from CocktailFeature/CocktailCard so each
   drink's markup exists in exactly one place. */

const GRID_COCKTAILS = COCKTAILS.filter(
  (c) => !c.featured && !MARGARITAS.includes(c)
);

export function Cocktails() {
  useScrollAnimations();

  useSeo({
    title: 'Cocktails | The Coconut Island',
    description:
      'Savour the island vibes in every glass — Ceylon arrack, mezcal and rum cocktails shaken, stirred and built with island spice at The Coconut Island.',
    path: '/cocktails',
  });

  return (
    <div className="min-h-screen bg-navy-900 text-navy-500">
      <Header />

      <main>
        {/* ── Hero ──
            Background is the site's navy paper-grain texture (same asset as
            Hero.tsx / ShowcaseSection.tsx) rather than a cocktail image —
            the drink shots are narrow icon/portrait crops that stretch badly
            across a full viewport-width hero; they read far better at card
            and spotlight scale further down the page. */}
        <section
          className="relative flex min-h-[80vh] flex-col justify-center overflow-hidden bg-navy-900 bg-cover bg-center pb-20 pt-40 sm:pb-28 sm:pt-48"
          style={{ backgroundImage: "url('/images/blue.png')" }}
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/70 to-navy-900/40" />
          </div>

          <div className="relative mx-auto w-full max-w-[1400px] px-5 text-center sm:px-8">
            <div className="mx-auto max-w-3xl" data-reveal="up">
              <Badge tone="orange" rotate={-6} className="mx-auto">
                🎭 Sri Lankan Mask &amp; Island Spirits
              </Badge>

              <h1
                className="mt-6 font-display font-black uppercase leading-[0.9] tracking-tightest text-white [text-shadow:0_2px_40px_rgba(5,12,28,0.6)]"
                style={{ fontSize: 'clamp(2.6rem, 7vw, 6rem)' }}
              >
                Savour the island vibes
                <br />
                in every glass!
              </h1>

              <p className="mx-auto mt-6 max-w-xl font-serif text-lg italic leading-relaxed text-white/75 sm:text-xl">
                Bringing the freshest island ingredients to every sip, our cocktails are a journey
                of spirits — shaken, mixed, stirred, built and poured to perfection. Experience an
                incredible blend of flavours that capture the true essence of island life.
              </p>
            </div>
          </div>
        </section>

        {/* ── Feature spotlights ── */}
        <section className="bg-navy-900 py-20 sm:py-28">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-24 px-5 sm:gap-32 sm:px-8">
            {FEATURED_COCKTAILS.map((cocktail, i) => (
              <CocktailFeature key={cocktail.slug} cocktail={cocktail} reverse={i % 2 === 1} />
            ))}
          </div>
        </section>

        {/* ── Full line-up, horizontal scroll spiral ── */}
        <CocktailSpiral cocktails={GRID_COCKTAILS} />

        {/* ── Margaritas ── */}
        <section className="paper-grain relative overflow-hidden bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <SectionHeading
              eyebrow="For All the Margarita Lovers"
              title="Three ways to margarita"
              subtitle="A Margarita cannot be missed — sweet, sour, and always island-spiced."
            />

            <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-3">
              {MARGARITAS.map((cocktail, i) => (
                <CocktailCard key={cocktail.slug} cocktail={cocktail} delay={i * 120} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Closing CTA ── */}
        <section className="bg-navy-900 py-16 sm:py-20">
          <div className="mx-auto max-w-[1400px] px-5 text-center sm:px-8" data-reveal="up">
            <p className="font-serif text-xl italic text-white/70 sm:text-2xl">
              Ready to taste the island for yourself?
            </p>
            <a
              href="/#reserver"
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-4 text-[12px] font-bold uppercase tracking-widest2 text-white shadow-lg transition-all duration-200 hover:bg-orange-600 hover:shadow-xl active:scale-95"
            >
              <span>Book a table</span>
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 transition-transform group-hover:scale-125" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

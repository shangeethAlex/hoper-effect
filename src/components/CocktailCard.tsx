import type { Cocktail } from '../data/cocktails';

/** Photo card for a cocktail grid — full-bleed image, name + description on
    a dark gradient footer. Used by the /cocktails page grid sections. */
export function CocktailCard({ cocktail, delay = 0 }: { cocktail: Cocktail; delay?: number }) {
  return (
    <article
      className="group relative overflow-hidden rounded-3xl"
      style={{ aspectRatio: '3/4' }}
      data-reveal="up"
      data-delay={delay}
    >
      <img
        src={cocktail.img}
        alt={cocktail.alt}
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/95 via-navy-900/25 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <h3 className="font-display text-xl font-bold text-white sm:text-2xl">{cocktail.name}</h3>
        <p className="mt-1.5 font-sans text-[13px] leading-relaxed text-white/75">
          {cocktail.description}
        </p>
      </div>
    </article>
  );
}

import type { Cocktail } from '../data/cocktails';

/** Big split spotlight for a single standout cocktail — full-bleed photo on
    one side, name + description on the other. `reverse` flips which side
    the photo sits on, so a page can alternate blocks for visual rhythm. */
export function CocktailFeature({
  cocktail,
  reverse = false,
}: {
  cocktail: Cocktail;
  reverse?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
      <div
        className={`relative overflow-hidden rounded-3xl ${reverse ? 'lg:order-2' : ''}`}
        style={{ aspectRatio: '4/5' }}
        data-reveal={reverse ? 'right' : 'left'}
      >
        <img
          src={cocktail.img}
          alt={cocktail.alt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div data-reveal={reverse ? 'left' : 'right'}>
        <p className="font-sans text-[11px] font-semibold uppercase tracking-widest2 text-orange-400">
          Signature Serve
        </p>
        <h3 className="mt-2 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {cocktail.name}
        </h3>
        <p className="mt-5 max-w-md font-serif text-xl italic leading-relaxed text-white/70">
          {cocktail.description}
        </p>
      </div>
    </div>
  );
}

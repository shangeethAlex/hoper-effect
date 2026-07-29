/**
 * Cocktail menu. Shared between the home page's CocktailSection filmstrip
 * and the full /cocktails page — keep this the single source of truth
 * rather than duplicating drink data in either place.
 */

export interface Cocktail {
  slug: string;
  name: string;
  img: string;
  alt: string;
  description: string;
  /** GBP, no symbol. Placeholder — real menu pricing hasn't been supplied yet;
      falls back to PLACEHOLDER_PRICE (see below) wherever unset. */
  price?: string;
  /** Marks a drink for the page's spotlight feature blocks. */
  featured?: boolean;
  /** Included in the home page's CocktailSection filmstrip. */
  onHomepage?: boolean;
}

export const COCKTAILS: Cocktail[] = [
  {
    slug: 'arrack-attack',
    name: 'Arrack Attack',
    img: '/images/cocktails/arrack-attack.webp',
    alt: 'Arrack Attack cocktail at The Coconut Island',
    description:
      'Ceylon arrack, triple sec, fresh lime and ginger, finished with a hint of island spice.',
    featured: true,
    onHomepage: true,
  },
  {
    slug: 'the-peacock',
    name: 'The Peacock',
    img: '/images/cocktails/the-peacock.webp',
    alt: 'The Peacock cocktail at The Coconut Island',
    description:
      "A tropical mix of the island's favourite arrack with shaken coconut rum, finishing off with a touch of lemon.",
    featured: true,
  },
  {
    slug: 'rise-up-or-spice-up',
    name: 'Rise Up or Spice Up',
    img: '/images/cocktails/rise-up.webp',
    alt: 'Rise Up or Spice Up mezcal cocktail at The Coconut Island',
    description:
      "Tequila's cousin mezcal, combined with triple sec — rise up with a touch of herb, or spice up island-style with chilli to wake up your taste buds.",
    onHomepage: true,
  },
  {
    slug: 'colombo-smoked-old-fashioned',
    name: 'Colombo Smoked Old Fashioned',
    img: '/images/cocktails/old-fashioned.webp',
    alt: 'Colombo Smoked Old Fashioned cocktail at The Coconut Island',
    description:
      'Bourbon, bitters and coconut arrack — a traditional old fashioned with an island twist, smoking Colombo vibes.',
    onHomepage: true,
  },
  {
    slug: 'fire-it-up',
    name: 'Fire It Up',
    img: '/images/cocktails/fire-it-up.webp',
    alt: 'Fire It Up cocktail at The Coconut Island',
    description:
      'Pineapple, guava, lime and raspberry down the spiced-and-coconut-rum road — island magic to light up your night.',
    onHomepage: true,
  },
  {
    slug: 'skull-on-fire',
    name: 'Skull on Fire',
    img: '/images/cocktails/skull-on-fire.webp',
    alt: 'Skull on Fire flaming cocktail at The Coconut Island',
    description:
      'Tequila, of course — honey, herb and lemon, ready for a fiery skull dance. The island party starter.',
    onHomepage: true,
  },
  {
    slug: 'smokey-island-boy',
    name: 'Smokey Island Boy',
    img: '/images/cocktails/smokey-island-boy.webp',
    alt: 'Smokey Island Boy mezcal cocktail at The Coconut Island',
    description: 'The best way to drink a mezcal — lemon and grenadine, burnt at the table for you.',
    onHomepage: true,
  },
  {
    slug: 'kalu-kopi-martini',
    name: 'Kalu Kopi Martini',
    img: '/images/cocktails/kalu-kopi-martini.webp',
    alt: 'Kalu Kopi Martini coffee cocktail at The Coconut Island',
    description:
      'Fresh double espresso blended with kalua and cardamom-infused vodka, ending you on an aromatic island wave.',
  },
  {
    slug: 'no-87',
    name: 'No. 87',
    img: '/images/cocktails/no-87.webp',
    alt: 'No. 87 mango martini at The Coconut Island',
    description: 'A mango martini merging our Colombo-to-north roots with some vodka.',
  },
  {
    slug: 'twist-n-shout',
    name: "Twist 'n' Shout",
    img: '/images/cocktails/twist-n-shout.webp',
    alt: "Twist 'n' Shout tequila cocktail at The Coconut Island",
    description: 'A tropical tequila twist with a juicy orange hint of island spice.',
  },
  {
    slug: 'aliya',
    name: 'Aliya',
    img: '/images/cocktails/aliya.webp',
    alt: 'Aliya — Ceylon arrack and coconut water cocktail at The Coconut Island',
    description:
      'Our signature pour of Ceylon arrack — with chilled coconut water, or a twist of ginger ale.',
    onHomepage: true,
  },
  {
    slug: 'galle-face-green',
    name: 'Galle Face Green',
    img: '/images/cocktails/galle-face-green.webp',
    alt: 'Galle Face Green gin and cucumber cocktail at The Coconut Island',
    description: 'The best way to have your gin — with refreshing cucumber.',
    onHomepage: true,
  },
  {
    slug: 'down-south',
    name: 'Down South',
    img: '/images/cocktails/down-south.webp',
    alt: 'Down South coconut and pineapple rum cocktail at The Coconut Island',
    description:
      'Share the love with this creamy island classic — coconut, pineapple and rum, served in a fresh pineapple.',
  },
  {
    slug: 'island-punch',
    name: 'Island Punch',
    img: '/images/cocktails/island-punch.webp',
    alt: 'Island Punch rum and passionfruit cocktail at The Coconut Island',
    description: 'Share your passion island style — rum, passionfruit and grenadine.',
    onHomepage: true,
  },
  {
    slug: 'mango-chilli-margarita',
    name: 'Mango Chilli Margarita',
    img: '/images/cocktails/mango-chilli-margarita.webp',
    alt: 'Mango Chilli Margarita at The Coconut Island',
    description: 'Where sweet mango meets the island chilli kick.',
    onHomepage: true,
  },
  {
    slug: 'classic-margarita',
    name: 'Classic Margarita',
    img: '/images/cocktails/classic-margarita.webp',
    alt: 'Classic Margarita at The Coconut Island',
    description: 'Tequila, triple sec and fresh lime — the classic, done island style.',
    onHomepage: true,
  },
  {
    slug: 'passion-fruit-margarita',
    name: 'Passion Fruit Margarita',
    img: '/images/cocktails/passion-fruit-margarita.webp',
    alt: 'Passion Fruit Margarita at The Coconut Island',
    description: "Sweet and sour, mixed with passion — the margarita that can't be missed.",
    onHomepage: true,
  },
];

/** Stand-in price shown wherever a cocktail has no `price` set — swap out
    once real menu pricing is supplied. */
export const PLACEHOLDER_PRICE = '12';

/** The three margaritas, grouped for the page's dedicated closing section. */
export const MARGARITAS = COCKTAILS.filter((c) => c.slug.endsWith('margarita'));

export const FEATURED_COCKTAILS = COCKTAILS.filter((c) => c.featured);

/** The curated subset shown in the home page's CocktailSection filmstrip. */
export const HOMEPAGE_COCKTAILS = COCKTAILS.filter((c) => c.onHomepage);

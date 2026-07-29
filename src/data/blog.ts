/**
 * Blog content. Static, hand-authored posts — no CMS. Each post renders on
 * the listing (/blog) and its own page (/blog/:slug). `body` is an ordered
 * list of blocks the post page renders in sequence.
 */

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'list'; items: string[] }
  /** Single inline image. `wide` breaks out past the text column. */
  | { type: 'image'; src: string; caption?: string; wide?: boolean }
  /** Two side-by-side images. */
  | { type: 'gallery'; images: { src: string; caption?: string }[] };

export interface BlogPost {
  slug: string;
  title: string;
  /** One-line hook shown on cards + as meta description. */
  excerpt: string;
  category: 'Recipes' | 'Culture' | 'Behind the Scenes' | 'Events';
  author: string;
  /** ISO date — used for <time> + sorting. */
  date: string;
  /** Minutes, shown on cards. */
  readingTime: number;
  cover: string;
  body: BlogBlock[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'the-soul-of-sri-lankan-street-food',
    title: 'The Soul of Sri Lankan Street Food',
    excerpt:
      'From kottu roti sizzling on the griddle to hoppers folded around a runny egg — the dishes that define an island.',
    category: 'Culture',
    author: 'The Coconut Island Kitchen',
    date: '2026-06-28',
    readingTime: 6,
    cover:
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1200',
    body: [
      {
        type: 'p',
        text: 'Walk any evening market in Colombo and the first thing you hear is rhythm — the metallic clang of blades chopping roti against a hot steel plate. That sound is kottu, and it is the heartbeat of Sri Lankan street food.',
      },
      {
        type: 'p',
        text: 'It is a cuisine you experience standing up, elbow to elbow, plate in hand. No white tablecloths, no ceremony — just heat, spice and the cook working an arm’s length in front of you.',
      },
      {
        type: 'image',
        src: 'https://images.pexels.com/photos/674574/pexels-photo-674574.jpeg?auto=compress&cs=tinysrgb&w=1400',
        caption: 'A night market in full swing — the theatre of the griddle.',
        wide: true,
      },
      { type: 'h2', text: 'A cuisine built on the griddle' },
      {
        type: 'p',
        text: 'Street food here is fast, loud and deeply personal. Every cook has a hand — more chilli, a heavier pour of curry, an extra crack of egg. Nothing is standardised, and that is exactly the point.',
      },
      {
        type: 'gallery',
        images: [
          {
            src: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800',
            caption: 'Spices ground fresh, every morning.',
          },
          {
            src: 'https://images.pexels.com/photos/5410400/pexels-photo-5410400.jpeg?auto=compress&cs=tinysrgb&w=800',
            caption: 'Curries lined up before service.',
          },
        ],
      },
      {
        type: 'quote',
        text: 'You do not learn these dishes from a book. You learn them from the person standing next to the griddle.',
        cite: 'Our head chef',
      },
      { type: 'h2', text: 'The dishes we grew up on' },
      {
        type: 'p',
        text: 'These are the plates that come back to us — the ones worth crossing a city for. Each one carries a place and a memory.',
      },
      {
        type: 'list',
        items: [
          'Kottu roti — shredded godamba roti tossed with egg, vegetables and spice.',
          'Egg hoppers — bowl-shaped fermented pancakes with a soft yolk centre.',
          'Isso vadai — crispy lentil fritters crowned with whole prawns.',
          'Pol sambol — fresh coconut, chilli and lime, on everything.',
        ],
      },
      {
        type: 'p',
        text: 'When we opened The Coconut Island, we did not want to reinterpret these dishes. We wanted to serve them the way we remember them — honest, unfussy and full of heat.',
      },
    ],
  },
  {
    slug: 'inside-a-coconut-sambol',
    title: 'Inside a Perfect Coconut Sambol',
    excerpt:
      'Three ingredients, one island staple. Why pol sambol is harder to get right than it looks.',
    category: 'Recipes',
    author: 'The Coconut Island Kitchen',
    date: '2026-06-14',
    readingTime: 4,
    cover:
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200',
    body: [
      {
        type: 'p',
        text: 'Pol sambol sits on nearly every Sri Lankan table, yet it defeats most first attempts. The difference between good and forgettable comes down to the coconut.',
      },
      {
        type: 'image',
        src: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=1400',
        caption: 'Fresh coconut — the base of everything.',
        wide: true,
      },
      { type: 'h2', text: 'Freshly grated, always' },
      {
        type: 'p',
        text: 'Desiccated coconut will not do. You want the moisture of a freshly cracked nut so the sambol stays loose and bright rather than dry and dusty.',
      },
      {
        type: 'list',
        items: [
          'Fresh grated coconut — the base and the body.',
          'Red chilli — heat, but also colour.',
          'Lime and salt — the lift that ties it together.',
          'A touch of Maldive fish for depth (optional).',
        ],
      },
      {
        type: 'gallery',
        images: [
          {
            src: 'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=800',
            caption: 'Chilli, for heat and colour.',
          },
          {
            src: 'https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg?auto=compress&cs=tinysrgb&w=800',
            caption: 'Lime — the lift that ties it together.',
          },
        ],
      },
      {
        type: 'quote',
        text: 'Balance is everything. Too much lime and it is sour; too little and it falls flat.',
      },
      {
        type: 'p',
        text: 'Serve it with hoppers, string hoppers, or simply spooned over rice. It should taste like the island — sharp, warm and alive.',
      },
    ],
  },
  {
    slug: 'building-the-island-in-brighton',
    title: 'Building the Island in Brighton',
    excerpt:
      'How a seaside unit became a slice of Sri Lanka — the story behind our first home.',
    category: 'Behind the Scenes',
    author: 'The Coconut Island Team',
    date: '2026-05-30',
    readingTime: 5,
    cover:
      'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=1200',
    body: [
      {
        type: 'p',
        text: 'Brighton already had the sea. What it did not have was the particular warmth of a Sri Lankan kitchen — so we set out to build one, plate by plate and wall by wall.',
      },
      { type: 'h2', text: 'From empty shell to island vibes' },
      {
        type: 'p',
        text: 'We wanted the room to feel like a home you were invited into, not a restaurant you booked. Warm light, hand-painted details and a soundtrack that leans tropical rather than polite.',
      },
      {
        type: 'gallery',
        images: [
          {
            src: 'https://images.pexels.com/photos/1449773/pexels-photo-1449773.jpeg?auto=compress&cs=tinysrgb&w=800',
            caption: 'Warm light, low and golden.',
          },
          {
            src: 'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=800',
            caption: 'Tables set before the doors open.',
          },
        ],
      },
      {
        type: 'quote',
        text: 'The goal was simple: you walk in, and for the length of a meal you are somewhere else.',
      },
      {
        type: 'p',
        text: 'Every detail was argued over — the colour of the walls, the weight of the cutlery, the plants overhead. None of it accidental.',
      },
      {
        type: 'image',
        src: 'https://images.pexels.com/photos/1024248/pexels-photo-1024248.jpeg?auto=compress&cs=tinysrgb&w=1400',
        caption: 'The finished room, mid-service.',
        wide: true,
      },
      {
        type: 'p',
        text: 'Two years on, that first Brighton room is still where it started — and it taught us everything we carried into Angel, London.',
      },
    ],
  },
  {
    slug: 'tropical-cocktails-that-tell-a-story',
    title: 'Tropical Cocktails That Tell a Story',
    excerpt:
      'Arrack, king coconut and fresh lime — the island in a glass, and how we build our menu.',
    category: 'Behind the Scenes',
    author: 'The Coconut Island Bar',
    date: '2026-05-12',
    readingTime: 4,
    cover:
      'https://images.pexels.com/photos/1170599/pexels-photo-1170599.jpeg?auto=compress&cs=tinysrgb&w=1200',
    body: [
      {
        type: 'p',
        text: 'Every cocktail on our list starts with a Sri Lankan ingredient and works outward. Arrack, the island distilled spirit, is our anchor.',
      },
      {
        type: 'image',
        src: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=1400',
        caption: 'Tropical, but never a gimmick.',
        wide: true,
      },
      { type: 'h2', text: 'Rooted in the island' },
      {
        type: 'p',
        text: 'We build outward from three things — the spirit, the water and the aromatics. Get those right and the drink almost makes itself.',
      },
      {
        type: 'list',
        items: [
          'Arrack — coconut-flower spirit, the backbone of the bar.',
          'King coconut water — sweet, hydrating, unmistakably tropical.',
          'Fresh lime and pandan for aroma and edge.',
        ],
      },
      {
        type: 'gallery',
        images: [
          {
            src: 'https://images.pexels.com/photos/1189261/pexels-photo-1189261.jpeg?auto=compress&cs=tinysrgb&w=800',
            caption: 'Fresh lime, pressed to order.',
          },
          {
            src: 'https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg?auto=compress&cs=tinysrgb&w=800',
            caption: 'Built for the golden hour.',
          },
        ],
      },
      {
        type: 'p',
        text: 'We would rather serve three drinks that mean something than thirty that do not. Each one should taste like a place, not just an ingredient list.',
      },
    ],
  },
];

/** Newest first — the order the listing and post navigation use. */
export const SORTED_POSTS = [...BLOG_POSTS].sort(
  (a, b) => +new Date(b.date) - +new Date(a.date),
);

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

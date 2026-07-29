/* Central place for all off-site social + review links and the platform stats
   shown on the site. One edit here updates the Reviews section AND the Footer.
   Swap the placeholder URLs / numbers for the real ones — nothing else to touch. */

export const SOCIAL = {
  instagram: 'https://www.instagram.com/thecoconutisland/',
  facebook: 'https://www.facebook.com/thecoconutisland',
  tripadvisor: 'https://www.tripadvisor.com/', // TODO: paste real listing URL
  google: 'https://www.google.com/maps',       // TODO: paste real Google Business URL
} as const;

/** The two review platforms we show scores for. Numbers must match the live
    listing — `href` sends the visitor there so anything claimed is checkable.
    `rating` is numeric so the star row can render halves accurately. */
export type Platform = 'google' | 'tripadvisor';

export const PLATFORMS: Record<
  Platform,
  { name: string; rating: number; outOf: number; count: string; href: string }
> = {
  google: {
    name: 'Google',
    rating: 4.7,
    outOf: 5,
    count: '900+ reviews',
    href: SOCIAL.google,
  },
  tripadvisor: {
    name: 'Tripadvisor',
    rating: 4.5,
    outOf: 5,
    count: '350+ reviews',
    href: SOCIAL.tripadvisor,
  },
};

/** Aggregate shown as the headline score — weighted across both platforms. */
export const AGGREGATE = {
  rating: 4.6,
  outOf: 5,
  count: '1,250+',
} as const;

/** Real guest reviews — paste genuine quotes from Google / Tripadvisor here.
    Keep them short (two or three lines reads best on the cards).
    `date` is display text exactly as the platform shows it ("2 weeks ago",
    "March 2026"). `rating` is that reviewer's own star count. */
export type Review = {
  quote: string;
  author: string;
  platform: Platform;
  rating: number;
  date: string;
  /** Google/Tripadvisor "Local Guide", "Contributed 40 reviews", etc. */
  credential?: string;
};

export const REVIEWS: Review[] = [
  {
    quote:
      'PASTE A REAL REVIEW HERE — the kottu was the best I have had outside Sri Lanka.',
    author: 'Guest name',
    platform: 'google',
    rating: 5,
    date: '2 weeks ago',
    credential: 'Local Guide · 42 reviews',
  },
  {
    quote:
      'PASTE A REAL REVIEW HERE — vibrant room, incredible cocktails, staff full of warmth.',
    author: 'Guest name',
    platform: 'tripadvisor',
    rating: 5,
    date: 'March 2026',
    credential: 'Reviewed 18 restaurants',
  },
  {
    quote:
      'PASTE A REAL REVIEW HERE — felt like a little slice of Sri Lanka in London.',
    author: 'Guest name',
    platform: 'google',
    rating: 4,
    date: 'a month ago',
    credential: '7 reviews',
  },
];

/** Instagram teaser strip — drop 4–6 square post images into
    /public/images/social/ and list them here (or leave empty to hide). */
export const INSTA_POSTS: string[] = [
  // '/images/social/post-1.jpg',
  // '/images/social/post-2.jpg',
  // '/images/social/post-3.jpg',
  // '/images/social/post-4.jpg',
];

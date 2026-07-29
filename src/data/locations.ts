/** Branch data for the two Coconut Island restaurants. */

export type LocationSlug = 'brighton' | 'london';

/** The three menu types. Cocktails share the same drinks across branches but
    carry different prices, so — like the food menus — each branch ships its
    own image set. Every menu is a set of attached photos (a menu can span
    several pages, hence an array). */
export type MenuKind = 'cuisine' | 'lunch' | 'cocktails';

export interface MenuTab {
  kind: MenuKind;
  /** Tab label — "Sri Lankan Cuisine", "Lunch", "Cocktails" */
  label: string;
  /** Optional one-line note under the tab (e.g. serving times) */
  note?: string;
  /** Menu page images in order. Drop files in /public/images/menus/. */
  images: string[];
}

export interface IslandLocation {
  slug: LocationSlug;
  /** Display name — "Brighton", "Angel, London" */
  name: string;
  /** Short neighbourhood line shown under the name */
  area: string;
  addressLines: string[];
  phone: string;
  phoneHref: string;
  email: string;
  openTableUrl: string;
  mapsUrl: string;
  /** Real-world coordinates — source of truth for the ghost map in FindYourIsland
      (projected offline by scripts/gen-uk-outline.mjs into src/data/ukOutline.ts). */
  coords: { lat: number; lng: number };
  hours: { days: string; time: string }[];
  image: string;
  tagline: string;
  blurb: string;
  /** ~150-char meta description for the location page */
  metaDescription: string;
  /** The three menus shown on this branch's page — all image-based. */
  menus: MenuTab[];
}

export const LOCATIONS: Record<LocationSlug, IslandLocation> = {
  brighton: {
    slug: 'brighton',
    name: 'Brighton',
    area: 'Western Road',
    addressLines: ['103 Western Road', 'Brighton BN1 2AA'],
    phone: '01273 009488',
    phoneHref: 'tel:+441273009488',
    email: 'hello@thecoconutisland.com',
    openTableUrl:
      'https://www.opentable.co.uk/r/the-coconut-island-reservations-brighton?restref=381978',
    mapsUrl:
      'https://maps.google.com/?q=The+Coconut+Island,+103+Western+Road,+Brighton+BN1+2AA',
    coords: { lat: 50.822, lng: -0.145 },
    hours: [
      { days: 'Tue — Sun', time: '12pm – 12am' },
      { days: 'Monday', time: 'Closed' },
    ],
    image: '/images/brighton.jpg',
    tagline: 'Where it all began',
    blurb:
      'Our original home by the sea — Sri Lankan street food, tropical cocktails and island energy in the heart of Brighton.',
    metaDescription:
      'Sri Lankan street food, tropical cocktails & island vibes at 103 Western Road, Brighton. Open Tue–Sun from 12pm — book your table at The Coconut Island.',
    menus: [
      {
        kind: 'cuisine',
        label: 'Sri Lankan Cuisine',
        note: 'Our full à la carte — hoppers, kothu & devilled everything',
        images: ['/images/menus/brighton-cuisine.jpg'],
      },
      {
        kind: 'lunch',
        label: 'Lunch',
        note: 'Served Tue–Sun, 12pm–4pm',
        images: ['/images/menus/brighton-lunch.jpg'],
      },
      {
        kind: 'cocktails',
        label: 'Cocktails',
        note: 'Rum-soaked, coconut-kissed island pours',
        images: ['/images/menus/brighton-cocktails.jpg'],
      },
    ],
  },
  london: {
    slug: 'london',
    name: 'Angel, London',
    area: 'Islington',
    addressLines: ['9 White Lion Street', 'London N1 9PD'],
    phone: '020 4618 3901',
    phoneHref: 'tel:+442046183901',
    email: 'angel@thecoconutisland.com',
    openTableUrl:
      'https://www.opentable.co.uk/r/coconut-island-angel-reservations-london?restref=484455',
    mapsUrl:
      'https://maps.google.com/?q=The+Coconut+Island,+9+White+Lion+Street,+London+N1+9PD',
    coords: { lat: 51.533, lng: -0.106 },
    hours: [{ days: 'Mon — Sun', time: '12pm – 11pm' }],
    image: '/images/angel.jpg',
    tagline: 'The island comes to the city',
    blurb:
      'Two minutes from Angel station — the same sun-drenched Sri Lankan spirit, now bringing island nights to Islington.',
    metaDescription:
      'Sri Lankan street food & tropical cocktails two minutes from Angel station — 9 White Lion Street, Islington. Open 7 days from 12pm. Book your table.',
    menus: [
      {
        kind: 'cuisine',
        label: 'Sri Lankan Cuisine',
        note: 'Our full à la carte — hoppers, kothu & devilled everything',
        images: ['/images/menus/london-cuisine.jpg'],
      },
      {
        kind: 'lunch',
        label: 'Lunch',
        note: 'Served Mon–Sun, 12pm–4pm',
        images: ['/images/menus/london-lunch.jpg'],
      },
      {
        kind: 'cocktails',
        label: 'Cocktails',
        note: 'Rum-soaked, coconut-kissed island pours',
        images: ['/images/menus/london-cocktails.jpg'],
      },
    ],
  },
};

export const LOCATION_LIST: IslandLocation[] = [LOCATIONS.brighton, LOCATIONS.london];

import { Badge } from './Primitives';

/* ---------------- OUR MENU ---------------- */

const MENU_SECTIONS = [
  {
    name: 'Street Food',
    items: [
      { name: 'Beef Kothu', desc: 'chopped godhamba roti, spices, egg', price: '14' },
      { name: 'Angry Bird', desc: 'devilled fried chicken, chilli glaze', price: '13' },
      { name: 'Mutton Rolls', desc: 'crispy Sri Lankan pancake rolls', price: '8' },
    ],
  },
  {
    name: 'Island Classics',
    items: [
      { name: 'Rice & Curry', desc: 'daily curries, sambol, papadam', price: '15' },
      { name: 'Chicken Devil', desc: 'wok-tossed, peppers, fiery sauce', price: '16' },
      { name: 'String Hoppers', desc: 'kiri hodi, pol sambol', price: '13' },
    ],
  },
  {
    name: 'Sweet',
    items: [
      { name: 'Watalappan', desc: 'jaggery & coconut custard', price: '7' },
      { name: 'Pani Pol Pancakes', desc: 'coconut, kithul treacle', price: '7' },
      { name: 'Faluda', desc: 'rose, ice cream, basil seeds', price: '8' },
    ],
  },
];

function MenuCard() {
  return (
    <div
      className="paper-grain relative bg-white p-7 shadow-2xl ring-1 ring-navy-500/10 sm:p-10 lg:-rotate-1"
      data-reveal="left"
    >
      <div className="absolute -left-3 -top-3" data-reveal="tilt" data-delay="200">
        <Badge tone="orange" rotate={-12}>Spicy!</Badge>
      </div>

      <div className="flex items-end justify-between border-b border-navy-500/15 pb-4">
        <div>
          <p className="font-sans text-[10px] uppercase tracking-widest2 text-navy-500/45">The Menu</p>
          <h3 className="mt-1 font-display text-3xl font-bold tracking-tight text-navy-500 sm:text-4xl">
            Our Menu
          </h3>
        </div>
        <span className="font-serif text-sm italic text-navy-500/50">Menu of the day</span>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2" data-stagger>
        {MENU_SECTIONS.map((section) => (
          <div key={section.name}>
            <h4 className="mb-4 flex items-center gap-3 font-display text-lg font-semibold uppercase tracking-wider text-navy-500">
              <span className="h-px flex-1 bg-navy-200" />
              {section.name}
              <span className="h-px flex-1 bg-navy-200" />
            </h4>
            <ul className="space-y-4">
              {section.items.map((item) => (
                <li key={item.name} className="group">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-serif text-lg font-medium text-navy-500 transition-colors group-hover:text-orange-500">
                      {item.name}
                    </span>
                    <span className="flex-1 translate-y-[-3px] border-b border-dotted border-navy-500/25" />
                    <span className="font-display text-lg font-bold text-navy-500">£{item.price}</span>
                  </div>
                  <p className="mt-0.5 font-sans text-[12px] italic text-navy-500/55">{item.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Third cell — polaroid image */}
        <div className="hidden sm:block">
          <div className="polaroid rotate-3" data-reveal="scale" data-delay="300">
            <img
              src="https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Sri Lankan kothu dish"
              className="h-44 w-full object-cover"
              loading="lazy"
            />
            <p className="mt-3 text-center font-serif text-sm italic text-navy-500/70">
              Kothu — made fresh daily
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-navy-500/15 pt-5">
        <p className="font-sans text-[11px] text-navy-500/50">
          Menu subject to change · Fresh daily · Lunch specials from £15
        </p>
        <a
          href="#reserver"
          className="font-sans text-[11px] font-bold uppercase tracking-widest2 text-orange-500 underline decoration-orange-200 decoration-2 underline-offset-4 transition-colors hover:text-orange-600"
        >
          View full menu →
        </a>
      </div>
    </div>
  );
}

/* ---------------- OUR EVENTS ---------------- */

const ACTIVITIES = [
  {
    title: 'Afterwork',
    time: 'Thursday · 6pm–9pm',
    desc: 'Tropical cocktails & short eats to share, live music atmosphere.',
    img: 'https://thecoconutisland.com/wp-content/uploads/the-coconut-island-food-4.jpg',
    rotate: -2,
  },
  {
    title: 'Sunday Brunch',
    time: 'Sun · 11am–2:30pm',
    desc: 'Egg hoppers, string hoppers & sambols — island brunch done right.',
    img: 'https://images.pexels.com/photos/302468/pexels-photo-302468.jpeg?auto=compress&cs=tinysrgb&w=600',
    rotate: 2,
  },
  {
    title: 'Tasting Evening',
    time: '1st Friday of the month',
    desc: 'Sharing feast of curries paired with signature cocktails.',
    img: 'https://images.pexels.com/photos/140831/pexels-photo-140831.jpeg?auto=compress&cs=tinysrgb&w=600',
    rotate: -1,
  },
];

function ActivitiesCard() {
  return (
    <div className="relative">
      <div className="mb-6 flex items-end justify-between" data-reveal="right">
        <div>
          <p className="font-sans text-[10px] uppercase tracking-widest2 text-white/60">On the Program</p>
          <h3 className="mt-1 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Our Events
          </h3>
        </div>
        <Badge tone="navy" rotate={6}>Agenda</Badge>
      </div>

      <div className="space-y-5" data-stagger>
        {ACTIVITIES.map((a) => (
          <article
            key={a.title}
            className="group grid grid-cols-1 gap-0 overflow-hidden bg-white shadow-2xl ring-1 ring-navy-500/10 transition-transform duration-300 hover:rotate-0 sm:grid-cols-5"
            style={{ transform: `rotate(${a.rotate}deg)` }}
          >
            <div className="relative h-44 overflow-hidden sm:col-span-2 sm:h-auto">
              <img
                src={a.img}
                alt={a.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 to-transparent" />
            </div>
            <div className="p-6 sm:col-span-3 sm:p-7">
              <p className="font-sans text-[10px] uppercase tracking-widest2 text-orange-500">{a.time}</p>
              <h4 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-navy-500">
                {a.title}
              </h4>
              <p className="mt-2 font-serif text-base italic leading-relaxed text-navy-500/70">
                {a.desc}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-widest2 text-orange-500">
                Book
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ---------------- SPLIT SECTION ---------------- */

export function SplitSections() {
  return (
    /*
      Negative top margin slides this section UP behind the hero image bottom,
      so the image appears to bleed into the section — matching the reference.
      The z-index is lower so the image (z-10 inside hero) sits on top visually.
    */
    <section
      id="carte"
      className="relative bg-orange-500 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/orange.png')" }}
    >
      <div id="activites" className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-28">
        {/* No section header — "Island on a plate" directly above already sets
            the scene; the orange band opens straight onto the two cards. */}
        {/* Split grid — OUR MENU vs OUR EVENTS */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          <div id="carte-card">
            <MenuCard />
          </div>
          <div id="activites-card">
            <ActivitiesCard />
          </div>
        </div>
      </div>
    </section>
  );
}

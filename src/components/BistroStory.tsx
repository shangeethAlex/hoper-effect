import { Badge } from './Primitives';

export function BistroStory() {
  return (
    <section id="bistro" className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        {/* Scrapbook image cluster */}
        <div className="relative h-[440px] sm:h-[520px]" data-reveal="right">
          {/* Back polaroid */}
          <div className="polaroid absolute left-0 top-6 -rotate-6 sm:left-6" data-reveal="scale" data-delay="100">
            <img
              src="https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="The Coconut Island dining room"
              className="h-52 w-56 object-cover sm:h-64 sm:w-64"
              loading="lazy"
            />
            <p className="mt-3 text-center font-serif text-sm italic text-navy-500/70">The dining room</p>
          </div>

          {/* Front polaroid */}
          <div className="polaroid absolute bottom-0 right-0 rotate-3 sm:right-6" data-reveal="scale" data-delay="300">
            <img
              src="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Sri Lankan dish"
              className="h-56 w-60 object-cover sm:h-72 sm:w-72"
              loading="lazy"
            />
            <p className="mt-3 text-center font-serif text-sm italic text-navy-500/70">Made from scratch</p>
          </div>

          {/* Stamp badge */}
          <div className="absolute -right-2 top-0 z-10" data-reveal="tilt" data-delay="500">
            <Badge tone="yellow" rotate={14}>★ Since 2023</Badge>
          </div>
        </div>

        {/* Text */}
        <div data-reveal="left">
          <p className="font-sans text-[11px] uppercase tracking-widest2 text-orange-500">Our Story</p>
          <h2 className="mt-3 font-display text-4xl font-bold leading-[1.02] tracking-tightest text-navy-500 sm:text-5xl">
            A Sri Lankan
            <span className="block font-serif italic font-medium text-orange-500">home</span>
          </h2>
          <div className="mt-6 space-y-4 font-serif text-lg leading-relaxed text-navy-500/75">
            <p>
              The Coconut Island was born from a simple desire: to bring the flavours of Sri Lanka
              to one table, in a warm setting where you feel at home right away.
            </p>
            <p>
              Home-style recipes, fresh-ground spices, tropical cocktails — every detail
              matters to bring the spirit of the island to life.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-8 border-t border-navy-500/15 pt-6" data-stagger>
            <div>
              <p className="font-display text-3xl font-bold text-navy-500" data-count="2023">0</p>
              <p className="font-sans text-[10px] uppercase tracking-widest2 text-navy-500/50">Opened</p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-navy-500" data-count="48">0</p>
              <p className="font-sans text-[10px] uppercase tracking-widest2 text-navy-500/50">Seats</p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-navy-500" data-count="100" data-suffix="%">0</p>
              <p className="font-sans text-[10px] uppercase tracking-widest2 text-navy-500/50">Homemade</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

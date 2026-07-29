import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Badge } from './Primitives';
import { SORTED_POSTS, formatDate } from '../data/blog';

/**
 * Home-page journal section — the latest three posts pinned to the white wall
 * like clippings. Internal links here feed SEO; the full archive lives at /blog.
 */
export function JournalTeaser() {
  const posts = SORTED_POSTS.slice(0, 3);
  const tilts = ['-rotate-1', 'rotate-[0.6deg]', 'rotate-1'];

  return (
    <section id="journal" className="paper-grain relative overflow-hidden bg-white py-12 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6"
          data-reveal="up"
        >
          <div className="max-w-xl">
            <Badge tone="navy" rotate={-5}>The Journal</Badge>
            <h2 className="mt-3 font-display text-3xl font-bold leading-[1.02] tracking-tightest text-navy-500 sm:mt-5 sm:text-5xl">
              Stories from
              <span className="block font-serif italic font-medium text-orange-500">the island</span>
            </h2>
            <p className="mt-2.5 font-serif text-base italic text-navy-500/65 sm:mt-4 sm:text-lg">
              Recipes, culture and the people behind the griddle.
            </p>
          </div>
          <Link
            to="/blog"
            className="group inline-flex items-center gap-2 self-start font-sans text-[12px] font-bold uppercase tracking-widest2 text-navy-500 transition-colors hover:text-orange-500 sm:self-auto"
          >
            <span>Read all stories</span>
            <ArrowRight className="h-4 w-4 text-orange-500 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div
          className="mt-6 flex snap-x snap-mandatory scroll-px-1 gap-4 overflow-x-auto px-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-12 sm:gap-5 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 md:pb-0"
          data-stagger
        >
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className={`group paper-grain flex w-[80vw] max-w-[320px] shrink-0 snap-start flex-col bg-white p-3 pb-4 shadow-xl sm:p-4 sm:pb-6 ring-1 ring-navy-500/10 transition-transform duration-200 hover:-translate-y-2 hover:rotate-0 md:w-auto md:max-w-none md:shrink ${tilts[i]}`}
            >
              <div className="relative overflow-hidden">
                <img
                  src={post.cover}
                  alt={post.title}
                  className="h-40 w-full object-cover sm:h-52 transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="mt-3.5 flex items-center gap-3 font-sans sm:mt-5 text-[11px] uppercase tracking-widest2 text-orange-500">
                <span>{post.category}</span>
                <span className="h-1 w-1 rounded-full bg-navy-500/30" />
                <span className="text-navy-500/50">{post.readingTime} min</span>
              </div>
              <h3 className="mt-2 font-display text-xl font-bold leading-snug tracking-tight text-navy-500 transition-colors group-hover:text-orange-500 sm:mt-3 sm:text-2xl">
                {post.title}
              </h3>
              <p className="mt-2 flex-1 font-serif text-sm italic leading-relaxed text-navy-500/65 sm:mt-3 sm:text-base">
                {post.excerpt}
              </p>
              <p className="mt-3 font-sans text-[11px] sm:mt-4 uppercase tracking-widest2 text-navy-500/40">
                {formatDate(post.date)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

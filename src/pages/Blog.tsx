import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Badge } from '../components/Primitives';
import { NewsletterBand } from '../components/Newsletter';
import { SORTED_POSTS, formatDate, type BlogPost } from '../data/blog';
import { useScrollAnimations } from '../hooks/useScrollAnimations';
import { useSeo, SITE_URL } from '../hooks/useSeo';

const CATEGORIES = ['All', 'Culture', 'Recipes', 'Behind the Scenes', 'Events'] as const;

export function Blog() {
  useScrollAnimations();
  useSeo({
    title: 'Journal | The Coconut Island',
    description:
      'Stories from the island — Sri Lankan street food, recipes, cocktails and the people behind The Coconut Island in Brighton and Angel, London.',
    path: '/blog',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      '@id': `${SITE_URL}/blog#blog`,
      name: 'The Coconut Island Journal',
      url: `${SITE_URL}/blog`,
      inLanguage: 'en-GB',
      publisher: { '@id': `${SITE_URL}/#org` },
      blogPost: SORTED_POSTS.map((p) => ({
        '@type': 'BlogPosting',
        headline: p.title,
        url: `${SITE_URL}/blog/${p.slug}`,
        datePublished: p.date,
      })),
    },
  });

  const [active, setActive] = useState<(typeof CATEGORIES)[number]>('All');

  const [featured, ...rest] = SORTED_POSTS;
  const filtered = useMemo(
    () => (active === 'All' ? rest : rest.filter((p) => p.category === active)),
    [active, rest],
  );

  return (
    <div className="min-h-screen bg-white text-navy-500">
      <Header />
      <main>
        {/* Hero — navy wainscot band, same language as the home sections */}
        <section className="relative overflow-hidden bg-navy-700 pt-36 pb-20 text-white sm:pt-44 sm:pb-28">
          <div className="grain absolute inset-0 opacity-30" />
          <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
            <Badge tone="yellow" rotate={-6}>The Journal</Badge>
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-bold leading-[1.02] tracking-tightest sm:text-7xl">
              Stories from
              <span className="block font-serif italic font-medium text-orange-400">the island</span>
            </h1>
            <p className="mt-6 max-w-xl font-serif text-lg italic leading-relaxed text-white/70">
              Recipes, culture and the people behind the griddle. A little of Sri Lanka,
              wherever you are reading this.
            </p>
            <p className="mt-6 inline-block rotate-[-2deg] font-['Permanent_Marker'] text-lg text-yellow-400">
              fresh from the pass, weekly-ish
            </p>
          </div>
        </section>

        {/* Featured post */}
        <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20">
          <Link
            to={`/blog/${featured.slug}`}
            className="group grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14"
            data-reveal="up"
          >
            <div className="paper-grain relative -rotate-1 bg-white p-3 shadow-xl ring-1 ring-navy-500/10 transition-transform duration-200 group-hover:rotate-0">
              <div className="relative overflow-hidden">
                <img
                  src={featured.cover}
                  alt={featured.title}
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-[420px]"
                  loading="lazy"
                />
              </div>
              <span className="absolute -left-3 top-4">
                <Badge tone="yellow" rotate={-8}>Featured</Badge>
              </span>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3 font-sans text-[11px] uppercase tracking-widest2 text-orange-500">
                <span>{featured.category}</span>
                <span className="h-1 w-1 rounded-full bg-navy-500/30" />
                <span className="text-navy-500/50">{featured.readingTime} min read</span>
              </div>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tightest text-navy-500 sm:text-5xl">
                {featured.title}
              </h2>
              <p className="mt-5 font-serif text-lg leading-relaxed text-navy-500/70">
                {featured.excerpt}
              </p>
              <div className="mt-7 flex items-center gap-2 font-sans text-sm font-semibold text-navy-500">
                <span className="transition-transform duration-200 group-hover:translate-x-1">Read the story</span>
                <ArrowRight className="h-4 w-4 text-orange-500 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </section>

        {/* Filters + grid */}
        <section className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-8">
          <div className="flex flex-wrap gap-2 border-t border-navy-500/10 pt-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`rounded-full px-5 py-2.5 font-sans text-[12px] font-bold uppercase tracking-widest2 transition-colors ${
                  active === cat
                    ? 'bg-navy-500 text-white'
                    : 'bg-navy-50 text-navy-500/60 hover:bg-navy-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="mt-16 text-center font-serif text-lg italic text-navy-500/50">
              No stories here yet — check back soon.
            </p>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </section>

        <NewsletterBand />
      </main>
      <Footer />
    </div>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group flex flex-col" data-reveal="up">
      <div className="paper-grain bg-white p-2.5 shadow-lg ring-1 ring-navy-500/10 transition-transform duration-200 group-hover:-translate-y-1.5">
        <div className="relative overflow-hidden">
          <img
            src={post.cover}
            alt={post.title}
            className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </div>
      <div className="mt-5 flex items-center gap-3 font-sans text-[11px] uppercase tracking-widest2 text-orange-500">
        <span>{post.category}</span>
        <span className="h-1 w-1 rounded-full bg-navy-500/30" />
        <span className="text-navy-500/50">{post.readingTime} min</span>
      </div>
      <h3 className="mt-3 font-display text-2xl font-bold leading-snug tracking-tight text-navy-500 transition-colors group-hover:text-orange-500">
        {post.title}
      </h3>
      <p className="mt-3 font-serif text-base leading-relaxed text-navy-500/65">{post.excerpt}</p>
      <p className="mt-4 font-sans text-[11px] uppercase tracking-widest2 text-navy-500/40">
        {formatDate(post.date)}
      </p>
    </Link>
  );
}

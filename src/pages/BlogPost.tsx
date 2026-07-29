import { useEffect, useState, type ReactNode } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { NewsletterBand } from '../components/Newsletter';
import { getPost, SORTED_POSTS, formatDate, type BlogBlock } from '../data/blog';
import { useSeo, SITE_URL } from '../hooks/useSeo';

export function BlogPost() {
  const { slug = '' } = useParams();
  const post = getPost(slug);

  useSeo({
    title: post ? `${post.title} | The Coconut Island` : 'The Coconut Island',
    description: post?.excerpt ?? '',
    path: `/blog/${slug}`,
    image: post?.cover,
    type: 'article',
    jsonLd: post && {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          image: post.cover,
          datePublished: post.date,
          dateModified: post.date,
          inLanguage: 'en-GB',
          author: { '@type': 'Organization', name: post.author },
          publisher: { '@id': `${SITE_URL}/#org` },
          mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Journal', item: `${SITE_URL}/blog` },
            { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
          ],
        },
      ],
    },
  });

  if (!post) return <Navigate to="/blog" replace />;

  const idx = SORTED_POSTS.findIndex((p) => p.slug === post.slug);
  const next = SORTED_POSTS[(idx + 1) % SORTED_POSTS.length];

  // First paragraph gets the drop cap.
  const leadBlock = post.body.find((b) => b.type === 'p');
  const sections = buildSections(post.body);

  return (
    <div className="min-h-screen bg-white text-navy-500">
      <ReadingProgress />
      <Header />
      <main>
        <article>
          {/* ── Editorial masthead ── */}
          <header className="mx-auto max-w-[720px] px-5 pt-32 text-center sm:px-8 sm:pt-36">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 font-sans text-[12px] font-bold uppercase tracking-widest2 text-navy-500/45 transition-colors hover:text-orange-500"
            >
              <ArrowLeft className="h-4 w-4" />
              The Journal
            </Link>

            <p className="mt-8 font-sans text-[11px] uppercase tracking-widest2 text-orange-500">
              {post.category}
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.04] tracking-tightest text-navy-500 sm:text-6xl">
              {post.title}
            </h1>
            <p className="mx-auto mt-6 max-w-xl font-serif text-xl italic leading-relaxed text-navy-500/65 sm:text-2xl">
              {post.excerpt}
            </p>

            {/* Byline */}
            <div className="mt-9 flex items-center justify-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-500 font-display text-sm font-bold text-white">
                {initials(post.author)}
              </span>
              <div className="text-left">
                <p className="font-sans text-sm font-semibold text-navy-500">{post.author}</p>
                <p className="font-sans text-[11px] uppercase tracking-widest2 text-navy-500/45">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span className="mx-2">·</span>
                  {post.readingTime} min read
                </p>
              </div>
            </div>
          </header>

          {/* ── Cover ── */}
          <figure className="mx-auto mt-9 max-w-5xl px-5 sm:mt-12 sm:px-8">
            <div className="paper-grain bg-white p-3 shadow-xl ring-1 ring-navy-500/10 sm:p-4">
              <img
                src={post.cover}
                alt={post.title}
                className="h-64 w-full object-cover sm:h-[460px]"
              />
            </div>
          </figure>

          {/* ── Body ── */}
          <div className="mx-auto max-w-[1120px] px-5 py-12 sm:px-8 sm:py-16">
            {sections.map((sec, i) =>
              sec.kind === 'intro' ? (
                <div key={i} className="mx-auto max-w-[720px]">
                  {sec.text.map((b, j) => (
                    <Block key={j} block={b} isLead={b === leadBlock} />
                  ))}
                </div>
              ) : sec.kind === 'quote' ? (
                <div key={i} className="mx-auto my-4 max-w-[820px]">
                  <Block block={sec.block} />
                </div>
              ) : (
                <Section key={i} text={sec.text} media={sec.media} flip={sec.index % 2 === 1} />
              ),
            )}

            {/* Tags + share */}
            <div className="mx-auto mt-16 flex max-w-[820px] flex-col gap-6 border-t border-navy-500/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-navy-50 px-4 py-1.5 font-sans text-[11px] font-bold uppercase tracking-widest2 text-navy-500/60">
                  {post.category}
                </span>
                <span className="rounded-full bg-navy-50 px-4 py-1.5 font-sans text-[11px] font-bold uppercase tracking-widest2 text-navy-500/60">
                  Sri Lanka
                </span>
              </div>
              <ShareRow title={post.title} slug={post.slug} />
            </div>
          </div>
        </article>

        {/* ── Author card ── */}
        <section className="mx-auto max-w-[680px] px-5 pb-16 sm:px-8">
          <div className="paper-grain flex items-start gap-5 bg-navy-50 p-7 ring-1 ring-navy-500/10 sm:p-8">
            <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-navy-500 font-display text-base font-bold text-white">
              {initials(post.author)}
            </span>
            <div>
              <p className="font-sans text-[11px] uppercase tracking-widest2 text-orange-500">Written by</p>
              <p className="mt-1 font-display text-xl font-bold text-navy-500">{post.author}</p>
              <p className="mt-2 font-serif text-base leading-relaxed text-navy-500/70">
                Notes from the pass, the bar and the dining room at The Coconut Island —
                Sri Lankan street food in Brighton and Angel, London.
              </p>
            </div>
          </div>
        </section>

        {/* ── Next post ── */}
        <section className="border-t border-navy-500/10 bg-navy-50">
          <Link
            to={`/blog/${next.slug}`}
            className="group mx-auto flex max-w-[1400px] flex-col gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:flex-row lg:items-center"
          >
            <div className="paper-grain -rotate-1 bg-white p-3 shadow-xl ring-1 ring-navy-500/10 transition-transform duration-200 group-hover:rotate-0 lg:w-1/2">
              <div className="relative overflow-hidden">
                <img
                  src={next.cover}
                  alt={next.title}
                  className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-72"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="lg:w-1/2">
              <p className="font-sans text-[11px] uppercase tracking-widest2 text-orange-500">Read next</p>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tightest text-navy-500 sm:text-4xl">
                {next.title}
              </h2>
              <p className="mt-4 font-serif text-lg leading-relaxed text-navy-500/70">{next.excerpt}</p>
              <div className="mt-6 flex items-center gap-2 font-sans text-sm font-semibold text-navy-500">
                <span className="transition-transform duration-200 group-hover:translate-x-1">Continue reading</span>
                <ArrowRight className="h-4 w-4 text-orange-500 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </section>

        <NewsletterBand />
      </main>
      <Footer />
    </div>
  );
}

/** Thin orange bar that fills as the reader scrolls the article. */
function ReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setPct(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed inset-x-0 top-0 z-[70] h-1 bg-transparent">
      <div className="h-full bg-orange-500 transition-[width] duration-150" style={{ width: `${pct}%` }} />
    </div>
  );
}

function ShareRow({ title, slug }: { title: string; slug: string }) {
  const url = `${SITE_URL}/blog/${slug}`;
  const links = [
    { label: 'X', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
  ];
  return (
    <div className="flex items-center gap-3">
      <span className="font-sans text-[11px] uppercase tracking-widest2 text-navy-500/40">Share</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-[11px] font-bold uppercase tracking-widest2 text-navy-500/70 transition-colors hover:text-orange-500"
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

/** Groups the flat block list into an intro, alternating image+text sections,
 *  and full-width quote bands. */
type Segment =
  | { kind: 'intro'; text: BlogBlock[] }
  | { kind: 'quote'; block: Extract<BlogBlock, { type: 'quote' }> }
  | { kind: 'section'; index: number; text: BlogBlock[]; media: BlogBlock[] };

function buildSections(body: BlogBlock[]): Segment[] {
  const segs: Segment[] = [];
  const intro: BlogBlock[] = [];
  let started = false;
  let cur: { kind: 'section'; index: number; text: BlogBlock[]; media: BlogBlock[] } | null = null;
  let secIndex = 0;

  const flush = () => {
    if (cur && (cur.text.length || cur.media.length)) {
      cur.index = secIndex++;
      segs.push(cur);
    }
    cur = null;
  };

  for (const b of body) {
    if (!started) {
      if (b.type === 'h2') {
        if (intro.length) segs.push({ kind: 'intro', text: [...intro] });
        started = true;
        cur = { kind: 'section', index: 0, text: [b], media: [] };
      } else {
        intro.push(b);
      }
      continue;
    }
    if (b.type === 'h2') {
      flush();
      cur = { kind: 'section', index: 0, text: [b], media: [] };
    } else if (b.type === 'quote') {
      flush();
      segs.push({ kind: 'quote', block: b });
    } else {
      if (!cur) cur = { kind: 'section', index: 0, text: [], media: [] };
      if (b.type === 'image' || b.type === 'gallery') cur.media.push(b);
      else cur.text.push(b);
    }
  }
  flush();
  if (!started && intro.length) segs.push({ kind: 'intro', text: [...intro] });
  return segs;
}

function Section({ text, media, flip }: { text: BlogBlock[]; media: BlogBlock[]; flip: boolean }) {
  if (media.length === 0) {
    return (
      <div className="mx-auto max-w-[720px]">
        {text.map((b, i) => (
          <Block key={i} block={b} />
        ))}
      </div>
    );
  }
  return (
    <div className="my-12 grid items-center gap-8 lg:my-16 lg:grid-cols-2 lg:gap-14">
      <div className={flip ? 'lg:order-2' : ''}>
        {text.map((b, i) => (
          <Block key={i} block={b} inColumn />
        ))}
      </div>
      <div className={flip ? 'lg:order-1' : ''}>
        {media.map((b, i) => (
          <MediaBlock key={i} block={b} />
        ))}
      </div>
    </div>
  );
}

/** Image / gallery rendered inside a column — no breakout margins. */
function MediaBlock({ block }: { block: BlogBlock }) {
  if (block.type === 'image') {
    return (
      <figure className="my-3 first:mt-0">
        <img
          src={block.src}
          alt={block.caption ?? ''}
          className="h-72 w-full object-cover shadow-lg ring-1 ring-navy-500/10 sm:h-[420px]"
          loading="lazy"
        />
        {block.caption && <Caption>{block.caption}</Caption>}
      </figure>
    );
  }
  if (block.type === 'gallery') {
    return (
      <div className="my-3 grid grid-cols-2 gap-3 first:mt-0">
        {block.images.map((img, i) => (
          <figure key={i}>
            <img
              src={img.src}
              alt={img.caption ?? ''}
              className="h-44 w-full object-cover shadow-md ring-1 ring-navy-500/10 sm:h-56"
              loading="lazy"
            />
            {img.caption && <Caption>{img.caption}</Caption>}
          </figure>
        ))}
      </div>
    );
  }
  return null;
}

function Block({ block, isLead, inColumn }: { block: BlogBlock; isLead?: boolean; inColumn?: boolean }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 className={`flex flex-col gap-3 font-display text-2xl font-bold tracking-tight text-navy-500 sm:text-3xl ${inColumn ? 'mt-0' : 'mt-14'}`}>
          <span className="h-0.5 w-10 rounded-full bg-orange-500" />
          {block.text}
        </h2>
      );
    case 'quote':
      return (
        <blockquote className="my-12 text-center">
          <p className="mx-auto max-w-xl font-serif text-2xl font-medium italic leading-snug text-navy-500 sm:text-[2rem]">
            <span className="text-orange-500">“</span>
            {block.text}
            <span className="text-orange-500">”</span>
          </p>
          {block.cite && (
            <cite className="mt-5 block font-sans text-[11px] uppercase not-italic tracking-widest2 text-navy-500/50">
              {block.cite}
            </cite>
          )}
        </blockquote>
      );
    case 'list':
      return (
        <ul className="my-8 space-y-3.5 border border-navy-500/10 bg-navy-50/70 p-6 sm:p-7">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3.5 font-serif text-lg leading-relaxed text-navy-500/80">
              <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-orange-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'image':
      return (
        <figure className={block.wide ? 'my-10 sm:-mx-24 lg:-mx-40' : 'my-8'}>
          <img
            src={block.src}
            alt={block.caption ?? ''}
            className="w-full object-cover shadow-lg ring-1 ring-navy-500/10"
            loading="lazy"
          />
          {block.caption && <Caption>{block.caption}</Caption>}
        </figure>
      );
    case 'gallery':
      return (
        <div className="my-9 grid grid-cols-2 gap-3 sm:-mx-24 sm:gap-4 lg:-mx-40">
          {block.images.map((img, i) => (
            <figure key={i}>
              <img
                src={img.src}
                alt={img.caption ?? ''}
                className="h-56 w-full object-cover shadow-lg ring-1 ring-navy-500/10 sm:h-72"
                loading="lazy"
              />
              {img.caption && <Caption>{img.caption}</Caption>}
            </figure>
          ))}
        </div>
      );
    default:
      return (
        <p
          className={`mt-5 font-serif text-lg leading-[1.72] text-navy-500/85 sm:text-xl ${
            isLead ? 'dropcap first:mt-0' : ''
          }`}
        >
          {block.text}
        </p>
      );
  }
}

function Caption({ children }: { children: ReactNode }) {
  return (
    <figcaption className="mt-2.5 text-center font-sans text-[12px] italic text-navy-500/45">
      {children}
    </figcaption>
  );
}

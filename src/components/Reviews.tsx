import type { ComponentType } from 'react';
import { Star, Instagram, ArrowUpRight, BadgeCheck } from 'lucide-react';
import { Badge } from './Primitives';
import {
  PLATFORMS,
  AGGREGATE,
  REVIEWS,
  INSTA_POSTS,
  SOCIAL,
  type Platform,
} from '../data/social';

/* Social proof presented the way the review platforms themselves present it,
   so a visitor recognises the format instantly and trusts the numbers:
     1. Header on the left, weighted aggregate score on the right.
     2. One score panel per platform (Google, Tripadvisor) — logo, exact score,
        star row, review count, deep link to the live listing.
     3. Guest quotes on light review cards: avatar, name, reviewer credential,
        date, that reviewer's own star count, platform mark. Nothing invented —
        every field is copied from the real listing.
     4. Instagram reduced to a single strip below a rule.
   Palette/type match GiftCardsTeaser & IslandShowcase: navy-500 ground, grain
   overlay, white + yellow-400 headline, data-reveal. */

/** One gold for every star on the page, dark ground or light card, so the
    ratings read as data rather than as another brand colour. */
const STAR_GOLD = 'text-[#f6b43c]';

/** Star row that renders halves, so 4.5 does not have to round to 5. */
function Stars({
  rating,
  className = 'h-4 w-4',
  color = STAR_GOLD,
  empty = 'text-white/20',
}: {
  rating: number;
  className?: string;
  color?: string;
  empty?: string;
}) {
  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className="relative inline-block">
            <Star className={`${className} ${empty} fill-current`} />
            {fill > 0 && (
              <span
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star className={`${className} ${color} fill-current`} />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

function GoogleMark({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2 5-4.4 6.6v5.5h7.1c4.1-3.8 6.6-9.4 6.6-16.1z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.9 0 10.9-2 14.5-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.1 15.5 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.8 28.2c-.4-1.3-.7-2.7-.7-4.2s.2-2.9.7-4.2v-5.7H4.5A22 22 0 0 0 2 24c0 3.6.9 6.9 2.5 9.9l7.3-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.8c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.1 29.9 2 24 2 15.5 2 8.1 6.9 4.5 13.9l7.3 5.7c1.7-5.2 6.5-8.8 12.2-8.8z"
      />
    </svg>
  );
}

function TripadvisorMark({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#000" />
      <circle cx="16" cy="24" r="7.5" fill="none" stroke="#34E0A1" strokeWidth="3" />
      <circle cx="32" cy="24" r="7.5" fill="none" stroke="#34E0A1" strokeWidth="3" />
      <circle cx="16" cy="24" r="2.6" fill="#34E0A1" />
      <circle cx="32" cy="24" r="2.6" fill="#34E0A1" />
      <path
        d="M17 13.5c4.4-2.2 9.6-2.2 14 0"
        fill="none"
        stroke="#34E0A1"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

const MARKS: Record<Platform, ComponentType<{ className?: string }>> = {
  google: GoogleMark,
  tripadvisor: TripadvisorMark,
};


export function Reviews() {
  const platforms = Object.entries(PLATFORMS) as [
    Platform,
    (typeof PLATFORMS)[Platform],
  ][];

  return (
    <section
      id="reviews"
      className="relative overflow-hidden bg-navy-500 py-12 sm:py-20"
    >
      <div className="grain absolute inset-0 opacity-30" />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        {/* ── Header + aggregate score, sharing one baseline ── */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
          <div data-reveal="left">
            <Badge tone="orange" rotate={-6}>Loved by locals</Badge>
            <h2 className="mt-3 font-display text-3xl font-bold leading-[1.02] tracking-tightest text-white sm:mt-5 sm:text-5xl lg:text-6xl">
              Don&apos;t take
              <span className="block font-serif italic font-medium text-yellow-400">
                our word for it
              </span>
            </h2>
          </div>

          <div className="shrink-0 sm:text-right" data-reveal="right">
            <div className="flex items-baseline gap-3 sm:justify-end">
              <span className="font-display text-4xl font-bold leading-none tracking-tightest text-white sm:text-6xl">
                {AGGREGATE.rating}
              </span>
              <span className="font-sans text-base font-medium text-white/50 sm:text-lg">
                / {AGGREGATE.outOf}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3 sm:justify-end">
              <Stars rating={AGGREGATE.rating} className="h-4 w-4" empty="text-white/15" />
              <span className="font-sans text-xs text-white/65">
                {AGGREGATE.count} reviews
              </span>
            </div>
          </div>
        </div>

        {/* ── Platform scores as one hairline strip, not competing boxes ── */}
        <div
          className="mt-8 grid gap-px overflow-hidden border-y border-white/10 bg-white/10 sm:mt-12 sm:grid-cols-2"
          data-stagger
        >
          {platforms.map(([key, p]) => {
            const Mark = MARKS[key];
            return (
              <a
                key={key}
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 bg-navy-500 py-5 transition-colors duration-200 hover:bg-navy-600 sm:px-6 sm:py-6 sm:first:pl-0 sm:last:pr-0"
              >
                <Mark className="h-7 w-7 shrink-0 sm:h-8 sm:w-8" />

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl font-bold leading-none tracking-tightest text-white">
                      {p.rating.toFixed(1)}
                    </span>
                    <Stars rating={p.rating} className="h-3.5 w-3.5" empty="text-white/15" />
                  </div>
                  <p className="mt-1.5 font-sans text-xs text-white/60">
                    {p.name} · {p.count}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1 font-sans text-[11px] font-bold uppercase tracking-widest text-white/55 transition-colors group-hover:text-yellow-400">
                  Read
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </a>
            );
          })}
        </div>

        {/* ── Guest quotes on light review cards ── */}
        <div
          className="mt-8 flex snap-x snap-mandatory scroll-px-1 gap-4 overflow-x-auto px-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-12 sm:gap-6 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0"
          data-stagger
        >
          {REVIEWS.map((rev, i) => {
            const p = PLATFORMS[rev.platform];
            const Mark = MARKS[rev.platform];
            return (
              <figure
                key={i}
                className="flex w-[82vw] max-w-[360px] shrink-0 snap-start flex-col bg-white p-6 text-navy-500 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.6)] sm:p-7 md:w-auto md:max-w-none md:shrink"
              >
                {/* stars first: the rating is the reason anyone reads on */}
                <div className="flex items-center justify-between gap-3">
                  <Stars
                    rating={rev.rating}
                    className="h-[18px] w-[18px]"
                    empty="text-navy-500/15"
                  />
                  <Mark className="h-5 w-5 shrink-0 opacity-80" />
                </div>

                <blockquote className="mt-5 grow font-serif text-[19px] leading-[1.5] text-navy-500 sm:text-xl">
                  {rev.quote}
                </blockquote>

                <figcaption className="mt-6 flex items-center gap-3 border-t border-navy-500/10 pt-5">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-500 font-sans text-sm font-bold text-white"
                    aria-hidden="true"
                  >
                    {rev.author.trim().charAt(0).toUpperCase()}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-sans text-sm font-bold leading-tight text-navy-500">
                      {rev.author}
                    </span>
                    <span className="block truncate font-sans text-xs text-navy-500/60">
                      {rev.date}
                      {rev.credential && ` · ${rev.credential}`}
                    </span>
                  </span>
                </figcaption>

                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 self-start font-sans text-[11px] font-bold uppercase tracking-widest text-navy-500/55 transition-colors hover:text-navy-500"
                >
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified on {p.name}
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </figure>
            );
          })}
        </div>

        {/* ── Instagram teaser ── */}
        <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-8 sm:mt-20 sm:gap-6 sm:pt-12" data-reveal="up">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
            <div>
              <p className="font-sans text-[11px] font-bold uppercase tracking-widest2 text-yellow-400">
                @thecoconutisland
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold tracking-tightest text-white sm:mt-3 sm:text-4xl">
                Follow the island
              </h3>
              <p className="mt-2 font-serif text-base italic text-white/65">
                Fresh plates, tropical nights &amp; #pureislandvibes, daily.
              </p>
            </div>
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 self-start rounded-full bg-yellow-400 px-7 py-4 text-[12px] font-bold uppercase tracking-widest2 text-navy-500 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-yellow-300 active:scale-95"
            >
              <Instagram className="h-4 w-4" /> Follow us
            </a>
          </div>

          {INSTA_POSTS.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {INSTA_POSTS.slice(0, 4).map((src) => (
                <a
                  key={src}
                  href={SOCIAL.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative aspect-square overflow-hidden ring-1 ring-white/10"
                >
                  <img
                    src={src}
                    alt="Instagram post"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-navy-900/0 transition-colors duration-200 group-hover:bg-navy-900/40">
                    <Instagram className="h-6 w-6 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

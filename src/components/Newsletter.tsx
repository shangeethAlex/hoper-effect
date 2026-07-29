import { FormEvent, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Badge } from './Primitives';

/**
 * Newsletter ("The Island List") — an entry popup shown once per visitor on
 * the home page, plus a full-width signup band reused on the blog pages.
 * No provider is wired yet: submits are remembered locally so the popup
 * never nags a subscriber. Wire the form to Mailchimp/Klaviyo when ready.
 */

const STORAGE_KEY = 'tci-newsletter';
/** A dismissal (not a signup) is re-asked after 30 days. */
const DISMISS_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

type NewsletterState = 'subscribed' | 'dismissed';

interface Stored {
  value: NewsletterState;
  timestamp: number;
}

function readStored(): Stored | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stored;
    if (parsed.value !== 'subscribed' && parsed.value !== 'dismissed') return null;
    if (typeof parsed.timestamp !== 'number') return null;
    if (parsed.value === 'dismissed' && Date.now() - parsed.timestamp > DISMISS_MAX_AGE_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function remember(value: NewsletterState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ value, timestamp: Date.now() } satisfies Stored),
    );
  } catch {
    // Private mode etc. — fine, just don't persist.
  }
}

/** Email capture form — shared by the popup and the band. */
function SignupForm({ dark = false, onSubscribed }: { dark?: boolean; onSubscribed?: () => void }) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: post `email` to the newsletter provider (Mailchimp/Klaviyo) when live.
    remember('subscribed');
    setDone(true);
    onSubscribed?.();
  };

  if (done) {
    return (
      <p
        className={`font-['Permanent_Marker'] text-lg ${dark ? 'text-yellow-400' : 'text-orange-500'}`}
        role="status"
      >
        You're on the list — see you on the island.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor={dark ? 'nl-email-dark' : 'nl-email'}>
        Email address
      </label>
      <input
        id={dark ? 'nl-email-dark' : 'nl-email'}
        type="email"
        required
        autoComplete="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`min-w-0 flex-1 border px-5 py-3.5 font-sans text-sm outline-none transition-colors ${
          dark
            ? 'border-white/25 bg-white/10 text-white placeholder:text-white/40 focus:border-orange-400'
            : 'border-navy-500/25 bg-white text-navy-500 placeholder:text-navy-500/35 focus:border-orange-500'
        }`}
      />
      <button
        type="submit"
        className="rounded-full bg-orange-500 px-7 py-3.5 text-[12px] font-bold uppercase tracking-widest2 text-white shadow-lg transition-all duration-200 hover:bg-orange-600 active:scale-[0.98]"
      >
        Sign me up
      </button>
    </form>
  );
}

/**
 * Entry popup. Shows once, ~7s after landing (after the cookie card has had
 * its moment), never again for subscribers, and re-asks dismissers after 30 days.
 */
export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (readStored()) return;
    const t = setTimeout(() => setOpen(true), 7000);
    return () => clearTimeout(t);
  }, []);

  // Scroll lock + Esc to close + move focus into the dialog.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const dismiss = () => {
    remember('dismissed');
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-navy-900/70 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Join The Island List newsletter"
        tabIndex={-1}
        className="paper-grain relative grid w-full max-w-3xl animate-scaleIn grid-cols-1 bg-white shadow-2xl ring-1 ring-navy-500/15 outline-none motion-reduce:animate-none sm:grid-cols-[5fr_7fr]"
      >
        <button
          onClick={dismiss}
          aria-label="Close newsletter popup"
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 ring-1 ring-navy-500/15 transition-colors hover:bg-navy-50"
        >
          <X className="h-4 w-4 text-navy-500" />
        </button>

        {/* Offers panel — the "why" */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-navy-700 p-8 sm:flex">
          <div className="grain absolute inset-0 opacity-30" />
          <div className="relative">
            <Badge tone="yellow" rotate={-6}>The Island List</Badge>
            <div className="mt-8 flex flex-col items-start gap-3">
              <Badge tone="orange" rotate={-3}>Offers first</Badge>
              <Badge tone="white" rotate={2}>Music night invites</Badge>
              <Badge tone="orange" rotate={-2}>New dishes early</Badge>
              <Badge tone="white" rotate={3}>Stories from the kitchen</Badge>
            </div>
          </div>
          <p className="relative rotate-[-2deg] font-['Permanent_Marker'] text-xl text-yellow-400">
            no spam — just sambol.
          </p>
        </div>

        {/* Signup panel */}
        <div className="p-7 sm:p-10">
          <p className="font-sans text-[11px] uppercase tracking-widest2 text-orange-500 sm:hidden">
            The Island List
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold leading-[1.02] tracking-tightest text-navy-500 sm:mt-0 sm:text-4xl">
            First to
            <span className="block font-serif italic font-medium text-orange-500">the flavour</span>
          </h2>
          <p className="mt-4 font-serif text-base italic leading-relaxed text-navy-500/70">
            Offers, new dishes, music nights and stories from both branches —
            straight to your inbox, once or twice a month.
          </p>
          <div className="mt-6">
            <SignupForm />
          </div>
          <p className="mt-4 font-sans text-[11px] text-navy-500/45">
            Unsubscribe anytime. We never share your email.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Full-width navy signup band — sits above the footer on the blog pages. */
export function NewsletterBand() {
  return (
    <section className="relative overflow-hidden bg-navy-700 py-16 sm:py-20">
      <div className="grain absolute inset-0 opacity-30" />
      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-2">
        <div data-reveal="left">
          <Badge tone="yellow" rotate={-6}>The Island List</Badge>
          <h2 className="mt-5 font-display text-3xl font-bold leading-[1.02] tracking-tightest text-white sm:text-4xl">
            Get these stories
            <span className="block font-serif italic font-medium text-orange-400">in your inbox</span>
          </h2>
          <p className="mt-4 max-w-md font-serif text-lg italic leading-relaxed text-white/70">
            New posts, offers and event invites from Brighton and Angel —
            once or twice a month, never more.
          </p>
        </div>
        <div data-reveal="right">
          <SignupForm dark />
          <p className="mt-4 font-sans text-[11px] text-white/40">
            Unsubscribe anytime. We never share your email.
          </p>
        </div>
      </div>
    </section>
  );
}

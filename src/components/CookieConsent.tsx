import { useEffect, useState } from 'react';

export type ConsentValue = 'accepted' | 'declined';

const STORAGE_KEY = 'tci-cookie-consent';
/** Re-ask after 6 months so consent doesn't live forever. */
const CONSENT_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;

interface StoredConsent {
  value: ConsentValue;
  timestamp: number;
}

function readStoredConsent(): StoredConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (parsed.value !== 'accepted' && parsed.value !== 'declined') return null;
    if (typeof parsed.timestamp !== 'number') return null;
    if (Date.now() - parsed.timestamp > CONSENT_MAX_AGE_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/** Current consent, or null if the visitor hasn't chosen (or it expired). */
export function getCookieConsent(): ConsentValue | null {
  return readStoredConsent()?.value ?? null;
}

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (readStoredConsent()) return;
    const t = setTimeout(() => setOpen(true), 1400);
    return () => clearTimeout(t);
  }, []);

  const choose = (value: ConsentValue) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ value, timestamp: Date.now() } satisfies StoredConsent),
      );
    } catch {
      // Storage unavailable (private mode etc.) — still dismiss for this visit.
    }
    // Lets analytics or embeds react without polling localStorage.
    window.dispatchEvent(new CustomEvent('cookie-consent', { detail: value }));
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 z-40 max-w-[340px] sm:bottom-6 sm:left-6"
    >
      <div className="bg-white/85 px-5 py-4 shadow-2xl ring-1 ring-navy-500/15 backdrop-blur-md">
        <p className="font-sans text-[11px] leading-relaxed text-navy-500/80">
          We use cookies to improve your experience. By continuing, you agree to
          our privacy policy.
        </p>
        <div className="mt-3.5 flex gap-2">
          <button
            onClick={() => choose('accepted')}
            className="border border-navy-500 bg-navy-500 px-4 py-2 text-[10px] font-bold uppercase tracking-widest2 text-white transition-colors hover:bg-navy-700"
          >
            Accept
          </button>
          <button
            onClick={() => choose('declined')}
            className="border border-navy-500 bg-transparent px-4 py-2 text-[10px] font-bold uppercase tracking-widest2 text-navy-500 transition-colors hover:bg-navy-500/5"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}

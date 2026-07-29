import { useEffect, useRef } from 'react';

/**
 * "The Coconut Island Hopper" — a pinned, scroll-scrubbed hero for the
 * signature dish, sitting between the hero and the journey filmstrip.
 *
 * Like the hero and IslandJourney, this is a tall runway (~700vh) with a
 * full-screen sticky stage pinned inside it. The last 100vh of the runway is
 * an exit window (runway = offsetHeight − 2×innerHeight): the stage stays
 * pinned, drifts up a little and re-darkens while IslandJourney's
 * -mt-[100vh] curtain slides over it — the same parallax hand-off this
 * section receives from the hero via its own -mt-[100vh].
 *
 * The visual is a single hopper as an isolated, transparent floating object.
 * The entire camera move — side angle, approach, rise, near top-down, and
 * the settled full top-down — is one scroll-scrubbed cutout sequence drawn
 * to a canvas, extracted from generated cinematic footage and keyed
 * per-frame against its near-black plate. Scroll maps to a frame index, so
 * the move plays forwards and backwards with the wheel, and it holds on the
 * final top-down frame while the condiments arrive over it. Desktop and
 * mobile load separate sequences (60 frames @640px / 36 @400px). If neither
 * loads — slow network, decode failure — the original four-still crossfade
 * renders instead; the stills stay mounted beneath as the always-correct
 * fallback.
 * Steam and each condiment are separate transparent layers: condiments
 * stagger in around the plate near top-down, the whole composition takes a
 * subtle spin whose speed leans on smoothed scroll velocity (clamped, and
 * enveloped so it has fully settled by the reveal), and at the end the two
 * sambol bowls part to make room for the CTAs — the same reveal language
 * as their entrance.
 *
 * Motion rules follow the house engine: scroll only sets a target; a rAF
 * loop chases it with frame-rate-independent exponential smoothing and
 * stops itself when settled. All per-frame writes go straight to element
 * styles via refs — no React re-renders while scrubbing.
 *
 * Reduced motion: the JS never runs, the stage is display:none and a plain
 * static block (composition + heading + CTAs) renders instead.
 */

const IMG = {
  side: '/images/hopper/hopper-side.webp',
  threeq: '/images/hopper/hopper-threequarter.webp',
  neartop: '/images/hopper/hopper-neartop.webp',
  topdown: '/images/hopper/hopper-topdown.webp',
  steam: '/images/hopper/steam.webp',
} as const;

/**
 * Scroll-scrubbed rotation footage, cut from the usable t=0–7s window of the
 * source clip — the one continuous rise from side angle to a true top-down.
 * Frames are spaced by equal cumulative visual change rather than equal time,
 * so a linear frame→scroll map already reads at a constant rate.
 */
const SEQ_SETS = {
  desktop: { dir: '/images/hopper/rotation-sequence', count: 60, px: 640 },
  mobile: { dir: '/images/hopper/rotation-sequence-mobile', count: 36, px: 400 },
} as const;

/**
 * The footage occupies p ∈ [0, SEQ_END_P] and then holds its last frame. It
 * hits full top-down around 83% of its own length, which lands at p ≈ 0.4 —
 * exactly where the condiments start arriving — and the short tail after
 * that settles under them.
 */
const SEQ_END_P = 0.48;

/**
 * Scroll fraction → frame fraction. The middle segment advances at roughly
 * half rate: that is the crisp-edge pause, timed to land under the "Crisp at
 * the edge" caption while the rim is at its most prominent three-quarter
 * angle, before the camera resumes its rise to top-down.
 */
const SEQ_CURVE: readonly (readonly [number, number])[] = [
  [0, 0],
  [0.5, 0.5],
  [0.68, 0.6],
  [1, 1],
];

/**
 * The hopper fills ~80% of the early frames but only ~70% by the top-down —
 * the camera eases back as it rises. SEQ_PULLBACK_COMP scales that back out
 * so the on-screen size stays steady while the condiments take their places,
 * and SEQ_BASE_SCALE sets the overall framing against the captions.
 */
const SEQ_PULLBACK_COMP = 0.14;
const SEQ_BASE_SCALE = 0.82;

/** Extra spin from scroll velocity (deg). The footage now carries motion of
 *  its own, so this sits lower than the stills-only build's 24. */
const SPIN_BOOST_MAX_DEG = 16;

/**
 * Condiment layers around the top-down plate. `t` staggers each entrance
 * within the condiment stage; `dx/dy` is the direction it eases in from;
 * `part` marks the two sambol bowls that slide outward for the CTA reveal.
 */
const SPRITES = [
  { src: '/images/hopper/1.png',       alt: '', cls: 'left-[-9%] top-[6%] w-[30%]',      t: 0.05, dx: -20, dy: -12, part: 0 },
  { src: '/images/hopper/5.png',       alt: '', cls: 'right-[-2%] top-[2%] w-[22%]',     t: 0.14, dx: 18,  dy: -12, part: 0 },
  { src: '/images/hopper/2.png',       alt: '', cls: 'left-[-15%] top-[40%] w-[26%]',     t: 0.23, dx: -22, dy: 4,   part: 0 },
  { src: '/images/hopper/3.png',      alt: '', cls: 'right-[-19%] top-[36%] w-[28%]',    t: 0.32, dx: 22,  dy: 6,   part: 0 },
  { src: '/images/hopper/sambol-coconut.png', alt: '', cls: 'left-[2%] bottom-[-8%] w-[32%]',   t: 0.41, dx: -14, dy: 16,  part: -1 },
  { src: '/images/hopper/4.png',   alt: '', cls: 'right-[2%] bottom-[-8%] w-[32%]',  t: 0.50, dx: 14,  dy: 16,  part: 1 },
];

/** Stage windows as fractions of pinned progress p ∈ [0,1]. p ∈ [0.92,1] is a readable dwell before the exit window. */
const STAGES = [
  { start: 0.0,  end: 0.1 },  // 1 — enter from the hero, side angle
  { start: 0.1,  end: 0.24 }, // 2 — side → three-quarter
  { start: 0.24, end: 0.38 }, // 3 — three-quarter → near top-down
  { start: 0.38, end: 0.64 }, // 4 — condiments + velocity-linked spin
  { start: 0.64, end: 0.76 }, // 5 — spin settles, plate centred
  { start: 0.76, end: 0.92 }, // 6 — sambols part, CTAs ease in
] as const;

const STAGE_LABELS = ['Enter', 'Turn', 'Rise', 'Spices', 'Reveal', 'Taste'];

const TEXTS: { eyebrow?: string; line: string; display?: boolean }[] = [
  { eyebrow: 'The Coconut Island Hopper', line: 'A Signature Taste of the Island', display: true },
  { eyebrow: 'Slow-fermented, cooked to order', line: 'Our signature hopper, inspired by the flavours of Sri Lanka.' },
  { eyebrow: 'Golden rim, spongy heart', line: 'Crisp at the edge. Soft at the heart.' },
  { eyebrow: 'Sambols, spice & fire', line: 'Surrounded by the bold flavours of Sri Lanka.' },
  { eyebrow: 'From our kitchen to your table', line: 'Discover the Taste of Coconut Island', display: true },
];

const MENU_HREF = '#specials';
const BOOK_HREF = '#reserver';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (f: number) => f * f * (3 - 2 * f);
/** Smoothstepped 0→1 across the window [a,b] of p. */
const seg = (p: number, a: number, b: number) => smooth(clamp01((p - a) / (b - a)));
/** Raw (un-eased) 0→1 across stage i — for sub-thresholds inside a stage. */
const rawLocal = (p: number, i: number) => clamp01((p - STAGES[i].start) / (STAGES[i].end - STAGES[i].start));
/** Piecewise-linear lookup through SEQ_CURVE. */
const seqCurve = (u: number) => {
  for (let i = 1; i < SEQ_CURVE.length; i++) {
    const [x0, y0] = SEQ_CURVE[i - 1];
    const [x1, y1] = SEQ_CURVE[i];
    if (u <= x1) return y0 + ((u - x0) / (x1 - x0)) * (y1 - y0);
  }
  return 1;
};

export function CoconutIslandHopper() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const duskRef = useRef<HTMLDivElement>(null);
  const goldRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const rotateRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const steamRef = useRef<HTMLImageElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const exitShadeRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hopperRefs = useRef<(HTMLImageElement | null)[]>([]);
  const spriteRefs = useRef<(HTMLImageElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const stepperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const section = sectionRef.current;
    if (!section) return;

    // Same chase rates as the hero so the pinned sections share one feel.
    const RESPONSE = 7.5;
    const MOUSE_RESPONSE = 5;
    const VEL_RESPONSE = 4;

    let current = 0;
    let target = 0;
    let exitCurrent = 0;
    let exitTarget = 0;
    let topRatio = 1;
    let mouseX = 0;
    let mouseY = 0;
    let mouseTX = 0;
    let mouseTY = 0;
    let velSm = 0;
    let lastY = window.scrollY;
    let raf = 0;
    let running = false;
    let last = 0;
    let lastActive = -1;

    const tiltOn = window.matchMedia('(pointer: fine)').matches && window.innerWidth >= 1024;

    // Rotation footage scrubber. Phones get their own lighter sequence rather
    // than being dropped to the stills.
    const seqSet = window.innerWidth >= 640 ? SEQ_SETS.desktop : SEQ_SETS.mobile;
    const seqFrames: HTMLImageElement[] = [];
    let seqReady = false;
    let seqFailed = false;
    let seqLoadStarted = false;
    let lastFrame = -1;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d') ?? null;
    if (canvas) {
      canvas.width = seqSet.px;
      canvas.height = seqSet.px;
    }

    const loadSequence = () => {
      if (seqLoadStarted || !ctx) return;
      seqLoadStarted = true;
      let loaded = 0;
      for (let i = 0; i < seqSet.count; i++) {
        const im = new Image();
        im.decoding = 'async';
        im.onload = () => {
          loaded += 1;
          // Only flip once every frame is decoded, so the first scrub can
          // never land on a gap.
          if (loaded === seqSet.count && !seqFailed) {
            seqReady = true;
            lastFrame = -1;
            readTarget();
            wake(); // repaint with the sequence now owning the rotation
          }
        };
        im.onerror = () => {
          seqFailed = true; // stills beneath simply keep rendering
        };
        im.src = `${seqSet.dir}/frame-${String(i + 1).padStart(3, '0')}.webp`;
        seqFrames.push(im);
      }
    };

    const readTarget = () => {
      const runway = section.offsetHeight - 2 * window.innerHeight;
      const top = section.getBoundingClientRect().top;
      topRatio = top / window.innerHeight;
      target = runway > 0 ? clamp01(-top / runway) : 0;
      exitTarget = runway > 0 ? clamp01((-top - runway) / window.innerHeight) : 0;
    };

    const apply = (p: number, ex: number) => {
      const s1 = Math.max(seg(p, STAGES[0].start, STAGES[0].end), 0.35 * clamp01((0.5 - topRatio) / 0.5));
      const s2 = seg(p, STAGES[1].start, STAGES[1].end);
      const s3 = seg(p, STAGES[2].start, STAGES[2].end);
      const s4raw = rawLocal(p, 3);
      const s5raw = rawLocal(p, 4);
      const s6 = seg(p, STAGES[5].start, STAGES[5].end);
      const dFade = seg(p, 0.4, 0.54); // near top-down → full top-down, done well inside stage 4

      // ---- hopper rotation: scrubbed footage when ready, still crossfades beneath ----
      // The footage covers the whole orbit, so once it is live every still is
      // silent; they only draw while it is still loading or has failed.
      const seqOn = seqReady && !seqFailed;
      const enterY = (1 - s1) * 9; // % of frame — the hopper floats up as it enters
      const alphas = seqOn
        ? [0, 0, 0, 0]
        : [s1 * (1 - s2), s2 * (1 - s3), s3 * (1 - dFade), dFade];
      const transforms = [
        `translate3d(0, ${enterY}%, 0) scale(${0.9 + 0.1 * s1 + s2 * 0.06}) rotate(${s2 * 2}deg)`,
        `scale(${0.95 + s2 * 0.05 + s3 * 0.06}) rotate(${(s2 - 1) * -2 + s3 * 2}deg)`,
        `scale(${0.95 + s3 * 0.05 + dFade * 0.06}) rotate(${(s3 - 1) * -2 + dFade * 2}deg)`,
        `scale(${0.94 + dFade * 0.06})`,
      ];
      for (let k = 0; k < 4; k++) {
        const img = hopperRefs.current[k];
        if (!img) continue;
        img.style.opacity = String(clamp01(alphas[k]));
        img.style.transform = transforms[k];
      }
      // Frames are already spaced by equal visual change, so the only shaping
      // here is SEQ_CURVE's crisp-edge dwell. Past SEQ_END_P the index pins to
      // the last frame and the top-down composition simply holds.
      const u = clamp01(p / SEQ_END_P);
      const fu = seqCurve(u);
      if (canvas) {
        if (seqOn && ctx) {
          const frame = Math.min(seqSet.count - 1, Math.round(fu * (seqSet.count - 1)));
          if (frame !== lastFrame && seqFrames[frame]) {
            lastFrame = frame;
            ctx.clearRect(0, 0, seqSet.px, seqSet.px);
            ctx.drawImage(seqFrames[frame], 0, 0, seqSet.px, seqSet.px);
          }
          canvas.style.opacity = String(clamp01(s1));
          canvas.style.transform =
            `translate3d(0, ${enterY}%, 0) scale(${SEQ_BASE_SCALE + 0.1 * s1 + SEQ_PULLBACK_COMP * fu})`;
        } else {
          canvas.style.opacity = '0';
        }
      }

      // ---- floating ground shadow: low wide ellipse from the side, tight halo overhead ----
      // Tracks whichever rotation is actually on screen — the footage reaches
      // overhead sooner than the still crossfade did.
      const o = seqOn ? smooth(fu) : seg(p, 0.1, 0.54); // "overheadness" of the camera
      const shadow = shadowRef.current;
      if (shadow) {
        shadow.style.opacity = String(0.5 - o * 0.16 - (1 - s1) * 0.5);
        shadow.style.transform = `translate3d(0, ${36 - o * 26 + enterY}%, 0) scale(${0.92 - o * 0.2}, ${0.3 + o * 0.22})`;
      }

      // ---- velocity-linked spin, enveloped to stage 4 and settled by stage 5 ----
      const env = seg(s4raw, 0, 0.2) * (1 - seg(s5raw, 0, 0.6));
      const boost = (Math.max(-2200, Math.min(2200, velSm)) / 2200) * SPIN_BOOST_MAX_DEG;
      const rot = rotateRef.current;
      if (rot) rot.style.transform = `rotate(${env * (s4raw * 14 + boost)}deg)`;

      // ---- condiments: staggered entrance, sambols part for the CTAs ----
      const partPx = Math.min(140, window.innerWidth * 0.12) * seg(s6, 0, 0.55);
      for (let k = 0; k < SPRITES.length; k++) {
        const el = spriteRefs.current[k];
        if (!el) continue;
        const sp = SPRITES[k];
        const a = seg(s4raw, sp.t, sp.t + 0.2);
        const px = sp.part * partPx;
        const py = sp.part !== 0 ? seg(s6, 0, 0.55) * 14 : 0;
        el.style.opacity = String(a);
        el.style.transform =
          `translate3d(${(1 - a) * sp.dx + px}px, ${(1 - a) * sp.dy + py}px, 0) ` +
          `scale(${0.72 + 0.28 * a}) rotate(${(1 - a) * (sp.dx > 0 ? 9 : -9)}deg)`;
      }

      // ---- steam joins at the top-down reveal ----
      const steam = steamRef.current;
      if (steam) steam.style.opacity = String(seg(s4raw, 0.1, 0.5) * 0.8);

      // ---- continuous colour grade: dusk market → golden hour ----
      const grade = smooth(p);
      if (duskRef.current) duskRef.current.style.opacity = String(0.85 * (1 - grade));
      if (goldRef.current) goldRef.current.style.opacity = String(grade * 0.9);
      if (sceneRef.current) {
        sceneRef.current.style.filter = `brightness(${0.92 + grade * 0.14}) saturate(${0.9 + grade * 0.25})`;
      }

      // ---- one caption at a time ----
      for (let i = 0; i < TEXTS.length; i++) {
        const el = textRefs.current[i];
        if (!el) continue;
        const { start: a, end: b } = STAGES[i];
        const w = b - a;
        const alphaIn = seg(p, a, a + w * 0.22);
        // The reveal heading (i === 4) stays put through stage 6, crowning the CTA layout.
        const alphaOut = i === 4 ? 1 : 1 - seg(p, b - w * 0.16, b);
        el.style.opacity = String(alphaIn * alphaOut);
        el.style.transform = `translate3d(0, ${(1 - alphaIn) * 26 - seg(p, a, b) * 8}px, 0)`;
      }

      // ---- CTA block eases in after the sambols part ----
      const btn = seg(s6, 0.35, 0.85);
      const cta = ctaRef.current;
      if (cta) {
        cta.style.opacity = String(btn);
        cta.style.transform = `translate3d(0, ${(1 - btn) * 24}px, 0)`;
        cta.style.visibility = btn > 0.02 ? 'visible' : 'hidden';
        cta.style.pointerEvents = btn > 0.6 ? 'auto' : 'none';
      }

      // ---- stepper dots fill with per-stage progress ----
      for (let i = 0; i < STAGES.length; i++) {
        const fill = dotRefs.current[i];
        if (!fill) continue;
        const end = i === STAGES.length - 1 ? 1 : STAGES[i].end;
        fill.style.transform = `scale(${clamp01((p - STAGES[i].start) / (end - STAGES[i].start))})`;
      }
      const active = Math.max(0, STAGES.findIndex((s, i) => p < (i === STAGES.length - 1 ? 1.01 : s.end)));
      if (active !== lastActive && stepperRef.current) {
        lastActive = active;
        stepperRef.current.querySelectorAll('button').forEach((b, i) => {
          if (i === active) b.setAttribute('aria-current', 'step');
          else b.removeAttribute('aria-current');
        });
      }

      // ---- desktop cursor tilt (outer wrapper only — spin lives on the inner one) ----
      const tilt = tiltRef.current;
      if (tilt) {
        tilt.style.transform = tiltOn
          ? `perspective(1200px) rotateX(${-mouseY * 3.5}deg) rotateY(${mouseX * 3.5}deg)`
          : '';
      }

      // ---- exit window: drift up and re-darken under IslandJourney's curtain ----
      if (stageRef.current) stageRef.current.style.transform = `translate3d(0, ${-ex * 10}vh, 0)`;
      if (exitShadeRef.current) exitShadeRef.current.style.opacity = String(ex * 0.55);
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      const y = window.scrollY;
      if (dt > 0) {
        const velInst = (y - lastY) / dt;
        velSm += (velInst - velSm) * (1 - Math.exp(-VEL_RESPONSE * dt));
      }
      lastY = y;

      current += (target - current) * (1 - Math.exp(-RESPONSE * dt));
      exitCurrent += (exitTarget - exitCurrent) * (1 - Math.exp(-RESPONSE * dt));
      mouseX += (mouseTX - mouseX) * (1 - Math.exp(-MOUSE_RESPONSE * dt));
      mouseY += (mouseTY - mouseY) * (1 - Math.exp(-MOUSE_RESPONSE * dt));

      const settled =
        Math.abs(target - current) <= 0.0006 &&
        Math.abs(exitTarget - exitCurrent) <= 0.0006 &&
        Math.abs(mouseTX - mouseX) <= 0.002 &&
        Math.abs(mouseTY - mouseY) <= 0.002 &&
        Math.abs(velSm) <= 5;

      if (!settled) {
        apply(current, exitCurrent);
        raf = requestAnimationFrame(tick);
      } else {
        current = target;
        exitCurrent = exitTarget;
        velSm = 0;
        apply(current, exitCurrent);
        running = false;
      }
    };

    const wake = () => {
      if (!running) {
        running = true;
        last = performance.now();
        lastY = window.scrollY; // no velocity spike on the first tick after idle
        raf = requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      readTarget();
      wake();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!tiltOn) return;
      mouseTX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseTY = (e.clientY / window.innerHeight) * 2 - 1;
      wake();
    };

    // Warm the cutout set (and start the rotation sequence download) once the
    // section is within ~1.5 viewports.
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        [...Object.values(IMG), ...SPRITES.map((s) => s.src)].forEach((src) => {
          const im = new Image();
          im.src = src;
        });
        loadSequence();
        io.disconnect();
      },
      { rootMargin: '150% 0px' }
    );
    io.observe(section);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const jumpTo = (i: number) => {
    const s = sectionRef.current;
    if (!s) return;
    const runway = s.offsetHeight - 2 * window.innerHeight;
    const docTop = s.getBoundingClientRect().top + window.scrollY;
    const frac = STAGES[i].start + 0.3 * (STAGES[i].end - STAGES[i].start);
    window.scrollTo({ top: Math.round(docTop + frac * runway), behavior: 'smooth' });
  };

  const primaryBtn =
    'group relative overflow-hidden rounded-full bg-orange-500 px-8 py-4 text-[12px] font-bold uppercase tracking-widest2 text-white shadow-lg transition-all duration-200 hover:bg-orange-600 hover:shadow-xl active:scale-95';
  const secondaryBtn =
    'inline-flex items-center rounded-full border border-white/30 px-8 py-4 text-[12px] font-bold uppercase tracking-widest2 text-white transition-all duration-200 hover:border-white hover:bg-white hover:text-navy-500 active:scale-95';

  return (
    <section
      ref={sectionRef}
      id="hopper"
      className="relative -mt-[100vh] bg-navy-900 motion-safe:h-[500vh] motion-safe:sm:h-[700vh] motion-reduce:mt-0"
    >
      {/* Pinned stage */}
      <div
        ref={stageRef}
        className="sticky top-0 h-screen overflow-hidden bg-navy-900 will-change-transform motion-reduce:hidden"
      >
        <h2 className="sr-only">The Coconut Island Hopper — a signature taste of the island</h2>

        {/* Scene: ambience + floating composition (colour-graded together) */}
        <div ref={sceneRef} className="absolute inset-0">
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{ background: 'radial-gradient(56% 46% at 50% 60%, rgba(240,128,60,0.16), transparent 72%)' }}
          />
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            aria-hidden="true"
            style={{ backgroundImage: "url('/images/blue.png')" }}
          />

          <div className="absolute inset-0 z-[1] flex items-center justify-center">
            {/* Outer wrapper: cursor tilt only */}
            <div ref={tiltRef} className="relative aspect-square w-[min(88vmin,620px)] will-change-transform sm:w-[min(78vmin,620px)]">
              {/* Floating ground shadow (does not spin) */}
              <div
                ref={shadowRef}
                aria-hidden="true"
                className="absolute inset-x-[10%] bottom-[4%] h-[38%] rounded-full will-change-transform"
                style={{
                  background: 'radial-gradient(closest-side, rgba(4,9,18,0.6), transparent 72%)',
                  opacity: 0,
                }}
              />

              {/* Inner wrapper: velocity-linked spin */}
              <div
                ref={rotateRef}
                className="absolute inset-0 will-change-transform"
                role="img"
                aria-label="A Sri Lankan hopper — crisp golden edge, soft centre — surrounded by coconut sambol, seeni sambol, dried chillies, cinnamon, cardamom and curry leaves"
              >
                {([IMG.side, IMG.threeq, IMG.neartop, IMG.topdown] as string[]).map((src, k) => (
                  <img
                    key={src}
                    ref={(el) => (hopperRefs.current[k] = el)}
                    src={src}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    className="pointer-events-none absolute inset-[6%] h-[88%] w-[88%] object-contain will-change-transform [filter:drop-shadow(0_26px_30px_rgba(4,9,18,0.5))]"
                    style={{ opacity: k === 0 ? undefined : 0 }}
                  />
                ))}

                {/* Scrubbed rotation footage — owns the whole camera move and
                    sits over the stills it replaces; the effect sets the
                    backing size for whichever sequence this viewport loads,
                    and it stays transparent until every frame is decoded. */}
                <canvas
                  ref={canvasRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[6%] h-[88%] w-[88%] will-change-transform [filter:drop-shadow(0_26px_30px_rgba(4,9,18,0.5))]"
                  style={{ opacity: 0 }}
                />

                {SPRITES.map((sp, k) => (
                  <img
                    key={sp.src}
                    ref={(el) => (spriteRefs.current[k] = el)}
                    src={sp.src}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    className={`pointer-events-none absolute ${sp.cls} will-change-transform [filter:drop-shadow(0_16px_20px_rgba(4,9,18,0.55))]`}
                    style={{ opacity: 0 }}
                  />
                ))}
              </div>

              {/* Steam rises straight up, so it lives outside the spinning wrapper */}
              <img
                ref={steamRef}
                src={IMG.steam}
                alt=""
                aria-hidden="true"
                draggable={false}
                loading="lazy"
                decoding="async"
                className="pointer-events-none absolute left-1/2 top-[-14%] ml-[-21%] w-[42%] mix-blend-screen animate-floatY"
                style={{
                  opacity: 0,
                  // The steam still is white-on-black for screen blending; crush its
                  // floor to true black and feather the frame so no rectangle shows.
                  filter: 'contrast(1.4) brightness(1.06)',
                  maskImage: 'radial-gradient(46% 46% at 50% 50%, black 28%, transparent 72%)',
                  WebkitMaskImage: 'radial-gradient(46% 46% at 50% 50%, black 28%, transparent 72%)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Colour-grade overlays: cool dusk fades out, warm gold fades in */}
        <div
          ref={duskRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background: 'linear-gradient(180deg, rgba(14,27,44,0.55), rgba(8,15,26,0.75))',
            opacity: 0.85,
          }}
        />
        <div
          ref={goldRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background: 'radial-gradient(70% 55% at 50% 62%, rgba(240,128,60,0.2), transparent 72%)',
            opacity: 0,
          }}
        />

        {/* Stage captions — one visible at a time */}
        <div className="pointer-events-none absolute inset-x-0 top-[15vh] z-[3] px-5 text-center sm:top-[12vh]" aria-hidden="true">
          {TEXTS.map((t, i) => (
            <div
              key={i}
              ref={(el) => (textRefs.current[i] = el)}
              className="absolute inset-x-0 px-5 will-change-transform"
              style={{ opacity: 0 }}
            >
              {t.eyebrow && (
                <p className="font-sans text-[11px] font-semibold uppercase tracking-widest2 text-orange-400">
                  {t.eyebrow}
                </p>
              )}
              {t.display ? (
                <p
                  className="mx-auto mt-3 max-w-4xl font-display font-black uppercase leading-[0.95] tracking-tightest text-white [text-shadow:0_2px_40px_rgba(4,9,18,0.6)]"
                  style={{ fontSize: 'clamp(1.9rem, 4.6vw, 4rem)' }}
                >
                  {t.line}
                </p>
              ) : (
                <p className="mx-auto mt-3 max-w-2xl font-serif text-xl italic text-white/85 [text-shadow:0_2px_24px_rgba(4,9,18,0.7)] sm:text-2xl">
                  {t.line}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Final CTA block — revealed as the sambol bowls part */}
        <div
          ref={ctaRef}
          className="absolute inset-x-0 bottom-[6vh] z-[4] flex flex-col items-center gap-3 px-5 sm:bottom-[9vh] sm:gap-5"
          style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}
        >
          <p className="font-serif text-base italic text-white/80 [text-shadow:0_2px_24px_rgba(4,9,18,0.7)] sm:text-xl">
            Fresh Sri Lankan flavours and island vibes in Brighton and Angel.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href={MENU_HREF} className={primaryBtn}>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              <span className="relative flex items-center gap-2">
                Explore Our Menu
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 transition-transform group-hover:scale-125" />
              </span>
            </a>
            <a href={BOOK_HREF} className={secondaryBtn}>
              Book a Table
            </a>
          </div>
        </div>

        {/* Stage stepper — desktop only */}
        <div
          ref={stepperRef}
          className="absolute right-5 top-1/2 z-[5] hidden -translate-y-1/2 flex-col gap-3 sm:flex sm:right-7"
        >
          {STAGES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => jumpTo(i)}
              title={STAGE_LABELS[i]}
              aria-label={`Go to step ${i + 1} of ${STAGES.length}: ${STAGE_LABELS[i]}`}
              className="group relative h-3 w-3 rounded-full border border-white/40 transition-colors hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
            >
              <span
                ref={(el) => (dotRefs.current[i] = el)}
                className="absolute inset-[2px] rounded-full bg-orange-500"
                style={{ transform: 'scale(0)' }}
              />
            </button>
          ))}
        </div>

        {/* Re-darkens while IslandJourney's curtain slides over */}
        <div ref={exitShadeRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[6] bg-navy-900" style={{ opacity: 0 }} />
      </div>

      {/* Reduced-motion fallback: the finished composition, no pin, no scrub */}
      <div className="hidden motion-reduce:block">
        <div className="mx-auto max-w-[1400px] px-5 py-20 text-center sm:px-8 sm:py-28">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-widest2 text-orange-400">
            The Coconut Island Hopper
          </p>
          <h2
            className="mt-3 font-display font-black uppercase leading-[0.95] tracking-tightest text-white"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
          >
            Discover the Taste of <span className="text-orange-500">Coconut Island</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-serif text-lg italic text-white/80">
            Crisp at the edge, soft at the heart — our signature hopper, surrounded by the bold flavours of Sri Lanka.
          </p>

          <div className="relative mx-auto mt-12 aspect-square w-full max-w-md">
            <img
              src={IMG.topdown}
              alt="Top-down view of a Sri Lankan hopper with a crisp golden edge and soft centre"
              decoding="async"
              className="absolute inset-[6%] h-[88%] w-[88%] object-contain [filter:drop-shadow(0_26px_30px_rgba(4,9,18,0.5))]"
            />
            {SPRITES.map((sp) => (
              <img
                key={sp.src}
                src={sp.src}
                alt=""
                decoding="async"
                className={`absolute ${sp.cls} [filter:drop-shadow(0_16px_20px_rgba(4,9,18,0.55))]`}
              />
            ))}
          </div>

          <p className="mt-10 font-serif text-lg italic text-white/80">
            Fresh Sri Lankan flavours and island vibes in Brighton and Angel.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a href={MENU_HREF} className={primaryBtn}>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              <span className="relative flex items-center gap-2">
                Explore Our Menu
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 transition-transform group-hover:scale-125" />
              </span>
            </a>
            <a href={BOOK_HREF} className={secondaryBtn}>
              Book a Table
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

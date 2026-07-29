import { useEffect, useRef } from 'react';
import { Badge } from './Primitives';

/**
 * "The journey" — a pinned, scroll-scrubbed filmstrip that sits right under
 * the hero. Where the other sections scroll past normally, this one works
 * like the hero: a tall runway (~340vh) with a full-screen sticky stage
 * pinned inside it. Vertical scroll drives a horizontal track of story
 * chapters — Sri Lankan roots → street-food rhythm → Brighton & Angel — so the
 * page reads as: enter the island (hero), then travel across it.
 *
 * The -mt-[100vh] pulls this section up over the hero's exit viewport: the
 * hero stage is still pinned there, so this navy wall slides up over it as
 * a curtain while the hero drifts slowly beneath — the parallax hand-off
 * (see Hero.tsx).
 *
 * Motion rules (owner's): the scroll is never hijacked — progress is pure
 * scrub, so the user's wheel/touch always owns the page. Scroll position
 * only sets a target; the applied progress chases it with the same
 * frame-rate-independent exponential smoothing as the hero, which keeps the
 * two sections feeling like one camera system. Each chapter dwells at
 * center via per-segment smoothstep easing (a soft pause, not a snap trap).
 *
 * Each chapter image is "painted onto the wall" when it arrives: the image
 * sits in an SVG masked by a single roller-snake stroke (pathLength=1, same
 * dashoffset mask trick as the hero's hand-written end plate). The painting
 * itself is TIME-based, not scroll-scrubbed — once a chapter's panel is
 * mostly in view its dashoffset flips and a CSS transition rolls the image
 * on over ~1.6s, however fast or slow the user scrolls. Scrolling back
 * before a chapter's arrival point resets it, so it repaints on return
 * (with hysteresis so the boundary never flickers).
 *
 * Reduced motion: the JS never runs and the motion-reduce classes collapse
 * the runway into a plain vertical stack of chapters, all fully visible —
 * stroke dashoffset defaults to 0 (painted) so the images need no JS.
 */

/**
 * Roller-snake reveal path for a frame `100 × h` viewBox units. Five
 * horizontal passes connected off-canvas (x −10…110) so only the sweeps
 * show; the stroke width overlaps neighbouring passes for full coverage.
 * Scaled by the frame height so the paint-on effect looks identical whatever
 * the image's aspect ratio. pathLength is normalised at render, so the
 * dashoffset animation is length-independent.
 */
function snakePath(h: number) {
  const rows = 5;
  const margin = h * 0.093;
  const step = (h - 2 * margin) / (rows - 1);
  const ys = Array.from({ length: rows }, (_, k) => +(margin + k * step).toFixed(2));
  let d = `M -10 ${ys[0]} L 110 ${ys[0]}`;
  for (let k = 1; k < rows; k++) {
    const prevEndedRight = (k - 1) % 2 === 0;
    const dropX = prevEndedRight ? 110 : -10;
    const sweepX = prevEndedRight ? -10 : 110;
    d += ` L ${dropX} ${ys[k]} L ${sweepX} ${ys[k]}`;
  }
  return { d, strokeWidth: +(h * 0.227).toFixed(2) };
}

const CHAPTERS = [
  {
    eyebrow: 'Chapter 01 — Sri Lankan roots',
    title: (
      <>
        Born on<br />
        <span className="text-orange-500">the island.</span>
      </>
    ),
    copy: 'Sri Lanka — where recipes pass down through generations, spices are ground fresh every morning, and nobody eats alone. That is the island we grew up on, and the one we bring to every plate.',
    img: '/images/jaffna-culture.jpg',
    imgW: 1000,
    imgH: 559,
    alt: 'Street life in Sri Lanka',
  },
  {
    eyebrow: 'Chapter 02 — Street spirit',
    title: (
      <>
        Adding <span className="text-orange-500">music</span>
        <br />
        to the food.
      </>
    ),
    copy: 'Street food back home has a soundtrack — kothu blades drumming on a hot griddle, vendors calling over the crowd. We cook to that rhythm. It is painted on our walls for a reason.',
    img: '/images/rickshaw.jpg',
    imgW: 1200,
    imgH: 2147,
    alt: 'Auto rickshaw on a Sri Lankan street',
  },
  {
    eyebrow: 'Chapter 03 — Brighton & London',
    title: (
      <>
        From the island,<br />
        <span className="text-orange-500">to your table.</span>
      </>
    ),
    copy: 'In 2023 we opened our doors on Brighton’s Western Road — and the island kept growing, all the way to Angel, London. Yaka masks, painted walls, cocktails and kothu.',
    img: '/images/mural.jpg',
    imgW: 1584,
    imgH: 672,
    alt: 'Painted island mural inside The Coconut Island',
  },
];

export function IslandJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let current = 0;
    let target = 0;
    let raf = 0;
    let running = false;
    let last = 0;

    // Same chase rate as the hero so both pinned sections share one feel.
    const RESPONSE = 7.5;
    const N = CHAPTERS.length;

    const imgs = Array.from(
      sectionRef.current?.querySelectorAll<HTMLElement>('[data-journey-img]') ?? []
    );
    const texts = Array.from(
      sectionRef.current?.querySelectorAll<HTMLElement>('[data-journey-text]') ?? []
    );
    const strokes = Array.from(
      sectionRef.current?.querySelectorAll<SVGPathElement>('[data-journey-stroke]') ?? []
    );

    // Painted state per chapter. Strokes start unpainted (dashoffset 1) with
    // transitions off so this init can't animate — the markup default is 0
    // (painted) purely for the no-JS/reduced-motion case. The reflow between
    // the two writes commits the unpainted state before transitions attach.
    const painted = new Array<boolean>(N).fill(false);
    strokes.forEach((s) => {
      s.style.transition = 'none';
      s.style.strokeDashoffset = '1';
    });
    void sectionRef.current?.offsetWidth;
    strokes.forEach((s) => {
      s.style.transition = 'stroke-dashoffset 1600ms cubic-bezier(0.4, 0, 0.2, 1)';
    });

    const setPaint = (k: number, on: boolean) => {
      painted[k] = on;
      const s = strokes[k];
      if (s) s.style.strokeDashoffset = on ? '0' : '1';
    };

    // Section top in viewport-height units — drives chapter 1's arrival,
    // which happens while the stage is still scrolling in (p is stuck at 0
    // until the sticky pin engages).
    let topRatio = 1;

    const readTarget = () => {
      const section = sectionRef.current;
      if (!section) return;
      // Unlike the hero this section isn't at scroll 0, so progress comes
      // from how far the section top has travelled past the viewport top.
      const runway = section.offsetHeight - window.innerHeight;
      const top = section.getBoundingClientRect().top;
      topRatio = top / window.innerHeight;
      target = runway > 0 ? Math.min(1, Math.max(0, -top / runway)) : 0;
    };

    const apply = (p: number) => {
      const track = trackRef.current;
      const bar = barRef.current;
      const counter = counterRef.current;
      if (!track || !bar || !counter) return;

      // Per-segment smoothstep: each chapter eases out of center and eases
      // into the next, so panels dwell readably at center while the scrub
      // stays glued to the scroll direction. TAIL panel-units of runway are
      // reserved after the last chapter centers — without them chapter 3
      // would only settle on the section's final scroll pixel and the next
      // section would cover it immediately.
      const TAIL = 0.4;
      const x = Math.min(N - 1, p * (N - 1 + TAIL));
      const i = Math.min(N - 2, Math.floor(x));
      const f = x - i;
      const eased = i + f * f * (3 - 2 * f);

      track.style.transform = `translate3d(${-eased * 100}vw, 0, 0)`;

      for (let k = 0; k < N; k++) {
        // c = signed distance of panel k from screen center, in panels.
        const c = Math.min(1, Math.max(-1, eased - k));
        const img = imgs[k];
        const text = texts[k];
        const stroke = strokes[k];
        if (img) {
          // Image drifts slower than the track (counter-translate inside its
          // crop) — the parallax that makes the strip read as a camera pan.
          img.style.transform = `translate3d(${c * 8}%, 0, 0) scale(1.18)`;
        }
        if (text) {
          text.style.opacity = String(Math.max(0, 1 - Math.abs(c) * 1.15));
          text.style.transform = `translate3d(${-c * 32}px, 0, 0)`;
        }
        if (stroke) {
          // Arrival trigger, not scrub: flip the painted state once the
          // panel is mostly in view and let the CSS transition roll the
          // image on in its own time. Chapters keep their paint while
          // panning off forward; only retreating back past the arrival
          // point resets them. The gap between the arrive and retreat
          // thresholds is the hysteresis. Chapter 1 arrives while the stage
          // is still scrolling in, so it triggers off topRatio instead.
          const arrived = k === 0 ? topRatio < 0.4 : eased > k - 0.45;
          const retreated = k === 0 ? topRatio > 0.75 : eased < k - 0.55;
          if (!painted[k] && arrived) setPaint(k, true);
          else if (painted[k] && retreated) setPaint(k, false);
        }
      }

      bar.style.transform = `scaleX(${p})`;
      counter.textContent = String(Math.round(x) + 1).padStart(2, '0');
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      current += (target - current) * (1 - Math.exp(-RESPONSE * dt));

      if (Math.abs(target - current) > 0.0006) {
        apply(current);
        raf = requestAnimationFrame(tick);
      } else {
        current = target;
        apply(current);
        running = false;
      }
    };

    const wake = () => {
      if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      readTarget();
      wake();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative -mt-[100vh] h-[340vh] bg-navy-500 motion-reduce:mt-0 motion-reduce:h-auto"
    >
      <div
        className="sticky top-0 h-screen overflow-hidden bg-navy-500 bg-cover bg-center motion-reduce:static motion-reduce:h-auto motion-reduce:overflow-visible"
        style={{ backgroundImage: "url('/images/blue.png')" }}
      >
        {/* Persistent rail: section eyebrow + chapter counter + progress.
            Sits below the fixed header; hidden when the strip is static. */}
        <div
          className="absolute inset-x-0 top-24 z-[1] flex flex-col items-center gap-3 motion-reduce:hidden"
          aria-hidden="true"
        >
          <p className="font-sans text-[11px] font-bold uppercase tracking-widest2 text-yellow-400">
            Our Journey
          </p>
          <div className="flex items-center gap-3">
            <span ref={counterRef} className="font-display text-sm font-bold text-white">
              01
            </span>
            <div className="h-px w-24 overflow-hidden bg-white/20 sm:w-36">
              <div
                ref={barRef}
                className="h-full w-full origin-left bg-orange-500"
                style={{ transform: 'scaleX(0)' }}
              />
            </div>
            <span className="font-display text-sm font-bold text-white/50">
              {String(CHAPTERS.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Horizontal track — one full-screen panel per chapter. The JS
            translates it by -100vw per chapter; reduced motion stacks the
            panels vertically instead. */}
        <div
          ref={trackRef}
          className="flex h-full will-change-transform motion-reduce:h-auto motion-reduce:flex-col"
        >
          {CHAPTERS.map((ch, i) => (
            <div
              key={ch.eyebrow}
              className="relative flex h-full w-screen shrink-0 items-center motion-reduce:h-auto motion-reduce:w-full motion-reduce:py-16"
            >
              <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-8 px-5 pt-28 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:pt-20">
                {/* Image — order alternates per chapter on desktop. The
                    picture lives inside an SVG masked by one roller-snake
                    stroke: five passes across the frame, connected off-canvas
                    so only the horizontal sweeps show. When the chapter
                    arrives the stroke's dashoffset flips and a CSS transition
                    paints the image onto the navy wall over ~1.6s. Default
                    dashoffset 0 keeps it fully painted without JS (reduced
                    motion). */}
                <div className={`flex justify-center ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  {(() => {
                    // Frame height in viewBox units so 100×fh matches the
                    // image's aspect ratio exactly — the painting then fills
                    // the frame with nothing cropped and no letterbox gaps.
                    const fh = Math.round((100 * ch.imgH) / ch.imgW);
                    const { d, strokeWidth } = snakePath(fh);
                    return (
                      <svg
                        data-journey-img
                        width={1000}
                        height={fh * 10}
                        viewBox={`0 0 100 ${fh}`}
                        preserveAspectRatio="xMidYMid meet"
                        className="block h-auto max-h-[42vh] w-auto max-w-full shadow-2xl will-change-transform sm:max-h-[48vh] lg:max-h-[62vh]"
                        role="img"
                        aria-label={ch.alt}
                      >
                        <defs>
                          <mask id={`journey-paint-${i}`}>
                            <path
                              data-journey-stroke
                              d={d}
                              pathLength="1"
                              fill="none"
                              stroke="#fff"
                              strokeWidth={strokeWidth}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeDasharray="1"
                              strokeDashoffset="0"
                            />
                          </mask>
                        </defs>
                        <image
                          href={ch.img}
                          x="0"
                          y="0"
                          width="100"
                          height={fh}
                          preserveAspectRatio="xMidYMid meet"
                          mask={`url(#journey-paint-${i})`}
                        />
                      </svg>
                    );
                  })()}
                </div>

                {/* Text */}
                <div
                  data-journey-text
                  className={`relative will-change-transform ${i % 2 === 1 ? 'lg:order-1' : ''}`}
                >
                  {/* Ghost chapter number behind the heading */}
                  <span
                    className="pointer-events-none absolute -top-14 left-0 select-none font-display text-[7rem] font-black leading-none text-white/5 sm:text-[9rem] lg:-top-20"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <p className="font-sans text-[11px] font-bold uppercase tracking-widest2 text-orange-500">
                    {ch.eyebrow}
                  </p>
                  <h2
                    className="mt-3 font-display font-black uppercase leading-[0.92] tracking-tightest text-white"
                    style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}
                  >
                    {ch.title}
                  </h2>
                  <p className="mt-5 max-w-lg font-serif text-lg leading-relaxed text-white/75 sm:text-xl">
                    {ch.copy}
                  </p>

                  {/* Final chapter hands off to the full story below */}
                  {i === CHAPTERS.length - 1 && (
                    <div className="mt-7 flex flex-wrap items-center gap-6">
                      <Badge tone="yellow" rotate={-4}>#pureislandvibes</Badge>
                      <a
                        href="#bistro"
                        className="font-sans text-[12px] font-bold uppercase tracking-widest2 text-white transition-colors hover:text-orange-500"
                      >
                        Read the full story ↓
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

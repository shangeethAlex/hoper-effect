import { useEffect, useRef } from 'react';
import { Badge } from './Primitives';

/**
 * Cinematic "entering the island" hero.
 *
 * Structure: a tall scroll runway (~330vh) with a full-screen sticky stage
 * pinned inside it. The dolly plays over the first ~230vh; the final 100vh
 * is the parallax exit, where the stage stays pinned and drifts slowly
 * while the next section slides up over it. While the user scrolls through
 * the runway the stage stays fixed and the layers dolly in around the
 * camera:
 *
 *   back   — the venue photo, full-bleed, slowly zooming (we approach it)
 *   mid    — navy vignette that lightens as we step inside
 *   front  — two coconut-palm silhouettes framing the shot, trunks cropped
 *            by the viewport bottom; they split apart, swell and defocus
 *            as the camera passes between them
 *   focus  — the centered headline stack, which grows, blurs and fades
 *            like a sign going out of focus as we walk past it
 *
 * Motion physics: scroll position only sets a target progress; the applied
 * progress chases it with exponential smoothing (frame-rate independent
 * lerp). That keeps the motion glued to the scroll direction — no bounce,
 * no overshoot — but gives every layer a soft, weighty start and stop
 * instead of raw 1:1 tracking. Parallax comes from each layer moving at a
 * different rate: palms (nearest) travel fastest, headline slower, photo
 * (farthest) slowest.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  // const palmLeftRef = useRef<HTMLDivElement>(null);
  // const palmRightRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const writeLine1Ref = useRef<SVGPathElement>(null);
  const writeLine2Ref = useRef<SVGPathElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  // Reveal the hero's own [data-reveal] children directly on mount instead
  // of relying on the app-wide IntersectionObserver: that observer only
  // registers elements once at App mount, so a remounted Hero (HMR, route
  // changes) would otherwise leave the headline stuck at opacity 0.
  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll<HTMLElement>('[data-reveal]');
    const timers: number[] = [];
    els?.forEach((el) => {
      timers.push(window.setTimeout(() => el.classList.add('rv-visible'), 60 + Number(el.dataset.delay ?? 0)));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let current = 0;
    let target = 0;
    // Exit phase: after the dolly completes, the stage stays pinned for one
    // extra viewport of scroll while the next section slides up over it —
    // this progress drives the stage's slow parallax drift under that
    // curtain.
    let exitCurrent = 0;
    let exitTarget = 0;
    let raf = 0;
    let running = false;
    let last = 0;

    // Pointer parallax state: target offset in [-1, 1] set by mousemove,
    // smoothed value applied per-frame — the masks drift with the cursor at
    // depth-proportional rates, which is what sells the 3D.
    let mouseTX = 0;
    let mouseTY = 0;
    let mouseX = 0;
    let mouseY = 0;

    // How quickly the smoothed progress catches the scroll target.
    // Lower = heavier, floatier camera; higher = tighter tracking.
    const RESPONSE = 7.5;
    const MOUSE_RESPONSE = 5;

    // Floating mask cutouts, each tagged with its depth (1 = the headline's
    // focal plane, >1 nearer the camera, <1 further away).
    const masks = Array.from(
      sectionRef.current?.querySelectorAll<HTMLElement>('[data-depth]') ?? []
    );

    const readTarget = () => {
      const section = sectionRef.current;
      if (!section) return;
      // The last viewport of the section is the exit window (the stage is
      // still pinned there while IslandJourney's -mt pulls it up over us),
      // so the dolly runway excludes it: dolly over [0, H-2vh], exit over
      // [H-2vh, H-vh].
      const runway = section.offsetHeight - 2 * window.innerHeight;
      target = runway > 0 ? Math.min(1, Math.max(0, window.scrollY / runway)) : 0;
      exitTarget = runway > 0 ? Math.min(1, Math.max(0, (window.scrollY - runway) / window.innerHeight)) : 0;
    };

    const apply = (p: number, ex: number) => {
      const bg = bgRef.current;
      const overlay = overlayRef.current;
      // const palmL = palmLeftRef.current;
      // const palmR = palmRightRef.current;
      const text = textRef.current;
      const end = endRef.current;
      const write1 = writeLine1Ref.current;
      const write2 = writeLine2Ref.current;
      const cue = cueRef.current;
      const stage = stageRef.current;
      if (!bg || !overlay || !text || !end || !write1 || !write2 || !cue || !stage) return;

      // Ease the raw progress so the dolly gathers speed gently.
      const e = p * p * (3 - 2 * p);

      // Parallax exit: while the journey section slides up over the pinned
      // stage at full scroll speed, the stage itself drifts up at a tenth of
      // it and sinks back into dusk — the depth split that sells the
      // hand-off. (Transforming a sticky element offsets it visually
      // without breaking the pin.)
      stage.style.transform = `translateY(${-ex * 10}vh)`;

      // Farthest layer: the photo creeps toward us.
      bg.style.transform = `scale(${1.08 + e * 0.25})`;

      // The room brightens as we step in off the street, then dims again as
      // the exit curtain covers it.
      overlay.style.opacity = String(0.55 - e * 0.35 + ex * 0.35);

      // Nearest layer: palms split apart, swell past the lens and defocus.
      // A touch of pointer drift keeps them alive even before scrolling.
      // const spread = e * window.innerWidth * 0.55;
      // const rise = e * window.innerHeight * 0.12;
      // palmL.style.transform = `translate(${-spread + mouseX * 14}px, ${rise + mouseY * 8}px) scale(${1 + e * 1.1})`;
      // palmR.style.transform = `translate(${spread + mouseX * 14}px, ${rise + mouseY * 8}px) scale(${1 + e * 1.1})`;
      // palmL.style.filter = palmR.style.filter = `blur(${e * 10}px)`;

      // The headline is the focal plane we walk through. It scales from the
      // start (we're always approaching it) but stays in focus for the first
      // ~35% of the journey — only once the camera is properly moving does
      // it slip past the focal plane, defocus and fade. It counter-drifts
      // against the pointer (opposite the near masks) to deepen the parallax.
      const t = Math.min(1, Math.max(0, (e - 0.35) / 0.55));
      text.style.transform = `translate(${-mouseX * 8}px, ${-mouseY * 5}px) scale(${1 + e * 0.75})`;
      text.style.filter = `blur(${t * 16}px)`;
      text.style.opacity = String(Math.max(0, 1 - t * 1.1));

      // Floating masks: each moves, swells and defocuses at a rate set by
      // its depth — nearer masks fly past the camera sooner and faster.
      // Static blur off the focal plane (|depth − 1|) is the depth-of-field.
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      for (const el of masks) {
        const d = Number(el.dataset.depth ?? 1);
        const dx = Number(el.dataset.dx ?? 0);
        const dy = Number(el.dataset.dy ?? 0);
        const rot = Number(el.dataset.rot ?? 0);

        const x = dx * e * vw * 0.4 * d + mouseX * 22 * d;
        const y = dy * e * vh * 0.3 * d + mouseY * 14 * d;
        el.style.transform = `translate(${x}px, ${y}px) rotate(${rot + e * dx * 16}deg) scale(${1 + e * d * 0.9})`;
        el.style.filter = `blur(${Math.abs(d - 1) * 1.5 + e * d * 7}px) drop-shadow(0 18px 30px rgba(5,12,28,0.45))`;
        el.style.opacity = String(Math.max(0, 1 - Math.max(0, (e - 0.55) / 0.4)));
      }

      // End plate: once the headline has slipped past the focal plane the
      // welcome gets hand-written onto the wall. The plate itself fades in
      // fast, then the two marker strokes write on scroll — each SVG mask
      // path has pathLength=1, so dashoffset 1→0 is "pen travels the line".
      // Scrolling back up literally un-writes it.
      const w = Math.min(1, Math.max(0, (e - 0.72) / 0.26));
      end.style.opacity = String(Math.min(1, w * 4));
      end.style.transform = `translate(${-mouseX * 6}px, ${-mouseY * 4}px)`;
      const p1 = Math.min(1, Math.max(0, (w - 0.08) / 0.47));
      const p2 = Math.min(1, Math.max(0, (w - 0.52) / 0.46));
      write1.style.strokeDashoffset = String(1 - p1);
      write2.style.strokeDashoffset = String(1 - p2);

      // Scroll cue vanishes the moment the journey starts.
      cue.style.opacity = String(Math.max(0, 1 - p * 5));
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      // Frame-rate independent exponential smoothing toward the targets.
      current += (target - current) * (1 - Math.exp(-RESPONSE * dt));
      exitCurrent += (exitTarget - exitCurrent) * (1 - Math.exp(-RESPONSE * dt));
      mouseX += (mouseTX - mouseX) * (1 - Math.exp(-MOUSE_RESPONSE * dt));
      mouseY += (mouseTY - mouseY) * (1 - Math.exp(-MOUSE_RESPONSE * dt));

      const settled =
        Math.abs(target - current) < 0.0006 &&
        Math.abs(exitTarget - exitCurrent) < 0.0006 &&
        Math.abs(mouseTX - mouseX) < 0.002 &&
        Math.abs(mouseTY - mouseY) < 0.002;

      if (!settled) {
        apply(current, exitCurrent);
        raf = requestAnimationFrame(tick);
      } else {
        current = target;
        exitCurrent = exitTarget;
        mouseX = mouseTX;
        mouseY = mouseTY;
        apply(current, exitCurrent);
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

    const onPointerMove = (ev: PointerEvent) => {
      mouseTX = (ev.clientX / window.innerWidth - 0.5) * 2;
      mouseTY = (ev.clientY / window.innerHeight - 0.5) * 2;
      wake();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[330vh] motion-reduce:h-screen"
      id="top"
    >
      {/* Pinned full-screen stage — everything inside dollies while the
          runway scrolls by. overflow-hidden crops the palm trunks at the
          viewport bottom so the trees read as standing beside the camera.
          The section is one viewport taller than the dolly runway: the
          stage stays pinned through that last stretch while IslandJourney
          (pulled up by -mt-[100vh]) slides over it — the parallax exit. */}
      <div ref={stageRef} className="sticky top-0 h-screen overflow-hidden bg-navy-500 will-change-transform">
        {/* ── Back: the venue, full-bleed ── */}
        <div ref={bgRef} className="absolute inset-0 will-change-transform">
          <video
            src="https://res.cloudinary.com/dkvujyej2/video/upload/v1785063649/edrtgv_fk7iyb.mp4"
            poster="/images/hero.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          />
        </div>

        {/* ── Mid: navy dusk that lifts as we enter ── */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-900/70 to-navy-900"
          style={{ opacity: 0.55 }}
          aria-hidden="true"
        />

        {/* ── Front: palm silhouettes framing the shot, bottoms cropped.
              Dark (brightness 0) like real foreground trees in shadow;
              positioned to overhang the bottom edge so their trunks are
              never fully visible. ── */}
        {/* <div
          ref={palmLeftRef}
          className="pointer-events-none absolute -top-[10vh] -left-[34vw] h-[72vh] will-change-transform sm:top-auto sm:-bottom-[14vh] sm:-left-[6vw] sm:h-[105vh]"
          style={{ transformOrigin: '30% 100%' }}
          aria-hidden="true"
        >
          <img
            src="/images/palm-tree.png"
            alt=""
            className="h-full w-auto -scale-x-100 opacity-95"
            style={{ filter: 'brightness(0)' }}
          />
        </div>
        <div
          ref={palmRightRef}
          className="pointer-events-none absolute -top-[10vh] -right-[34vw] h-[72vh] will-change-transform sm:top-auto sm:-bottom-[14vh] sm:-right-[6vw] sm:h-[105vh]"
          style={{ transformOrigin: '70% 100%' }}
          aria-hidden="true"
        >
          <img
            src="/images/palm-tree.png"
            alt=""
            className="h-full w-auto opacity-95"
            style={{ filter: 'brightness(0)' }}
          />
        </div> */}

        {/* ── Focus: centered headline stack ── */}
        <div className="relative z-[1] flex h-full items-center justify-center px-5">
          <div
            ref={textRef}
            className="relative max-w-5xl text-center will-change-transform"
            style={{ transformOrigin: '50% 45%' }}
          >
            <div className="mb-6 flex items-center justify-center" data-reveal="down">
              <Badge tone="yellow" rotate={-6}>★ Since 2023</Badge>
            </div>

            <h1
              className="font-display font-black uppercase leading-[0.88] tracking-tightest text-white [text-shadow:0_2px_40px_rgba(10,20,40,0.55)]"
              style={{ fontSize: 'clamp(2.8rem, 8.5vw, 8rem)' }}
              data-reveal="up"
            >
              Taste the <span className="text-orange-500">Island,</span><br />Feel the{' '}
             Vibes.
            </h1>

            <p
              className="mx-auto mt-6 max-w-xl font-serif text-lg italic text-white/85 sm:text-xl"
              data-reveal="up"
              data-delay="150"
            >
              Authentic Sri Lankan street food, tropical cocktails &amp; island vibes.
            </p>

            <p
              className="mt-5 font-sans text-[11px] font-bold uppercase tracking-widest2 text-white/70"
              data-reveal="up"
              data-delay="220"
            >
              Brighton · Angel, London
            </p>

          </div>
        </div>

        {/* ── End plate: the welcome hand-written on the wall as we arrive.
              The marker text sits inside an SVG whose mask is two fat zigzag
              strokes tracing each line (paths generated + coverage-verified
              against the actual Permanent Marker glyphs); the scroll handler
              drives their dashoffset so the words write on as you scroll in.
              Hidden for reduced motion (the handler never runs, so it stays
              at opacity 0 — the headline stays instead). ── */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center px-5"
          aria-hidden="true"
        >
          <div ref={endRef} className="text-center will-change-transform" style={{ opacity: 0 }}>
            <p className="font-sans text-[11px] font-bold uppercase tracking-widest2 text-yellow-400">
              #pureislandvibes
            </p>
            <svg
              viewBox="0 0 900 369"
              className="mx-auto mt-2 w-[min(92vw,640px)]"
              style={{ filter: 'drop-shadow(0 2px 24px rgba(10,20,40,0.55))' }}
            >
              <defs>
                <mask id="hero-write-mask">
                  <path
                    ref={writeLine1Ref}
                    d="M 90 87 L 136 121 L 182 87 L 229 121 L 275 87 L 321 121 L 367 87 L 413 121 L 460 87 L 506 121 L 552 87 L 598 121 L 644 87 L 691 121 L 737 87 L 783 121 L 829 87"
                    pathLength="1"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="100"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="1"
                    strokeDashoffset="1"
                  />
                  <path
                    ref={writeLine2Ref}
                    d="M 142 278 L 181 307 L 220 278 L 259 307 L 298 278 L 337 307 L 376 278 L 416 307 L 455 278 L 494 307 L 533 278 L 572 307 L 611 278 L 650 307 L 689 278 L 728 307 L 767 278"
                    pathLength="1"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="85"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="1"
                    strokeDashoffset="1"
                  />
                </mask>
              </defs>
              <g
                mask="url(#hero-write-mask)"
                style={{ fontFamily: "'Permanent Marker', cursive", fontSize: '110px' }}
              >
                <text x="450" y="143" textAnchor="middle" fill="#fff">
                  Welcome to
                </text>
                <text x="450" y="325" textAnchor="middle" fill="#fff">
                  the <tspan fill="#f2914d">island</tspan>.
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* ── 3D mask layer — cutouts floating IN FRONT of the headline at
              three camera depths (data-depth: 1 = the headline's focal
              plane, >1 nearer, <1 farther). The scroll handler flies each
              one outward past the lens at a depth-proportional rate, and
              pointer movement drifts them for the parallax-3D feel.
              data-dx/data-dy set each mask's escape direction. ── */}
        <div className="pointer-events-none absolute inset-0 z-[2]" aria-hidden="true">
          {/* Far — small, behind the focal plane, softly out of focus */}
          {/* <div
            data-depth="0.45"
            data-dx="-0.7"
            data-dy="-0.4"
            data-rot="-14"
            className="absolute left-[14%] top-[18%] w-14 will-change-transform sm:left-[18%] sm:w-20"
            style={{ transform: 'rotate(-14deg)' }}
          >
            <img src="/images/kolam-yaka-transparent.png" alt="" className="w-full opacity-80" />
          </div> */}

          {/* Mid — on the focal plane */}
          {/* <div
            data-depth="1"
            data-dx="0.85"
            data-dy="-0.25"
            data-rot="9"
            className="absolute right-[10%] top-[22%] w-24 will-change-transform sm:right-[16%] sm:w-32 lg:w-40"
            style={{ transform: 'rotate(9deg)' }}
          >
            <img src="/images/mask1-cutout.png" alt="" className="w-full" />
          </div> */}

          {/* Near — big, closest to the camera, shallow depth-of-field blur */}
          {/* <div
            data-depth="1.7"
            data-dx="-0.9"
            data-dy="0.6"
            data-rot="-10"
            className="absolute bottom-[14%] left-[6%] w-36 will-change-transform sm:left-[9%] sm:w-48 lg:w-60"
            style={{ transform: 'rotate(-10deg)' }}
          >
            <img src="/images/peacock_yaka.png" alt="" className="w-full" />
          </div> */}
        </div>

        {/* ── Scroll cue ── */}
        <div
          ref={cueRef}
          className="absolute inset-x-0 bottom-8 z-[1] flex flex-col items-center gap-2 text-white/70"
          aria-hidden="true"
        >
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest2">
            Scroll to enter
          </span>
          <span className="animate-bounce text-lg leading-none">↓</span>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";

// Tilted feature cards in one row that drives sideways as you scroll down (and back as you scroll
// up), first built for the LMS page. Shared: the design and behaviour live here; pages pass only
// their content.
//
// Props:
//   features  [{ icon, title, text }], icon being an icon element, e.g. <Layers /> (elements, not
//             components, so server pages can pass them; sized and stroked here)
//   guide     the AI Guide step (data-guide) for the section
//   label     an accessible name for the section when there is no heading
//   heading   optional { title, text }: a centred heading and intro inside the pinned section,
//             above the row, so they stay on screen while the cards drive past
//
// The cards keep their own tilt; the speed effects (stretch, lean) sit on a wrapper around each
// card so every card stretches about its own centre, and the motion blur is one SVG filter on the
// whole row. Without JavaScript the row is a normal horizontal scroller instead. Sizes and the
// stretch/lean transforms are in globals.css (.lms-drive, .hs-*).

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// The four card styles from the LMS design, used in order and repeated: deep navy, pale blue (with
// a blue icon tile instead of a white one), bright blue, royal blue.
const tones = [
  { card: "from-[#0b347f] to-[#072763]", tile: "bg-white text-[#0b347f]" },
  { card: "from-[#8dbbf3] to-[#a6cbf7]", tile: "bg-[#1f63da] text-white" },
  { card: "from-[#2b78ef] to-[#3d88f6]", tile: "bg-white text-[#1f63da]" },
  { card: "from-[#0a4fd8] to-[#1259e6]", tile: "bg-white text-[#0a4fd8]" },
];

// Each card's tilt (deg), alternating like the design so the row reads as hand-placed cards
const tilts = [-8, 5, -6, 4, -7, 5, -5, 6, -7];

// Car physics: the row is a mass on a spring pulled towards the scroll position. A stiff, slightly
// under-damped spring builds speed smoothly when scrolling starts (accelerating), trails the scroll a
// little at speed, and when scrolling stops it brakes hard and runs a touch past the mark before
// settling back (the forward pull). All of it follows the real scroll speed, not a fixed animation.
const STIFFNESS = 380; // 1/s²
const DAMPING = 2 * Math.sqrt(STIFFNESS) * 0.6; // damping ratio 0.6: ~10% overshoot after a hard stop
const STEP = 1 / 240; // physics substep (s), so the spring is stable at any frame rate
// Speed effects, by row speed (px/s) and acceleration (px/s²)
const STRETCH_PER_SPEED = 1 / 45000; // horizontal stretch: +2% at 900px/s
const MAX_STRETCH = 0.06;
const BLUR_FROM = 500; // px/s before motion blur starts
const BLUR_PER_SPEED = 1 / 700; // px of horizontal blur per px/s above BLUR_FROM
const MAX_BLUR = 3.5;
const LEAN_PER_ACCEL = 1 / 2600; // deg of lean per px/s²: back when speeding up, forward when braking
const MAX_LEAN = 5;

// The section pins (sticky) while the spacer below it scrolls past; the spacer is exactly as tall as
// the row is wider than the screen, so scrolling down 1px asks the row to move 1px left. The row
// itself follows through the spring above. One scroll handler sets the target; a rAF loop runs the
// physics only while the row is moving and stops once it has settled.
function useCarScroll(stageRef, sectionRef, viewportRef, trackRef, spacerRef, blurRef) {
  useEffect(() => {
    const stage = stageRef.current;
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const spacer = spacerRef.current;
    const blur = blurRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let pinTop = 0;
    let maxShift = 0;
    let x = 0; // row position (px, ≤ 0)
    let v = 0; // row speed (px/s)
    let lean = 0; // smoothed lean (deg)
    let last = 0;
    let raf = 0;
    let blurOn = false;
    // False once unmounted: callbacks that outlive the section (document.fonts.ready) must not
    // touch its elements
    let alive = true;

    const target = () => {
      const range = stage.offsetHeight - section.offsetHeight;
      const p = range > 0 ? clamp((pinTop - stage.getBoundingClientRect().top) / range, 0, 1) : 0;
      return -p * maxShift;
    };

    const render = (accel) => {
      track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
      if (reduced) return;
      const speed = Math.abs(v);
      lean += (clamp(accel * LEAN_PER_ACCEL, -MAX_LEAN, MAX_LEAN) - lean) * 0.25;
      track.style.setProperty("--hs-stretch", (1 + Math.min(speed * STRETCH_PER_SPEED, MAX_STRETCH)).toFixed(4));
      track.style.setProperty("--hs-lean", `${lean.toFixed(3)}deg`);
      const b = clamp((speed - BLUR_FROM) * BLUR_PER_SPEED, 0, MAX_BLUR);
      if (b > 0.2) {
        blur.setAttribute("stdDeviation", `${b.toFixed(2)} 0`);
        if (!blurOn) track.style.filter = "url(#hs-motion-blur)";
        blurOn = true;
      } else if (blurOn) {
        track.style.filter = "";
        blurOn = false;
      }
    };

    const frame = (now) => {
      const goal = target();
      if (reduced) {
        x = goal;
        render(0);
        raf = 0;
        return;
      }
      const dt = Math.min((now - last) / 1000, 1 / 20);
      last = now;
      const v0 = v;
      for (let t = 0; t < dt; t += STEP) {
        const h = Math.min(STEP, dt - t);
        v += (STIFFNESS * (goal - x) - DAMPING * v) * h;
        x += v * h;
      }
      render(dt > 0 ? (v - v0) / dt : 0);
      // Settled: snap exactly onto the mark and let the loop sleep until the next scroll
      if (Math.abs(goal - x) < 0.05 && Math.abs(v) < 0.5 && Math.abs(lean) < 0.01) {
        x = goal;
        v = 0;
        lean = 0;
        render(0);
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const measure = () => {
      maxShift = Math.max(0, track.scrollWidth - viewport.clientWidth);
      spacer.style.height = `${maxShift}px`;
      // Centre the pinned section on screen; one taller than the screen pins with its bottom showing
      const free = window.innerHeight - section.offsetHeight;
      pinTop = free >= 0 ? free / 2 : free;
      section.style.top = `${pinTop}px`;
    };

    const onResize = () => {
      if (!alive || !track.isConnected) return;
      measure();
      // Jump straight to the new spot: a resize shouldn't make the row drive across the screen
      x = target();
      v = 0;
      render(0);
    };

    onResize();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(track);
    document.fonts?.ready.then(onResize);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [stageRef, sectionRef, viewportRef, trackRef, spacerRef, blurRef]);
}

export default function FeatureDriveSection({ features, guide, label, heading }) {
  const stageRef = useRef(null);
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const spacerRef = useRef(null);
  const blurRef = useRef(null);
  useCarScroll(stageRef, sectionRef, viewportRef, trackRef, spacerRef, blurRef);
  const titleId = `${guide}-title`;

  return (
    // --hs-count: the number of cards, for the spacer's size before the script measures it
    <div ref={stageRef} className="lms-drive relative" style={{ "--hs-count": features.length }}>
      <noscript>
        <style>{`.hs-viewport { overflow-x: auto; } .hs-spacer { display: none; }`}</style>
      </noscript>

      {/* Horizontal-only Gaussian blur: the motion blur. Its strength is set per frame. */}
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <filter id="hs-motion-blur" x="-5%" y="0" width="110%" height="100%">
          <feGaussianBlur ref={blurRef} stdDeviation="0 0" />
        </filter>
      </svg>

      <section
        ref={sectionRef}
        data-guide={guide}
        data-guide-ref="parent"
        aria-label={heading ? undefined : label}
        aria-labelledby={heading ? titleId : undefined}
        className="sticky top-0 bg-white"
      >
        {heading && (
          <div className="mx-auto max-w-[56rem] px-4 pt-12 text-center sm:px-6 sm:pt-14">
            <h2
              id={titleId}
              className="text-[28px] font-semibold leading-[1.22] tracking-tight text-[#0a2463] sm:text-[34px] lg:text-[clamp(34px,2.9vw,42px)]"
            >
              {heading.title}
            </h2>
            <p className="mx-auto mt-3 max-w-[48rem] text-[15px] leading-snug text-[#1d2f63] sm:text-[17px] lg:text-[clamp(16px,1.25vw,18px)]">
              {heading.text}
            </p>
          </div>
        )}

        <div ref={viewportRef} className="hs-viewport overflow-hidden">
          {/* Vertical padding leaves room for the tilted corners and shadows */}
          <ul
            ref={trackRef}
            className="flex w-max items-stretch gap-(--hs-gap) px-(--hs-pad) py-14 will-change-transform sm:py-16"
          >
            {features.map((feature, i) => {
              const tone = tones[i % tones.length];
              return (
                <li key={feature.title} className="hs-motion flex w-(--hs-card) shrink-0">
                  <article
                    className={`flex min-h-[calc(var(--hs-card)*1.3)] w-full flex-col rounded-2xl bg-linear-to-br p-6 text-white shadow-[0_18px_40px_-12px_rgba(0,36,97,0.35)] lg:p-7 ${tone.card}`}
                    style={{ rotate: `${tilts[i % tilts.length]}deg` }}
                  >
                    <span
                      aria-hidden="true"
                      className={`flex size-10 items-center justify-center rounded-lg shadow-[0_4px_10px_rgba(0,36,97,0.15)] [&>svg]:size-5 [&>svg]:stroke-[1.8] ${tone.tile}`}
                    >
                      {feature.icon}
                    </span>
                    <h3 className="mt-7 text-[clamp(20px,1.7vw,24px)] font-medium leading-tight">{feature.title}</h3>
                    <p className="mt-4 text-[clamp(13px,1vw,15px)] leading-normal text-white/90">{feature.text}</p>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Pinned scroll distance: as tall as the row is wider than the screen (sized in CSS so the
          page doesn't jump on load; the script then sets the exact figure) */}
      <div ref={spacerRef} aria-hidden="true" className="hs-spacer" />
    </div>
  );
}

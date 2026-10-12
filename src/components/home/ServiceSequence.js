"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";

const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const ease = (t) => 1 - Math.pow(1 - t, 3);

// Breakpoints for picking a timing preset: <640 = mobile, 640-1279 = tablet /
// 1024px-laptop, >=1280 = full desktop.
const TABLET_MIN_WIDTH = 640;
const DESKTOP_MIN_WIDTH = 1280;

// Scroll units (1 unit = 1 viewport height) that lay out the sequence. Each
// tier gets a shorter timeline than the one above it, so the section's total
// scroll height — and how long it stays pinned — scales down with the
// viewport instead of every non-mobile size playing the same full sequence.
const TIMING = {
  desktop: {
    holdStart: 0.1, // brief pause once pinned, before the first card starts leaving
    cardLen: 0.78, // scroll it takes one card to fully exit (and the next to fully arrive)
    cardStagger: 0.72, // scroll between the start of consecutive exits (< cardLen, so motion never stops dead)
    holdEnd: 0.32, // extra pinned scroll once the last card has settled, before the page moves on
  },
  tablet: {
    holdStart: 0.08,
    cardLen: 0.7,
    cardStagger: 0.62,
    holdEnd: 0.25,
  },
  mobile: {
    holdStart: 0.05,
    cardLen: 0.58,
    cardStagger: 0.5,
    holdEnd: 0.15,
  },
};

function pickPreset(width) {
  if (width >= DESKTOP_MIN_WIDTH) return TIMING.desktop;
  if (width >= TABLET_MIN_WIDTH) return TIMING.tablet;
  return TIMING.mobile;
}

// Depth keyframes describing a card's look at stack position `s`:
// s = -1   → fully thrown clear of the stack (toward the viewer, faded out)
// s = -0.4 → mid-flight: already lifting, turning and growing
// s =  0   → front of the stack, at rest
// s =  1   → one layer back
// s =  2   → two layers back
// x/y/z are px translation, rotX/Y/Z are deg rotation (rotZ = the in-plane "flick" tilt).
const FRAMES = [
  { s: -1, x: 44, y: -165, z: 170, scale: 1.24, opacity: 0, rotX: -18, rotY: 8, rotZ: 13 },
  { s: -0.4, x: 16, y: -55, z: 60, scale: 1.08, opacity: 0.85, rotX: -7, rotY: 3, rotZ: 5 },
  { s: 0, x: 0, y: 0, z: 0, scale: 1, opacity: 1, rotX: 0, rotY: 0, rotZ: 0 },
  { s: 1, x: 0, y: 20, z: -60, scale: 0.94, opacity: 1, rotX: 3, rotY: 0, rotZ: 0 },
  { s: 2, x: 0, y: 38, z: -120, scale: 0.88, opacity: 1, rotX: 5, rotY: 0, rotZ: 0 },
];
const FRAME_KEYS = ["x", "y", "z", "scale", "opacity", "rotX", "rotY", "rotZ"];

function sampleFrame(s) {
  const lo = FRAMES[0].s;
  const hi = FRAMES[FRAMES.length - 1].s;
  const clamped = clamp(s, lo, hi);
  let a = FRAMES[0];
  let b = FRAMES[FRAMES.length - 1];
  for (let i = 0; i < FRAMES.length - 1; i++) {
    if (clamped >= FRAMES[i].s && clamped <= FRAMES[i + 1].s) {
      a = FRAMES[i];
      b = FRAMES[i + 1];
      break;
    }
  }
  const span = b.s - a.s || 1;
  const t = (clamped - a.s) / span;
  const out = {};
  for (const key of FRAME_KEYS) out[key] = a[key] + (b[key] - a[key]) * t;
  return out;
}

function frameStyle(s) {
  const f = sampleFrame(s);
  const transform =
    `translate3d(${f.x.toFixed(2)}px, ${f.y.toFixed(2)}px, ${f.z.toFixed(2)}px) ` +
    `rotateX(${f.rotX.toFixed(2)}deg) rotateY(${f.rotY.toFixed(2)}deg) rotateZ(${f.rotZ.toFixed(2)}deg) ` +
    `scale(${f.scale.toFixed(4)})`;
  return {
    transform,
    opacity: clamp(f.opacity, 0, 1),
    zIndex: Math.round((2 - clamp(s, -1, 2)) * 10),
  };
}

// The title/description/caption only read as "attached" to whichever card is
// at the front (s = 0). Cards behind it keep that text hidden — both so
// labels don't stack on top of one another, and because the front card's
// gradient overlay isn't fully opaque, so readable text sitting directly
// behind it would otherwise ghost through.
const revealOpacity = (s) => clamp(1 - Math.abs(s), 0, 1);

function timelineLength(count, timing) {
  const transitions = Math.max(0, count - 1);
  return timing.holdStart + transitions * timing.cardStagger + timing.cardLen + timing.holdEnd;
}

// Pins the title + card stack together and, as you scroll, lifts the front card out
// toward the viewer and fades it away while the next card slides forward to take its
// place — repeating for every card, then releasing the pin. Scrolling back up
// reverses the same timeline. Respects prefers-reduced-motion with a static,
// non-pinned stack.
export default function ServiceSequence({ services, title }) {
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const presetRef = useRef(TIMING.desktop);
  const initialTimelineEnd = timelineLength(services.length, TIMING.desktop);

  // Picks the mobile/tablet/desktop timing before the browser paints, so the
  // tall scroll-runway never visibly resizes after load.
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const applyPreset = () => {
      presetRef.current = pickPreset(window.innerWidth);
      const end = timelineLength(services.length, presetRef.current);
      track.style.height = `${(end * 100).toFixed(2)}svh`;
    };
    applyPreset();
    window.addEventListener("resize", applyPreset);
    return () => window.removeEventListener("resize", applyPreset);
  }, [services.length]);

  useEffect(() => {
    const track = trackRef.current;
    const cards = cardRefs.current.filter(Boolean);
    if (!track || !cards.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.classList.add("svc-static");
      return;
    }

    const transitions = Math.max(0, cards.length - 1);
    let vh = 0;
    let top = 0;
    let timelineEnd = timelineLength(cards.length, presetRef.current);
    let raf = 0;
    let last = 0;
    let cur = -1;

    const measure = () => {
      vh = window.innerHeight;
      top = track.getBoundingClientRect().top + window.scrollY;
      timelineEnd = timelineLength(cards.length, presetRef.current);
    };

    const pAt = (u, at) => ease(clamp((u - at) / presetRef.current.cardLen));

    const apply = (u) => {
      const uu = Math.max(0, u - presetRef.current.holdStart);
      const pTrans = [];
      for (let k = 0; k < transitions; k++) pTrans.push(pAt(uu, k * presetRef.current.cardStagger));

      cards.forEach((el, i) => {
        let s = i;
        for (let k = 0; k <= Math.min(i, transitions - 1); k++) s -= pTrans[k];
        const { transform, opacity, zIndex } = frameStyle(s);
        el.style.transform = transform;
        el.style.opacity = String(opacity);
        el.style.zIndex = String(zIndex);
        const reveal = String(revealOpacity(s));
        const caption = el.querySelector('[data-seq="caption"]');
        if (caption) caption.style.opacity = reveal;
        const face = el.querySelector('[data-seq="reveal"]');
        if (face) face.style.opacity = reveal;
      });
    };

    const tick = (now) => {
      raf = 0;
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      const target = clamp((window.scrollY - top) / vh, 0, timelineEnd);
      cur = cur < 0 ? target : cur + (target - cur) * (1 - Math.exp(-dt / 110));
      apply(cur);
      if (Math.abs(target - cur) > 0.0004) raf = requestAnimationFrame(tick);
      else last = 0;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onResize = () => {
      measure();
      schedule();
    };

    track.classList.add("svc-pinned");
    measure();
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    document.fonts?.ready.then(onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      track.classList.remove("svc-pinned");
      cards.forEach((el) => {
        el.style.transform = "";
        el.style.opacity = "";
        el.style.zIndex = "";
        const caption = el.querySelector('[data-seq="caption"]');
        if (caption) caption.style.opacity = "";
        const face = el.querySelector('[data-seq="reveal"]');
        if (face) face.style.opacity = "";
      });
    };
  }, [services.length]);

  return (
    <div ref={trackRef} style={{ height: `${(initialTimelineEnd * 100).toFixed(2)}svh` }}>
      {/* Fills the viewport while pinned (min-h-svh, not a partial height) so the sticky box
          never leaves a strip of empty space below it — title and cards are centred together
          inside it via flex, so both hold still in the middle of the screen for the whole
          scroll-driven animation instead of the cards alone sticking to the top edge. */}
      <div
        data-seq="stage"
        className="sticky top-0 flex min-h-svh flex-col items-center justify-center gap-8 px-4 py-8 sm:gap-10 sm:px-6 lg:gap-12 lg:px-8 [perspective:1600px]"
      >
        {title && <div className="mx-auto w-full max-w-[1320px]">{title}</div>}
        <ul data-seq="stack" className="relative mx-auto w-full max-w-[380px] list-none p-0">
          <li aria-hidden="true" data-seq="sizer" className="invisible">
            <CardInner {...services[0]} />
          </li>
          {services.map((service, i) => {
            const { transform, opacity, zIndex } = frameStyle(i);
            return (
              <li
                key={service.title}
                ref={(el) => (cardRefs.current[i] = el)}
                data-seq="card"
                className="absolute inset-0 [backface-visibility:hidden]"
                style={{ transform, opacity, zIndex }}
              >
                <CardInner {...service} revealOpacity={revealOpacity(i)} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function CardInner({ image, title, content, revealOpacity = 1 }) {
  return (
    <div className="relative w-full [container-type:inline-size]">
      <div className="relative aspect-[667/390] w-full overflow-hidden rounded-[20px]">
        <Image
          src={image}
          alt={title}
          fill
          unoptimized
          sizes="(min-width: 480px) 380px, 90vw"
          className="object-cover"
        />
        {/* Gradient + text only fully shows for the front card — layers behind it are
            still translucent here, so a visible readout would ghost through onto the
            card in front of them. */}
        <div data-seq="reveal" style={{ opacity: revealOpacity }}>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#00142f]/90 via-[#00142f]/35 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <h3 className="text-[clamp(14px,4.5cqw,30px)] font-semibold leading-[1.2] text-white">
              {title}
            </h3>
            <p className="mt-1.5 text-[clamp(11px,3cqw,20px)] leading-[1.4] text-white/90">
              {content}
            </p>
          </div>
        </div>
      </div>

      <p
        data-seq="caption"
        style={{ opacity: revealOpacity }}
        className="mt-4 text-center text-[18px] font-medium text-[#1163B8] sm:text-[20px]"
      >
        {title}
      </p>
    </div>
  );
}

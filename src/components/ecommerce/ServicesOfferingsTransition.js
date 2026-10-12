"use client";

import { useEffect, useRef } from "react";

const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

// Scroll-linked hand-off from the Services section to the Offerings section.
// Services pins (sticky) and the whole Offerings section, its background ([data-offer-bg]: white
// backdrop, glow, light bands, spire) and its cards together, slides up over it at exactly the
// scroll speed, so they always stay aligned and the motion never speeds up, stalls or jumps. Services
// stays on screen until Offerings has fully covered it; only then does it leave (hidden underneath).
// Scrolling up reverses it 1:1. The only per-frame write is the opacity of the soft leading edge,
// which fades in as the two sections start to overlap. Without JS, or with reduced motion, the two
// sections simply stack as normal.
export default function ServicesOfferingsTransition({ services, offerings }) {
  const stageRef = useRef(null);
  const pinRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const pin = pinRef.current;
    const section = stage?.querySelector("[data-offer-section]");
    const edge = section?.querySelector("[data-offer-bg-edge]");
    if (!pin || !section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;

    const measure = () => {
      // Pin at the top; a Services section taller than the screen pins with its bottom on-screen instead.
      pin.style.position = "sticky";
      pin.style.top = `${Math.min(0, window.innerHeight - pin.offsetHeight)}px`;
    };

    const update = () => {
      raf = 0;
      if (!edge) return;
      // How far Offerings has slid over Services; the soft top edge ramps in over the first 128px.
      const overlap = pin.getBoundingClientRect().bottom - section.getBoundingClientRect().top;
      edge.style.opacity = clamp(overlap / 128).toFixed(3);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      schedule();
    };

    measure();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(pin);
    document.fonts?.ready.then(onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      [pin, edge].forEach((el) => el && el.removeAttribute("style"));
    };
  }, []);

  return (
    // Services and Offerings share this box, so Services stays pinned for as long as Offerings is
    // sliding over it, and is released only once it is completely covered. data-guide-anchor: the
    // AI guide measures Services by this (never sticky) box, so pinning can't skew its position.
    <div ref={stageRef} data-guide-anchor className="relative">
      <div ref={pinRef} className="relative z-0">
        {services}
      </div>
      {/* Above Services, so the incoming section (background and cards together) covers it */}
      <div className="relative z-10">{offerings}</div>
    </div>
  );
}

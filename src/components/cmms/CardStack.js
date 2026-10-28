"use client";

import { useEffect, useRef } from "react";

const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

// Scroll-linked card stack. Every card ([data-stack-card]) pins (sticky) at the same line, centred in
// the space below the floating navbar, so each card scrolls up at exactly the scroll speed and lands
// squarely on top of the one before (later cards paint above earlier ones). As the next card rises,
// the pinned one eases back: it shrinks slightly towards its top edge, lifts a little so its rim
// peeks out above the incoming card, and fades out over the last part of the hand-off, so by the time
// it is fully covered it has gone. Scrolling up reverses it 1:1. Card heights and positions never
// change, so nothing below shifts; the only per-frame writes are transform and opacity.
// A card taller than the space (mobile) pins with its bottom on-screen instead, so it is always read
// in full. Without JS, or with reduced motion, the cards simply stack as normal.
export default function CardStack({ className, children }) {
  const listRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;
    const cards = list ? [...list.querySelectorAll("[data-stack-card]")] : [];
    if (cards.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tops = [];

    const measure = () => {
      const vh = window.innerHeight;
      // Clear the floating navbar (fixed, ~16-24px from the top), with a little air below it
      const header = document.querySelector("header");
      const clear = (header ? header.getBoundingClientRect().bottom : 80) + 16;
      tops = cards.map((card) => {
        const h = card.offsetHeight;
        const top = h <= vh - clear - 16 ? clear + (vh - clear - h) / 2 : vh - h - 16;
        card.style.position = "sticky";
        card.style.top = `${Math.round(top)}px`;
        card.style.transformOrigin = "50% 0";
        card.style.willChange = "transform, opacity";
        return Math.round(top);
      });
    };

    const update = () => {
      raf = 0;
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        // 0 while the next card is a full card-height away from its pin line, 1 once it has landed
        const h = card.offsetHeight;
        const p = clamp(1 - (next.getBoundingClientRect().top - tops[i + 1]) / h);
        const fade = clamp((p - 0.55) / 0.45);
        card.style.transform = p ? `translate3d(0, ${(-18 * p).toFixed(2)}px, 0) scale(${(1 - 0.06 * p).toFixed(4)})` : "";
        card.style.opacity = fade ? (1 - fade).toFixed(3) : "";
      });
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
    cards.forEach((card) => ro.observe(card));
    document.fonts?.ready.then(onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      cards.forEach((card) => card.removeAttribute("style"));
    };
  }, []);

  return (
    <ul ref={listRef} className={className}>
      {children}
    </ul>
  );
}

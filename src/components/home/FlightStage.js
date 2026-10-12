"use client";

import { useEffect, useRef } from "react";

const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Scroll-linked hand-off between the "Welcome" section and the flight section.
// 1. Welcome stays pinned while a large rocket flies out of its small rocket icon
//    and settles into its final position in the flight section.
// 2. Only once it has landed does Welcome fade out and the flight cards appear.
// Without JS or with reduced motion, the sections simply stack normally.
export default function FlightStage({ children }) {
  const stageRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const prev = stage.querySelector(".flight-prev");
    const spacer = stage.querySelector(".flight-spacer");
    const section = stage.querySelector(".flight-section");
    const box = stage.querySelector(".flight-rocket");
    const fly = stage.querySelector(".flight-rocket-inner");
    const cards = stage.querySelector(".flight-cards");
    const iconBtn = stage.querySelector("[data-rocket]")?.closest("button");
    // A separate wrapper is faded (not the <img>) so RocketLink's own click animation is untouched.
    const iconFade = stage.querySelector("[data-flight-icon]");
    if (!prev || !spacer || !section || !box || !fly || !cards || !iconBtn) return;

    stage.classList.add("flight-js");

    let vh = 0;
    let boxOffset = 0; // rocket-box centre, relative to the section top (layout only)
    let raf = 0;

    const measure = () => {
      vh = window.innerHeight;
      const h = prev.offsetHeight;
      const pinTop = Math.max(80, (vh - h) / 2);
      prev.style.top = `${pinTop}px`;
      // The pinned section starts to hold as the flight section begins to enter.
      spacer.style.height = `${Math.max(0, vh - pinTop - h)}px`;
      boxOffset =
        box.getBoundingClientRect().top - section.getBoundingClientRect().top + box.offsetHeight / 2;
    };

    const update = () => {
      raf = 0;
      const sTop = section.getBoundingClientRect().top;
      const arrive = vh * 0.25; // section top when the rocket has landed

      // Phase 1: the rocket flies from the icon to its final spot.
      const f = clamp((vh - sTop) / (vh - arrive));
      const p = ease(f);
      const b = box.getBoundingClientRect();
      const i = iconBtn.getBoundingClientRect();
      const nx = b.left + b.width / 2;
      const ny = sTop + boxOffset;
      const dx = (i.left + i.width / 2 - nx) * (1 - p);
      const dy = (i.top + i.height / 2 - ny) * (1 - p);
      const s0 = clamp((i.width / box.offsetWidth) * 1.5, 0.08, 0.6);
      const scale = s0 + (1 - s0) * p;
      const appear = clamp(f / 0.1);
      fly.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${35 * (1 - p)}deg) scale(${scale})`;
      fly.style.opacity = String(appear);
      if (iconFade) iconFade.style.opacity = String(1 - appear);
      // Once the big rocket has left, the hidden icon must not be clickable.
      iconBtn.style.pointerEvents = appear > 0.5 ? "none" : "";

      // Phase 2: only after landing, Welcome leaves and the cards arrive.
      const g = clamp((arrive - sTop) / (vh * 0.5));
      prev.style.opacity = String(1 - g);
      prev.style.transform = g > 0 ? `scale(${1 - 0.05 * g})` : "";
      cards.style.opacity = String(g);
      cards.style.transform = `translate3d(0, ${(1 - g) * 24}px, 0)`;
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
    document.fonts?.ready.then(onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      stage.classList.remove("flight-js");
      [prev, spacer, fly, cards, iconFade, iconBtn].forEach((el) => el && el.removeAttribute("style"));
    };
  }, []);

  return (
    <div ref={stageRef} className="flight-stage">
      {children}
    </div>
  );
}

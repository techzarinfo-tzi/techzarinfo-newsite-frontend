"use client";

import { useLayoutEffect, useRef } from "react";

// Plays the process section's motion (globals.css .proc-*). Every [data-proc-watch] element inside
// gets data-in once it scrolls into view: the desktop diagram as a whole, and each stacked card or
// arrow on its own below lg, so the long mobile list plays as you reach each step. Server render,
// no JS and reduced motion all show everything at rest: the pieces are only hidden once this has
// marked the wrapper ready (before paint).
export default function ProcessMotion({ children, className }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    root.dataset.proc = "ready";
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.dataset.in = "";
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    root.querySelectorAll("[data-proc-watch]").forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      delete root.dataset.proc;
      root.querySelectorAll("[data-proc-watch]").forEach((el) => delete el.dataset.in);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

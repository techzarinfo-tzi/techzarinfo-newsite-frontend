"use client";

import { useEffect, useRef } from "react";
import "./BottomBlur.css";

const LAYERS = 6;

// Fixed blur strip along the bottom of the viewport (see BottomBlur.css). Content sharpens as it
// scrolls up out of the strip; the last stretch of the page can't scroll any higher, so the strip
// fades out as the page bottom arrives and the footer's final lines end up fully readable.
export default function BottomBlur() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const remaining = doc.scrollHeight - (window.scrollY + window.innerHeight);
      const opacity = Math.min(1, Math.max(0, remaining / el.offsetHeight));
      el.style.opacity = String(opacity);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Page height changes (lazy images, accordions, route changes) move where the bottom is.
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className="bottom-blur" aria-hidden="true">
      {Array.from({ length: LAYERS }, (_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}

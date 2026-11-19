"use client";

import { useEffect, useRef } from "react";
import { COVERED_EVENT } from "@/components/ai/AiHero";

// Cinematic hand-over from the AI hero to the section after it. The hero stays pinned (sticky) while
// the next section (children) scrolls up over it, rising out of a tall dark gradient. One scroll
// value drives everything, written as CSS variables so React never re-renders on scroll:
//
//   --ai-p  on the stage: 0 -> 1 as the next section's top travels from the bottom of the screen to
//           the top. The hero's scene eases back and up, its copy lifts and fades first, and a dark
//           veil deepens (see AiHero).
//   --ai-h  on [data-ai-heading]: 0 -> 1 as the heading enters; it rises and fades in.
//   --r     on [data-ai-words]: 0 -> 1 as the paragraph moves up the screen; its words light up one
//           after another (each word has --i, the paragraph --n).
//
// Once the dark fade has fully covered the hero, the hero's WebGL loop is paused (COVERED_EVENT).
// Reduced motion: nothing moves, the words are all lit.

const clamp01 = (v) => Math.min(1, Math.max(0, v));

export default function AiHeroStage({ hero, children }) {
  const stageRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const next = stage.querySelector("[data-ai-next]");
    const fade = stage.querySelector("[data-ai-fade]");
    const heading = stage.querySelector("[data-ai-heading]");
    const words = stage.querySelector("[data-ai-words]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let covered = false;
    const setCovered = (v) => {
      if (v === covered) return;
      covered = v;
      window.dispatchEvent(new CustomEvent(COVERED_EVENT, { detail: v }));
    };

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      setCovered(fade.getBoundingClientRect().bottom <= 0);
      if (reduced.matches) {
        stage.style.setProperty("--ai-p", "0");
        heading?.style.setProperty("--ai-h", "1");
        words?.style.setProperty("--r", "1");
        return;
      }
      const p = clamp01(1 - next.getBoundingClientRect().top / vh);
      stage.style.setProperty("--ai-p", p.toFixed(4));
      if (heading) {
        const top = heading.getBoundingClientRect().top;
        heading.style.setProperty("--ai-h", clamp01((vh * 0.98 - top) / (vh * 0.32)).toFixed(4));
      }
      if (words) {
        // Starts lighting as the paragraph's top passes 90% of the screen, all lit by 40%
        const top = words.getBoundingClientRect().top;
        words.style.setProperty("--r", clamp01((vh * 0.9 - top) / (vh * 0.5)).toFixed(4));
      }
    };
    // Only while the section is on screen (or about to be); one last update as it leaves, so its
    // end state is exact even after a fast fling
    let onScreen = true;
    const request = () => {
      if (onScreen && !frame) frame = requestAnimationFrame(update);
    };
    const gate = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        if (!frame) frame = requestAnimationFrame(update);
      },
      { rootMargin: "25% 0px" }
    );
    gate.observe(stage);

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    reduced.addEventListener("change", request);
    return () => {
      gate.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      reduced.removeEventListener("change", request);
      setCovered(false);
    };
  }, []);

  return (
    <div ref={stageRef} className="relative" style={{ "--ai-p": 0 }}>
      {/* Pinned while the next section rises over it */}
      <div className="sticky top-0 z-0">{hero}</div>
      <div data-ai-next className="relative z-10">
        {children}
      </div>
    </div>
  );
}

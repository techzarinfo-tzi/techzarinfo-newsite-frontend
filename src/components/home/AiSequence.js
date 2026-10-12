"use client";

import { useEffect, useRef } from "react";

const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const ease = (t) => 1 - Math.pow(1 - t, 3);
const lerp = (a, b, t) => a + (b - a) * t;

// Scroll units: one unit of scroll = 60% of the viewport height.
const UNIT_VH = 0.6;

// Order of the reveal. `at`/`len` are in scroll units. Reorder or retime here.
const TIMELINE = {
  title: { at: 0, len: 1 },
  sub: { at: 1, len: 1 },
  // The bot rises continuously from below the stage: quickly until only its eye area shows,
  // slowly through the eyes and face, then on up to its final position.
  // Each entry is [scroll unit, position]: 1 = fully below the stage, "EYE" / "FACE" = the
  // stage edge crosses the bot at eyeVisible / faceVisible of its height, 0 = final position.
  bot: [
    [2, 1],
    [2.8, "EYE"],
    [3.6, "FACE"],
    [4.6, 0],
  ],
  eyeVisible: 0.42, // share of the bot's height showing at the eye stage
  faceVisible: 0.62, // ...and once the face and shoulders are up
  cta: { at: 4.6, len: 1 },
  itemStart: 5.6, // the five items split out from behind the bot
  itemStagger: 0.25,
  itemLen: 1,
};

// Pins the section on desktop and reveals its parts one by one as you scroll.
// Below `lg` (or with reduced motion) it falls back to a simple in-view reveal.
export default function AiSequence({ className, children }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const q = (name) => [...track.querySelectorAll(`[data-seq="${name}"]`)];
    const title = q("title");
    const sub = q("sub");
    const cta = q("cta");
    const items = q("item");
    const bot = track.querySelector('[data-seq="bot"]');
    if (!bot || !items.length) return;

    const desktop = window.matchMedia("(min-width: 1024px)");
    let cleanup = () => {};

    const setup = () => {
      cleanup();
      return desktop.matches ? pinned() : inView();
    };

    // ---- Tablet / mobile: reveal each element, in order, as it scrolls into view ----
    function inView() {
      const all = [...title, ...sub, bot, ...items, ...cta];
      track.classList.add("ai-io");
      all.forEach((el, i) => el.style.setProperty("--d", `${(i % 3) * 90}ms`));
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("ai-in");
              io.unobserve(e.target);
            }
          }),
        { threshold: 0.2 },
      );
      all.forEach((el) => io.observe(el));
      return () => {
        io.disconnect();
        track.classList.remove("ai-io");
        all.forEach((el) => {
          el.classList.remove("ai-in");
          el.style.removeProperty("--d");
        });
      };
    }

    // ---- Desktop: pinned, scroll-scrubbed sequence ----
    function pinned() {
      const offsets = []; // where each item starts, relative to the bot's centre
      let botBelow = 0; // translateY that parks the bot just below the stage
      let botEye = 0; // translateY that shows only the eye area
      let botFace = 0; // translateY once the face and shoulders are up
      let vh = 0;
      let top = 0;
      let raf = 0;
      let last = 0;
      let cur = -1; // eased scroll position, in units
      const all = [...title, ...sub, bot, ...items, ...cta];

      const measure = () => {
        vh = window.innerHeight;
        top = track.getBoundingClientRect().top + window.scrollY;
        all.forEach((el) => (el.style.transform = ""));
        const b = bot.getBoundingClientRect();
        const stage = bot.closest(".ai-stage");
        const below = (stage ? stage.getBoundingClientRect().bottom : window.innerHeight) - b.top;
        botBelow = below + 4;
        botEye = below - b.height * TIMELINE.eyeVisible;
        botFace = below - b.height * TIMELINE.faceVisible;
        const bx = b.left + b.width / 2;
        const by = b.top + b.height * 0.55;
        items.forEach((el, i) => {
          const r = el.getBoundingClientRect();
          offsets[i] = { dx: bx - (r.left + r.width / 2), dy: by - (r.top + r.height / 2) };
        });
      };

      const prog = (u, at, len) => ease(clamp((u - at) / len));

      const apply = (u) => {
        const rise = (els, t) =>
          els.forEach((el) => {
            const p = prog(u, t.at, t.len);
            el.style.opacity = p;
            el.style.transform = `translate3d(0, ${(1 - p) * 36}px, 0)`;
          });
        rise(title, TIMELINE.title);
        rise(sub, TIMELINE.sub);
        rise(cta, TIMELINE.cta);

        // Piecewise path: below -> eyes -> face -> final. Legs are linear (different speeds); the
        // eased scroll position below smooths the joins so it never stops or jerks.
        const path = TIMELINE.bot;
        const at = (k) => (path[k][1] === "EYE" ? botEye : path[k][1] === "FACE" ? botFace : path[k][1] * botBelow);
        let ty = at(0);
        if (u >= path[path.length - 1][0]) ty = at(path.length - 1);
        else
          for (let k = 0; k < path.length - 1; k++) {
            if (u >= path[k][0] && u < path[k + 1][0]) {
              const t = (u - path[k][0]) / (path[k + 1][0] - path[k][0]);
              ty = lerp(at(k), at(k + 1), t);
              break;
            }
          }
        bot.style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0)`;

        items.forEach((el, i) => {
          const p = prog(u, TIMELINE.itemStart + i * TIMELINE.itemStagger, TIMELINE.itemLen);
          const { dx, dy } = offsets[i];
          el.style.opacity = clamp(p * 1.6);
          el.style.transform = `translate3d(${(1 - p) * dx}px, ${(1 - p) * dy}px, 0) scale(${0.35 + 0.65 * p})`;
        });
      };

      const tick = (now) => {
        raf = 0;
        const dt = last ? Math.min(64, now - last) : 16;
        last = now;
        const target = (window.scrollY - top) / (vh * UNIT_VH);
        cur = cur < 0 ? target : cur + (target - cur) * (1 - Math.exp(-dt / 140));
        apply(cur);
        if (Math.abs(target - cur) > 0.0005) raf = requestAnimationFrame(tick);
        else last = 0;
      };
      const schedule = () => {
        if (!raf) raf = requestAnimationFrame(tick);
      };
      const onResize = () => {
        measure();
        schedule();
      };

      track.classList.add("ai-pinned");
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
        track.classList.remove("ai-pinned");
        all.forEach((el) => {
          el.style.opacity = "";
          el.style.transform = "";
        });
      };
    }

    cleanup = setup();
    const onChange = () => {
      cleanup = setup();
    };
    desktop.addEventListener("change", onChange);
    return () => {
      desktop.removeEventListener("change", onChange);
      cleanup();
    };
  }, []);

  return (
    <div ref={trackRef} className={className}>
      {children}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { guideSteps } from "@/config/guide";
import { OPEN_CHAT_EVENT } from "@/components/chatbot/ChatWidget";

const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => t * t * (3 - 2 * t);

// One fixed character that travels the page. It only ever changes `transform`, and all
// per-frame work happens in a rAF loop that writes straight to the DOM, so React never re-renders.
export default function AiGuide() {
  const rootRef = useRef(null);
  const botRef = useRef(null);
  const bubbleRef = useRef(null);
  const textRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const root = rootRef.current;
    const bot = botRef.current;
    const bubble = bubbleRef.current;
    const textEl = textRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const items = [...document.querySelectorAll("[data-guide]")]
      .map((el) => ({
        el,
        // data-guide-ref="parent": measure a pinned section by its wrapper; any other value is a
        // selector for the closest ancestor to measure (e.g. when the section itself is sticky).
        ref:
          el.dataset.guideRef === "parent"
            ? el.parentElement
            : el.dataset.guideRef
              ? el.closest(el.dataset.guideRef) ?? el
              : el,
        cfg: guideSteps[el.dataset.guide],
      }))
      .filter((it) => it.cfg);

    if (!items.length) {
      root.classList.remove("is-on");
      return;
    }

    let vh = 0;
    let mids = [];
    let tops = [];
    let anchors = [];
    const cur = { x: 0, y: 0, r: 0, s: 1 };
    let started = false;
    let raf = 0;
    let last = 0;
    let shownIdx = -1; // step whose text is currently in the bubble
    let stepIdx = -1; // step the guide is currently "at"
    let swapTimer = 0;
    let showing = false;
    let vw = 0;
    let size = 0;
    // Drag state: while active the pointer position overrides the section anchor;
    // on release the guide eases back to where the current section wants it.
    // sx/sy: where the press started, so a tap (no real movement) can open the chat instead.
    const drag = { active: false, id: null, px: 0, py: 0, gx: 0, gy: 0, sx: 0, sy: 0 };
    let returning = false;

    const measure = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      size = root.offsetWidth;
      const pad = vw < 640 ? 10 : 20;
      // Mid-point of each section in page coordinates (a pinned section uses its wrapper's top).
      // Drives the smooth travelling swoop between anchors.
      mids = items.map(({ el, ref }) => ref.getBoundingClientRect().top + window.scrollY + el.offsetHeight / 2);
      mids[0] = Math.min(mids[0], vh * 0.5); // rests at the first anchor when the page is at the top
      // ...and at the last anchor when scrolled to the bottom: a closing section shorter than the
      // viewport (the footer) would otherwise have a mid-point the viewport centre can never reach.
      if (mids.length > 1) {
        const bottomCentre = document.documentElement.scrollHeight - vh * 0.5;
        mids[mids.length - 1] = Math.max(mids[mids.length - 2], Math.min(mids[mids.length - 1], bottomCentre));
      }
      // Top edge of each section in page coordinates. Drives which section's text/mood is
      // "active" — kept separate from `mids` so a very tall section (e.g. the pinned AI
      // Solutions sequence) can't drag that switch-point deep into its own neighbour.
      tops = items.map(({ el, ref }) => ref.getBoundingClientRect().top + window.scrollY);
      anchors = items.map(({ cfg }) => ({
        x: cfg.side === "left" ? pad : vw - size - pad,
        y: vh * 0.84 - size / 2,
      }));
    };

    const setText = (idx) => {
      textEl.textContent = "";
      items[idx].cfg.text.split(" ").forEach((word, i) => {
        const s = document.createElement("span");
        s.className = "ai-word";
        s.style.setProperty("--i", i);
        s.textContent = word;
        textEl.append(s, " ");
      });
      shownIdx = idx;
    };

    const setShow = (on) => {
      if (on === showing) return;
      showing = on;
      if (on) void bubble.offsetWidth; // restart the word animations
      bubble.classList.toggle("is-show", on);
    };

    const goTo = (idx) => {
      stepIdx = idx;
      root.dataset.mood = items[idx].cfg.mood;
      root.classList.toggle("is-left", items[idx].cfg.side === "left");
      root.classList.toggle("is-right", items[idx].cfg.side === "right");
      setShow(false);
      clearTimeout(swapTimer);
      swapTimer = window.setTimeout(() => {
        setText(idx);
        schedule();
      }, reduced ? 0 : 260);
    };

    const tick = (now) => {
      raf = 0;
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;

      const c = window.scrollY + vh * 0.5;
      const n = items.length;
      let i = 0;
      while (i < n - 1 && c >= mids[i + 1]) i++;
      const t = i < n - 1 ? clamp((c - mids[i]) / (mids[i + 1] - mids[i] || 1)) : 0;
      const e = ease(t);
      const swoop = Math.sin(Math.PI * e);
      const a = anchors[i];
      const b = anchors[Math.min(i + 1, n - 1)];
      const dir = b.x >= a.x ? 1 : -1;

      const target = {
        x: lerp(a.x, b.x, e),
        y: lerp(a.y, b.y, e) - swoop * vh * 0.06,
        r: reduced ? 0 : dir * swoop * 12,
        s: reduced ? 1 : 1 + swoop * 0.18,
      };
      if (drag.active) {
        target.x = clamp(drag.px - drag.gx - size / 2, 0, vw - size);
        target.y = clamp(drag.py - drag.gy - size / 2, 0, vh - size);
        target.s = 1.08;
        // lean into the direction of travel
        target.r = reduced ? 0 : clamp((target.x - cur.x) * 0.12, -16, 16);
      }

      if (!started || reduced) {
        Object.assign(cur, target);
        started = true;
      } else {
        const tc = drag.active ? 70 : returning ? 190 : 110; // ms: snappy while held, gentle on the way back
        const k = 1 - Math.exp(-dt / tc); // frame-rate independent easing => cinematic follow
        cur.x += (target.x - cur.x) * k;
        cur.y += (target.y - cur.y) * k;
        cur.r += (target.r - cur.r) * k;
        cur.s += (target.s - cur.s) * k;
      }
      root.style.transform = `translate3d(${cur.x.toFixed(2)}px, ${cur.y.toFixed(2)}px, 0) rotate(${cur.r.toFixed(2)}deg) scale(${cur.s.toFixed(3)})`;

      // Which section's text/mood is "active": whichever section's own top-to-next-top
      // band the viewport's centre currently sits in — i.e. the section actually on
      // screen, not an interpolation midpoint that a very tall section could skew.
      let bi = 0;
      while (bi < n - 1 && c >= tops[bi + 1]) bi++;
      if (bi !== stepIdx) goTo(bi);
      // The bubble only shows once the travelling swoop has settled (near a whole step
      // and the position has caught up) and the visible text matches the active section.
      const p = i + e;
      const posNear = Math.round(p);
      const settled = Math.abs(p - posNear) < 0.2 && Math.abs(target.x - cur.x) < 40;
      setShow(settled && !drag.active && !returning && shownIdx === bi);

      if (returning && Math.hypot(target.x - cur.x, target.y - cur.y) < 1.5) returning = false;
      const moving =
        drag.active ||
        returning ||
        Math.abs(target.x - cur.x) > 0.05 ||
        Math.abs(target.y - cur.y) > 0.05 ||
        Math.abs(target.r - cur.r) > 0.05 ||
        Math.abs(target.s - cur.s) > 0.001;
      if (moving) raf = requestAnimationFrame(tick);
      else last = 0;
    };

    function schedule() {
      if (!raf) raf = requestAnimationFrame(tick);
    }
    const onResize = () => {
      measure();
      schedule();
    };

    const onDown = (ev) => {
      if (ev.pointerType === "mouse" && ev.button !== 0) return;
      ev.preventDefault();
      drag.active = true;
      drag.id = ev.pointerId;
      drag.px = ev.clientX;
      drag.py = ev.clientY;
      drag.sx = ev.clientX;
      drag.sy = ev.clientY;
      drag.gx = ev.clientX - (cur.x + size / 2);
      drag.gy = ev.clientY - (cur.y + size / 2);
      returning = false;
      bot.setPointerCapture(ev.pointerId);
      root.classList.add("is-dragging");
      setShow(false);
      schedule();
    };
    const onMove = (ev) => {
      if (!drag.active || ev.pointerId !== drag.id) return;
      drag.px = ev.clientX;
      drag.py = ev.clientY;
      schedule();
    };
    const onUp = (ev) => {
      if (!drag.active || ev.pointerId !== drag.id) return;
      drag.active = false;
      returning = true;
      root.classList.remove("is-dragging");
      if (ev.type === "pointerup" && Math.hypot(ev.clientX - drag.sx, ev.clientY - drag.sy) < 6) {
        window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT));
      }
      schedule();
    };
    bot.addEventListener("pointerdown", onDown);
    bot.addEventListener("pointermove", onMove);
    bot.addEventListener("pointerup", onUp);
    bot.addEventListener("pointercancel", onUp);
    bot.addEventListener("lostpointercapture", onUp);

    measure();
    goTo(0);
    setText(0);
    schedule();
    const showTimer = window.setTimeout(() => root.classList.add("is-on"), 500);

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    document.fonts?.ready.then(onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(swapTimer);
      clearTimeout(showTimer);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      bot.removeEventListener("pointerdown", onDown);
      bot.removeEventListener("pointermove", onMove);
      bot.removeEventListener("pointerup", onUp);
      bot.removeEventListener("pointercancel", onUp);
      bot.removeEventListener("lostpointercapture", onUp);
      root.classList.remove("is-dragging");
    };
  }, [pathname]);

  return (
    <div ref={rootRef} className="ai-guide is-left" aria-hidden="true">
      <div ref={bubbleRef} className="ai-guide__bubble">
        <p ref={textRef} />
      </div>
      <div ref={botRef} className="ai-guide__bot">
        <Image
          src="/ai-guide.png"
          alt=""
          width={384}
          height={384}
          unoptimized
          priority
          draggable={false}
          className="ai-guide__img"
        />
      </div>
    </div>
  );
}

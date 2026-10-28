"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { guideSteps, guideAvoidPaths } from "@/config/guide";
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
    const avoid = guideAvoidPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));

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
    // Avoid mode (guideAvoidPaths): the hop between two steps plays over a short window around the
    // section boundary (bounds/wins) instead of between section mid-points, so the guide rests at a
    // step for most of each section. When scrolling stops, `snap` finishes an interrupted hop and
    // `spot` overrides that step's anchor with a free place beside the content.
    let bounds = [];
    let wins = [];
    let spot = null;
    let snap = -1;
    let placeTimer = 0;
    let confirmTimer = 0;
    let lastScroll = 0;
    let lastCheck = 0;

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
        s: 1,
      }));
      if (avoid) {
        // Each boundary's window is at most half a viewport, and never more than ~half of either
        // neighbouring section, so windows don't overlap. The last one is pulled up so it can finish
        // before the page bottom.
        const bottomCentre = document.documentElement.scrollHeight - vh * 0.5;
        wins = [];
        bounds = [];
        for (let j = 1; j < tops.length; j++) {
          const next = j < tops.length - 1 ? tops[j + 1] - tops[j] : Infinity;
          const w = Math.max(1, Math.min(vh * 0.25, (tops[j] - tops[j - 1]) * 0.45, next * 0.45));
          wins.push(w);
          bounds.push(Math.min(tops[j], bottomCentre - w));
        }
      }
    };

    const anchorAt = (j) => (spot && spot.k === j ? spot : anchors[j]);

    // ---- Avoid mode: find a free spot for the guide (and its bubble) beside the content ----
    const GAP = 8;
    const clearColor = (c) => c === "transparent" || /(?:,|\/)\s*0(?:\.0+)?\s*\)$/.test(c);
    const range = document.createRange();

    // What the guide must keep clear of, inside the strip along one screen edge it can use (`reach`
    // wide). hard: text, media and controls. soft: card surfaces (background, border or shadow), but
    // not full-width section backgrounds. Large aria-hidden layers (glows, washes, the footer
    // wordmark) are decoration and ignored. Content still hidden for its entrance animation counts
    // (it is about to appear there), and so does anything that keeps moving: infinite CSS animations
    // (the logo marquee) and script-driven areas marked data-guide-busy (the features orbit).
    const collect = (left, reach) => {
      const lo = left ? 0 : vw - reach;
      const hi = left ? reach : vw;
      const hard = [];
      const soft = [];
      const styles = new Map();
      const cs = (el) => {
        let s = styles.get(el);
        if (!s) styles.set(el, (s = getComputedStyle(el)));
        return s;
      };
      // Trim a rect to what its overflow-clipping ancestors actually show
      const add = (list, el, r) => {
        let l = r.left, t = r.top, rr = r.right, b = r.bottom;
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          const s = cs(p);
          if (s.overflowX === "visible" && s.overflowY === "visible") continue;
          const pr = p.getBoundingClientRect();
          if (s.overflowX !== "visible") (l = Math.max(l, pr.left)), (rr = Math.min(rr, pr.right));
          if (s.overflowY !== "visible") (t = Math.max(t, pr.top)), (b = Math.min(b, pr.bottom));
        }
        if (rr - l > 1 && b - t > 1 && rr > lo && l < hi && b > 0 && t < vh) list.push({ l, t, r: rr, b });
      };
      const modal = document.querySelector(".chat-modal");
      for (const el of document.body.getElementsByTagName("*")) {
        if (root.contains(el) || modal?.contains(el) || (el instanceof SVGElement && el.ownerSVGElement)) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1 || r.right <= lo || r.left >= hi || r.bottom <= 0 || r.top >= vh) continue;
        const opaque = !el.closest("[data-guide]");
        if (el.checkVisibility && !el.checkVisibility({ opacityProperty: opaque, visibilityProperty: true })) continue;
        const deco = el.closest('[aria-hidden="true"]');
        if (deco) {
          const d = deco.getBoundingClientRect();
          if (d.width > vw * 0.5 || d.height > vh * 0.5) continue;
        }
        if (
          /^(img|svg|video|canvas|button|a|input|textarea|select|iframe)$/.test(el.localName) ||
          el.getAttribute("role") === "button" ||
          el.hasAttribute("data-guide-busy") ||
          el.getAnimations().some((a) => a.effect?.getComputedTiming().iterations === Infinity)
        ) {
          add(hard, el, r);
          continue;
        }
        for (let n = el.firstChild; n; n = n.nextSibling) {
          if (n.nodeType !== 3 || !n.data.trim()) continue;
          range.selectNodeContents(n);
          for (const rc of range.getClientRects()) add(hard, el, rc);
        }
        if (r.width < vw * 0.92 && r.height < vh * 0.95) {
          const s = cs(el);
          if (
            s.backgroundImage !== "none" ||
            !clearColor(s.backgroundColor) ||
            s.boxShadow !== "none" ||
            parseFloat(s.borderTopWidth) + parseFloat(s.borderLeftWidth) > 0
          )
            add(soft, el, r);
        }
      }
      return { hard, soft };
    };

    // Root x for a given scale, so the visible character keeps `pad` from its edge, or, peeking,
    // hangs that share of itself past the edge
    const xFor = (left, s, peek = 0) => {
      const edge = peek ? -peek * s * size : vw < 640 ? 10 : 20;
      return left ? edge - (size / 2) * (1 - s) : vw - edge - size + (size / 2) * (1 - s);
    };

    // Screen boxes of the character (with room for its idle animation) and, optionally, its bubble,
    // for the root at (x, y) with scale s. The bubble's place mirrors .ai-guide__bubble in globals.css.
    const boxesAt = (left, x, y, s, withBubble) => {
      const h = size / 2;
      const map = (l, t, r, b) => ({ l: x + h + s * (l - h), t: y + h + s * (t - h), r: x + h + s * (r - h), b: y + h + s * (b - h) });
      const out = [map(size * 0.12 - 6, size * 0.12 - 14, size * 0.88 + 6, size * 0.88)];
      if (withBubble) {
        const bw = bubble.offsetWidth;
        const bh = bubble.offsetHeight;
        const bl = left ? size * 0.78 : size * 0.22 - bw;
        out.push(map(bl, size * 0.38 - bh, bl + bw, size * 0.38 + 7));
      }
      return out;
    };

    // The character may hang past the screen edge (peeking); only its visible part has to be clear
    const isClear = (boxes, obs, withSoft, minTop, gap = GAP) =>
      boxes.every(
        (bx, n) =>
          (n || ((bx = { ...bx, l: Math.max(bx.l, 0), r: Math.min(bx.r, vw) }), bx.r - bx.l > 0)) &&
          bx.l >= 0 &&
          bx.r <= vw &&
          bx.b <= vh - 8 &&
          bx.t >= (n ? minTop : Math.max(minTop, vh * 0.35)) &&
          ![...obs.hard, ...(withSoft ? obs.soft : [])].some(
            (o) => o.l < bx.r + gap && o.r > bx.l - gap && o.t < bx.b + gap && o.b > bx.t - gap,
          ),
      );

    const placeSoon = (ms) => {
      if (!avoid) return;
      clearTimeout(placeTimer);
      clearTimeout(confirmTimer);
      placeTimer = window.setTimeout(place, ms);
    };

    // `confirm`: a second look shortly after parking, for content that animated in meanwhile
    function place(confirm) {
      placeTimer = 0;
      if (drag.active || stepIdx < 0) return;
      if (returning || performance.now() - lastScroll < 140) return placeSoon(160);
      const k = stepIdx;
      snap = k; // finish an interrupted hop at the nearest step
      const cfg = items[k].cfg;
      const left = cfg.side === "left";
      const withText = shownIdx === k && (!cfg.bubbleMinWidth || vw >= cfg.bubbleMinWidth);
      const header = document.querySelector("header");
      const minTop = (header ? Math.max(0, header.getBoundingClientRect().bottom) : 0) + GAP;
      const obs = collect(left, (vw < 640 ? 10 : 20) + size + bubble.offsetWidth + 24);
      // Try nearest the current spot first, so the guide stays put while that place is still free
      const from = spot && spot.k === k ? spot.y : anchors[k].y;
      const ys = [from];
      for (let y = 0; y < vh; y += 8) ys.push(y);
      ys.sort((a, b) => Math.abs(a - from) - Math.abs(b - from));
      if (!confirm) confirmTimer = window.setTimeout(() => place(true), 900);
      // Best first: full size with its bubble; then the character alone, shrinking to fit; then
      // peeking in from the edge (narrow gutters); then over an empty part of a card, still clear of
      // its text. Each pass: [scales, peek shares, with bubble, keep off cards]
      const passes = [
        [[1, 0.85], [0], true, true],
        [[1, 0.85, 0.7, 0.6], [0], false, true],
        [[0.7, 0.6], [0.28, 0.45], false, true],
        [[0.7, 0.6], [0, 0.28, 0.45], false, false],
      ];
      for (const [scales, peeks, text, withSoft] of passes) {
        if (text && !withText) continue;
        for (const y of ys) {
          for (const peek of peeks) {
            for (const s of scales) {
              const x = xFor(left, s, peek);
              if (isClear(boxesAt(left, x, y, s, text), obs, withSoft, minTop, peek ? GAP / 2 : GAP)) {
                spot = { k, x, y, s, bubble: text };
                schedule();
                return;
              }
            }
          }
        }
      }
      // Nowhere free (dense content, phones): tuck it small into the bottom corner, peeking in from
      // the edge so it covers as little as possible, above the chat launcher on the right, without
      // its bubble
      const s = 0.6;
      const launcher = document.querySelector(".chat-launcher");
      const bottom = !left && launcher ? launcher.getBoundingClientRect().top - 12 : vh - 16;
      spot = { k, x: xFor(left, s, 0.35), y: bottom - (size / 2) * (1 + s), s, bubble: false };
      schedule();
    }

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
        placeSoon(0);
      }, reduced ? 0 : 260);
    };

    const tick = (now) => {
      raf = 0;
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;

      const c = window.scrollY + vh * 0.5;
      const n = items.length;
      let i = 0;
      let t = 0;
      let bi = 0;
      if (avoid) {
        let p = snap;
        if (p < 0) {
          p = 0;
          for (let j = 0; j < bounds.length; j++) p += clamp((c - bounds[j] + wins[j]) / (2 * wins[j]));
        }
        i = Math.min(Math.floor(p), n - 1);
        t = p - i;
        bi = Math.round(p); // switches at the boundary itself, the middle of the hop
      } else {
        while (i < n - 1 && c >= mids[i + 1]) i++;
        t = i < n - 1 ? clamp((c - mids[i]) / (mids[i + 1] - mids[i] || 1)) : 0;
        // Which section's text/mood is "active": whichever section's own top-to-next-top
        // band the viewport's centre currently sits in — i.e. the section actually on
        // screen, not an interpolation midpoint that a very tall section could skew.
        while (bi < n - 1 && c >= tops[bi + 1]) bi++;
      }
      const e = ease(t);
      const swoop = Math.sin(Math.PI * e);
      const a = anchorAt(i);
      const b = anchorAt(Math.min(i + 1, n - 1));
      const dir = b.x >= a.x ? 1 : -1;

      const target = {
        x: lerp(a.x, b.x, e),
        y: lerp(a.y, b.y, e) - swoop * vh * 0.06,
        r: reduced ? 0 : dir * swoop * 12,
        s: (reduced ? 1 : 1 + swoop * 0.18) * lerp(a.s, b.s, e),
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

      if (bi !== stepIdx) goTo(bi);
      // The bubble only shows once the travelling swoop has settled (near a whole step
      // and the position has caught up) and the visible text matches the active section.
      const p = i + e;
      const posNear = Math.round(p);
      const settled = Math.abs(p - posNear) < 0.2 && Math.abs(target.x - cur.x) < 40;
      // A step can keep its bubble off on narrow screens (cfg.bubbleMinWidth) where it would cover content.
      const roomy = !items[bi].cfg.bubbleMinWidth || vw >= items[bi].cfg.bubbleMinWidth;
      // Avoid mode: only at a spot found with room for the bubble, once the guide has arrived there
      const free =
        !avoid ||
        (spot?.k === bi && spot.bubble && posNear === bi && Math.abs(target.x - cur.x) < 4 && Math.abs(target.y - cur.y) < 4);
      setShow(settled && !drag.active && !returning && shownIdx === bi && roomy && free);

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
      placeSoon(160);
    };
    const onScroll = () => {
      if (avoid) {
        lastScroll = performance.now();
        snap = -1;
        placeSoon(160);
        // Content moves under the parked bubble while scrolling: drop the bubble as soon as it
        // would cover something (checked a few times a second; the next stop finds a new spot)
        if (spot?.bubble && spot.k === stepIdx && lastScroll - lastCheck > 150) {
          lastCheck = lastScroll;
          const left = items[spot.k].cfg.side === "left";
          const header = document.querySelector("header");
          const minTop = (header ? Math.max(0, header.getBoundingClientRect().bottom) : 0) + GAP;
          const obs = collect(left, (vw < 640 ? 10 : 20) + size + bubble.offsetWidth + 24);
          if (!isClear(boxesAt(left, spot.x, spot.y, spot.s, true), obs, true, minTop)) spot.bubble = false;
        }
      }
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
      placeSoon(300);
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
    placeSoon(400);
    const showTimer = window.setTimeout(() => root.classList.add("is-on"), 500);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    document.fonts?.ready.then(onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(swapTimer);
      clearTimeout(showTimer);
      clearTimeout(placeTimer);
      clearTimeout(confirmTimer);
      window.removeEventListener("scroll", onScroll);
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
          src="/ai-guide.webp"
          alt=""
          width={384}
          height={384}
          unoptimized
          draggable={false}
          className="ai-guide__img"
        />
      </div>
    </div>
  );
}

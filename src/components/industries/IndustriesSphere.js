"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

// "Industries" page: the industry cards on a slowly turning sphere. Cards always face you and
// grow or shrink with their depth (the ones at the back sit smaller, behind the front ones), as in
// the design.
//
//   Spin    never stops: a steady turn, in the direction you last moved it.
//   Mouse   moving the mouse over the section spins the sphere the same way (right moves the front
//           to the right, down moves it down); it then eases back to the steady turn.
//   Touch   dragging sideways spins it (vertical swipes still scroll the page).
//   Open    clicking (or tapping, or Enter on) a card shows a small, readable copy of it in the
//           centre (a quick fade); a click outside, Esc or the close button closes it. The sphere
//           pauses while a card is open.
//
// Positions are applied straight to the cards' transforms every frame (no React renders while
// it turns); the loop stops while the section is off screen. Reduced motion: no steady turn and
// no zoom animation (moving and dragging still turn it).

const AUTO_SPEED = 0.22; // rad/s, the steady turn
const MOUSE_GAIN = 0.0105; // rad/s added per px of mouse movement
const TOUCH_GAIN = 0.02;
const MAX_SPEED = 4.5;
const SETTLE = 1.4; // how quickly a push eases back to the steady turn (1/s)
const DEPTH = 4; // perspective distance, in sphere radii

// Evenly spread points on a sphere (Fibonacci lattice)
function spherePoints(n) {
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - ((i + 0.5) / n) * 2;
    const r = Math.sqrt(1 - y * y);
    const a = golden * i;
    pts.push([Math.cos(a) * r, y, Math.sin(a) * r]);
  }
  return pts;
}

// 3x3 rotation matrices, row-major. Screen axes: x right, y down, z towards you.
const mul = (a, b) => {
  const o = new Array(9);
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++) o[r * 3 + c] = a[r * 3] * b[c] + a[r * 3 + 1] * b[3 + c] + a[r * 3 + 2] * b[6 + c];
  return o;
};
const rotY = (t) => [Math.cos(t), 0, Math.sin(t), 0, 1, 0, -Math.sin(t), 0, Math.cos(t)]; // front moves right
const rotX = (t) => [1, 0, 0, 0, Math.cos(t), Math.sin(t), 0, -Math.sin(t), Math.cos(t)]; // front moves down
const START = mul(rotX(-0.18), rotY(0.3)); // the sphere's starting tilt

// Entrance on page load: the cards fly in from the four sides (in turn: left, right, top, bottom),
// tilted and a little smaller, and settle into the sphere one after another.
const ENTRY_MS = 1300; // each card's flight
const ENTRY_STAGGER_MS = 75; // between cards
const ENTRY_FROM = [
  { x: -1, y: 0, tilt: -16, drift: 0.4 }, // left
  { x: 1, y: 0, tilt: 16, drift: -0.4 }, // right
  { x: 0, y: -1, tilt: -9, drift: 0.6 }, // top
  { x: 0, y: 1, tilt: 9, drift: -0.6 }, // bottom
];
// 0..1 for a card, by its turn in the entrance; 0 before it starts (or before the entrance does)
function entranceProgress(start, now, turn) {
  if (start === null || now === undefined) return 0;
  return Math.min(1, Math.max(0, (now - start - turn * ENTRY_STAGGER_MS) / ENTRY_MS));
}

// Card size and sphere radius for the stage (px). The section is one screen tall, so the sphere
// fits both ways: across, the cards on the sides stay on screen; down, the whole sphere (about
// 2 radii plus a card, with the depth scaling) fits the stage height under the navbar.
const HEIGHT_PER_CARD = 3.3; // sphere height in card widths, at radius = 1.05 card widths
function measure(width, height) {
  const byWidth = Math.min(290, Math.max(118, width * 0.27));
  const byHeight = height > 0 ? height / HEIGHT_PER_CARD : byWidth;
  const cw = Math.round(Math.max(96, Math.min(byWidth, byHeight)));
  const radius = Math.min(cw * 1.05, ((width - cw) / 2) * 0.98);
  return { cw, radius: Math.max(cw * 0.7, radius) };
}

// The card on the sphere scales everything with its width (--cw); the opened card (`open`) uses
// fixed, compact reading sizes instead.
function Card({ industry, style, className = "", open = false, ...rest }) {
  return (
    <div
      className={`flex flex-col bg-[#e9f4ff] text-left shadow-[0_10px_28px_-14px_rgba(0,36,97,0.35)] ${
        open ? "p-3.5" : "p-[calc(var(--cw)*0.035)]"
      } ${className}`}
      style={style}
      {...rest}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- transformed every frame; plain img keeps it simple */}
      <img
        src={industry.image}
        alt=""
        width={760}
        height={545}
        draggable={false}
        decoding="async"
        className="aspect-[760/545] w-full object-cover"
      />
      <h2
        className={`font-semibold uppercase leading-tight tracking-wide text-[#0b2a5b] ${
          open ? "mt-3 text-[15px]" : "mt-[calc(var(--cw)*0.045)] text-[max(7px,calc(var(--cw)*0.042))]"
        }`}
      >
        {industry.title}
      </h2>
      <p
        className={`text-[#1d3a6b] ${
          open ? "mt-1.5 text-[14px] leading-relaxed" : "mt-[calc(var(--cw)*0.02)] text-[max(6.5px,calc(var(--cw)*0.04))] leading-[1.35]"
        }`}
      >
        {industry.text}
      </p>
    </div>
  );
}

export default function IndustriesSphere({ industries }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const [size, setSize] = useState({ cw: 270, radius: 284 });
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(null); // { index, phase: "in" | "out" }

  // Motion state, outside React
  const motion = useRef({
    matrix: START,
    vel: { x: 0, y: AUTO_SPEED },
    base: { x: 0, y: AUTO_SPEED },
    paused: false,
    reduced: false,
    size: { cw: 270, radius: 284 },
    enter: { start: null, done: false }, // the entrance: start time once the first frame runs
  });
  // Points nearest the front go to the first industries, so the list's order is front to back
  // at the start (Media / Publishing in front, as in the design)
  const points = useRef(
    spherePoints(industries.length).sort(
      (a, b) => START[6] * b[0] + START[7] * b[1] + START[8] * b[2] - (START[6] * a[0] + START[7] * a[1] + START[8] * a[2])
    )
  );

  // Places every card for the current rotation. While the entrance plays (`now` given), each
  // card is also offset from its place, coming in from its side of the screen.
  const place = useCallback(
    (now) => {
      const m = motion.current;
      const { radius } = m.size;
      const f = DEPTH * radius;
      const n = points.current.length;
      const entering = !m.enter.done;
      let allIn = true;
      points.current.forEach((p, i) => {
        const el = cardRefs.current[i];
        if (!el) return;
        const x = (m.matrix[0] * p[0] + m.matrix[1] * p[1] + m.matrix[2] * p[2]) * radius;
        const y = (m.matrix[3] * p[0] + m.matrix[4] * p[1] + m.matrix[5] * p[2]) * radius;
        const z = (m.matrix[6] * p[0] + m.matrix[7] * p[1] + m.matrix[8] * p[2]) * radius;
        let s = (f / (f - z)) * 0.86; // front about 1.15x, back about 0.69x
        let px = (x * f) / (f - z);
        let py = (y * f) / (f - z);
        let tilt = 0;
        if (entering) {
          const t = entranceProgress(m.enter.start, now, n - 1 - i); // back cards first, the front one last
          if (t < 1) allIn = false;
          const e = 1 - Math.pow(1 - t, 4); // ease out
          const from = ENTRY_FROM[i % 4];
          const reachX = window.innerWidth * 0.62 + m.size.cw;
          const reachY = window.innerHeight * 0.62 + m.size.cw;
          px += from.x * reachX * (1 - e) + from.drift * m.size.cw * (1 - e);
          py += from.y * reachY * (1 - e) + from.drift * m.size.cw * 0.5 * (1 - e);
          tilt = from.tilt * (1 - e);
          s *= 0.82 + 0.18 * e;
          el.style.opacity = String(Math.min(1, t * 2.5));
        }
        el.style.transform = `translate(-50%, -50%) translate3d(${px}px, ${py}px, 0) rotate(${tilt}deg) scale(${s})`;
        el.style.zIndex = String(Math.round((z / radius + 1) * 100));
      });
      if (entering && allIn && m.enter.start !== null) {
        m.enter.done = true;
        cardRefs.current.forEach((el) => el && (el.style.opacity = ""));
      }
    },
    []
  );

  // Size from the stage width
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const apply = () => {
      const next = measure(stage.clientWidth || window.innerWidth, stage.clientHeight || window.innerHeight * 0.85);
      motion.current.size = next;
      setSize(next);
      place(performance.now());
    };
    apply();
    // Fade the stage in once the cards are in place (they're stacked at the centre before that)
    const shown = requestAnimationFrame(() => setReady(true));
    const ro = new ResizeObserver(apply);
    ro.observe(stage);
    return () => {
      cancelAnimationFrame(shown);
      ro.disconnect();
    };
  }, [place]);

  // The turning loop
  useEffect(() => {
    const m = motion.current;
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const setReduced = () => {
      m.reduced = reducedQuery.matches;
      const auto = m.reduced ? 0 : AUTO_SPEED;
      const len = Math.hypot(m.base.x, m.base.y) || 1;
      m.base = { x: (m.base.x / len) * auto, y: (m.base.y / len) * auto };
      if (!m.base.x && !m.base.y && auto) m.base = { x: 0, y: auto };
    };
    setReduced();
    reducedQuery.addEventListener("change", setReduced);

    let raf = 0;
    let last = 0;
    let visible = true;
    const frame = (now) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      // The entrance starts on the first frame (reduced motion: cards simply appear in place)
      if (!m.enter.done) {
        if (m.reduced) {
          m.enter.done = true;
          cardRefs.current.forEach((el) => el && (el.style.opacity = ""));
        } else if (m.enter.start === null) {
          m.enter.start = now;
        }
      }
      if (!m.paused || !m.enter.done) {
        if (!m.paused) {
          const k = 1 - Math.exp(-dt * SETTLE);
          m.vel.x += (m.base.x - m.vel.x) * k;
          m.vel.y += (m.base.y - m.vel.y) * k;
          m.matrix = mul(mul(rotX(m.vel.x * dt), rotY(m.vel.y * dt)), m.matrix);
        }
        place(now);
      }
      const moving = !m.enter.done || (!m.paused && Math.abs(m.vel.x) + Math.abs(m.vel.y) > 1e-4);
      if (visible && moving) raf = requestAnimationFrame(frame);
      else last = 0;
    };
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };
    m.kick = kick;

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      kick();
    });
    io.observe(sectionRef.current);
    kick();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      reducedQuery.removeEventListener("change", setReduced);
    };
  }, [place]);

  // Mouse / touch: push the spin in the direction of movement
  const push = (dx, dy, gain) => {
    const m = motion.current;
    if (m.paused || (!dx && !dy)) return;
    m.vel.x = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, m.vel.x + dy * gain));
    m.vel.y = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, m.vel.y + dx * gain));
    // The steady turn then carries on in the direction last moved
    const auto = m.reduced ? 0 : AUTO_SPEED;
    const len = Math.hypot(dx, dy);
    m.base = { x: (dy / len) * auto, y: (dx / len) * auto };
    m.kick?.();
  };

  const drag = useRef(null);
  const onPointerMove = (e) => {
    if (e.pointerType === "mouse") {
      push(e.movementX, e.movementY, MOUSE_GAIN);
      return;
    }
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    d.x = e.clientX;
    d.y = e.clientY;
    d.moved += Math.hypot(dx, dy);
    push(dx, dy * 0.4, TOUCH_GAIN);
  };
  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse") drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: 0 };
  };
  const endDrag = (e) => {
    if (drag.current?.id === e.pointerId) setTimeout(() => (drag.current = null), 0);
  };

  // Zoom a card in and out
  const openCard = (index) => {
    if (drag.current && drag.current.moved > 8) return; // that was a swipe, not a tap
    motion.current.paused = true;
    setOpen({ index, phase: "in", reduced: motion.current.reduced });
  };
  const closeCard = useCallback(() => setOpen((o) => (o && o.phase === "in" ? { ...o, phase: "out" } : o)), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && closeCard();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeCard]);

  return (
    <section
      ref={sectionRef}
      data-guide="industriesSphere"
      aria-label="Industries we serve"
      // Exactly one screen: the stage fills what's left under the floating navbar
      className="relative flex h-svh min-h-[480px] flex-col overflow-hidden bg-white pt-[88px] pb-4 sm:pt-24 sm:pb-6 lg:pt-[104px]"
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        ref={stageRef}
        // isolate: the cards' depth z-indexes stay inside the stage, under the zoomed card
        className={`relative isolate mx-auto min-h-0 w-full max-w-[1100px] flex-1 touch-pan-y select-none transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
        style={{ "--cw": `${size.cw}px` }}
      >
        <ul className="contents">
          {industries.map((industry, i) => (
            <li
              key={industry.title}
              ref={(el) => (cardRefs.current[i] = el)}
              className="absolute top-1/2 left-1/2 will-change-transform"
              style={{ width: size.cw }}
            >
              <button
                type="button"
                onClick={() => openCard(i)}
                aria-label={`${industry.title}: read more`}
                className="block w-full cursor-zoom-in rounded-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b57b7]"
              >
                <Card industry={industry} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {open && (
        <ZoomedCard
          industry={industries[open.index]}
          phase={open.phase}
          reduced={open.reduced}
          onClose={closeCard}
          onClosed={() => {
            setOpen(null);
            motion.current.paused = false;
            motion.current.kick?.();
          }}
        />
      )}
    </section>
  );
}

// The opened card: a small, readable copy in the middle of the screen. It simply fades and
// scales in (and back out); the sphere card stays where it is.
const OPEN_MS = 220;
const CLOSE_MS = 180;

function ZoomedCard({ industry, phase, reduced, onClose, onClosed }) {
  const closeRef = useRef(null);
  const [shown, setShown] = useState(false);
  // Latest callback, so a parent re-render mid-animation doesn't restart it
  const closedRef = useRef(onClosed);
  useEffect(() => {
    closedRef.current = onClosed;
  }, [onClosed]);

  useEffect(() => {
    if (phase === "in") {
      const show = requestAnimationFrame(() => setShown(true));
      closeRef.current?.focus({ preventScroll: true });
      return () => cancelAnimationFrame(show);
    }
    const hide = requestAnimationFrame(() => setShown(false));
    const done = setTimeout(() => closedRef.current(), reduced ? 0 : CLOSE_MS);
    return () => {
      cancelAnimationFrame(hide);
      clearTimeout(done);
    };
  }, [phase, reduced]);

  const duration = reduced ? 0 : phase === "in" ? OPEN_MS : CLOSE_MS;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={industry.title}
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-colors ${
        shown ? "bg-[#0b1f45]/25" : "bg-transparent"
      }`}
      style={{ transitionDuration: `${duration}ms` }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Small: up to 320px wide (about 300px on phones), narrower on very short screens so the
          whole card always fits (its height is about 0.72 x its width plus ~9rem of text) */}
      <div
        className={`relative w-[min(320px,calc(100vw-5.5rem),calc((100svh-11rem)/0.72))] min-w-[240px] transition-[opacity,transform] ease-out ${
          shown ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        style={{ transitionDuration: `${duration}ms` }}
      >
        <Card industry={industry} open className="shadow-[0_18px_44px_-16px_rgba(0,36,97,0.4)]" />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-3 -right-3 grid size-8 place-items-center rounded-full bg-white text-[#0b2a5b] shadow-md hover:bg-[#e9f4ff] focus-visible:outline-2 focus-visible:outline-[#0b57b7]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-4" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

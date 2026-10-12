"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const ROCKET_SRC = "/home/flights/rocket img 1.svg";

// Builds a fixed-position copy of the rocket image only that sits
// exactly on top of the original, so the hand-off is invisible.
function createFlyer(rect, src) {
  const wrap = document.createElement("div");
  Object.assign(wrap.style, {
    position: "fixed",
    left: "0",
    top: "0",
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    zIndex: "60",
    pointerEvents: "none",
    willChange: "transform, opacity",
    transform: `translate3d(${rect.left}px, ${rect.top}px, 0)`,
  });

  const img = document.createElement("img");
  img.src = src;
  img.alt = "";
  Object.assign(img.style, {
    position: "relative",
    display: "block",
    width: "100%",
    height: "auto",
  });

  wrap.append(img);
  document.body.appendChild(wrap);
  return wrap;
}

const PUFF_LIFE = 1100;

// Soft grey puffs emitted from the tail along the flight path. They sit in
// their own fixed, click-through layer beneath the rocket.
function createSmoke(puffs, rect, duration) {
  const layer = document.createElement("div");
  Object.assign(layer.style, {
    position: "fixed",
    left: "0",
    top: "0",
    width: "0",
    height: "0",
    zIndex: "59",
    pointerEvents: "none",
  });
  const size = rect.width * 0.4;
  puffs.forEach((puff, i) => {
    const rad = (puff.heading * Math.PI) / 180;
    const back = rect.height * 0.32;
    const jx = Math.sin(i * 12.9898) * 6;
    const jy = Math.cos(i * 78.233) * 6;
    const px = puff.x - Math.sin(rad) * back + jx - size / 2;
    const py = puff.y + Math.cos(rad) * back + jy - size / 2;
    // Alternate which blue sits at the core so the puffs blend into each other.
    const [inner, outer] =
      i % 2 === 0
        ? ["rgba(2,171,252,0.7)", "rgba(2,117,251,0.35)"]
        : ["rgba(2,117,251,0.55)", "rgba(2,171,252,0.35)"];
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "absolute",
      left: `${px}px`,
      top: `${py}px`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      background: `radial-gradient(circle at 40% 40%, ${inner} 0%, ${outer} 50%, rgba(2,117,251,0) 72%)`,
      opacity: "0",
      willChange: "transform, opacity",
    });
    const drift = 14 + (i % 4) * 4;
    el.animate(
      [
        { transform: "translate3d(0,0,0) scale(0.5)", opacity: 0 },
        { transform: `translate3d(0,${drift * 0.3}px,0) scale(1)`, opacity: 0.5, offset: 0.25 },
        { transform: `translate3d(0,${drift}px,0) scale(2.2)`, opacity: 0 },
      ],
      { duration: PUFF_LIFE, delay: puff.t * duration, easing: "ease-out", fill: "both" },
    );
    layer.appendChild(el);
  });
  document.body.appendChild(layer);
  return layer;
}

// Catmull-Rom point on the segment p1->p2 (p0/p3 are the neighbours).
function catmull(p0, p1, p2, p3, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  const f = (a, b, c, d) =>
    0.5 *
    (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
  return { x: f(p0.x, p1.x, p2.x, p3.x), y: f(p0.y, p1.y, p2.y, p3.y) };
}

// A cartoon-style scenic route: the rocket swoops across the whole viewport
// (right, back left, up and around) before shooting out of the top-right.
// Waypoints are relative to the viewport so it scales on every screen size.
function buildFlightPath({ cx, cy, w, h, vw, vh, steps = 120 }) {
  const way = [
    { x: cx, y: cy },
    { x: cx + vw * 0.08, y: cy - vh * 0.1 },
    { x: vw * 0.85, y: vh * 0.3 },
    { x: vw * 0.8, y: vh * 0.55 },
    { x: vw * 0.55, y: vh * 0.78 },
    { x: vw * 0.22, y: vh * 0.6 },
    { x: vw * 0.15, y: vh * 0.3 },
    { x: vw * 0.4, y: vh * 0.14 },
    { x: vw * 0.72, y: vh * 0.2 },
    { x: vw * 0.92, y: -vh * 0.05 },
    { x: vw + w * 1.5, y: -h * 2.5 },
  ];
  const pts = [way[0], ...way, way[way.length - 1]];

  // Dense sample of the spline, then arc-length parameterise for even speed.
  const dense = [];
  const per = 40;
  for (let i = 1; i < pts.length - 2; i++) {
    for (let j = 0; j < per; j++) {
      dense.push(catmull(pts[i - 1], pts[i], pts[i + 1], pts[i + 2], j / per));
    }
  }
  dense.push(way[way.length - 1]);
  const len = [0];
  for (let i = 1; i < dense.length; i++) {
    len.push(len[i - 1] + Math.hypot(dense[i].x - dense[i - 1].x, dense[i].y - dense[i - 1].y));
  }
  const total = len[len.length - 1];

  const at = (dist) => {
    let i = 1;
    while (i < len.length - 1 && len[i] < dist) i++;
    const span = len[i] - len[i - 1] || 1;
    const k = (dist - len[i - 1]) / span;
    return {
      x: dense[i - 1].x + (dense[i].x - dense[i - 1].x) * k,
      y: dense[i - 1].y + (dense[i].y - dense[i - 1].y) * k,
    };
  };

  const CROUCH = 0.05;
  const BASE_TILT = 20; // the artwork itself points up and slightly right
  const frames = [];
  const samples = [];
  const puffs = [];
  let prevAngle = 0;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = Math.max(0, (t - CROUCH) / (1 - CROUCH));
    const ease = (u * u * (3 - 2 * u)) * 0.5 + u * u * 0.5;
    const d = ease * total;
    const pos = at(d);
    const ahead = at(Math.min(total, d + total * 0.01));
    const behind = at(Math.max(0, d - total * 0.01));

    let angle = (Math.atan2(ahead.x - behind.x, behind.y - ahead.y) * 180) / Math.PI - BASE_TILT;
    // Unwrap so the rotation never flips the long way round.
    while (angle - prevAngle > 180) angle -= 360;
    while (angle - prevAngle < -180) angle += 360;
    prevAngle = angle;
    // Ease the rotation in so the rocket eases into the turn instead of snapping.
    const k = Math.min(1, u / 0.15);
    angle *= k * k * (3 - 2 * k);

    const dip = t < CROUCH ? 6 * Math.sin((Math.PI * t) / CROUCH) : 0;
    const scale = 1 + 0.3 * Math.sin(Math.PI * Math.min(1, u * 1.1)) - 0.15 * u;
    samples.push({ x: pos.x - w / 2, y: pos.y - h / 2 + dip, angle, scale, t });
  }
  // Light moving average on the angle removes any residual jitter.
  for (let i = 0; i < samples.length; i++) {
    const lo = Math.max(0, i - 3);
    const hi = Math.min(samples.length - 1, i + 3);
    let sum = 0;
    for (let j = lo; j <= hi; j++) sum += samples[j].angle;
    const { x, y, scale, t } = samples[i];
    const angle = sum / (hi - lo + 1);
    if (i % 3 === 0 && t > 0.06 && t < 0.97) {
      puffs.push({ t, x: x + w / 2, y: y + h / 2, heading: angle + BASE_TILT });
    }
    frames.push({
      transform: `translate3d(${x}px, ${y}px, 0) rotate(${angle}deg) scale(${scale})`,
      opacity: t > 0.94 ? (1 - t) / 0.06 : 1,
      offset: t,
    });
  }
  return { frames, puffs };
}

export default function RocketLink() {
  const btnRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => () => abortRef.current?.(), []);

  function handleClick() {
    if (abortRef.current) return; // already flying

    const btn = btnRef.current;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const rect = btn.querySelector("img").getBoundingClientRect();
    const wrap = createFlyer(rect, ROCKET_SRC);

    const moving = btn.querySelectorAll("[data-rocket], [data-cue]");
    const setMoving = (opacity, transition) =>
      moving.forEach((el) => {
        el.style.transition = transition;
        el.style.opacity = opacity;
      });
    setMoving("0", "none");

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const duration = Math.min(5000, Math.max(3200, vw * 3.2));

    const { frames, puffs } = buildFlightPath({
      cx: rect.left + rect.width / 2,
      cy: rect.top + rect.height / 2,
      w: rect.width,
      h: rect.height,
      vw,
      vh,
    });
    const smoke = createSmoke(puffs, rect, duration);

    let returnTimer = 0;

    const cleanup = () => {
      clearTimeout(returnTimer);
      wrap.remove();
      smoke.remove();
      setMoving("1", "opacity 0.6s ease");
      abortRef.current = null;
    };
    abortRef.current = () => {
      clearTimeout(returnTimer);
      wrap.remove();
      smoke.remove();
      setMoving("1", "none");
      abortRef.current = null;
    };

    const flight = wrap.animate(frames, {
      duration,
      easing: "linear",
      fill: "forwards",
    });

    flight.onfinish = () => {
      wrap.remove();
      // Bring the rocket back so it can be launched again.
      returnTimer = window.setTimeout(cleanup, 1300);
    };
  }

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={handleClick}
      aria-label="Launch the rocket"
      className="group relative mx-[0.15em] -my-[0.5em] inline-block w-[2.3em] cursor-pointer align-middle"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-[8%] top-[38%] h-[46%] rounded-[50%] bg-[#000B2F]"
      />
      <span
        aria-hidden="true"
        data-cue className="animate-pulse-ring absolute inset-x-[8%] top-[38%] h-[46%] rounded-[50%] border-2 border-[#000B2F]"
      />
      <span data-flight-icon className="block">
        <Image
          src={ROCKET_SRC}
          alt=""
          width={121}
          height={106}
          unoptimized
          data-rocket className="animate-float relative block h-auto w-full"
        />
      </span>
      <span
        aria-hidden="true"
        data-cue
        className="pointer-events-none absolute left-1/2 top-full -mt-[0.3em] flex -translate-x-1/2 flex-col items-center"
      >
        {[0, 1].map((i) => (
          <svg
            key={i}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000B2F"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-arrow-up -mt-1.5 h-4 w-4 sm:h-5 sm:w-5"
            style={{ animationDelay: `${i * 0.25}s` }}
          >
            <path d="M6 15l6-6 6 6" />
          </svg>
        ))}
      </span>
    </button>
  );
}

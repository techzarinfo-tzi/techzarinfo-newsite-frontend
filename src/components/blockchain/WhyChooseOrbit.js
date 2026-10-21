"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const base = "/service/blockchain/whychoose/";

// Coin artwork for the orbit (intrinsic sizes from each SVG, so next/image keeps the aspect ratio)
const coins = [
  { file: "bitcoin.webp", w: 242, h: 234 },
  { file: "ethi.webp", w: 231, h: 218 },
  { file: "poly.webp", w: 243, h: 227 },
  { file: "doller.webp", w: 230, h: 207 },
  { file: "t.webp", w: 245, h: 231 },
  { file: "ean.webp", w: 234, h: 218 },
  { file: "x.webp", w: 237, h: 230 },
  { file: "lol.webp", w: 239, h: 235 },
];

const TAU = Math.PI * 2;
const COUNT = coins.length;
const CYCLE = 6; // seconds: scatter -> gather -> scatter, the reference's loop
const SWIRL = 3 / COUNT; // extra share of the track per cycle while scattered; whole slots, so the gathered ring is always even
const DRIFT = 1 / 40; // share of the track per second: slow constant turn underneath, so the ring is never fully still
// Per coin: how far it strays when scattered (share of the free room), how many times it tumbles per
// cycle, and which way it rolls. Varied so the scattered cloud looks loose, not like a stretched ring.
const spread = [1, 0.72, 0.9, 0.78, 0.96, 0.7, 0.86, 0.8];
const turns = [1, 2, 1, 2, 2, 1, 2, 1];
const roll = [1, -1, 1, 1, -1, 1, -1, -1];

// Eases a 0..1 cycle phase with zero speed at both ends: the coins sweep and tumble while scattered and
// come to rest exactly on whole turns when gathered, so every loop joins the next without a jump.
const ease = (u) => u - Math.sin(TAU * u) / TAU;

// The track: a rounded rectangle (half extents a, b, corner radius rc), walked clockwise from the top
// centre. With a = b = rc it is a circle. Returns a point and its outward normal at a share f of the
// perimeter, so coins spaced by equal shares are evenly spaced along the path.
function makeTrack(a, b, rc) {
  const sx = a - rc;
  const sy = b - rc;
  const q = (Math.PI / 2) * rc;
  const line = (x0, y0, x1, y1, nx, ny) => ({ len: Math.hypot(x1 - x0, y1 - y0), at: (t) => [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, nx, ny] });
  const arc = (cx, cy, from) => ({
    len: q,
    at: (t) => {
      const p = from + (Math.PI / 2) * t;
      return [cx + rc * Math.cos(p), cy + rc * Math.sin(p), Math.cos(p), Math.sin(p)];
    },
  });
  const segs = [
    line(0, -b, sx, -b, 0, -1),
    arc(sx, -sy, -Math.PI / 2),
    line(a, -sy, a, sy, 1, 0),
    arc(sx, sy, 0),
    line(sx, b, -sx, b, 0, 1),
    arc(-sx, sy, Math.PI / 2),
    line(-a, sy, -a, -sy, -1, 0),
    arc(-sx, -sy, Math.PI),
    line(-sx, -b, 0, -b, 0, -1),
  ].filter((s) => s.len > 0);
  const total = segs.reduce((sum, s) => sum + s.len, 0);
  return (f) => {
    let d = (((f % 1) + 1) % 1) * total;
    for (const s of segs) {
      if (d <= s.len) return s.at(d / s.len);
      d -= s.len;
    }
    return segs[segs.length - 1].at(1);
  };
}

// The "Why Choose" coin cloud, after the reference: coins swirl outward in a loose 3D cloud, tumbling
// end over end with nearer coins larger and farther ones fainter, then gather into an even ring round
// the copy, settle face-on, and scatter again.
// From md the ring follows the glass panel's outline at a fixed gap (a rounded rectangle), so every
// coin stays the same distance from the copy and the section stays compact; on phones the ring is a
// circle beneath the copy. Scattering only ever moves coins outward, by as much room as the screen and
// the section padding leave, so a coin never crosses the copy or leaves the section.
// One rAF loop writes transforms straight to the DOM (no re-renders); it pauses off-screen and in
// background tabs. With prefers-reduced-motion the coins are placed once, evenly, and stay still.
export default function WhyChooseOrbit({ className = "" }) {
  const stageRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const items = itemRefs.current;
    const section = stage.closest("section");
    const panel = stage.parentElement.querySelector(".why-glass");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let track = () => [0, 0, 0, -1];
    let halfH = 1;
    let coinHalf = 0;
    let roomX = 0;
    let roomY = 0;
    const measure = () => {
      // The ResizeObserver can still fire while the page unmounts, after React has cleared the refs
      if (!items[0]) return;
      const coin = items[0].offsetWidth;
      coinHalf = coin / 2;
      const cs = getComputedStyle(section);
      const inner = section.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      roomX = Math.max(0, (inner - stage.offsetWidth) / 2 - 4);
      if (getComputedStyle(stage).position === "absolute") {
        // round the panel: coin centres run coin/2 + gap outside its edge, corners rounded to match
        const d = parseFloat(getComputedStyle(stage).getPropertyValue("--gap")) + coin / 2;
        const a = panel.offsetWidth / 2 + d;
        const b = panel.offsetHeight / 2 + d;
        const rc = Math.min(parseFloat(getComputedStyle(panel).borderTopLeftRadius) + d, a, b);
        track = makeTrack(a, b, rc);
        halfH = b;
        // only into the section padding (minus a margin for the near-side growth), never past it
        roomY = Math.max(0, parseFloat(cs.paddingTop) - 12 - 0.04 * coin);
      } else {
        const R = (stage.offsetWidth - coin) / 2;
        track = makeTrack(R, R, R);
        halfH = R;
        roomY = Math.min(0.12 * R, 24);
      }
    };

    const draw = (time) => {
      const cycles = time / CYCLE;
      const n = Math.floor(cycles);
      const u = cycles - n; // 0 = gathered, 0.5 = most scattered
      const scatter = (1 - Math.cos(TAU * u)) / 2;
      const e = ease(u);
      const ring = DRIFT * time + SWIRL * (n + e);

      items.forEach((el, i) => {
        if (!el) return;
        const [px, py, nx, ny] = track(ring + i / COUNT);
        const out = scatter * spread[i];
        const near = Math.max(-1, Math.min(1, py / halfH)); // lower half of the ring = nearer the viewer
        const scale = 1 + 0.08 * near * scatter;
        // a nearer (larger) coin also steps out by its extra radius, so its edge never closes the gap
        const grow = Math.max(0, scale - 1) * coinHalf;
        const x = px + nx * (roomX * out + grow);
        const y = py + ny * (roomY * out + grow);
        const spin = 360 * turns[i] * e * roll[i];
        const tip = 28 * Math.sin(TAU * u) * roll[i];
        el.style.transform =
          `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)}) ` +
          `perspective(700px) rotateY(${spin.toFixed(1)}deg) rotateX(${tip.toFixed(1)}deg)`;
        el.style.opacity = (1 - (0.22 * scatter * (1 - near)) / 2).toFixed(3);
        el.style.zIndex = String(Math.round(10 + 9 * near));
      });
    };

    measure();
    draw(0); // starts gathered and even
    stage.dataset.ready = "";

    let raf = 0;
    let last = 0;
    let time = 0;
    let visible = true;

    const frame = (now) => {
      raf = 0;
      time += last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      draw(time);
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    const start = () => {
      if (!still && !raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    io.observe(stage);
    const ro = new ResizeObserver(() => {
      measure();
      if (still || !raf) draw(time);
    });
    ro.observe(section);
    ro.observe(panel);
    document.addEventListener("visibilitychange", start);
    start();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", start);
      delete stage.dataset.ready;
      items.forEach((el) => {
        if (!el) return;
        el.style.transform = "";
        el.style.opacity = "";
        el.style.zIndex = "";
      });
    };
  }, []);

  return (
    <div ref={stageRef} aria-hidden="true" className={`why-orbit ${className}`}>
      {coins.map(({ file, w, h }, i) => (
        <div
          key={file}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          className="why-orbit-item"
          style={{ "--a": `${(TAU / COUNT) * i}rad` }}
        >
          <Image
            src={`${base}${file}`}
            alt=""
            width={w}
            height={h}
            unoptimized
            draggable={false}
            className="why-coin h-full w-full object-contain"
          />
        </div>
      ))}
    </div>
  );
}

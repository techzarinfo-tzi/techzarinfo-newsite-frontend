"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const DIR = "/service/blockchain/hero/layers";

// The hero artwork split into layers (all in the 667 x 626 frame of the original image):
// the phone + hand, and each coin cut out at its original spot.
const FRAME_W = 667;
const FRAME_H = 626;

// Orbit: every coin circles its OWN spot from the design on a small tilted ring (an ellipse seen
// in perspective: ry = K * rx, rotated by TILT). The ring is placed so the coin's design position is
// a point on it, so the first frame is exactly the original artwork and every coin starts from (and
// keeps returning to) its own place. All coins turn the same way; the near (lower) half of a ring is
// in front of the phone and hand, the far (upper) half behind, and the hand-over between the two
// happens at the ring's left/right ends, at the coin's own position, never over the phone's centre.
// The flick still pushes coins away from the phone, so it keeps that centre point.
const CENTER = { x: 285, y: 290 };
const K = 0.45;
const TILT = (-10 * Math.PI) / 180;

// theta0: where on its ring a coin starts. 90deg = nearest point (in front), -90deg = farthest
// (behind), matching the design: BNB and Bitcoin sit in front of the phone, Tether behind the hand.
const deg = (v) => (v * Math.PI) / 180;
const coins = [
  { name: "eth", x: 31, y: 78, w: 77, h: 75, rx: 38, period: 11, theta0: deg(-90) },
  { name: "tether", x: 35, y: 249, w: 141, h: 142, rx: 34, period: 13, theta0: deg(-90) },
  { name: "bnb", x: 289, y: 104, w: 145, h: 92, rx: 34, period: 12, theta0: deg(90) },
  { name: "bitcoin", x: 365, y: 279, w: 218, h: 144, rx: 40, period: 14, theta0: deg(90) },
];

// Point on a coin's ring (frame px, relative to the ring centre), tilted.
const ring = (c, theta) => {
  const x = c.rx * Math.cos(theta), y = K * c.rx * Math.sin(theta);
  return [x * Math.cos(TILT) - y * Math.sin(TILT), x * Math.sin(TILT) + y * Math.cos(TILT)];
};

const smooth = (a, b, v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
// How much of the coin is in front of the phone: 0 on the far half of its ring, 1 on the near half,
// with a gradual hand-over at the ring's ends so a coin slips behind instead of popping.
const frontness = (theta) => smooth(-0.3, 0.3, Math.sin(theta));
// Perspective size: smaller on the far side, larger on the near side (relative to the design size).
const depthScale = (theta) => 0.92 + 0.08 * Math.sin(theta);

// random flick timing (module scope: only ever called from the animation loop)
const randomBetween = (a, b) => a + Math.random() * (b - a);

const pct = (v, total) => `${((v / total) * 100).toFixed(4)}%`;

function CoinImage({ coin, layer, elRef }) {
  const front = layer === "front";
  return (
    <div
      ref={elRef}
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{
        left: pct(coin.x, FRAME_W),
        top: pct(coin.y, FRAME_H),
        width: pct(coin.w, FRAME_W),
        zIndex: front ? 20 : 0,
        // first paint = the design: only the copies that are in front in the design are shown on top
        opacity: front ? frontness(coin.theta0) : 1,
        willChange: "transform, opacity",
      }}
    >
      <Image
        src={`${DIR}/coin-${coin.name}.png`}
        alt=""
        width={coin.w * 2}
        height={coin.h * 2}
        sizes="(min-width: 1024px) 25vw, 40vw"
        className="h-auto w-full"
        draggable={false}
      />
    </div>
  );
}

// Coins orbit the phone (behind it on the far side, in front on the near side) and every few
// seconds a random coin gets "flicked": it spins over, flies outward and comes back to its orbit.
// One rAF loop writes transform/opacity straight to the DOM (no React re-renders); it pauses when
// the hero is off-screen or the tab is hidden, and never runs with prefers-reduced-motion.
export default function CoinOrbit({ alt }) {
  const boxRef = useRef(null);
  const refs = useRef([]);
  // copy i*2 = behind the phone, i*2 + 1 = in front of it
  const setRef = (slot) => (el) => {
    refs.current[slot] = el;
  };

  useEffect(() => {
    const box = boxRef.current;
    if (!box || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let scale = box.clientWidth / FRAME_W; // frame px -> screen px

    // Flight layer: the hero clips its contents and sits under the fixed navbar (z-50), so a flicked
    // coin is handed over to its own copy in a viewport-level overlay above the navbar (z-55, still
    // below the chat widget). The copy tracks the coin's exact on-screen position every frame.
    const flightLayer = document.createElement("div");
    flightLayer.setAttribute("aria-hidden", "true");
    flightLayer.style.cssText = "position:fixed;inset:0;z-index:55;pointer-events:none;overflow:hidden;";
    const flights = coins.map((_, i) => {
      const el = refs.current[i * 2 + 1].cloneNode(true);
      el.style.cssText = "position:absolute;left:0;top:0;opacity:0;visibility:hidden;will-change:transform,opacity;";
      flightLayer.append(el);
      return el;
    });
    document.body.append(flightLayer);
    let raf = 0;
    let last = 0;
    let time = 0; // animation clock (only advances while running, so nothing jumps after a pause)
    let visible = true;
    let nextFlick = randomBetween(2.5, 4.5);
    const flicks = new Map(); // coin index -> start time
    const FLICK = 1.35; // seconds

    const frame = (now) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      time += dt;

      // schedule the next flick at a random interval, on a coin that isn't already flying
      if (time >= nextFlick) {
        const free = coins.map((_, i) => i).filter((i) => !flicks.has(i));
        if (free.length) flicks.set(free[Math.floor(randomBetween(0, free.length))], time);
        nextFlick = time + randomBetween(3, 7);
      }

      coins.forEach((c, i) => {
        const theta = c.theta0 + (time / c.period) * Math.PI * 2;
        // offset from the design position = (point on the ring now) - (point on the ring at the start)
        const [px0, py0] = ring(c, c.theta0);
        const [px1, py1] = ring(c, theta);
        let ox = px1 - px0;
        let oy = py1 - py0;
        let s = depthScale(theta) / depthScale(c.theta0);
        let flip = 0;
        let tilt = 0;
        let lift = 0;

        const start = flicks.get(i);
        if (start !== undefined) {
          const u = (time - start) / FLICK;
          if (u >= 1) {
            flicks.delete(i);
            flights[i].style.opacity = "0";
            flights[i].style.visibility = "hidden";
          } else {
            const out = Math.sin(Math.PI * u); // 0 -> 1 -> 0: out and back
            const e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; // ease in-out
            // fly outward, away from the phone's centre, and a little upward
            const px = c.x + c.w / 2 + ox - CENTER.x;
            const py = c.y + c.h / 2 + oy - CENTER.y;
            const len = Math.hypot(px, py) || 1;
            // never far toward the left, where the hero copy is
            ox += Math.max((px / len) * 110, -25) * out;
            oy += (py / len) * 110 * out - 40 * out;
            s *= 1 + 0.18 * out;
            flip = 720 * e; // two fast flips over
            tilt = 25 * Math.sin(Math.PI * 2 * u);
            lift = out; // pulled in front of the phone while flying
          }
        }

        const rest = `scale(${s.toFixed(4)}) perspective(600px) rotateY(${flip.toFixed(1)}deg) rotate(${tilt.toFixed(1)}deg)`;
        const transform = `translate3d(${(ox * scale).toFixed(2)}px, ${(oy * scale).toFixed(2)}px, 0) ${rest}`;
        // in-hero copy hands over to the flight copy as the coin lifts off, and back as it lands
        const front = frontness(theta) * (1 - lift);
        const depth = Math.round(10 + 9 * Math.sin(theta) + 20 * lift); // nearer coins on top
        const back = refs.current[i * 2];
        const top = refs.current[i * 2 + 1];
        if (back) {
          back.style.transform = transform;
          back.style.zIndex = String(depth % 10);
        }
        if (lift > 0) {
          const r = box.getBoundingClientRect();
          const fl = flights[i];
          fl.style.visibility = "visible";
          fl.style.width = `${(c.w * scale).toFixed(2)}px`;
          fl.style.opacity = lift.toFixed(3);
          const fx = r.left + (c.x + ox) * scale; // same screen spot as the in-hero copy
          const fy = r.top + (c.y + oy) * scale;
          fl.style.transform = `translate3d(${fx.toFixed(2)}px, ${fy.toFixed(2)}px, 0) ${rest}`;
        }
        if (top) {
          top.style.transform = transform;
          top.style.opacity = front.toFixed(3);
          top.style.zIndex = String(20 + depth);
        }
      });

      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    const start = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    io.observe(box);
    const ro = new ResizeObserver(() => {
      scale = box.clientWidth / FRAME_W;
    });
    ro.observe(box);
    document.addEventListener("visibilitychange", start);
    start();

    const els = refs.current;
    const cleanupLayer = () => flightLayer.remove();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", start);
      els.forEach((el) => el && (el.style.transform = ""));
      cleanupLayer();
    };
  }, []);

  return (
    <div ref={boxRef} className="relative isolate aspect-667/626 w-full">
      {/* far side: under the phone and hand */}
      {coins.map((c, i) => (
        <CoinImage key={`${c.name}-back`} coin={c} layer="back" elRef={setRef(i * 2)} />
      ))}
      <Image
        src={`${DIR}/phone-hand.png`}
        alt={alt}
        width={FRAME_W}
        height={FRAME_H}
        preload
        sizes="(min-width: 1024px) 48vw, 90vw"
        className="relative z-10 h-auto w-full"
        draggable={false}
      />
      {/* near side: over the phone and hand (fades in/out with the orbit) */}
      {coins.map((c, i) => (
        <CoinImage key={`${c.name}-front`} coin={c} layer="front" elRef={setRef(i * 2 + 1)} />
      ))}
    </div>
  );
}

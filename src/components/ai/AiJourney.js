"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Lora } from "next/font/google";
import { Box, Layers, Rocket, Search, ShieldCheck, TrendingUp } from "lucide-react";

// The AI page's process section, after the approach film: an antique parchment map (ship's wheel,
// world map, sailing ship, compass dial) with a compass chart in the middle: a hexagon on a compass
// rose with "Development" at its heart, and the six steps around it, clockwise from north.
//
// Built as the design (1440 x 811): the parchment art is the background image (the design's own,
// with its heading, labels and chart removed); the heading, chart (SVG) and labels are live, laid
// out on the design's grid and scaled to fit under the navbar. Phones get a column: heading, chart,
// then the steps in two columns.
//
// Hand-over: this section sits underneath AiApproach (lower z-index) and overlaps its end by a screen
// plus the slide (--ai-slide), so it is already pinned when AiApproach's stage slides out to the
// left; the parchment settles in with a gentle parallax as it goes (--r).
// Then, strictly in order (--q, over the next screen of scroll): heading, subtitle, the compass
// rings draw, the hexagon turns and grows into place, the centre and the cardinal letters, then
// the six steps one after another, clockwise from north, each with its arrow.
// Exit: the stage stays pinned for a tail (--ai-burn) while AiHire, on top, burns it away from the
// centre (burnReveal).
// Reduced motion: everything shown at once, no parallax.

const lora = Lora({ subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"], display: "swap" });

const BG = "/service/AI/map/journey-map.jpg";
const DESIGN = { w: 1440, h: 811 };
const NAV = 84; // room for the fixed navbar
const FOOT = 56; // and for the site's bottom blur strip
const C = { x: 718, y: 495 }; // compass centre (design px)
const HEX_R = 156;
const INK = "#3b1d12";
const PLUM = "#4a1d3d";

// Steps clockwise from north: label centre (design px) and the hexagon vertex it belongs to
const STEPS = [
  { title: "Idea & Requirement Discovery", icon: Search, x: 720, y: 255, angle: -90 },
  { title: "Design & Architecture Planning", icon: Layers, x: 1068, y: 370, angle: -30 },
  { title: "AI Product Development", icon: Box, x: 1045, y: 616, angle: 30 },
  { title: "Model Training & Optimization", icon: TrendingUp, x: 718, y: 727, angle: 90 },
  { title: "Testing & Validation", icon: ShieldCheck, x: 405, y: 616, angle: 150 },
  { title: "Deployment & Launch", icon: Rocket, x: 400, y: 370, angle: 210 },
];
const STEP_AT = (i) => 0.5 + i * 0.07;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
// progress of a step of the reveal, as a CSS expression of --q
const prog = (start, dur) => `clamp(0, (var(--q) - ${start}) / ${dur}, 1)`;

// Hexagon points at radius r (SVG units, centred at 0,0)
const hex = (r) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = ((-90 + i * 60) * Math.PI) / 180;
    return `${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
const vertex = (deg, r) => [r * Math.cos((deg * Math.PI) / 180), r * Math.sin((deg * Math.PI) / 180)];

export default function AiJourney() {
  const trackRef = useRef(null);
  const slideLenRef = useRef(null);
  const stageRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const box = boxRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Desktop/tablet: the design's grid, scaled to fit under the navbar and centred
    const fit = () => {
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      if (W < 768) {
        box.style.transform = "";
        return;
      }
      const k = Math.min(W / DESIGN.w, (H - NAV - FOOT) / DESIGN.h);
      const x = (W - DESIGN.w * k) / 2;
      const y = NAV + (H - NAV - FOOT - DESIGN.h * k) / 2;
      box.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${k.toFixed(4)})`;
    };

    let raf = 0;
    const update = () => {
      raf = 0;
      const top = track.getBoundingClientRect().top;
      const slide = slideLenRef.current.offsetHeight;
      const vh = window.innerHeight;
      const r = reduced.matches || slide <= 0 ? 1 : clamp01(-top / slide);
      const q = reduced.matches ? 1 : clamp01((-top - slide) / vh);
      stage.style.setProperty("--r", ease(r).toFixed(4));
      stage.style.setProperty("--q", q.toFixed(4));
    };
    // Only while the section is on screen (or about to be); one last update as it leaves, so its
    // end state is exact even after a fast fling
    let onScreen = true;
    const request = () => {
      if (onScreen && !raf) raf = requestAnimationFrame(update);
    };
    const gate = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        if (!raf) raf = requestAnimationFrame(update);
      },
      { rootMargin: "25% 0px" }
    );
    gate.observe(track);
    fit();
    update();
    const ro = new ResizeObserver(() => {
      fit();
      request();
    });
    ro.observe(stage);
    window.addEventListener("scroll", request, { passive: true });
    reduced.addEventListener("change", request);
    return () => {
      gate.disconnect();
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", request);
      reduced.removeEventListener("change", request);
    };
  }, []);

  return (
    <section
      ref={trackRef}
      data-guide="aiJourney"
      aria-labelledby="ai-journey-title"
      // Under AiApproach (z-30), overlapping its end by a screen plus its slide-out; then a screen to
      // reveal the content and a little to hold it
      className={`${lora.className} relative z-[25] -mt-[calc(100svh+var(--ai-slide))] h-[calc(260svh+var(--ai-slide)+var(--ai-burn))] [--ai-burn:130svh] [--ai-slide:110svh] motion-reduce:mt-0! motion-reduce:h-svh! motion-reduce:[--ai-burn:0svh] motion-reduce:[--ai-slide:0svh]`}
    >
      <div ref={slideLenRef} aria-hidden="true" className="invisible absolute left-0 top-0 h-(--ai-slide) w-px" />

      <div ref={stageRef} className="sticky top-0 h-svh overflow-hidden bg-[#3a2412]" style={{ "--r": 1, "--q": 1 }}>
        {/* Parchment: settles in from the right as the scene above slides away */}
        <div
          className="absolute inset-0 motion-reduce:transform-none!"
          style={{ transform: "translate3d(calc((1 - var(--r)) * 14%), 0, 0) scale(calc(1 + (1 - var(--r)) * 0.08))" }}
        >
          <Image src={BG} alt="" fill unoptimized className="object-cover" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-black"
          style={{ opacity: "calc((1 - var(--r)) * 0.55)" }}
        />

        {/* Content: the design's grid on md+, a column on phones */}
        <div
          ref={boxRef}
          className="relative flex h-full flex-col items-center justify-center gap-4 px-4 pb-6 pt-[84px] md:absolute md:left-0 md:top-0 md:block md:h-[811px] md:w-[1440px] md:origin-top-left md:p-0"
        >
          {/* Heading */}
          <div className="text-center md:absolute md:left-[380px] md:top-[30px] md:w-[680px]">
            <h2
              id="ai-journey-title"
              className="text-[26px] font-bold leading-[1.12] text-[#2a1206] [text-shadow:0_1px_0_rgba(255,236,200,0.5)] sm:text-[34px] md:text-[46px] md:leading-[1.08]"
              style={{
                "--h": prog(0, 0.12),
                opacity: "var(--h)",
                transform: "translate3d(0, calc((1 - var(--h)) * 26px), 0)",
                filter: "blur(calc((1 - var(--h)) * 6px))",
              }}
            >
              Our Approach to AI Software Development
            </h2>
            <p
              className="mx-auto mt-2 max-w-[34rem] text-[14px] italic leading-snug text-[#2a1206] sm:text-[16px] md:mt-2.5 md:max-w-[560px] md:text-[19px]"
              style={{
                "--h": prog(0.08, 0.12),
                opacity: "var(--h)",
                transform: "translate3d(0, calc((1 - var(--h)) * 18px), 0)",
              }}
            >
              A systematic journey from concept to deployment, ensuring excellence at every stage
            </p>
          </div>

          {/* Compass chart */}
          <Compass />

          {/* The six steps */}
          <ol className="grid w-full max-w-[26rem] auto-rows-fr grid-cols-2 gap-2.5 md:contents">
            {STEPS.map(({ title, icon: Icon, x, y }, i) => (
              <li
                key={title}
                className="md:absolute md:left-(--lx) md:top-(--ly) md:-translate-x-1/2 md:-translate-y-1/2"
                style={{ "--lx": `${x}px`, "--ly": `${y}px` }}
              >
                <div
                  className="flex h-full items-center gap-2 rounded-full border border-[#7a4a22]/35 py-1.5 pl-1.5 pr-3 shadow-[0_4px_12px_rgba(60,30,10,0.35),inset_0_1px_0_rgba(255,245,220,0.7),inset_0_-2px_4px_rgba(150,95,40,0.25)] md:gap-3 md:py-2 md:pl-2 md:pr-5"
                  style={{
                    background: "linear-gradient(180deg, #f8e3b4 0%, #ecc98d 55%, #e2b877 100%)",
                    "--s": prog(STEP_AT(i), 0.07),
                    opacity: "var(--s)",
                    transform: "scale(calc(0.82 + var(--s) * 0.18))",
                    filter: "blur(calc((1 - var(--s)) * 4px))",
                  }}
                >
                  <span
                    className="grid size-7 shrink-0 place-items-center rounded-full text-[#f6e2b8] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] md:size-[34px]"
                    style={{ background: `radial-gradient(circle at 35% 30%, #6b2f58, ${PLUM})` }}
                  >
                    <Icon className="size-3.5 md:size-[18px]" strokeWidth={2.2} aria-hidden="true" />
                  </span>
                  <span className="text-[12px] font-semibold leading-tight text-[#2a1206] md:whitespace-nowrap md:text-[17px]">
                    {title}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

// The compass chart (SVG, 476 x 476, centred on the design's compass centre)
function Compass() {
  const S = 476;
  const c = S / 2;
  const ringDraw = prog(0.18, 0.18);
  return (
    <svg
      viewBox={`${-c} ${-c} ${S} ${S}`}
      aria-hidden="true"
      className="w-[min(78vw,40svh,22rem)] shrink-0 overflow-visible md:absolute md:w-[476px]"
      style={{ left: `${C.x - c}px`, top: `${C.y - c}px` }}
    >
      <defs>
        <radialGradient id="aj-medal" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#f8e4b6" />
          <stop offset="100%" stopColor="#d7ad6e" />
        </radialGradient>
        <linearGradient id="aj-band" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9975c" />
          <stop offset="100%" stopColor="#a8743f" />
        </linearGradient>
        <marker id="aj-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={INK} />
        </marker>
      </defs>

      {/* Rings: drawn in */}
      <g fill="none" stroke={INK} style={{ "--d": ringDraw }}>
        <circle r="190" strokeWidth="1.6" pathLength="1" strokeDasharray="1" style={{ strokeDashoffset: "calc(1 - var(--d))" }} />
        <circle r="182" strokeWidth="0.8" pathLength="1" strokeDasharray="1" style={{ strokeDashoffset: "calc(1 - var(--d))" }} />
        <circle r="120" strokeWidth="0.7" strokeOpacity="0.5" pathLength="1" strokeDasharray="1" style={{ strokeDashoffset: "calc(1 - var(--d))" }} />
        {/* slowly turning dashed ring */}
        <g className="aj-spin" style={{ opacity: "var(--d)" }}>
          <circle r="170" strokeWidth="0.8" strokeDasharray="2 7" strokeOpacity="0.7" />
        </g>
      </g>

      {/* Cardinal arrows and letters */}
      <g style={{ "--l": prog(0.3, 0.12), opacity: "var(--l)" }}>
        {[
          // letter, direction, letter radius, arrow end radius (as in the design: N and S sit
          // close to the ring, between it and their steps)
          ["N", 0, -1, 203, 188],
          ["E", 1, 0, 222, 200],
          ["S", 0, 1, 194, 186],
          ["W", -1, 0, 222, 200],
        ].map(([t, dx, dy, lr, ar]) => (
          <g key={t}>
            <line x1={dx * 182} y1={dy * 182} x2={dx * ar} y2={dy * ar} stroke={INK} strokeWidth="1.6" markerEnd="url(#aj-arrow)" />
            <text
              x={dx * lr}
              y={dy * lr + 9}
              textAnchor="middle"
              fontSize="28"
              fontWeight="700"
              fill={INK}
              className="font-[inherit]"
            >
              {t}
            </text>
          </g>
        ))}
      </g>

      {/* Hexagon: turns and grows into place */}
      <g
        style={{
          "--x": prog(0.26, 0.16),
          opacity: "var(--x)",
          transform: "rotate(calc((1 - var(--x)) * -40deg)) scale(calc(0.55 + var(--x) * 0.45))",
        }}
      >
        {Array.from({ length: 6 }, (_, i) => {
          const [ax, ay] = vertex(-90 + i * 60, HEX_R);
          const [bx, by] = vertex(-30 + i * 60, HEX_R);
          return <polygon key={i} points={`0,0 ${ax},${ay} ${bx},${by}`} fill={i % 2 ? "#5a2749" : PLUM} />;
        })}
        <polygon points={hex(HEX_R * 0.66)} fill="url(#aj-band)" opacity="0.9" />
        {Array.from({ length: 6 }, (_, i) => {
          const [ax, ay] = vertex(-90 + i * 60, HEX_R * 0.66);
          const [bx, by] = vertex(-30 + i * 60, HEX_R * 0.66);
          return <polygon key={i} points={`0,0 ${ax},${ay} ${bx},${by}`} fill="#7a4a2a" opacity={i % 2 ? 0.12 : 0.28} />;
        })}
        <polygon points={hex(HEX_R)} fill="none" stroke="#f0d39c" strokeWidth="2" />
        <polygon points={hex(HEX_R * 0.83)} fill="none" stroke="#e8c58a" strokeOpacity="0.45" strokeWidth="1" />
        <polygon points={hex(HEX_R * 0.66)} fill="none" stroke="#f3dba8" strokeOpacity="0.8" strokeWidth="1.2" />
        {Array.from({ length: 6 }, (_, i) => {
          const [x, y] = vertex(-90 + i * 60, HEX_R);
          return <line key={i} x1="0" y1="0" x2={x} y2={y} stroke="#f0d39c" strokeOpacity="0.55" strokeWidth="1" />;
        })}
      </g>

      {/* Arrows from the vertices out to the steps (drawn with each step) */}
      {STEPS.map(({ angle }, i) => {
        if (angle === -90 || angle === 90) return null; // north and south use the cardinal arrows
        const [x1, y1] = vertex(angle, HEX_R + 8);
        const [x2, y2] = vertex(angle, 214);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={INK}
            strokeWidth="1.6"
            markerEnd="url(#aj-arrow)"
            pathLength="1"
            strokeDasharray="1"
            style={{ "--a": prog(STEP_AT(i), 0.06), strokeDashoffset: "calc(1 - var(--a))", opacity: "var(--a)" }}
          />
        );
      })}

      {/* Vertex nodes */}
      {STEPS.map(({ angle }, i) => {
        const [x, y] = vertex(angle, HEX_R);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="8.5"
            fill="#f3d9a3"
            stroke={INK}
            strokeWidth="2.6"
            style={{ "--n": prog(0.38 + i * 0.015, 0.05), opacity: "var(--n)" }}
          />
        );
      })}

      {/* Centre medallion */}
      <g style={{ "--m": prog(0.4, 0.1), opacity: "var(--m)", transform: "scale(calc(0.6 + var(--m) * 0.4))" }}>
        <circle r="48" fill="url(#aj-medal)" stroke={INK} strokeWidth="2.2" />
        <circle r="41" fill="none" stroke={INK} strokeOpacity="0.55" strokeWidth="1" strokeDasharray="3 3" />
        <text y="-2" textAnchor="middle" fontSize="22" fontWeight="700" fill={INK} fontFamily="ui-monospace, monospace">
          {"</>"}
        </text>
        <text y="17" textAnchor="middle" fontSize="9.5" fontWeight="700" letterSpacing="0.6" fill={INK}>
          DEVELOPMENT
        </text>
      </g>
    </svg>
  );
}

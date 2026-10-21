"use client";

import { useEffect, useRef } from "react";
import { Cloud, Cog, Database, Hourglass, LayoutGrid, Users } from "lucide-react";

// Icons from Lucide (lucide.dev), drawn in the site's colour via currentColor
const icons = {
  database: Database,
  analytics: Hourglass,
  cloud: Cloud,
  tenant: Users,
  interface: LayoutGrid,
  automation: Cog,
};

// Clockwise from the top left, at the angles they sit in the design (degrees, 0 = right, y down):
// six evenly spaced points on one circle.
const features = [
  { icon: "database", title: "Centralized Database", text: "Manage all your data from a single platform", angle: -120 },
  { icon: "analytics", title: "Real-Time Analytics", text: "Make informed decisions with up-to-date insights", angle: -60 },
  { icon: "cloud", title: "Cloud-Based ERP Solutions", text: "Access your ERP system anytime, anywhere", angle: 0 },
  { icon: "tenant", title: "Multi tenant", text: "Multiple users to share a single instance of software", angle: 60 },
  { icon: "interface", title: "User-Friendly Interface", text: "Ensure smooth adoption with intuitive design", angle: 120 },
  { icon: "automation", title: "Process Automation", text: "Reduce manual errors and improved efficiency", angle: 180 },
];

const RAD = Math.PI / 180;

// Speed (degrees per second): a slow base turn; scrolling adds speed in proportion to how fast the
// page is moving, up to a cap. The speed eases towards its target (quicker to pick up than to
// settle), so it never jumps: scroll and it gathers pace, stop and it glides back to the base turn.
const BASE_SPEED = 6; // one turn a minute
const SPEED_PER_SCROLL = 0.045; // deg/s per px/s of scrolling
const MAX_SPEED = 110;
const SPEED_UP = 0.3; // s: time constant while gathering pace
const SLOW_DOWN = 0.9; // s: time constant while settling back

// Pills fade out near the top and bottom of the ring, where they swap from extending left to
// extending right (or back), so the swap is never seen: fully shown beyond FADE_TO, gone below
// FADE_FROM (|cos| of the angle, i.e. horizontal distance from the vertical axis).
const FADE_FROM = 0.12;
const FADE_TO = 0.38;
const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Where an item sits for a given angle: a translate in units of the stage size (--S) times the
// orbit radius (--orbit), so the same string works at every breakpoint without measuring.
const place = (deg) => {
  const c = Math.cos(deg * RAD).toFixed(5);
  const s = Math.sin(deg * RAD).toFixed(5);
  return `translate(calc(var(--S) * var(--orbit) * ${c}), calc(var(--S) * var(--orbit) * ${s}))`;
};
const sideFor = (deg) => (Math.cos(deg * RAD) < 0 ? "left" : "right");
const pillOpacity = (deg) => smoothstep(FADE_FROM, FADE_TO, Math.abs(Math.cos(deg * RAD)));

// Design (1440px): the stage is ~1100px wide; the icons orbit at 24.6% of that, the ring at 28%, the
// centre disc is 25% across, each pill ~28% wide. Phones (below md) keep only the icons on the orbit
// (larger ratios, square stage) and list the features below it.
// One rAF loop writes each item's transform, its pill's opacity and which side the pill is on
// (no re-renders). It runs only while the section is on screen and the tab is visible; with
// prefers-reduced-motion everything stays at the design's positions.
export default function ErpFeaturesOrbit() {
  const stageRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const stage = stageRef.current;
    const items = itemRefs.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rotation = 0; // degrees added to every item's design angle
    let speed = BASE_SPEED;
    let scrollSpeed = 0; // smoothed px/s
    let lastY = window.scrollY;
    let last = 0;
    let raf = 0;
    let visible = false;

    const draw = () => {
      items.forEach((el, i) => {
        if (!el) return;
        const deg = features[i].angle + rotation;
        el.style.transform = place(deg);
        const side = sideFor(deg);
        if (el.dataset.side !== side) el.dataset.side = side;
        el.style.setProperty("--pill", pillOpacity(deg).toFixed(3));
      });
    };

    const frame = (now) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      if (dt > 0) {
        // How fast the page is scrolling, smoothed so single wheel ticks don't spike it
        const y = window.scrollY;
        const instant = Math.abs(y - lastY) / dt;
        lastY = y;
        scrollSpeed += (instant - scrollSpeed) * (1 - Math.exp(-dt / 0.12));
        const target = Math.min(MAX_SPEED, BASE_SPEED + scrollSpeed * SPEED_PER_SCROLL);
        const tau = target > speed ? SPEED_UP : SLOW_DOWN;
        speed += (target - speed) * (1 - Math.exp(-dt / tau));
        rotation = (rotation + speed * dt) % 360;
        draw();
      }
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    const start = () => {
      if (!raf && visible && !document.hidden) {
        lastY = window.scrollY;
        raf = requestAnimationFrame(frame);
      }
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    io.observe(stage);
    document.addEventListener("visibilitychange", start);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", start);
    };
  }, []);

  return (
    <section data-guide="erpFeatures" className="overflow-x-clip bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div
        ref={stageRef}
        className="erp-orbit relative mx-auto h-(--S) w-(--S) [--disc:0.5] [--orbit:0.41] [--ring:0.41] [--S:min(92vw,420px)] md:h-[calc(var(--S)*0.69)] md:[--disc:0.25] md:[--orbit:0.246] md:[--ring:0.28] md:[--S:min(1100px,94vw)]"
      >
        {/* The ring */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 size-[calc(var(--S)*var(--ring)*2)] -translate-1/2 rounded-full border border-[#dce7f7]"
        />

        {/* Centre disc: the design's radial gradient (closest-side, so 100% lands on the rim), plus
            the soft outer glow */}
        <div className="absolute top-1/2 left-1/2 z-10 flex size-[calc(var(--S)*var(--disc))] -translate-1/2 items-center justify-center rounded-full border border-white bg-[radial-gradient(circle_closest-side,#F5F9FE_39%,#ECF5FF_93%,#B4D5FF_100%)] text-center shadow-[0_0_0_10px_rgba(207,224,255,0.45),0_0_60px_10px_rgba(0,94,255,0.18),inset_0_0_24px_rgba(0,94,255,0.12)]">
          <h2 className="w-[80%] text-[clamp(17px,5vw,22px)] font-medium leading-tight tracking-tight text-[#002461] md:text-[max(15px,calc(var(--S)*0.019))]">
            Power Packed Features of Our Custom ERP Software
          </h2>
        </div>

        {/* The features: an icon on the orbit, its pill extending outwards (md and up) */}
        <ul>
          {features.map((feature, i) => (
            <li
              key={feature.title}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              data-side={sideFor(feature.angle)}
              className="orbit-item absolute top-1/2 left-1/2 z-20 size-0"
              style={{ transform: place(feature.angle), "--pill": pillOpacity(feature.angle) }}
            >
              <div className="orbit-pill absolute top-0 hidden -translate-y-1/2 items-center rounded-[26px] border border-[#e1eaf7] bg-white shadow-[0_8px_24px_-12px_rgba(0,36,97,0.18)] md:flex">
                <div>
                  <h3 className="text-[clamp(14px,1.3vw,18px)] font-medium leading-snug text-[#002461]">{feature.title}</h3>
                  <p className="mt-1 text-[clamp(11px,0.95vw,13px)] leading-snug text-[#002461]/75">{feature.text}</p>
                </div>
              </div>
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 flex size-(--icon) -translate-1/2 items-center justify-center rounded-full bg-[#e3eeff]"
              >
                <span className="flex size-[72%] items-center justify-center rounded-full bg-linear-to-b from-[#3d84f7] to-[#1b54d6] text-white shadow-[0_6px_14px_-4px_rgba(27,84,214,0.55)]">
                  {(() => {
  const Icon = icons[feature.icon];
  return <Icon aria-hidden="true" strokeWidth={1.9} className="size-[48%]" />;
})()}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Phones: the features as a list under the orbit */}
      <ul className="mx-auto mt-10 grid max-w-[420px] gap-3 md:hidden">
        {features.map((feature) => (
          <li key={feature.title} className="flex items-center gap-4 rounded-[22px] border border-[#e1eaf7] bg-white p-4 shadow-[0_8px_24px_-12px_rgba(0,36,97,0.18)]">
            <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-[#3d84f7] to-[#1b54d6] text-white">
              {(() => {
  const Icon = icons[feature.icon];
  return <Icon aria-hidden="true" strokeWidth={1.9} className="size-5" />;
})()}
            </span>
            <div>
              <h3 className="text-base font-medium text-[#002461]">{feature.title}</h3>
              <p className="mt-0.5 text-sm text-[#002461]/75">{feature.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

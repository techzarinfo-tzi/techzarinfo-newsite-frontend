"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const ASSETS = "/product/ERP/utilize/";

// The nine logo tiles, at their centres in the design (in % of the arch box, which spans the
// design's full width and its band from the top tile to the bottom tiles). order: entrance order,
// from the top of the arch outwards; depth: how far the tile drifts with the pointer.
const tech = [
  { name: "Web applications", file: "utilize-1.svg", x: 14.4, y: 75.3, order: 4, depth: 0.9 },
  { name: "Laravel", file: "laravel 1.svg", x: 23.2, y: 44, order: 3, depth: 0.7 },
  { name: "Google Cloud", file: "google-cloud 1.svg", x: 33.5, y: 22.7, order: 1, depth: 0.5 },
  { name: "AWS", file: "aws 1.svg", x: 41, y: 50, order: 2, depth: 0.35 },
  { name: "PHP", file: "php 1.svg", x: 49, y: 13.3, order: 0, depth: 0.25 },
  { name: "DigitalOcean", file: "digital-ocean 1.svg", x: 57.1, y: 50, order: 2, depth: 0.35 },
  { name: "HTML5", file: "html 1.svg", x: 63.6, y: 22.7, order: 1, depth: 0.5 },
  { name: "JavaScript", file: "js 1.svg", x: 74.6, y: 44, order: 3, depth: 0.7 },
  { name: "CSS3", file: "css 1.svg", x: 82.9, y: 75.3, order: 4, depth: 0.9 },
];

// Layout from the 1440px design: the tiles (~88px, rounded, pale lilac-to-white with a soft blue
// shadow) form an arch across the section; the heading and paragraph sit centred in its opening,
// level with the two lowest tiles. Below xl (1280px) the copy moves under the arch, which keeps its shape
// with smaller tiles (never under 44px).
//
// Motion (globals.css .erp-tech-*), each on its own wrapper so they never fight over `transform`:
//   1. Entrance, once, as the section scrolls in: the tiles rise and pop in from the top of the
//      arch outwards, then the heading and paragraph fade up.
//   2. Idle: every tile bobs gently, out of step with its neighbours.
//   3. Pointer: on mouse devices the tiles drift with the cursor, outer tiles more than inner ones,
//      for a little depth (one rAF write of two CSS variables per frame, eased).
//   4. Hover/focus: a tile lifts, grows slightly and shows the technology's name.
// Shared by other pages: title, children (the paragraph) and guide default to the ERP page's own
// content, so that page passes nothing. The tiles are the same everywhere.
export default function ErpTechnologies({
  title = "Technology We Utilize for ERP Software Development",
  children = (
    <>
      As a reputed ERP development company of this era, our ERP software developers use highly
      sophisticated tools and advanced technologies to deliver a flawless output. Every solution is
      crafted with precision to match your industry requirements, ensuring smooth performance, robust
      security, and long-term scalability
    </>
  ),
  guide = "erpTech",
}) {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  // Entrance trigger
  useEffect(() => {
    const el = sectionRef.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        io.disconnect();
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pointer drift: eases --mx/--my (-1..1) towards the cursor's position over the section
  useEffect(() => {
    const el = sectionRef.current;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    const step = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty("--mx", x.toFixed(4));
      el.style.setProperty("--my", y.toFixed(4));
      raf = Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001 ? requestAnimationFrame(step) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };
    const move = (e) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      kick();
    };
    const leave = () => {
      tx = 0;
      ty = 0;
      kick();
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-guide={guide}
      data-inview={inView}
      className="erp-tech relative overflow-hidden bg-white px-4 pt-12 pb-14 sm:px-6 lg:pb-16 xl:px-0 xl:pt-6 xl:pb-20"
    >
      <noscript>
        <style>{`.erp-tech .erp-tech-in { opacity: 1 !important; animation: none !important; }`}</style>
      </noscript>

      {/* Faint blue haze along the top edge, as in the design */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_30%_100%_at_50%_0%,rgba(205,222,250,0.55),transparent_75%)]"
      />

      <div className="relative mx-auto max-w-[1440px]">
        {/* The arch: the design's 1440 x 600 band, scaled to the width */}
        <ul className="relative mx-auto aspect-[1440/600] w-full max-w-[760px] max-sm:aspect-[1440/980] xl:max-w-none">
          {tech.map((t, i) => (
            <li
              key={t.file}
              className="erp-tech-in erp-tech-pop absolute -translate-1/2"
              style={{ left: `${t.x}%`, top: `${t.y}%`, "--o": t.order }}
            >
              <div className="erp-tech-drift" style={{ "--depth": t.depth }}>
                <div className="erp-tech-bob" style={{ "--bob-delay": `${-(i * 0.77) % 5}s` }}>
                  <div
                    tabIndex={0}
                    aria-label={t.name}
                    className="erp-tech-tile group relative flex size-(--tile) items-center justify-center rounded-[22%] border border-white/90 bg-linear-to-br from-[#fbfcff] to-[#ebf0ff] shadow-[0_10px_24px_-8px_rgba(70,105,200,0.28),inset_0_1px_0_rgba(255,255,255,0.9)] outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
                  >
                    <Image
                      src={encodeURI(`${ASSETS}${t.file}`)}
                      alt=""
                      width={64}
                      height={64}
                      draggable={false}
                      className="pointer-events-none size-[68%] object-contain select-none"
                    />
                    <span className="erp-tech-label pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded-full bg-[#002461] px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-white shadow-md">
                      {t.name}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* The copy: in the arch's opening from xl (pulled up by a negative margin, so it stays in
            the flow and the section always grows to fit it; 15.4% of the width = the part of the
            arch box below the opening's top), under the arch below that */}
        <div className="erp-tech-in erp-tech-copy relative mx-auto mt-6 max-w-[820px] text-center xl:-mt-[15.4%] xl:max-w-[clamp(620px,55vw,800px)]">
          <h2 className="mx-auto max-w-[560px] text-[28px] font-semibold leading-[1.25] tracking-tight text-balance text-[#002461] sm:text-[34px] lg:text-[40px] xl:max-w-[600px] xl:text-[clamp(34px,2.8vw,40px)]">
            {title}
          </h2>
          <p className="mx-auto mt-3 text-[15px] leading-normal text-[#002461] sm:text-base lg:text-[17px] lg:leading-[1.35]">
            {children}
          </p>
        </div>
      </div>
    </section>
  );
}

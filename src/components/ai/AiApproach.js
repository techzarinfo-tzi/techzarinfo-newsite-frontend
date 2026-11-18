"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { createFrameFilm } from "@/components/ai/frameFilm";
import { HOLE } from "@/components/ai/AiIndustries";
import GlassCard from "@/components/ai/GlassCard";

// "Our Approach to AI Software Development" on the AI page, after the industries section. A scroll
// film like the others (143 frames, every 2nd of the supplied 285): the camera starts close on the
// little robot on its hill, pulls back over the hill, and the scene shrinks into a glowing round
// portal on deep teal.
//
//   Hole    the hand-over: over the pinned industries scene a hole opens (at HOLE) with this
//           film's first frame inside, ringed with light; the industry icons swirl into it and
//           vanish (AiIndustries reads the same scroll as --v), then the hole widens until the
//           scene fills the screen, settling from a slight zoom. A circular clip on this stage;
//           like the other hand-overs, the section overlaps the end of AiIndustries by a screen
//           plus the transition (--ai-hole).
//   Film    robot close-up -> wide shot of the hill. The film eases almost to a stop on the wide
//           shot while the three glass cards rise in one after another (the design's second
//           state), then they lift away and the film plays on into the portal.
//   Heading once the portal has formed, the heading rises in above it (the design's final state).
//   Exit    the stage stays pinned for a tail (--ai-slide) and slides out to the left, a soft shadow
//           on its trailing edge, uncovering AiJourney underneath (which sits under this section).
//
// Reduced motion: no hole (the section simply follows), the film and content still follow the scroll.

const FRAMES = 143;
const frameSrc = (i) => `/service/AI/approach/${String(i).padStart(3, "0")}.jpg`;

// Scroll (after the hole) -> film frame: the wide shot holds while the cards are up
const FILM_KEYS = [
  [0, 1],
  [0.3, 70],
  [0.56, 74],
  [0.88, FRAMES],
  [1, FRAMES],
];
const CARDS_AT = [0.3, 0.36, 0.42]; // each card rises in
const CARDS_OUT = 0.56; // they lift away together
const HEADING_AT = 0.86;

// Card copy as in the design (the cards currently share it)
const CARD = {
  title: "Custom AI Development",
  text: "We code the intelligence you imagine. We build custom AI that understands your requirements, adapts to your processes, and creates new possibilities beyond conventional software",
};

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (a, b, v) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const filmAt = (p) => {
  for (let i = 1; i < FILM_KEYS.length; i++) {
    const [p1, f1] = FILM_KEYS[i];
    const [p0, f0] = FILM_KEYS[i - 1];
    if (p <= p1) return f0 + (f1 - f0) * clamp01((p - p0) / (p1 - p0 || 1));
  }
  return FRAMES;
};

export default function AiApproach() {
  const trackRef = useRef(null);
  const holeLenRef = useRef(null);
  const slideLenRef = useRef(null);
  const stageRef = useRef(null);
  const sceneRef = useRef(null);
  const zoomRef = useRef(null);
  const rimRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const scene = sceneRef.current;
    const zoom = zoomRef.current;
    const rim = rimRef.current;
    const film = createFrameFilm({
      canvas: canvasRef.current,
      stage,
      count: FRAMES,
      src: frameSrc,
      ease: 9,
      onFrameReady: () => kick(),
    });

    const measure = () => {
      const r = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const holeLen = holeLenRef.current.offsetHeight;
      const slideLen = slideLenRef.current.offsetHeight;
      const span = r.height - holeLen - slideLen - vh;
      return {
        top: r.top,
        u: holeLen > 0 ? (r.top > 0.5 ? 0 : clamp01(-r.top / holeLen)) : 1,
        p: span > 0 ? clamp01((-r.top - holeLen) / span) : 0,
        // the slide-out over the tail
        s: slideLen > 0 ? clamp01((-r.top - holeLen - span) / slideLen) : 0,
      };
    };
    const aim = (m) => film.setTarget((filmAt(m.p) - 1) / (FRAMES - 1));
    aim(measure());
    film.jump();

    let lastHole = "";
    const hole = (u) => {
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      const cx = HOLE.x * W;
      const cy = HOLE.y * H;
      if (u >= 1) {
        if (lastHole !== "open") {
          scene.style.clipPath = "none";
          zoom.style.transform = "none";
          rim.style.opacity = "0";
          stage.style.pointerEvents = "auto";
          lastHole = "open";
        }
        return;
      }
      lastHole = "";
      const minD = Math.min(W, H);
      const far = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy));
      // opens to a small hole, breathes a little wider while the icons fall in, then widens fast
      const R =
        0.12 * minD * smooth(0, 0.2, u) * (1 + 0.3 * smooth(0.2, 0.55, u)) +
        far * 1.05 * Math.pow(smooth(0.55, 1, u), 1.6);
      scene.style.clipPath = `circle(${R.toFixed(1)}px at ${cx}px ${cy}px)`;
      zoom.style.transformOrigin = `${cx}px ${cy}px`;
      zoom.style.transform = `scale(${(1.35 - 0.35 * smooth(0.4, 1, u)).toFixed(4)})`;
      rim.style.width = rim.style.height = `${(2 * R).toFixed(1)}px`;
      rim.style.transform = `translate(${(cx - R).toFixed(1)}px, ${(cy - R).toFixed(1)}px)`;
      rim.style.opacity = (smooth(0, 0.12, u) * (1 - smooth(0.82, 1, u))).toFixed(3);
      stage.style.pointerEvents = "none";
    };

    let raf = 0;
    let last = 0;
    let onScreen = false;
    const tick = (now) => {
      raf = 0;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
      last = now;
      const m = measure();
      stage.style.setProperty("--p", m.p.toFixed(4));
      hole(m.u);
      // Slide out to the left: eased in-out, with a shadow along the trailing edge while moving
      const e = m.s < 0.5 ? 2 * m.s * m.s : 1 - Math.pow(-2 * m.s + 2, 2) / 2;
      stage.style.transform = e > 0 ? `translate3d(${(-e * 100).toFixed(3)}%, 0, 0)` : "";
      stage.style.boxShadow = e > 0 && e < 1 ? `24px 0 70px rgba(0,0,0,${(0.55 * Math.sin(Math.PI * e)).toFixed(3)})` : "";
      aim(m);
      if (film.step(dt) && onScreen) raf = requestAnimationFrame(tick);
      else last = 0;
    };
    function kick() {
      if (!raf && onScreen) raf = requestAnimationFrame(tick);
    }

    const near = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        film.startLoading();
        kick();
      },
      { rootMargin: "100% 0px" }
    );
    near.observe(track);
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      kick();
    });
    io.observe(track);
    const ro = new ResizeObserver(() => {
      film.resize();
      lastHole = "";
      kick();
    });
    ro.observe(stage);
    window.addEventListener("scroll", kick, { passive: true });

    return () => {
      film.destroy();
      cancelAnimationFrame(raf);
      near.disconnect();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", kick);
    };
  }, []);

  return (
    <section
      ref={trackRef}
      data-guide="aiApproach"
      aria-labelledby="ai-approach-title"
      // Overlaps the end of AiIndustries by a screen plus the hole transition, which plays first here
      className="relative z-30 -mt-[calc(100svh+var(--ai-hole))] h-[calc(600svh+var(--ai-hole)+var(--ai-slide))] [--ai-hole:120svh] [--ai-slide:110svh] motion-reduce:mt-0! motion-reduce:[--ai-hole:0svh] motion-reduce:[--ai-slide:0svh]"
    >
      {/* Measures the hole transition's length */}
      <div ref={holeLenRef} aria-hidden="true" className="invisible absolute left-0 top-0 h-(--ai-hole) w-px" />
      {/* Measures the slide-out tail */}
      <div ref={slideLenRef} aria-hidden="true" className="invisible absolute bottom-0 left-0 h-(--ai-slide) w-px" />

      <div
        ref={stageRef}
        className="pointer-events-none sticky top-0 h-svh overflow-hidden text-white"
        style={{ "--p": 0 }}
      >
        {/* The film, seen through the hole until it opens fully */}
        <div ref={sceneRef} className="absolute inset-0" style={{ clipPath: "circle(0px at 50% 55%)" }}>
          <div ref={zoomRef} className="absolute inset-0 bg-[#0d3d3b]">
            <Image src={frameSrc(1)} alt="" fill unoptimized className="object-cover" />
            <canvas
              ref={canvasRef}
              aria-hidden="true"
              className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500 data-live:opacity-100"
            />
          </div>
        </div>

        {/* The hole's ring of light (like the portal's rim in the film) */}
        <div
          ref={rimRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 rounded-full border-2 border-[#d6fffa]/85"
          style={{
            opacity: 0,
            boxShadow:
              "0 0 18px 2px rgba(150,240,230,0.55), 0 0 60px 8px rgba(80,200,190,0.28), inset 0 0 22px 2px rgba(170,250,240,0.45), 0 0 120px 30px rgba(6,40,40,0.18)",
          }}
        />

        {/* The design's second state: three glass cards over the wide shot */}
        <ul className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 pt-[8svh] md:flex-row md:items-center md:gap-[clamp(1.25rem,2.6vw,2.75rem)] md:pt-0">
          {CARDS_AT.map((at, i) => (
            <li
              key={i}
              className="w-[min(20rem,86vw)] md:w-[clamp(15rem,22vw,20rem)]"
              style={{
                "--c": `clamp(0, (var(--p) - ${at}) / 0.05, 1)`,
                "--o": `clamp(0, (var(--p) - ${CARDS_OUT}) / 0.05, 1)`,
                opacity: "calc(var(--c) * (1 - var(--o)))",
                transform:
                  "translate3d(0, calc((1 - var(--c)) * 36px - var(--o) * 44px), 0) scale(calc(0.96 + var(--c) * 0.04 - var(--o) * 0.04))",
              }}
            >
              <GlassCard {...CARD} />
            </li>
          ))}
        </ul>

        {/* The design's final state: the heading above the portal */}
        <div
          className="absolute inset-x-0 top-[clamp(5.5rem,12svh,8rem)] px-4 text-center sm:px-6"
          style={{
            "--h": `clamp(0, (var(--p) - ${HEADING_AT}) / 0.06, 1)`,
            opacity: "var(--h)",
            transform: "translate3d(0, calc((1 - var(--h)) * 28px), 0)",
            filter: "blur(calc((1 - var(--h)) * 6px))",
          }}
        >
          <h2
            id="ai-approach-title"
            className="mx-auto max-w-[36rem] text-[28px] font-semibold leading-[1.2] tracking-tight [text-shadow:0_2px_24px_rgba(2,30,30,0.6)] sm:text-[36px] lg:text-[clamp(36px,3vw,46px)]"
          >
            Our Approach to AI Software Development
          </h2>
        </div>
      </div>
    </section>
  );
}

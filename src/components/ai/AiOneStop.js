"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { BrainCircuit, Rocket, Workflow } from "lucide-react";
import { createFrameFilm, isLowPower, mobileSet } from "@/components/ai/frameFilm";

// "Our One-Stop AI Development Services" on the Artificial Intelligence page: a scroll-driven film.
// The section is a tall scroll track with a pinned, one-screen stage. Scrolling through the track
// plays the supplied frame sequence (a slow dolly through a night-time carriage up to its door
// window, 124 frames) on a canvas, so the scene moves exactly with the scrollbar, forwards and back.
//
//   start   frame 1 with the title and intro over it (the design's first state)
//   then    the title zooms past and fades as the camera moves in, and the scene dims a little
//   ~frame 70-95  the three services appear one after another over the door (the design's second state)
//   end     the camera reaches the window; the services stay, then the section scrolls on
//
// Smoothness: the displayed frame eases towards the scroll position (time based) and the two frames
// either side of it are cross-faded, so even a fast flick or a coarse wheel reads as continuous
// motion. Text and overlays are driven by one CSS variable (--p) on the stage, set without React
// re-renders.
//
// Loading (see frameFilm): nothing is fetched until the section is about a screen away. Frame 1 is
// also a regular image (the poster) so the stage never shows empty. The loop runs only while the section is on screen and still moving.
//
// Reduced motion: no scroll track; one screen showing the design's final state (frame 75 with the
// services).

const BG = "#02050d";
const FRAMES = 124;
const frameSrc = (i) => `/service/AI/one-stop/${String(i).padStart(3, "0")}.jpg`;
const FILM_END = 0.88; // share of the scroll track the film takes; the rest holds the last frame
const REDUCED_FRAME = 75; // the design's frame for the services
const EASE = 10; // how quickly the displayed frame catches up with the scroll (per second)

const SERVICES = [
  {
    icon: BrainCircuit,
    title: "Custom AI Development",
    text: "We code the intelligence you imagine. We build custom AI that understands your business DNA, adapts to your processes, and creates new possibilities beyond conventional software.",
    at: 0.46,
  },
  {
    icon: Rocket,
    title: "AI Product Development",
    text: "Turn Ideas into Intelligent Assets. Our AI-powered product development makes your ideas smarter, adapts faster, and transforms your vision into a market-ready innovation.",
    at: 0.54,
  },
  {
    icon: Workflow,
    title: "AI Integration Services",
    text: "Bridge the gap between AI and your existing systems. Utilize our AI solutions in your CRM, ERP, SaaS platforms, and business applications for smarter, more connected operations.",
    at: 0.62,
  },
];

export default function AiOneStop() {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const tailRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const film = createFrameFilm({
      canvas: canvasRef.current,
      stage,
      count: FRAMES,
      src: frameSrc,
      mobile: mobileSet("one-stop", FRAMES),
      ease: EASE,
      onFrameReady: () => kick(),
    });

    const progress = () => {
      if (reduced.matches) return 1;
      const r = track.getBoundingClientRect();
      // The tail (AiIsland's touch transition plays over it) is not part of the film
      const span = r.height - tailRef.current.offsetHeight - window.innerHeight;
      return span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
    };
    const aim = (p) =>
      film.setTarget(reduced.matches ? (REDUCED_FRAME - 1) / (FRAMES - 1) : Math.min(1, p / FILM_END));
    aim(progress());
    film.jump();

    let raf = 0;
    let last = 0;
    let onScreen = false;
    const tick = (now) => {
      raf = 0;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
      last = now;
      const p = progress();
      stage.style.setProperty("--p", p.toFixed(4));
      aim(p);
      // Keep going while catching up; otherwise sleep until the next scroll or loaded frame
      if (film.step(dt) && onScreen) raf = requestAnimationFrame(tick);
      else last = 0;
    };
    function kick() {
      if (!raf && onScreen) raf = requestAnimationFrame(tick);
    }

    // Start loading about a screen before the section arrives; run only while it is on screen
    const near = new IntersectionObserver(([e]) => e.isIntersecting && film.startLoading(), { rootMargin: isLowPower() ? "60% 0px" : "100% 0px" });
    near.observe(track);
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      kick();
    });
    io.observe(track);
    const ro = new ResizeObserver(() => {
      film.resize();
      kick();
    });
    ro.observe(stage);
    window.addEventListener("scroll", kick, { passive: true });
    reduced.addEventListener("change", kick);

    return () => {
      film.destroy();
      cancelAnimationFrame(raf);
      near.disconnect();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", kick);
      reduced.removeEventListener("change", kick);
    };
  }, []);

  return (
    <section
      ref={trackRef}
      data-guide="aiServices"
      aria-labelledby="ai-one-stop-title"
      // The scroll track: its extra height is how long the film plays, plus a tail during which the
      // stage stays pinned under AiIsland's touch transition (which overlaps it by the same amount)
      className="relative h-[calc(460svh+var(--ai-touch))] [--ai-touch:120svh] motion-reduce:h-svh! motion-reduce:[--ai-touch:0svh]"
      style={{ backgroundColor: BG }}
    >
      {/* Measures the tail */}
      <div ref={tailRef} aria-hidden="true" className="invisible absolute bottom-0 left-0 h-(--ai-touch) w-px" />
      <div
        ref={stageRef}
        className="group sticky top-0 h-svh overflow-hidden text-white"
        style={{ "--p": 0, backgroundColor: BG }}
      >
        {/* Poster: frame 1, until the canvas has drawn */}
        <Image
          src={frameSrc(1)}
          alt=""
          fill
          unoptimized
          className="object-cover"
        />
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500 data-live:opacity-100"
        />

        {/* Dims the scene for the services (the design's second state is darker) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ backgroundColor: BG, opacity: "calc(clamp(0, (var(--p) - 0.3) / 0.16, 1) * 0.5)" }}
        />
        {/* Soft vignette so white text always reads, strongest at the edges */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 45%, rgba(2,5,13,0.55) 100%)" }}
        />
        {/* Joins the dark section above: fades out as the film starts */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[22svh]"
          style={{
            background: "linear-gradient(to bottom, #02050d 0%, rgba(2,5,13,0.6) 40%, rgba(2,5,13,0) 100%)",
            opacity: "calc(1 - clamp(0, var(--p) * 8, 1))",
          }}
        />

        {/* First state: title and intro, centred; they zoom past and fade as the camera moves in */}
        <div
          className="absolute inset-0 flex items-center justify-center px-4 pt-[6svh] text-center sm:px-6"
          style={{
            "--t": "clamp(0, (var(--p) - 0.05) / 0.15, 1)",
            opacity: "calc(1 - var(--t))",
            transform: "scale(calc(1 + var(--t) * 0.35))",
            filter: "blur(calc(var(--t) * 8px))",
          }}
        >
          <div className="max-w-[40rem]">
            <h2
              id="ai-one-stop-title"
              className="text-[30px] font-semibold leading-[1.15] tracking-tight [text-shadow:0_2px_28px_rgba(2,5,13,0.75)] sm:text-[40px] lg:text-[clamp(40px,3.4vw,54px)]"
            >
              Our One-Stop AI Development Services
            </h2>
            <p className="mx-auto mt-3 max-w-[30rem] text-[15px] leading-snug text-white/85 [text-shadow:0_1px_16px_rgba(2,5,13,0.85)] sm:text-[16px] lg:text-[clamp(16px,1.2vw,19px)]">
              We are one of the top AI development companies in the industry, delivering intelligent solutions
            </p>
          </div>
        </div>

        {/* Second state: the three services over the door, one after another */}
        <div className="absolute inset-0 flex items-center justify-center px-5 pt-[8svh] sm:px-8 md:pt-0 md:pb-[6svh]">
          <ul className="grid w-full max-w-[72rem] gap-6 sm:gap-8 md:grid-cols-3 md:gap-[clamp(2rem,5vw,6rem)]">
            {SERVICES.map(({ icon: Icon, title, text, at }) => (
              <li
                key={title}
                className="motion-reduce:opacity-100! motion-reduce:transform-none! motion-reduce:filter-none!"
                style={{
                  "--a": `clamp(0, (var(--p) - ${at}) / 0.07, 1)`,
                  opacity: "var(--a)",
                  transform: "translate3d(0, calc((1 - var(--a)) * 32px), 0)",
                  filter: "blur(calc((1 - var(--a)) * 6px))",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-white/60 bg-white/5 backdrop-blur-[2px] lg:size-11">
                    <Icon className="size-5 lg:size-[22px]" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3 className="max-w-[11rem] text-[17px] font-semibold leading-tight [text-shadow:0_1px_14px_rgba(2,5,13,0.8)] lg:text-[clamp(17px,1.3vw,21px)]">
                    {title}
                  </h3>
                </div>
                <p className="mt-3 text-[14px] leading-relaxed text-white/80 [text-shadow:0_1px_12px_rgba(2,5,13,0.9)] sm:text-[15px] lg:mt-4 lg:text-[clamp(15px,1.05vw,17px)]">
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { createBurnReveal } from "@/components/ai/burnReveal";
import { isLowPower } from "@/components/ai/frameFilm";

// "Hire Our Claude AI Prompt Engineer" on the AI page, after the parchment-map process section.
//
// Hand-over: the map section burns away from the centre (burnReveal) and this section is what lies
// behind the flames. As with the other hand-overs, this section overlaps the end of AiJourney by a
// screen plus the burn (--ai-burn) and sits on top of it; until the burn completes only the shader
// canvas shows (transparent where the map hasn't burnt yet), then the real photo takes over.
// Then, strictly in order (--q): heading, paragraph, the orange timeline line grows down, and the
// four hiring steps appear one after another.
// Exit: the stage stays pinned for a tail (--ai-emerge) and the camera dives into the laptop: the
// photo zooms in on it and darkens, the copy fades, while AiFeatures opens out of the laptop on top.
// Reduced motion or no WebGL: a plain cross-fade.

const PHOTO = "/service/AI/hire.jpg";
// object-position of the photo (keep in step with the classes on <Image>): phones centre on the
// scholars, wider screens anchor top-left as in the design
export const posFor = (w) => (w < 768 ? [0.7, 0.5] : [0, 0]);
// The photo, and the laptop lid in it (photo px)
const IMG = { w: 1672, h: 941 };
const LAPTOP = { x: 905, y: 542, w: 255, h: 213 };
// The laptop's rectangle on screen for a W x H stage, the photo zoomed by z about the laptop's centre
export function laptopRect(W, H, z = 1) {
  const [px, py] = posFor(W);
  const k = Math.max(W / IMG.w, H / IMG.h);
  const ox = (W - IMG.w * k) * px;
  const oy = (H - IMG.h * k) * py;
  const cx = ox + (LAPTOP.x + LAPTOP.w / 2) * k;
  const cy = oy + (LAPTOP.y + LAPTOP.h / 2) * k;
  return { cx, cy, w: LAPTOP.w * k * z, h: LAPTOP.h * k * z };
}
// How far the photo zooms into the laptop during the hand-over
export const DIVE_ZOOM = 1.6;
export const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

const STEPS = ["Share Your Requirements", "Resume Sharing", "Interview & Selection", "Project Onboarding"];
const STEP_AT = (i) => 0.3 + i * 0.08;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (a, b, v) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const prog = (start, dur) => `clamp(0, (var(--q) - ${start}) / ${dur}, 1)`;

export default function AiHire() {
  const trackRef = useRef(null);
  const burnLenRef = useRef(null);
  const emergeLenRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let burn = null;
    const startBurn = () => {
      if (burn || reduced.matches) return;
      burn = createBurnReveal({ canvas, src: PHOTO });
      burn?.resize();
    };

    const measure = () => {
      const r = track.getBoundingClientRect();
      const len = burnLenRef.current.offsetHeight;
      const emerge = emergeLenRef.current.offsetHeight;
      const span = r.height - len - emerge - window.innerHeight;
      return {
        // the dive into the laptop, over the tail
        e: emerge > 0 && span > 0 ? clamp01((-r.top - len - span) / emerge) : 0,
        top: r.top,
        t: len > 0 ? (r.top > 0.5 ? 0 : clamp01(-r.top / len)) : 1,
        q: clamp01((-r.top - len) / (window.innerHeight * 0.9)),
      };
    };

    let raf = 0;
    let onScreen = false;
    let shown = false;
    const tick = (now) => {
      raf = 0;
      const m = measure();
      stage.style.visibility = m.top <= 0.5 ? "visible" : "hidden";
      stage.style.setProperty("--q", (reduced.matches ? 1 : m.q).toFixed(4));
      // Dive: zoom into the laptop (origin at its centre), darken, fade the copy
      const W = stage.clientWidth;
      const lap = laptopRect(W, stage.clientHeight);
      const ez = easeInOut(m.e);
      stage.style.setProperty("--zoom", (1 + (DIVE_ZOOM - 1) * ez).toFixed(4));
      stage.style.setProperty("--lx", `${lap.cx.toFixed(1)}px`);
      stage.style.setProperty("--ly", `${lap.cy.toFixed(1)}px`);
      stage.style.setProperty("--dive", m.e.toFixed(4));
      const useBurn = burn?.ready && !reduced.matches;
      const burning = useBurn && m.t > 0 && m.t < 1;
      if (burning) {
        burn.render(m.t, now / 1000, posFor(stage.clientWidth));
        if (!shown) canvas.style.visibility = "visible";
        shown = true;
      } else if (shown) {
        burn?.clear();
        canvas.style.visibility = "hidden";
        shown = false;
      }
      // the real photo: once the burn is through (or a plain fade without it)
      stage.style.setProperty("--photo", useBurn ? (m.t >= 1 ? "1" : "0") : smooth(0.1, 0.9, m.t).toFixed(4));
      stage.style.backgroundColor = m.t >= 1 || !useBurn ? "#000" : "transparent";
      if (burning && onScreen) raf = requestAnimationFrame(tick);
    };
    function kick() {
      if (!raf && onScreen) raf = requestAnimationFrame(tick);
    }

    const near = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        startBurn();
        kick();
      },
      { rootMargin: isLowPower() ? "60% 0px" : "100% 0px" }
    );
    near.observe(track);
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      kick();
    });
    io.observe(track);
    const ro = new ResizeObserver(() => {
      burn?.resize();
      kick();
    });
    ro.observe(stage);
    window.addEventListener("scroll", kick, { passive: true });
    reduced.addEventListener("change", kick);
    return () => {
      burn?.destroy();
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
      data-guide="aiHire"
      aria-labelledby="ai-hire-title"
      // On top of AiJourney, overlapping its end by a screen plus the burn
      className="relative z-[26] -mt-[calc(100svh+var(--ai-burn))] h-[calc(220svh+var(--ai-burn)+var(--ai-emerge))] [--ai-burn:130svh] [--ai-emerge:120svh] motion-reduce:mt-0! motion-reduce:[--ai-burn:0svh] motion-reduce:[--ai-emerge:0svh]"
    >
      <div ref={burnLenRef} aria-hidden="true" className="invisible absolute left-0 top-0 h-(--ai-burn) w-px" />
      {/* Measures the dive tail */}
      <div ref={emergeLenRef} aria-hidden="true" className="invisible absolute bottom-0 left-0 h-(--ai-emerge) w-px" />

      <div ref={stageRef} className="sticky top-0 h-svh overflow-hidden text-white" style={{ "--q": 0, "--photo": 0, "--zoom": 1, "--dive": 0, "--lx": "60%", "--ly": "70%" }}>
        {/* The photo (what the flames uncover) */}
        <div
          className="absolute inset-0"
          style={{ opacity: "var(--photo)", transform: "scale(var(--zoom))", transformOrigin: "var(--lx) var(--ly)" }}
        >
          <Image src={PHOTO} alt="" fill unoptimized className="object-cover object-[70%_50%] md:object-[0%_0%]" />
          {/* keeps the copy legible: dark on the left (desktop) / top (phones) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-b from-black/80 via-black/40 to-transparent md:bg-linear-to-r md:from-black/60 md:via-black/15"
          />
        </div>
        <canvas ref={canvasRef} aria-hidden="true" className="invisible absolute inset-0 h-full w-full" />
        {/* darkens as the camera dives into the laptop */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: "calc(var(--dive) * 0.65)" }} />

        {/* Copy and the hiring steps, left as in the design */}
        <div
          className="absolute inset-0 flex flex-col justify-start px-5 pt-[clamp(6rem,14svh,8.5rem)] sm:px-8 md:justify-center md:pt-[84px] lg:px-[clamp(2.5rem,5.3vw,5.5rem)]"
          style={{ opacity: "calc(var(--photo) * (1 - clamp(0, var(--dive) * 3, 1)))" }}
        >
          <div className="max-w-[37rem]">
            <h2
              id="ai-hire-title"
              className="max-w-[30rem] text-[30px] font-semibold leading-[1.15] tracking-tight sm:text-[38px] lg:text-[clamp(38px,3vw,46px)]"
              style={{
                "--h": prog(0, 0.12),
                opacity: "var(--h)",
                transform: "translate3d(0, calc((1 - var(--h)) * 26px), 0)",
                filter: "blur(calc((1 - var(--h)) * 6px))",
              }}
            >
              Hire Our Claude AI Prompt Engineer
            </h2>
            <p
              className="mt-4 text-[14px] leading-relaxed text-white/85 sm:text-[16px] lg:text-[clamp(16px,1.15vw,18px)]"
              style={{
                "--h": prog(0.1, 0.12),
                opacity: "var(--h)",
                transform: "translate3d(0, calc((1 - var(--h)) * 18px), 0)",
              }}
            >
              Getting code from Claude is not a big deal but getting the right code takes the right prompts, analysis, and
              expertise. Our Claude AI prompt engineers craft accurate prompts, refine outputs, and validate results to help
              you build smarter, more reliable AI solutions.
            </p>

            {/* Hiring steps on an orange timeline */}
            <ol className="relative mt-8 space-y-6 pl-7 sm:mt-10 sm:space-y-8 lg:mt-12 lg:space-y-[clamp(1.75rem,3.6svh,2.5rem)]">
              <span
                aria-hidden="true"
                className="absolute left-0 top-0.5 bottom-0.5 w-[5px] origin-top rounded-full bg-linear-to-b from-[#a8461c] via-[#d8703a] to-[#f2a26a] shadow-[0_0_14px_rgba(242,140,80,0.45)]"
                style={{ "--b": prog(0.24, 0.32), transform: "scaleY(var(--b))" }}
              />
              {STEPS.map((step, i) => (
                <li
                  key={step}
                  className="group text-[15px] text-[#f4c4a2] sm:text-[17px] lg:text-[clamp(17px,1.2vw,19px)]"
                  style={{
                    "--s": prog(STEP_AT(i), 0.08),
                    opacity: "var(--s)",
                    transform: "translate3d(calc((1 - var(--s)) * -18px), 0, 0)",
                  }}
                >
                  <span className="inline-block transition-[color,transform] duration-300 group-hover:translate-x-1 group-hover:text-[#ffd9bd]">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

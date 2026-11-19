"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { DIVE_ZOOM, easeInOut, laptopRect } from "@/components/ai/AiHire";

// "Majestic Features in Our AI Development Solutions" on the AI page, after the hire section.
//
// Hand-over: it emerges from the laptop in the hire photo. While the camera dives into the laptop
// (AiHire zooms its photo about the laptop), this section, on top, opens out of the laptop lid: a
// glowing window exactly over the (zooming) lid that widens to the full screen, its night sky growing
// out of it. Like the other hand-overs it overlaps the end of AiHire by a screen plus the transition
// (--ai-emerge) and stays hidden until pinned.
// Then, in order (--q): heading, intro, and the features one after another. The features are an
// accordion (the first open, as in the design).
// Exit: over the last stretch (--ai-out) the sky sinks into black and the copy drifts back and
// fades, so the black tools section after it follows without a seam (--out).
// Reduced motion: no dive; the section simply follows.

const SKY = "/service/AI/sky.jpg";

const FEATURES = [
  { title: "Speech Recognition", text: "Where spoken words are accurately converted to text or commands in real-time." },
  { title: "Voice Bots", text: "Enables automated customer support through AI-powered conversations." },
  {
    title: "Visual Search",
    text: "Enables the user to search for a product or category by uploading an image rather than typing it.",
  },
  {
    title: "Advanced Dashboard",
    text: "Provides real-time analytics, performance, and AI insights in a unified interface.",
  },
  {
    title: "Multilingual Support",
    text: "Recognizes and processes multiple languages to increase global accessibility.",
  },
  {
    title: "Sentiment Analysis",
    text: "Analyzes customer emotions and feedback to improve engagement and service quality.",
  },
];

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const prog = (start, dur) => `clamp(0, (var(--q) - ${start}) / ${dur}, 1)`;

export default function AiFeatures() {
  const trackRef = useRef(null);
  const emergeLenRef = useRef(null);
  const stageRef = useRef(null);
  const sceneRef = useRef(null);
  const growRef = useRef(null);
  const outLenRef = useRef(null);
  const glowRef = useRef(null);
  const [open, setOpen] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const scene = sceneRef.current;
    const grow = growRef.current;
    const glow = glowRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;
    let wasOpen = false;
    const update = () => {
      raf = 0;
      const r = track.getBoundingClientRect();
      const len = emergeLenRef.current.offsetHeight;
      const vh = window.innerHeight;
      const e =
        reduced.matches || len <= 0
          ? 1
          : r.top > 0.5
            ? 0
            : clamp01(-r.top / len);
      const q = reduced.matches ? 1 : clamp01((-r.top - len) / (vh * 0.8));
      const outLen = outLenRef.current.offsetHeight;
      const out = outLen > 0 ? clamp01((-r.top - (r.height - vh - outLen)) / outLen) : 0;
      stage.style.setProperty("--out", out.toFixed(4));
      stage.style.visibility =
        r.top <= 0.5 || reduced.matches ? "visible" : "hidden";
      stage.style.setProperty("--q", q.toFixed(4));

      if (e >= 1) {
        if (!wasOpen) {
          scene.style.clipPath = "none";
          grow.style.transform = "none";
          glow.style.opacity = "0";
          stage.style.pointerEvents = "auto";
          wasOpen = true;
        }
        return;
      }
      wasOpen = false;
      stage.style.pointerEvents = "none";
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      // the lid as the hire photo zooms into it, then widening to the full screen
      const lap = laptopRect(W, H, 1 + (DIVE_ZOOM - 1) * easeInOut(e));
      const g = easeInOut(clamp01((e - 0.12) / 0.88));
      const l = (lap.cx - lap.w / 2) * (1 - g);
      const t = (lap.cy - lap.h / 2) * (1 - g);
      const rr = W - (lap.cx + lap.w / 2) * (1 - g) - W * g;
      const b = H - (lap.cy + lap.h / 2) * (1 - g) - H * g;
      const radius = 14 * (1 - g);
      scene.style.clipPath = `inset(${t.toFixed(1)}px ${rr.toFixed(1)}px ${b.toFixed(1)}px ${l.toFixed(1)}px round ${radius.toFixed(1)}px)`;
      // the sky grows out of the window
      const bx = l + (W - l - rr) / 2;
      const by = t + (H - t - b) / 2;
      grow.style.transformOrigin = `${bx.toFixed(1)}px ${by.toFixed(1)}px`;
      grow.style.transform = `scale(${(0.45 + 0.55 * g).toFixed(4)})`;
      // a screen-light glow around the window while it is small
      glow.style.left = `${l}px`;
      glow.style.top = `${t}px`;
      glow.style.width = `${W - l - rr}px`;
      glow.style.height = `${H - t - b}px`;
      glow.style.borderRadius = `${radius}px`;
      glow.style.opacity = (Math.min(1, e * 12) * (1 - g)).toFixed(3);
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
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    reduced.addEventListener("change", request);
    return () => {
      gate.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      reduced.removeEventListener("change", request);
    };
  }, []);

  return (
    <section
      ref={trackRef}
      data-guide="aiFeatures"
      aria-labelledby="ai-features-title"
      // On top of AiHire, overlapping its end by a screen plus the emergence
      className="relative z-[27] -mt-[calc(100svh+var(--ai-emerge))] h-[calc(200svh+var(--ai-emerge)+var(--ai-out))] [--ai-emerge:120svh] [--ai-out:80svh] motion-reduce:mt-0! motion-reduce:[--ai-emerge:0svh] motion-reduce:[--ai-out:0svh]"
    >
      <div
        ref={emergeLenRef}
        aria-hidden="true"
        className="invisible absolute left-0 top-0 h-(--ai-emerge) w-px"
      />
      <div ref={outLenRef} aria-hidden="true" className="invisible absolute bottom-0 left-0 h-(--ai-out) w-px" />

      <div
        ref={stageRef}
        className="pointer-events-none sticky top-0 h-svh overflow-hidden text-white"
        style={{ "--q": 0 }}
      >
        <div
          ref={sceneRef}
          className="absolute inset-0 bg-[#05070c]"
          style={{ clipPath: "inset(50% round 14px)" }}
        >
          {/* the contents grow out of the window (the window itself is the clip above) */}
          <div
            ref={growRef}
            className="absolute inset-0"
            style={{
              opacity: "calc(1 - var(--out, 0))",
              transform: "translate3d(0, calc(var(--out, 0) * -40px), 0) scale(calc(1 - var(--out, 0) * 0.06))",
            }}
          >
            {/* Night sky with clouds, lit a little cooler and brighter, as in the design */}
            <Image
              src={SKY}
              alt=""
              fill
              unoptimized
              className="object-cover object-bottom"
              style={{
                filter: "brightness(1.35) contrast(1.08) saturate(1.2)",
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[#3a5a9a]/15 mix-blend-soft-light"
            />

            {/* Copy and features */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-4 pb-[clamp(0.75rem,3svh,2rem)] pt-[clamp(76px,11svh,96px)] sm:px-6">
              <div className="w-full max-w-[38rem] text-center">
                <h2
                  id="ai-features-title"
                  className="mx-auto max-w-[30rem] text-[28px] font-semibold leading-[1.18] tracking-tight sm:text-[36px] lg:text-[clamp(36px,2.8vw,44px)] [@media(max-height:700px)]:text-[23px]"
                  style={{
                    "--h": prog(0, 0.12),
                    opacity: "var(--h)",
                    transform: "translate3d(0, calc((1 - var(--h)) * 26px), 0)",
                    filter: "blur(calc((1 - var(--h)) * 6px))",
                  }}
                >
                  Majestic Features in Our AI Development Solutions
                </h2>
                <p
                  className="mx-auto mt-3 max-w-[34rem] text-[14px] leading-snug text-white/80 sm:text-[15px] lg:text-[16px] [@media(max-height:700px)]:mt-2 [@media(max-height:700px)]:text-[12.5px]"
                  style={{
                    "--h": prog(0.1, 0.12),
                    opacity: "var(--h)",
                    transform: "translate3d(0, calc((1 - var(--h)) * 18px), 0)",
                  }}
                >
                  We are recognized as one of the finest artificial intelligence
                  development companies in this business. Our AI development
                  solutions will be enhanced through our advanced features
                </p>

                <ul className="mx-auto mt-[clamp(1rem,3.5svh,2rem)] max-w-[30rem] space-y-[clamp(0.4rem,1.2svh,0.625rem)] text-left">
                  {FEATURES.map(({ title, text }, i) => {
                    const isOpen = open === i && !!text;
                    return (
                      <li
                        key={title}
                        style={{
                          "--s": prog(0.22 + i * 0.07, 0.08),
                          opacity: "var(--s)",
                          transform:
                            "translate3d(0, calc((1 - var(--s)) * 22px), 0)",
                        }}
                      >
                        <div
                          className="ai-glass ai-glass-dark overflow-hidden rounded-xl border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_30px_-12px_rgba(0,0,0,0.6)] transition-colors duration-300 hover:border-white/35"
                          style={{
                            background:
                              "linear-gradient(160deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
                            backdropFilter: "blur(14px) saturate(140%)",
                            WebkitBackdropFilter: "blur(14px) saturate(140%)",
                          }}
                        >
                          <button
                            type="button"
                            aria-expanded={text ? isOpen : undefined}
                            aria-controls={text ? `ai-feature-${i}` : undefined}
                            onClick={() => text && setOpen(isOpen ? -1 : i)}
                            className="flex w-full items-center justify-between gap-3 px-4 py-[clamp(0.55rem,1.5svh,0.75rem)] text-left text-[14px] font-medium sm:px-5 sm:text-[15px]"
                          >
                            {title}
                            <span
                              aria-hidden="true"
                              className={`grid size-6 shrink-0 place-items-center rounded-full bg-white text-[#0b1220] transition-all duration-300 ${isOpen ? "scale-75 opacity-0" : "opacity-100"}`}
                            >
                              <ChevronRight
                                className="size-4"
                                strokeWidth={2.4}
                              />
                            </span>
                          </button>
                          {text && (
                            <div
                              id={`ai-feature-${i}`}
                              className="grid transition-[grid-template-rows] duration-400 ease-out"
                              style={{
                                gridTemplateRows: isOpen ? "1fr" : "0fr",
                              }}
                            >
                              <p className="min-h-0 overflow-hidden px-4 text-[13px] leading-relaxed text-white/75 sm:px-5 sm:text-[14px]">
                                <span className="block pb-3.5">{text}</span>
                              </p>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Screen light around the window as it opens out of the laptop */}
        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute border border-white/50"
          style={{
            opacity: 0,
            boxShadow:
              "0 0 24px 4px rgba(170,205,255,0.55), 0 0 80px 20px rgba(110,160,255,0.25)",
          }}
        />
      </div>
    </section>
  );
}

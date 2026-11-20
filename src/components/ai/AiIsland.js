"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { createFrameFilm, isLowPower, mobileSet } from "@/components/ai/frameFilm";
import { createTouchPortal } from "@/components/ai/touchPortal";
import GlassCard from "@/components/ai/GlassCard";
import {
  ChartColumnIncreasing,
  Globe,
  LayoutGrid,
  MessageSquareMore,
  NotebookPen,
  Package,
  SquareCode,
  SquareUser,
  Waypoints,
} from "lucide-react";

// The AI page's second scroll film, after "One-Stop AI Development Services": the camera rises from a
// phone on a wooden tray in the grass, over an island in the sea, up through the clouds into white
// (143 frames, every 2nd of the supplied 285). Same pattern as AiOneStop: a tall scroll track, a
// pinned one-screen stage, the film scrubbed by the scroll (frameFilm).
//
//   Touch   the hand-over from the carriage (touchPortal): two fingertips of light reach in and touch
//           at the moon, a portal of light opens there and the island emerges through it, while the
//           carriage dissolves into glittering line-art. This section overlaps the end of AiOneStop
//           by the transition's length (--ai-touch) plus a screen, so its stage pins exactly as the
//           train's film ends; the train stage stays pinned underneath (its tail) while the portal,
//           drawn on a transparent canvas, opens over it.
//   Cards   Apple-style glass cards in groups with clear gaps between them: two at first (a pair
//           beside the tray), then each next group rises in as the camera climbs, its cards
//           staggered. Phones stack each group's two cards.
//   Exit    the film ends in white, the clouds closed. The stage then stays pinned for a tail
//           (--ai-cloud) under AiIndustries, whose cloud transition starts from that white.
//
// CSS variables on the stage: --p (film progress, 0..1), --in (transition done: cards and film).
// Reduced motion, or no WebGL: no portal; the island simply fades in over the train.

const FRAMES = 143;
const frameSrc = (i) => `/service/AI/island/${String(i).padStart(3, "0")}.jpg`;
const TRAIN_LAST = "/service/AI/one-stop/124.jpg";
const MOON = [0.495, 0.369]; // the touch point: the moon in the train's last frame (image uv)
const FILM_END = 0.94;
const EASE = 9;

// The nine AI services, in the design's order (the group positions follow in CARDS)
const SERVICES = [
  {
    icon: Waypoints,
    title: "Custom AI Development",
    text: "Custom AI Development delivers ready-to-deploy, white-label intelligent solutions that help your businesses to brand, scale, and resell as their own platforms in the market. Our systems are crafted with configurable AI models, modular architectures, and multi-tenant support to suit SaaS providers, enterprises, and startups alike. This type of method shortens development time",
  },
  {
    icon: Package,
    title: "AI Product Development",
    text: "We can develop intelligent mobile and web apps using sophisticated machine learning algorithms that learn from user behavior in real-time. Our platforms will enable users to have a personalized experience based on recommendations, dynamic content, and predictive analytics. Our AI-enabled platforms will enhance engagement, retention, and productivity worldwide.",
  },
  {
    icon: SquareCode,
    title: "AI Integration Services",
    text: "Our AI Integration services can integrate intelligent algorithms with your current enterprise systems like CRMs, ERPs, SaaS applications, and data pipelines to improve automation and decision-making. Our solution implementation allows real-time insights, predictive analytics, and intelligent workflows while ensuring secure and scalable implementation with effortless performance.",
  },
  {
    icon: SquareUser,
    title: "AI Agents & Virtual Assistants",
    text: "Our AI Agents & Virtual Assistants will help your businesses to automate conversations, routine tasks, scheduling, and internal support across departments. Our platform understands user requests, provides instant responses, and connects with enterprise systems to complete actions. Our advanced agents can learn from interactions to improve accuracy over time.",
  },
  {
    icon: MessageSquareMore,
    title: "AI Chatbot Development",
    text: "AI chatbot development will support your businesses as conversational systems that handle your customer inquiries, lead generation, appointment booking, and support requests around the clock. Our chatbots can easily understand natural language and respond with accurate, contextual answers across websites, mobile apps, and messaging platforms to your clients.",
  },
  {
    icon: NotebookPen,
    title: "Generative AI Solutions",
    text: "We are a leading generative AI development company in this business. Our experienced AI developers can develop platforms for text, image, video, research, documentation, and code that will allow your businesses to automate content creation, speed up development cycles, and improve the creative work process.",
  },
  {
    icon: ChartColumnIncreasing,
    title: "Predictive Analytics & Forecasting Systems",
    text: "Our team is capable of developing personalized engines using AI programming languages that will help to analyze the historical data of your businesses to predict demands, identify risks, and make decisions that help businesses shift from being reactive to proactive. Our software identifies the underlying patterns in sales, supply chains, customer behaviors, and financials.",
  },
  {
    icon: LayoutGrid,
    title: "Computer Vision Applications",
    text: "We will develop computer vision applications that can be utilized for the development of sophisticated image and video recognition models for automating quality inspection, facial recognition, medical image analysis, and security surveillance. Our system will be capable of processing visual data in real-time to identify defects or threats.",
  },
  {
    icon: Globe,
    title: "Natural Language Processing (NLP) Systems",
    text: "Our AI software developers can create language-driven solutions such as sentiment analysis, speech recognition, translation, and document intelligence that helps your businesses to understand and work with text and voice data more easily. Our systems can read your business customer messages, convert speech into text, translate conversations across languages, and extract key details from documents.",
  },
];
// Desktop: group (gd), side and a stagger offset (od, svh) within the group.
// Phones: group (gm) of two stacked cards, the second offset by om (svh).
// Six card slots: each shows the service at the same position in SERVICES.
const CARDS = [
  { side: "L", gd: 0, od: 0, gm: 0, om: 0 },
  { side: "R", gd: 0, od: 14, gm: 0, om: 36 },
  { side: "C", gd: 1, od: 0, gm: 1, om: 0 },
  { side: "L", gd: 2, od: 0, gm: 1, om: 36 },
  { side: "R", gd: 2, od: 14, gm: 2, om: 0 },
  { side: "C", gd: 3, od: 0, gm: 2, om: 36 },
];
// The services that have a card slot (sizes every card to the tallest of these)
const SHOWN = SERVICES.slice(0, CARDS.length);

const SIDE = {
  L: "left-1/2 [--x:-50%] md:left-[5%] md:[--x:0%]",
  R: "left-1/2 [--x:-50%] md:left-auto md:right-[5%] md:[--x:0%]",
  C: "left-1/2 [--x:-50%]",
};

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (a, b, v) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export default function AiIsland() {
  const trackRef = useRef(null);
  const touchRef = useRef(null);
  const cloudRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const portalRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const portalCanvas = portalRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const film = createFrameFilm({
      canvas: canvasRef.current,
      stage,
      count: FRAMES,
      src: frameSrc,
      mobile: mobileSet("island", FRAMES),
      ease: EASE,
      onFrameReady: () => kick(),
    });
    let portal = null;
    const startPortal = () => {
      if (portal || reduced.matches) return;
      portal = createTouchPortal({ canvas: portalCanvas, srcA: TRAIN_LAST, srcB: frameSrc(1), touch: MOON });
      portal?.resize();
    };

    const measure = () => {
      const r = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const touch = touchRef.current.offsetHeight;
      const span = r.height - touch - cloudRef.current.offsetHeight - vh;
      return {
        // the touch transition: 0..1 over the first `touch` px once pinned
        u: touch > 0 ? clamp01(-r.top / touch) : 1,
        // the film, after it
        p: span > 0 ? clamp01((-r.top - touch) / span) : 0,
      };
    };

    const aim = (m) => film.setTarget(Math.min(1, m.p / FILM_END));
    aim(measure());
    film.jump();

    let raf = 0;
    let last = 0;
    let onScreen = false;
    let portalShown = false;
    const tick = (now) => {
      raf = 0;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
      last = now;
      const m = measure();
      stage.style.setProperty("--p", m.p.toFixed(4));
      aim(m);
      const moving = film.step(dt);

      // Touch transition: the portal while it plays; a plain fade when it can't run
      const usePortal = portal?.ready && !reduced.matches;
      const playing = usePortal && m.u > 0 && m.u < 1;
      if (playing) {
        portal.render(m.u, now / 1000);
        if (!portalShown) portalCanvas.style.visibility = "visible";
        portalShown = true;
      } else if (portalShown) {
        portal?.clear();
        portalCanvas.style.visibility = "hidden";
        portalShown = false;
      }
      stage.style.setProperty("--film", usePortal ? (m.u >= 1 ? "1" : "0") : smooth(0.2, 0.9, m.u).toFixed(4));
      stage.style.setProperty("--in", smooth(0.88, 1, m.u).toFixed(4));
      stage.style.pointerEvents = m.u >= 1 ? "auto" : "none";

      if ((moving || playing) && onScreen) raf = requestAnimationFrame(tick);
      else last = 0;
    };
    function kick() {
      if (!raf && onScreen) raf = requestAnimationFrame(tick);
    }

    const near = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        film.startLoading();
        startPortal();
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
      film.resize();
      portal?.resize();
      kick();
    });
    ro.observe(stage);
    window.addEventListener("scroll", kick, { passive: true });
    reduced.addEventListener("change", kick);

    return () => {
      film.destroy();
      portal?.destroy();
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
      data-guide="aiIsland"
      aria-label="AI development services"
      // Overlaps the end of AiOneStop by a screen plus the touch transition, which plays first here
      // and ends with a pinned tail under AiIndustries' cloud transition (--ai-cloud)
      className="relative z-10 -mt-[calc(100svh+var(--ai-touch))] h-[calc(520svh+var(--ai-touch)+var(--ai-cloud))] [--ai-cloud:110svh] [--ai-touch:120svh] motion-reduce:mt-0! motion-reduce:[--ai-cloud:0svh] motion-reduce:[--ai-touch:0svh]"
    >
      {/* Measures the touch transition's length */}
      <div ref={touchRef} aria-hidden="true" className="invisible absolute left-0 top-0 h-(--ai-touch) w-px" />
      <div ref={cloudRef} aria-hidden="true" className="invisible absolute bottom-0 left-0 h-(--ai-cloud) w-px" />

      <div
        ref={stageRef}
        className="pointer-events-none sticky top-0 h-svh overflow-hidden text-white"
        style={{ "--p": 0, "--in": 0, "--film": 0 }}
      >
        {/* The film (poster: frame 1, until the canvas has drawn); shown once the portal has opened */}
        <div className="absolute inset-0" style={{ opacity: "var(--film)" }}>
          <Image src={frameSrc(1)} alt="" fill unoptimized className="object-cover" />
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500 data-live:opacity-100"
          />
        </div>

        {/* The touch transition, over the pinned train stage */}
        <canvas ref={portalRef} aria-hidden="true" className="invisible absolute inset-0 h-full w-full" />

        {/* Glass cards in groups, rising in as the camera climbs */}
        <ul
          className="absolute inset-0 [--gap:100] [--speed:310] [--start:36] md:[--gap:72] md:[--speed:305] md:[--start:54]"
          style={{ opacity: "var(--in)" }}
        >
          {CARDS.map(({ side, gd, od, gm, om }, i) => (
            <li
              key={i}
              className={`absolute top-0 w-[min(21rem,86vw)] [--g:var(--gm)] [--o:var(--om)] md:w-[clamp(16rem,23vw,21rem)] md:[--g:var(--gd)] md:[--o:var(--od)] ${SIDE[side]}`}
              style={{
                "--gd": gd,
                "--od": od,
                "--gm": gm,
                "--om": om,
                // centre line in svh; eases in from the bottom edge, out at the top
                "--y": "calc(var(--start) + var(--g) * var(--gap) + var(--o) - var(--p) * var(--speed))",
                "--a": "calc(clamp(0, (100 - var(--y)) / 16, 1) * clamp(0, (var(--y) + 8) / 16, 1))",
                opacity: "var(--a)",
                transform:
                  "translate3d(var(--x), calc(var(--y) * 1svh - 50% + (1 - var(--a)) * 28px), 0) scale(calc(0.94 + var(--a) * 0.06))",
              }}
            >
              {/* sizeSet: the shown cards all come out the same size (GlassCard.js) */}
              <GlassCard {...SERVICES[i]} sizeSet={SHOWN} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import {
  BedDouble,
  Building2,
  CarFront,
  ChartNoAxesColumnIncreasing,
  Clapperboard,
  Factory,
  GraduationCap,
  ShieldCheck,
  ShoppingCart,
  Stethoscope,
  Truck,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import { createFrameFilm, isLowPower, mobileSet } from "@/components/ai/frameFilm";
import { createCloudReveal } from "@/components/ai/cloudReveal";

// "Our AI Software Development Services for Wider Industries" on the AI page, after the island film.
//
// Strictly in order, each step only once the one before has finished:
//
//   Clouds  the island film ends with the clouds closed to white; this section starts behind that
//           white and the clouds part over it (cloudReveal), centre first, over the bare scene (no
//           heading or icons yet). Like the touch transition, the section overlaps the end of
//           AiIsland by a screen plus the transition (--ai-cloud) so its stage pins exactly as the
//           island's film ends, and stays hidden until then.
//   Film    the phone spins in and rises into place (86 frames), scrubbed by the scroll (frameFilm).
//           The frames are laid out so the phone sits under the heading at the design's size and
//           runs off the bottom edge, as in the design; capped at half the width on phones.
//   Content once the phone has settled, the heading rises in, then the description.
//   Icons   last, the industry app icons fly out of it one after another to
//           their places around it (positions measured from the design, in phone widths), then float
//           gently. On narrow screens they pull in to straddle the phone's edges.
//
//   Exit    the stage stays pinned for a tail (--ai-hole) under AiApproach, which opens a hole in
//           it (at HOLE): the icons swirl into the hole one by one and vanish inside (--v).
//
// The frames' background is #f7f7f7; the canvas is brightened 3.3% so it is pure white like the
// design (and the clouds), which barely touches the phone itself.
// Reduced motion, or no WebGL: a white wash fades instead of the clouds; no float.

const FRAMES = 86;
const frameSrc = (i) => `/service/AI/industries/${String(i).padStart(3, "0")}.jpg`;
const CLOUDS = "/service/AI/island/128.jpg"; // a cloud frame from the island film
// Timeline after the clouds, as shares of the section's scroll
const FILM_END = 0.42; // the phone film plays to here
const HEADING_AT = 0.45; // then the heading rises in
const TEXT_AT = 0.5; // then the description
const ICONS_AT = 0.58; // then the icons, one after another (ICON_STEP apart)
const ICON_STEP = 0.019;
// Where AiApproach opens its hole (share of the screen); the icons are pulled into it
export const HOLE = { x: 0.5, y: 0.55 };
// The phone in the frames (share of the frame): left/right edge, top, bottom
const PHONE = { x0: 0.373, x1: 0.626, y0: 0.041, y1: 0.952 };
const PHONE_ASPECT = ((PHONE.x1 - PHONE.x0) * 16) / ((PHONE.y1 - PHONE.y0) * 9); // width / height

// Icons, from the design: centre offset from the phone's centre (dx) and top (dy) in phone widths,
// size in phone widths, colours (top -> bottom of the glossy gradient)
const ICONS = [
  { icon: ChartNoAxesColumnIncreasing, label: "Finance", dx: -1.43, dy: 0.18, size: 0.235, c: ["#a35bff", "#6a1fe0"] },
  { icon: GraduationCap, label: "Education", dx: 0.57, dy: 0.24, size: 0.28, c: ["#9b4dff", "#6417e0"] },
  { icon: BedDouble, label: "Hospitality", dx: 1.4, dy: 0.09, size: 0.235, c: ["#ff6b93", "#e2285a"] },
  { icon: CarFront, label: "Automotive", dx: -0.89, dy: 0.37, size: 0.235, c: ["#3d8bff", "#0a4fd6"] },
  { icon: Factory, label: "Manufacturing", dx: 1.15, dy: 0.61, size: 0.235, c: ["#3fd0d4", "#0e8d97"] },
  { icon: Building2, label: "Real estate", dx: -1.67, dy: 0.79, size: 0.235, c: ["#ffa24a", "#f0640c"] },
  { icon: Clapperboard, label: "Media & entertainment", dx: -0.95, dy: 0.83, size: 0.235, c: ["#ff5d98", "#de1f62"] },
  { icon: UtensilsCrossed, label: "Food & restaurants", dx: 0.68, dy: 0.83, size: 0.235, c: ["#ff9a3c", "#ee5e08"] },
  { icon: ShieldCheck, label: "Insurance & security", dx: -1.13, dy: 1.25, size: 0.235, c: ["#3f7dff", "#1243d1"] },
  { icon: Truck, label: "Logistics", dx: 1.42, dy: 1.18, size: 0.235, c: ["#ffd24f", "#f5a000"] },
  { icon: Zap, label: "Energy", dx: -0.56, dy: 1.43, size: 0.3, c: ["#4ade6a", "#139632"] },
  { icon: ShoppingCart, label: "Retail & e-commerce", dx: 0.82, dy: 1.43, size: 0.235, c: ["#45d36a", "#16983a"] },
  { icon: Stethoscope, label: "Healthcare", dx: 0.54, dy: 1.68, size: 0.235, c: ["#4a8dff", "#1b59dd"] },
];

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (a, b, v) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export default function AiIndustries() {
  const trackRef = useRef(null);
  const cloudLenRef = useRef(null);
  const holeLenRef = useRef(null);
  const stageRef = useRef(null);
  const headingRef = useRef(null);
  const canvasRef = useRef(null);
  const cloudRef = useRef(null);
  const iconRefs = useRef([]);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const cloudCanvas = cloudRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    // ---- layout: where the phone goes; the frames and icons follow it ----
    let box = { x: 0, y: 0, w: 0, h: 0 };
    let cssW = 1;
    const layout = () => {
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      cssW = W;
      const headingBottom = headingRef.current.getBoundingClientRect().bottom - stage.getBoundingClientRect().top;
      const phoneTop = Math.max(0.3 * H, headingBottom + Math.min(36, Math.max(20, 0.03 * H)));
      const narrow = W < 768;
      // narrow screens: the phone takes at most half the width, leaving room for the icons
      const phoneH = Math.min(1.07 * H - phoneTop, ((narrow ? 0.5 : 0.6) * W) / PHONE_ASPECT);
      const phoneW = phoneH * PHONE_ASPECT;
      const frameH = phoneH / (PHONE.y1 - PHONE.y0);
      const frameW = (frameH * 16) / 9;
      box = { x: W / 2 - frameW / 2, y: phoneTop - PHONE.y0 * frameH, w: frameW, h: frameH };

      // Icons: as designed where there is room; on narrow screens the horizontal spread shrinks so
      // the outermost icons stay on screen, pulling the rest in towards the phone's edges.
      const scale = narrow ? 0.72 : 1;
      const outer = Math.max(...ICONS.map((i) => Math.abs(i.dx)));
      const room = W / 2 - 10 - (0.235 * phoneW * scale) / 2 - phoneW / 2;
      const spread = Math.min(1, room / ((outer - 0.5) * phoneW));
      const cx = W / 2;
      stage.style.setProperty("--ox", `${cx}px`);
      stage.style.setProperty("--hx", `${HOLE.x * W}px`);
      stage.style.setProperty("--hy", `${HOLE.y * H}px`);
      stage.style.setProperty("--oy", `${phoneTop + phoneH * 0.4}px`);
      ICONS.forEach((it, k) => {
        const el = iconRefs.current[k];
        if (!el) return;
        const side = Math.sign(it.dx);
        const x = cx + side * (phoneW * 0.5 + (Math.abs(it.dx) - 0.5) * phoneW * spread);
        el.style.setProperty("--x", `${x}px`);
        el.style.setProperty("--y", `${phoneTop + it.dy * phoneW}px`);
        el.style.setProperty("--s", `${Math.max(34, it.size * phoneW * scale)}px`);
      });
    };

    const film = createFrameFilm({
      canvas: canvasRef.current,
      stage,
      count: FRAMES,
      src: frameSrc,
      mobile: mobileSet("industries", FRAMES),
      ease: 9,
      background: "#f7f7f7",
      cropBackground: "#ffffff", // the phone frames have the lift baked in: #f7f7f7 -> white
      place: (cw) => {
        const k = cw / cssW;
        return { x: box.x * k, y: box.y * k, w: box.w * k, h: box.h * k };
      },
      onFrameReady: () => kick(),
    });

    let clouds = null;
    const startClouds = () => {
      if (clouds || reduced.matches) return;
      clouds = createCloudReveal({ canvas: cloudCanvas, src: CLOUDS });
      clouds?.resize();
    };

    const measure = () => {
      const r = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const cloudLen = cloudLenRef.current.offsetHeight;
      const holeLen = holeLenRef.current.offsetHeight;
      const span = r.height - cloudLen - holeLen - vh;
      return {
        top: r.top,
        u: cloudLen > 0 ? clamp01(-r.top / cloudLen) : 1,
        p: span > 0 ? clamp01((-r.top - cloudLen) / span) : 0,
        // the hole transition over the tail
        v: holeLen > 0 ? clamp01((-r.top - cloudLen - span) / holeLen) : 0,
      };
    };
    const aim = (m) => film.setTarget(Math.min(1, m.p / FILM_END));
    aim(measure());
    film.jump();

    let raf = 0;
    let last = 0;
    let onScreen = false;
    let cloudShown = false;
    const tick = (now) => {
      raf = 0;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
      last = now;
      const m = measure();
      // Hidden until pinned: before that the island's stage is still on screen behind
      stage.style.visibility = m.top <= 0.5 ? "visible" : "hidden";
      stage.style.setProperty("--q", m.p.toFixed(4));
      stage.style.setProperty("--u", m.u.toFixed(4));
      stage.style.setProperty("--v", m.v.toFixed(4));
      aim(m);
      const moving = film.step(dt);

      const useClouds = clouds?.ready && !reduced.matches;
      const playing = useClouds && m.top <= 0.5 && m.u < 1;
      if (playing) {
        clouds.render(m.u, now / 1000);
        if (!cloudShown) cloudCanvas.style.visibility = "visible";
        cloudShown = true;
      } else if (cloudShown) {
        clouds?.clear();
        cloudCanvas.style.visibility = "hidden";
        cloudShown = false;
      }
      stage.style.setProperty("--wash", useClouds ? "0" : (1 - smooth(0, 0.9, m.u)).toFixed(4));

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
        startClouds();
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
      layout();
      film.resize();
      // the phone crop set has the 3.3% lift baked in; full frames get it from the CSS filter
      canvasRef.current.style.filter = film.mode === "crop" ? "none" : "brightness(1.033)";
      clouds?.resize();
      kick();
    });
    ro.observe(stage);
    ro.observe(headingRef.current);
    window.addEventListener("scroll", kick, { passive: true });
    reduced.addEventListener("change", kick);

    return () => {
      film.destroy();
      clouds?.destroy();
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
      data-guide="aiIndustries"
      aria-labelledby="ai-industries-title"
      // Overlaps the end of AiIsland by a screen plus the cloud transition, which plays first here
      className="relative z-20 -mt-[calc(100svh+var(--ai-cloud))] h-[calc(400svh+var(--ai-cloud)+var(--ai-hole))] [--ai-cloud:110svh] [--ai-hole:120svh] motion-reduce:mt-0! motion-reduce:[--ai-cloud:0svh] motion-reduce:[--ai-hole:0svh]"
    >
      {/* Measures the cloud transition's length */}
      <div ref={cloudLenRef} aria-hidden="true" className="invisible absolute left-0 top-0 h-(--ai-cloud) w-px" />
      {/* Measures the tail under AiApproach's hole transition */}
      <div ref={holeLenRef} aria-hidden="true" className="invisible absolute bottom-0 left-0 h-(--ai-hole) w-px" />

      <div
        ref={stageRef}
        className="sticky top-0 h-svh overflow-hidden bg-white"
        style={{ "--q": 0, "--u": 0, "--v": 0, "--wash": 0, "--ox": "50vw", "--oy": "60svh", "--hx": "50vw", "--hy": "55svh" }}
      >
        {/* The phone film (frames' #f7f7f7 lifted to white) */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500 data-live:opacity-100"
          style={{ filter: "brightness(1.033)" }}
        />

        {/* Heading, as in the design */}
        <div
          ref={headingRef}
          className="absolute inset-x-0 top-[clamp(5.5rem,13svh,8.5rem)] px-4 text-center sm:px-6"
        >
          <h2
            id="ai-industries-title"
            style={{
              "--h": `clamp(0, (var(--q) - ${HEADING_AT}) / 0.07, 1)`,
              opacity: "var(--h)",
              transform: "translate3d(0, calc((1 - var(--h)) * 28px), 0)",
              filter: "blur(calc((1 - var(--h)) * 6px))",
            }}
            className="mx-auto max-w-[40rem] text-[26px] font-semibold leading-[1.2] tracking-tight text-[#0b2a66] sm:text-[34px] lg:max-w-[48rem] lg:text-[clamp(34px,2.8vw,44px)]"
          >
            Our AI Software Development Services for Wider Industries
          </h2>
          <p
            style={{
              "--h": `clamp(0, (var(--q) - ${TEXT_AT}) / 0.07, 1)`,
              opacity: "var(--h)",
              transform: "translate3d(0, calc((1 - var(--h)) * 20px), 0)",
              filter: "blur(calc((1 - var(--h)) * 4px))",
            }}
            className="mx-auto mt-2 max-w-[42rem] text-[14px] leading-snug text-[#1e293b] sm:text-[16px] lg:max-w-[46rem] lg:text-[clamp(16px,1.15vw,18px)]">
            Our AI software development services do not stick to one particular industry alone. We are offering
            services to all types of global sectors within a fixed time &amp; schedule
          </p>
        </div>

        {/* Industry icons, flying out of the phone to their places */}
        <ul aria-label="Industries we serve" className="pointer-events-none absolute inset-0">
          {ICONS.map(({ icon: Icon, label, c }, k) => (
            <li
              key={label}
              ref={(el) => (iconRefs.current[k] = el)}
              className="absolute left-0 top-0"
              style={{
                "--a": `clamp(0, (var(--q) - ${(ICONS_AT + k * ICON_STEP).toFixed(3)}) / 0.08, 1)`,
                "--e": "calc(var(--a) * (2 - var(--a)))",
                // pulled into the hole, accelerating (--k2), one after another
                "--k": `clamp(0, (var(--v) - ${(0.14 + k * 0.026).toFixed(3)}) / 0.26, 1)`,
                "--k2": "calc(var(--k) * var(--k))",
                "--px": "calc(var(--ox) + (var(--x, 0px) - var(--ox)) * var(--e))",
                "--py": "calc(var(--oy) + (var(--y, 0px) - var(--oy)) * var(--e))",
                opacity: "calc(clamp(0, var(--a) * 3, 1) * (1 - var(--k2)))",
                transform:
                  "translate3d(calc(var(--px) + (var(--hx) - var(--px)) * var(--k2)), calc(var(--py) + (var(--hy) - var(--py)) * var(--k2)), 0) translate(-50%, -50%) rotate(calc(var(--k2) * 260deg)) scale(calc((0.35 + var(--e) * 0.65) * (1 - var(--k2) * 0.9)))",
              }}
            >
              <span
                className="ai-bob block motion-reduce:animate-none!"
                style={{ animationDelay: `${(-k * 0.47).toFixed(2)}s`, animationDuration: `${4.2 + (k % 4) * 0.6}s` }}
              >
                <span
                  className="relative grid place-items-center rounded-[24%] text-white"
                  style={{
                    width: "var(--s, 48px)",
                    height: "var(--s, 48px)",
                    background: `linear-gradient(160deg, ${c[0]} 0%, ${c[1]} 100%)`,
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -2px 4px rgba(0,0,0,0.12), 0 10px 22px -8px ${c[1]}aa, 0 3px 8px -2px rgba(15,23,42,0.18)`,
                  }}
                >
                  {/* gloss */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-[8%] top-[5%] h-[45%] rounded-[40%] bg-linear-to-b from-white/35 to-transparent"
                  />
                  <Icon className="relative size-[48%] drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]" strokeWidth={2.2} aria-hidden="true" />
                  <span className="sr-only">{label}</span>
                </span>
              </span>
            </li>
          ))}
        </ul>

        {/* Fallback hand-over (reduced motion / no WebGL): the white simply fades */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-white" style={{ opacity: "var(--wash)" }} />
        {/* The clouds, parting over everything */}
        <canvas ref={cloudRef} aria-hidden="true" className="invisible absolute inset-0 h-full w-full" />
      </div>
    </section>
  );
}

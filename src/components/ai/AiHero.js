"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ContactLink from "@/components/common/ContactLink";
import DemoLink from "@/components/common/DemoLink";

// Artificial Intelligence hero: the supplied photo (a hall under a funnel of glowing screens, a
// figure standing below its bright ring), full-bleed. A WebGL shader brings it to life:
//
//   - The ring turns. The photo is one flat image, so each pixel in the ring band finds which of
//     the funnel's perspective ellipses it lies on (their centre, width and flatness change with
//     size; measured from the photo) and samples further along that same ellipse, so the screens
//     travel around the ring as on a real cylinder, foreshortened correctly. The photo only holds
//     detail for about +-10 deg of travel (beyond that the thin far side would have to fill the
//     thick front), so the ring turns slowly back and forth within that range, eased, plus a
//     little towards the cursor. The figure and the band's edges blend back into the untouched
//     photo, so nothing smears.
//   - Mouse parallax. A smooth depth map (far hall, funnel, ring, floor, figure) shifts each part
//     by its depth as the cursor moves, eased. The view is overscanned 6% so no edge ever shows.
//     Touch screens get a slow, gentle drift instead.
//   - A faint cool glow follows the cursor, and a touch of grain keeps the dark gradients from
//     banding.
//
// Layout (from the design): the hero is exactly one screen tall (100svh) on every device. The photo
// is centred, sits on the hero's bottom edge and is sized to the larger of FIT.width x the hero's
// width (the design's framing: the ring about 45% of the width) and FIT.height x its height (so tall
// phone screens still fill with the ring and figure), times OVERSCAN for the parallax. Above it, its
// dark top fades into the hero's background (TOP_FADE photo px), where the heading sits over the
// upper funnel.
//
// The still photo (next/image, priority) paints first and stays for reduced motion, no WebGL or a
// lost context; the canvas fades in over it once its first frame is drawn, placed and faded
// identically (same size formula, bottom-anchored, same top fade), so the hand-over is seamless.
// The loop runs only while the hero is on screen and the tab is visible.

const STILL = "/service/AI/Hero/ai-hero.jpg"; // the design's frame, 1670 x 762
const TEXTURE = "/service/AI/Hero/ai-hero-texture.jpg"; // the full photo, 1672 x 941 (frame = x 1..1671, y 0..762)
const FRAME = { w: 1670, h: 762, x: 1 };
const FIT = { width: 1.1, height: 0.8 };
// AiHeroStage dispatches this (detail: true / false) when the next section fully covers the hero
export const COVERED_EVENT = "ai-hero:covered";
const OVERSCAN = 1.06;
const TOP_FADE = 90; // photo px over which the photo's top edge fades into the background
const DROP = 24; // photo px the photo sits below the hero's bottom edge (moves the scene down)
const BG = "#02050d";

// Motion
const SWAY_DEG = 7; // the ring's slow turn, each way
const SWAY_PERIOD = 26; // seconds for a full there-and-back
const CURSOR_TURN_DEG = 2.5; // extra turn towards the cursor (total stays within the photo's ~10 deg)
const PARALLAX_PX = [26, 13]; // shift at depth 1, in photo px, at the section's edges
const EASE = 4.5; // 1/s: how quickly the scene follows the cursor

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec4 uView;      // photo px of the view's top-left corner, and the view's size
uniform vec2 uPar;       // parallax shift at depth 1 (photo px)
uniform float uRot;      // ring rotation (rad)
uniform vec3 uGlow;      // cursor glow: photo px position, strength
uniform float uTime;

const vec2 TEX = vec2(1672.0, 941.0);
const vec3 BG = vec3(0.0078, 0.0196, 0.051);  // #02050d, the hero's background
const float TOP_FADE = 90.0;

// The funnel's rings, measured from the photo: a ring with semi-major axis a is an ellipse centred
// on (CX, cy(a)) with semi-minor axis s(a) * a; both change linearly between the bright bottom rim
// (a = 340) and a ring higher up (a = 490).
const float CX = 832.0;
const float A0 = 340.0;
const float CY0 = 470.0;
const float S0 = 0.32;
const float A1 = 490.0;
const float CY1 = 340.0;
const float S1 = 0.5;

float cyOf(float a) { return CY0 + (a - A0) * (CY1 - CY0) / (A1 - A0); }
float sOf(float a) { return clamp(S0 + (a - A0) * (S1 - S0) / (A1 - A0), 0.12, 0.75); }

vec3 tex(vec2 p) { return texture2D(uTex, clamp(p / TEX, vec2(0.0), vec2(1.0))).rgb; }

// Which ring the point lies on (bisection on a: inside the ellipse means a is too big)
float ringOf(vec2 p) {
  float dx = p.x - CX;
  float lo = 120.0;
  float hi = 700.0;
  for (int i = 0; i < 16; i++) {
    float a = 0.5 * (lo + hi);
    float b = sOf(a) * a;
    float dy = p.y - cyOf(a);
    if (dx * dx / (a * a) + dy * dy / (b * b) > 1.0) lo = a; else hi = a;
  }
  return 0.5 * (lo + hi);
}

// Depth for the parallax (0 far .. 1 near), smooth everywhere so the warp never tears
float depthAt(vec2 p) {
  float d = 0.16;                                                        // the dark hall
  float funnel = 1.0 - smoothstep(0.7, 1.25, length((p - vec2(832.0, 300.0)) / vec2(780.0, 340.0)));
  d = mix(d, 0.42, funnel);                                              // the funnel overhead
  float ring = 1.0 - smoothstep(0.9, 1.3, length((p - vec2(832.0, 470.0)) / vec2(350.0, 125.0)));
  d = mix(d, 0.6, ring);                                                 // the bright ring and hole
  d = mix(d, 1.0, smoothstep(580.0, 940.0, p.y));                        // the floor, nearer lower down
  float figure = (1.0 - smoothstep(10.0, 28.0, abs(p.x - 829.0)))
    * smoothstep(538.0, 556.0, p.y) * (1.0 - smoothstep(660.0, 700.0, p.y));
  return mix(d, 0.82, figure);                                           // the figure
}

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  vec2 p = uView.xy + uv * uView.zw;
  p -= uPar * depthAt(p);

  vec3 col = tex(p);

  // The ring band (only worth solving inside its bounding box)
  if (p.x > 460.0 && p.x < 1210.0 && p.y > 320.0 && p.y < 620.0) {
    float a = ringOf(p);
    float band = smoothstep(268.0, 292.0, a) * (1.0 - smoothstep(336.0, 356.0, a));
    float keepFigure = min(1.0, smoothstep(12.0, 34.0, abs(p.x - 829.0)) + (1.0 - smoothstep(528.0, 552.0, p.y)));
    float m = band * keepFigure;
    if (m > 0.001) {
      float cy = cyOf(a);
      float b = sOf(a) * a;
      float t = atan((p.y - cy) / b, (p.x - CX) / a) - uRot;
      vec3 turned = tex(vec2(CX + a * cos(t), cy + b * sin(t)));
      col = mix(col, turned, m);
    }
  }

  // The photo's top edge fades into the background above it (matching the still's CSS mask)
  col = mix(BG, col, clamp(p.y / TOP_FADE, 0.0, 1.0));

  // A faint cool light following the cursor
  vec2 g = (p - uGlow.xy) / 190.0;
  col += vec3(0.16, 0.42, 1.0) * (0.07 * uGlow.z) * exp(-dot(g, g));

  // A touch of grain against banding in the dark gradients
  col += (hash(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) / 255.0;

  gl_FragColor = vec4(col, 1.0);
}`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
  return shader;
}

export default function AiHero() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: "high-performance" });
    // No WebGL, or a context that is already lost: keep the still image
    if (!gl || gl.isContextLost()) return;

    let program;
    try {
      program = gl.createProgram();
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    } catch (err) {
      console.warn(`AI hero: WebGL setup failed, keeping the still image. ${err?.message ?? err}`);
      return;
    }
    gl.useProgram(program);

    // One triangle covering the screen
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = Object.fromEntries(["uTex", "uView", "uPar", "uRot", "uGlow", "uTime"].map((n) => [n, gl.getUniformLocation(program, n)]));
    gl.uniform1i(u.uTex, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Sizing: the canvas buffer at up to 2x density, and the photo-px window it shows (placed as
    // the still: centred, bottom-anchored, sized by FIT, times OVERSCAN)
    let view = [0, 0, FRAME.w, FRAME.h];
    let pxPerPhotoPx = 1;
    const resize = () => {
      const w = section.clientWidth;
      const h = section.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      const k = Math.max((FIT.width * w) / FRAME.w, (FIT.height * h) / FRAME.h) * OVERSCAN;
      const vw = w / k;
      const vh = h / k;
      // Bottom-anchored, DROP photo px below the hero's bottom edge (as the still's translateY)
      view = [FRAME.x + (FRAME.w - vw) / 2, FRAME.h - DROP - vh, vw, vh];
      pxPerPhotoPx = k;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(section);

    // Cursor: target and eased current position (-1..1 across the section), and glow strength
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const target = { x: 0, y: 0, glow: 0 };
    const cur = { x: 0, y: 0, glow: 0 };
    const onMove = (e) => {
      if (e.pointerType !== "mouse") return;
      const r = section.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      target.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      target.glow = 1;
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      target.glow = 0;
    };
    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);

    let raf = 0;
    let running = false;
    let ready = false;
    let shown = false;
    let last = 0;
    const start = performance.now();

    const draw = (now) => {
      raf = 0;
      if (!ready) return;
      const time = (now - start) / 1000;
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      const f = 1 - Math.exp(-dt * EASE);
      // Touch screens: a slow, gentle drift in place of the cursor
      if (!finePointer) {
        target.x = Math.sin(time * 0.13) * 0.35;
        target.y = Math.sin(time * 0.09) * 0.2;
      }
      cur.x += (target.x - cur.x) * f;
      cur.y += (target.y - cur.y) * f;
      cur.glow += (target.glow - cur.glow) * f;

      const rot = ((SWAY_DEG * Math.sin((time / SWAY_PERIOD) * Math.PI * 2) + CURSOR_TURN_DEG * cur.x) * Math.PI) / 180;
      gl.uniform4f(u.uView, view[0], view[1], view[2], view[3]);
      gl.uniform2f(u.uPar, cur.x * PARALLAX_PX[0], cur.y * PARALLAX_PX[1]);
      gl.uniform1f(u.uRot, rot);
      gl.uniform3f(u.uGlow, view[0] + ((cur.x + 1) / 2) * view[2], view[1] + ((cur.y + 1) / 2) * view[3], cur.glow * Math.min(1, pxPerPhotoPx));
      gl.uniform1f(u.uTime, time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!shown) {
        shown = true;
        setLive(true);
      }
      if (running) raf = requestAnimationFrame(draw);
    };

    const play = () => {
      if (running || !ready) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(draw);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    // Only animate while the hero is on screen, not covered by the section scrolling over it
    // (AiHeroStage reports that with an "ai-hero:covered" event) and the tab is visible
    let onScreen = false;
    let covered = false;
    const shouldRun = () => onScreen && !covered && document.visibilityState === "visible";
    const sync = () => (shouldRun() ? play() : pause());
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(section);
    const onVisibility = () => sync();
    document.addEventListener("visibilitychange", onVisibility);
    const onCovered = (e) => {
      covered = Boolean(e.detail);
      sync();
    };
    window.addEventListener(COVERED_EVENT, onCovered);

    // A lost context (GPU reset, too many contexts): fall back to the still image
    const onLost = (e) => {
      e.preventDefault();
      pause();
      ready = false;
      setLive(false);
    };
    canvas.addEventListener("webglcontextlost", onLost);

    let alive = true;
    const img = new window.Image();
    img.decoding = "async";
    img.src = TEXTURE;
    img
      .decode()
      .then(() => {
        if (!alive || gl.isContextLost()) return;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
        ready = true;
        if (shouldRun()) play();
        else requestAnimationFrame(draw); // draw one frame so the canvas is ready when it scrolls in
      })
      .catch(() => {
        // The texture failed to load: the still image simply stays
      });

    return () => {
      alive = false;
      pause();
      ro.disconnect();
      io.disconnect();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener(COVERED_EVENT, onCovered);
      canvas.removeEventListener("webglcontextlost", onLost);
      // Free our GPU objects but never force-lose the context: the same canvas hands back that
      // context on a remount (React Strict Mode, Fast Refresh), and a lost one can't be drawn on.
      // The browser releases the context itself when the canvas goes away.
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-guide="aiHero"
      aria-labelledby="ai-hero-title"
      // Exactly one screen tall; a size container, so the still's size formula below uses the
      // hero's own width and height (cqw / cqh), the same numbers the shader is sized from
      className="relative h-svh overflow-hidden"
      style={{ backgroundColor: BG, containerType: "size" }}
    >
      {/* The scene (photo, live canvas, bottom fade). Inside AiHeroStage, --ai-p (0 -> 1 as the
          next section rises over the hero) eases it back and up a little as it leaves */}
      <div
        aria-hidden="true"
        className="absolute inset-0 origin-[50%_70%] motion-reduce:transform-none!"
        style={{ transform: "translate3d(0, calc(var(--ai-p, 0) * -5%), 0) scale(calc(1 - var(--ai-p, 0) * 0.08))" }}
      >
      {/* The still photo: paints first, and stays wherever the WebGL scene doesn't run. Centred on
          the bottom edge, sized like the scene (FIT, OVERSCAN), its top faded into the background. */}
      <Image
        src={STILL}
        alt="A lone figure stands in a dark hall beneath a vast glowing ring of screens"
        width={FRAME.w}
        height={FRAME.h}
        priority
        sizes="(max-aspect-ratio: 1/1) 200vh, 120vw"
        // Served as the JPG itself (no WebP/AVIF conversion), already optimised at full quality
        unoptimized
        className="absolute bottom-0 left-1/2 h-auto max-w-none"
        style={{
          // Centred, and moved down DROP photo px (a share of its own height) as in the shader
          transform: `translate(-50%, ${(DROP / FRAME.h) * 100}%)`,
          width: `calc(max(${FIT.width * 100}cqw, ${((FIT.height * FRAME.w) / FRAME.h) * 100}cqh) * ${OVERSCAN})`,
          maskImage: `linear-gradient(to bottom, transparent 0%, #000 ${(TOP_FADE / FRAME.h) * 100}%)`,
          WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, #000 ${(TOP_FADE / FRAME.h) * 100}%)`,
        }}
      />

      {/* The live scene, fading in over the still once its first frame is drawn */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-out ${live ? "opacity-100" : "opacity-0"}`}
      />

      {/* Bottom fade into the hero's dark background: an eased curve (barely there at first, then
          gathering), which reads as a natural fall-off where a linear fade would show a band over
          the dark photo. Over the scene (still and canvas alike), under the text; ~10% of the
          hero, so it stays clear of the figure's feet at every screen size. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[clamp(4.5rem,10cqh,7.5rem)]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,5,13,0) 0%, rgba(2,5,13,0.013) 12%, rgba(2,5,13,0.049) 24%, rgba(2,5,13,0.104) 35%, rgba(2,5,13,0.175) 46%, rgba(2,5,13,0.259) 56%, rgba(2,5,13,0.352) 65%, rgba(2,5,13,0.45) 73%, rgba(2,5,13,0.55) 80%, rgba(2,5,13,0.65) 86%, rgba(2,5,13,0.754) 91%, rgba(2,5,13,0.86) 95.5%, #02050d 100%)",
        }}
      />
      </div>

      {/* Darkens the whole scene as the next section takes over, so the hand-over is one dark field */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundColor: BG, opacity: "calc(var(--ai-p, 0) * 0.92)" }}
      />

      {/* Heading, intro and buttons, centred over the upper funnel as in the design */}
      <div
        className="absolute inset-x-0 top-[clamp(6.5rem,22cqh,15rem)] px-4 text-center text-white sm:px-6 motion-reduce:transform-none!"
        // Leaves first: lifts and fades out over the first half of the hand-over
        style={{
          opacity: "clamp(0, calc(1 - var(--ai-p, 0) * 2.2), 1)",
          transform: "translate3d(0, calc(var(--ai-p, 0) * -56px), 0)",
        }}
      >
        <h1
          id="ai-hero-title"
          className="text-[32px] font-semibold leading-[1.15] tracking-tight [text-shadow:0_2px_24px_rgba(2,5,13,0.6)] sm:text-[42px] lg:text-[clamp(42px,3.6vw,56px)]"
        >
          AI Development Company
        </h1>
        <p className="mx-auto mt-3 max-w-[30rem] text-[15px] leading-snug text-white/85 [text-shadow:0_1px_16px_rgba(2,5,13,0.7)] sm:text-[17px] lg:max-w-[34rem] lg:text-[clamp(17px,1.4vw,21px)]">
          As a leading AI development company, Techzarinfo delivers AI development services
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4 lg:mt-8 lg:gap-[27px]">
          <ContactLink className="inline-flex h-11 items-center rounded-[3px] bg-white px-[15px] text-[15px] font-medium text-[#002461] transition-colors hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:text-base">
            Start a Project
          </ContactLink>
          <DemoLink className="inline-flex h-11 items-center rounded-[3px] border border-white/70 px-[15px] text-[15px] font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:text-base">
            Free Demo
          </DemoLink>
        </div>
      </div>
    </section>
  );
}

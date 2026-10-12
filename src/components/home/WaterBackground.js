"use client";

import { useEffect, useRef } from "react";

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const DROPS = 4; // impact slots (each one is a falling drop, then a travelling wave train)
const FALL = 0.7; // seconds a drop takes to reach the surface (shared with the shader)
const GAP = 3.4; // average seconds between drops

// Soft pale-blue water seen at a low angle. A height field gives per-pixel normals that drive
// diffuse light, a specular sheen and crest/trough shading. Drops fall behind the phone, hit the
// water there and send a wave train across the whole surface. The idle rings keep the water
// moving between drops, and the AI guide leaves a gentle wake where it hovers.
const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
uniform vec4 uDrop[${DROPS}]; // xy: impact point (uv, y down), z: start time, w: strength
uniform vec3 uGuide;          // xy: guide's feet (uv), z: wake strength
uniform vec2 uSrc;            // where the drops land: behind the phone (uv)
uniform vec2 uPx;             // x: fall height (uv), y: drop radius (uv)

const float FALL = ${FALL.toFixed(2)};
const float SQ = 1.8; // vertical foreshortening of the water plane

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  uv.y = 1.0 - uv.y;
  float asp = uRes.x / uRes.y;
  vec2 sc = vec2(asp, 1.0);

  // idle rings, always drifting outward from the phone
  vec2 q = (uv - uSrc) * sc;
  q.y *= SQ;
  float r = length(q);
  float a = atan(q.y, q.x);
  r += 0.008 * sin(a * 3.0 + uTime * 0.3) + 0.005 * sin(a * 5.0 - uTime * 0.4);
  float fade = exp(-r * 0.9) * smoothstep(0.05, 0.22, r);
  float slope = 0.0;
  float h = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float k = 11.0 + fi * 5.0;
    float ph = r * k - uTime * (0.45 + fi * 0.12);
    float am = fade / (1.0 + fi * 1.1);
    slope += am * k * cos(ph);
    h += am * sin(ph) / k;
  }
  vec2 grad = normalize(q + 1e-5) * slope * vec2(1.0, SQ) * 0.045;

  // wave trains from drops that have landed: a sharp leading crest followed by a few softer ones
  for (int i = 0; i < ${DROPS}; i++) {
    vec4 D = uDrop[i];
    float age = uTime - D.z - FALL;
    if (age > 0.0 && age < 10.0) {
      vec2 dv = (uv - D.xy) * sc;
      dv.y *= SQ;
      float d = length(dv);
      float x = d - (0.01 + 0.34 * age);
      float env = exp(-x * x / (x < 0.0 ? 0.13 : 0.004));
      float A = D.w * 0.026 / (0.35 + d) * exp(-age * 0.2) * smoothstep(0.0, 0.3, age + 0.1);
      float k = 34.0;
      grad += dv / (d + 1e-4) * vec2(1.0, SQ) * A * k * cos(x * k) * env;
      h += A * sin(x * k) * env;
    }
  }

  // gentle wake where the AI guide hovers over the water
  vec2 gv = (uv - uGuide.xy) * sc;
  gv.y *= SQ;
  float gd = length(gv);
  float gamp = uGuide.z * 0.004 * exp(-gd * 5.0) * smoothstep(0.0, 0.04, gd);
  grad += gv / (gd + 1e-4) * vec2(1.0, SQ) * gamp * cos(gd * 46.0 - uTime * 2.4) * 46.0;

  vec3 n = normalize(vec3(-grad, 1.0));
  vec3 L = normalize(vec3(-0.3, -0.6, 0.75));
  float diff = dot(n, L);
  float spec = pow(max(dot(reflect(-L, n), vec3(0.0, 0.0, 1.0)), 0.0), 26.0);

  // misty pale-blue water, slightly deeper toward the sides
  vec2 m = (uv - vec2(0.5, 0.60)) * sc;
  float md = length(m);
  vec3 base = mix(vec3(0.925, 0.958, 1.0), vec3(0.77, 0.865, 0.98), smoothstep(0.1, 0.7, md));
  vec3 col = base * (0.93 + 0.26 * diff);
  col = mix(col, vec3(0.60, 0.75, 0.96), clamp(-h * 5.0, 0.0, 0.32)); // troughs: deeper blue
  col += vec3(1.0) * spec * 0.5 + vec3(0.85, 0.93, 1.0) * clamp(h * 4.0, 0.0, 0.16); // crests: bright

  // broad soft glow behind the phone
  vec2 g = (uv - vec2(0.5, 0.60)) * vec2(asp * 0.62, 1.0);
  col = mix(col, vec3(0.97, 0.985, 1.0), exp(-dot(g, g) * 5.5) * 0.6);

  // white sky fading into the mist
  col = mix(vec3(1.0), col, smoothstep(0.10, 0.50, uv.y));

  // falling drops and the splash where they land
  for (int i = 0; i < ${DROPS}; i++) {
    vec4 D = uDrop[i];
    float life = uTime - D.z;
    if (life > 0.0 && life < FALL + 0.6) {
      if (life < FALL) {
        float p = life / FALL;
        vec2 pos = vec2(D.x, D.y - uPx.x * (1.0 - p * p));
        vec2 dp = (uv - pos) * sc;
        float e = length(vec2(dp.x, dp.y * (0.62 - 0.2 * p)));
        float rad = uPx.y * D.w;
        float al = smoothstep(rad, rad * 0.55, e) * smoothstep(0.0, 0.25, p);
        vec3 dc = mix(vec3(0.62, 0.78, 0.98), vec3(0.95, 0.985, 1.0), smoothstep(0.0, rad, -dp.y * 0.8 - dp.x * 0.4 + rad * 0.4));
        col = mix(col, dc, al * 0.85);
      } else {
        float age = life - FALL;
        vec2 dp = (uv - D.xy) * sc;
        float H = uPx.y * 7.0 * D.w * sin(3.14159 * clamp(age / 0.6, 0.0, 1.0));
        float jd = length(vec2(dp.x / (uPx.y * 0.75 * D.w), (dp.y + H * 0.5) / (H * 0.5 + 0.002)));
        float al = smoothstep(1.0, 0.55, jd) * (1.0 - age / 0.6);
        col = mix(col, vec3(0.97, 0.99, 1.0), al * 0.8);
        vec2 sp = dp * vec2(1.0, SQ);
        col += vec3(0.9, 0.95, 1.0) * exp(-dot(sp, sp) / (uPx.y * uPx.y * 6.0)) * exp(-age * 7.0) * 0.6;
      }
    }
  }

  gl_FragColor = vec4(col, 1.0);
}`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// Mirrors the shader's height field in plain JS (idle rings + drop wave trains, no guide wake)
// so the floating phone can sample the same water surface it's sitting on.
const SURF_SQ = 1.8;
function heightAt(ux, uy, t, asp, src, drops) {
  let h = 0;
  const qx = (ux - src.x) * asp;
  const qy = (uy - src.y) * SURF_SQ;
  let r = Math.hypot(qx, qy);
  const ang = Math.atan2(qy, qx);
  r += 0.008 * Math.sin(ang * 3 + t * 0.3) + 0.005 * Math.sin(ang * 5 - t * 0.4);
  const fade = Math.exp(-r * 0.9) * smooth(0.05, 0.22, r);
  for (let i = 0; i < 3; i++) {
    const k = 11 + i * 5;
    const ph = r * k - t * (0.45 + i * 0.12);
    h += (fade / (1 + i * 1.1)) * Math.sin(ph) / k;
  }
  for (let i = 0; i < DROPS; i++) {
    const o = i * 4;
    const age = t - drops[o + 2] - FALL;
    if (age > 0 && age < 10) {
      const dx = (ux - drops[o]) * asp;
      const dy = (uy - drops[o + 1]) * SURF_SQ;
      const d = Math.hypot(dx, dy);
      const x = d - (0.01 + 0.34 * age);
      const env = Math.exp((-x * x) / (x < 0 ? 0.13 : 0.004));
      const A = (drops[o + 3] * 0.026) / (0.35 + d) * Math.exp(-age * 0.2) * smooth(0, 0.3, age + 0.1);
      h += A * Math.sin(x * 34) * env;
    }
  }
  return h;
}

export default function WaterBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uDrop = gl.getUniformLocation(prog, "uDrop");
    const uGuide = gl.getUniformLocation(prog, "uGuide");
    const uSrc = gl.getUniformLocation(prog, "uSrc");
    const uPx = gl.getUniformLocation(prog, "uPx");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const drops = new Float32Array(DROPS * 4);
    for (let i = 0; i < DROPS; i++) drops[i * 4 + 2] = -1000; // empty slot

    let raf = 0;
    let visible = false;
    let slot = 0;
    let nextDrop = 0.6;
    let wake = 0;
    let prevX = 0;
    let prevY = 0;
    let guide = null;
    let floater = null;
    const float = { y: 0, r: 0 };
    const src = { x: 0.5, y: 0.72 };
    const start = performance.now();

    // The drop lands behind the phone: find it on the page so this holds at every breakpoint.
    const locateSource = () => {
      const el = canvas.parentElement?.querySelector("[data-water-source]");
      const c = canvas.getBoundingClientRect();
      if (el && c.width && c.height) {
        const r = el.getBoundingClientRect();
        src.x = (r.left + r.width / 2 - c.left) / c.width;
        src.y = (r.top + r.height / 2 - c.top) / c.height;
      }
      gl.uniform2f(uSrc, src.x, src.y);
      gl.uniform2f(uPx, Math.min(0.36, 420 / (c.height || 1)), 8 / (c.height || 1));
      if (reduce) {
        // static frame: two waves already well on their way across the water
        drops.set([src.x, src.y, 4 - FALL - 1.6, 1, src.x, src.y, 4 - FALL - 3.6, 0.9]);
        gl.uniform4fv(uDrop, drops);
      }
    };

    // Where the guide's feet touch the water (0..1 across the canvas) and how hard to ripple.
    const updateGuide = () => {
      guide ??= document.querySelector(".ai-guide");
      let target = 0;
      let gx = 0.5;
      let gy = 2;
      if (guide && guide.classList.contains("is-on")) {
        const rect = canvas.getBoundingClientRect();
        const gr = guide.getBoundingClientRect();
        const cx = gr.left + gr.width / 2;
        const fy = gr.bottom - gr.height * 0.12;
        gx = (cx - rect.left) / rect.width;
        gy = (fy - rect.top) / rect.height;
        const speed = Math.hypot(cx - prevX, fy - prevY);
        prevX = cx;
        prevY = fy;
        const inside = smooth(0.3, 0.5, gy) * (1 - smooth(1.0, 1.15, gy)) * smooth(-0.1, 0.05, gx) * (1 - smooth(0.95, 1.1, gx));
        target = inside * (0.35 + Math.min(speed * 0.06, 0.65));
      }
      wake += (target - wake) * 0.08;
      gl.uniform3f(uGuide, gx, gy, wake);
    };

    // The phone rides the same surface it's dropped onto: sample the height field under its
    // footprint each frame and turn that into a gentle bob (translateY) and rock (rotate).
    const updateFloat = (t) => {
      floater ??= canvas.parentElement?.querySelector("[data-water-float]");
      if (!floater) return;
      const c = canvas.getBoundingClientRect();
      const f = floater.getBoundingClientRect();
      if (!c.width || !c.height) return;
      const asp = c.width / c.height;
      const fx = (f.left + f.width / 2 - c.left) / c.width;
      const fy = (f.top + f.height / 2 - c.top) / c.height;
      const ow = (f.width * 0.3) / c.width;

      const hMid = heightAt(fx, fy, t, asp, src, drops);
      const hL = heightAt(fx - ow, fy, t, asp, src, drops);
      const hR = heightAt(fx + ow, fy, t, asp, src, drops);

      const idleY = Math.sin(t * 0.9) * 1.4;
      const idleR = Math.sin(t * 0.7 + 1.2) * 0.5;
      const targetY = clamp(hMid * 260 + idleY, -20, 20);
      const targetR = clamp((hR - hL) * 260 + idleR, -3.5, 3.5);

      float.y += (targetY - float.y) * 0.18;
      float.r += (targetR - float.r) * 0.18;
      floater.style.transform = `translate3d(0, ${float.y.toFixed(2)}px, 0) rotate(${float.r.toFixed(2)}deg)`;
    };

    const draw = (now) => {
      const t = reduce ? 4 : (now - start) / 1000;
      gl.uniform1f(uTime, t);
      if (!reduce) {
        if (t >= nextDrop) {
          const o = slot * 4;
          drops[o] = src.x; // always dead-centre, exactly behind the phone
          drops[o + 1] = src.y;
          drops[o + 2] = t;
          drops[o + 3] = 0.9 + Math.random() * 0.25;
          gl.uniform4fv(uDrop, drops);
          slot = (slot + 1) % DROPS;
          nextDrop = t + GAP * (0.85 + Math.random() * 0.3);
        }
        updateGuide();
        updateFloat(t);
      } else {
        gl.uniform3f(uGuide, 0.5, 2, 0);
        floater ??= canvas.parentElement?.querySelector("[data-water-float]");
        if (floater) floater.style.transform = "translate3d(0, -3px, 0) rotate(0.6deg)";
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now) => {
      draw(now);
      raf = visible && !reduce ? requestAnimationFrame(loop) : 0;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr * 0.75));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr * 0.75));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      locateSource();
      draw(performance.now());
    };

    gl.uniform4fv(uDrop, drops);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf && !reduce) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full bg-[linear-gradient(180deg,#fff_0%,#e4eefc_45%,#c5daf7_100%)]"
    />
  );
}

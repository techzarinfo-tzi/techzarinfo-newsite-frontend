import { isLowPower } from "@/components/ai/frameFilm";

// "Touch" transition between the AI page's two films (after the Shopify Editions "Renaissance" hand-
// over, where two figures touch and a portal of light opens): drawn by WebGL on a transparent canvas
// over the pinned train scene, driven by one progress value t (0..1, from the scroll).
//
//   0.00-0.24  two glowing fingertips of light reach in from either side, trailing glitter, and
//              meet at the touch point (the moon in the carriage's door window)
//   0.22-0.32  touch: a flash, and a bright orb of light ignites
//   0.26-1.00  the orb opens into a portal, accelerating until it fills the screen. Its rim is a
//              ragged ring of white light and glitter; just inside it, starry space; deeper inside,
//              the island scene emerging (it settles from a slight zoom to rest). Outside, the
//              carriage dissolves: it darkens and its edges turn to sparkling white line-art.
//
// At t = 1 the canvas shows exactly the island's first frame, framed like the film canvas, so the
// film takes over seamlessly. The canvas is premultiplied-alpha: where it is transparent the real
// train stage (with its cards) shows through; lights are added on top.

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5); // y down, like the page
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uA;      // the train's last frame
uniform sampler2D uB;      // the island's first frame
uniform vec2 uRes;         // canvas px
uniform float uAspA;
uniform float uAspB;
uniform vec2 uTouch;       // touch point in A's image uv
uniform float uT;
uniform float uTime;

const vec3 BG = vec3(0.008, 0.02, 0.051);

// Image uv for a screen uv, image drawn to cover the screen, centred
vec2 coverScale(float asp) {
  float s = uRes.x / uRes.y;
  return s > asp ? vec2(1.0, asp / s) : vec2(s / asp, 1.0);
}
vec2 cover(vec2 uv, float asp) { return (uv - 0.5) * coverScale(asp) + 0.5; }

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}
// Sparse twinkling points on a grid of 'cell' px
float sparkle(vec2 px, float cell, float density, float speed) {
  vec2 c = floor(px / cell);
  float h = hash(c);
  if (h > density) return 0.0;
  vec2 p = (c + 0.25 + 0.5 * vec2(hash(c + 3.1), hash(c + 7.7))) * cell;
  float d = length(px - p);
  float tw = 0.5 + 0.5 * sin(uTime * speed * (1.0 + h * 4.0) + h * 40.0);
  return exp(-d * d / (cell * cell * 0.012)) * tw;
}
float lum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

// A fingertip of light, its trail behind it
vec3 fingertip(vec2 px, vec2 from, vec2 to, float bend, float a, float r) {
  vec3 col = vec3(0.0);
  for (int i = 0; i < 16; i++) {
    float fi = float(i);
    float ai = clamp(a - fi * 0.012, 0.0, 1.0);
    float e = 1.0 - pow(1.0 - ai, 3.0);
    vec2 p = mix(from, to, e) + vec2(0.0, -bend * sin(3.14159 * e));
    float d = length(px - p);
    float k = 1.0 - fi / 16.0;            // the trail tapers and fades behind the tip
    float ri = r * (0.35 + 0.65 * k);
    float w = i == 0 ? 1.0 : 0.22 * k;
    col += w * (exp(-d * d / (ri * ri)) * vec3(1.0, 0.97, 0.92) + 0.45 * exp(-d / (ri * 5.0)) * vec3(0.55, 0.75, 1.0));
  }
  return col;
}

void main() {
  vec2 px = vUv * uRes;
  float m = min(uRes.x, uRes.y);
  vec2 sA = coverScale(uAspA);
  vec2 cUv = (uTouch - 0.5) / sA + 0.5;   // touch point, screen uv
  vec2 C = cUv * uRes;
  vec2 dv = px - C;
  float dist = length(dv);

  // ---- reach & touch ----
  float a = smoothstep(0.0, 0.24, uT);
  float touched = smoothstep(0.215, 0.245, uT);
  float tipFade = 1.0 - smoothstep(0.24, 0.3, uT);
  vec3 light = vec3(0.0);
  if (tipFade > 0.0) {
    float r = 0.016 * m;
    light += tipFade * fingertip(px, C + vec2(-0.62 * uRes.x, 0.2 * uRes.y), C - vec2(0.01 * m, 0.0), 0.1 * uRes.y, a, r);
    light += tipFade * fingertip(px, C + vec2(0.62 * uRes.x, 0.14 * uRes.y), C + vec2(0.01 * m, 0.0), 0.08 * uRes.y, a, r);
    // glitter shed along the way
    light += tipFade * a * sparkle(px, 16.0, 0.08, 6.0) * exp(-abs(dv.y + 0.05 * uRes.y * (1.0 - a)) / (0.08 * uRes.y)) * vec3(0.9, 0.95, 1.0) * 0.8;
  }
  float since = max(uT - 0.235, 0.0);
  float flash = touched * exp(-since * 16.0);
  light += flash * (exp(-dist * dist / pow(0.12 * m, 2.0)) * 1.6 + 0.18) * vec3(0.92, 0.96, 1.0);

  // ---- portal ----
  float e = clamp((uT - 0.26) / 0.74, 0.0, 1.0);
  float maxD = length(max(C, uRes - C));
  float orb = 0.035 * m * smoothstep(0.22, 0.3, uT);
  float R = orb + maxD * 1.2 * pow(e, 1.7);
  float ang = atan(dv.y, dv.x);
  float ragged = fbm(vec2(ang * 2.5 + 10.0, uTime * 0.35)) - 0.5;
  ragged += 0.35 * (fbm(vec2(ang * 9.0, uTime * 0.8 + 4.0)) - 0.5);
  float Re = R * (1.0 + 0.16 * ragged);
  float d = dist - Re;                     // < 0 inside
  float rimW = 2.0 + 0.006 * m + 0.03 * R;

  // inside: island emerging out of starry space
  float zoom = mix(1.3, 1.0, smoothstep(0.0, 1.0, e));
  vec2 uvB = cover((vUv - cUv) / zoom + cUv, uAspB);
  vec3 colB = texture2D(uB, uvB).rgb;
  float W = max(0.3 * Re, 6.0);
  float spaceAmt = smoothstep(-W, -0.1 * W, d);
  vec3 space = BG * 1.4 + vec3(0.85, 0.9, 1.0) * (sparkle(px, 7.0, 0.3, 4.0) * 1.2 + sparkle(px + 31.0, 23.0, 0.25, 2.0) * 1.5);
  space += vec3(0.25, 0.3, 0.55) * fbm(px / (0.15 * m) + uTime * 0.05) * 0.35;
  vec3 inside = mix(colB, space, spaceAmt);
  inside = mix(inside, colB, smoothstep(0.85, 1.0, e)); // at the very end, only the island

  // rim: ring of light and glitter
  float rim = exp(-abs(d) / rimW) * smoothstep(0.2, 0.3, uT);
  float rimGlitter = sparkle(px, 6.0, 0.55, 9.0) * exp(-abs(d) / (rimW * 6.0)) * 2.2;
  vec3 rimLight = vec3(0.95, 0.97, 1.0) * (rim * 1.6 + rimGlitter) + vec3(0.5, 0.7, 1.0) * exp(-max(d, 0.0) / (0.05 * m)) * 0.35 * smoothstep(0.24, 0.3, uT);
  rimLight *= 1.0 - smoothstep(0.92, 1.0, e);

  // outside: the carriage dissolving into sparkling line-art
  vec2 uvA = cover(vUv, uAspA);
  vec2 tx = sA / uRes * 1.5;
  float gx = lum(texture2D(uA, uvA + vec2(tx.x, 0.0)).rgb) - lum(texture2D(uA, uvA - vec2(tx.x, 0.0)).rgb);
  float gy = lum(texture2D(uA, uvA + vec2(0.0, tx.y)).rgb) - lum(texture2D(uA, uvA - vec2(0.0, tx.y)).rgb);
  float edge = smoothstep(0.03, 0.22, length(vec2(gx, gy)));
  float near = exp(-max(d, 0.0) / (0.35 * m));
  float o = smoothstep(0.26, 0.55, uT) * (0.45 + 0.55 * near);
  float tw = 0.45 + 0.9 * sparkle(px, 3.0, 0.6, 7.0) + 0.3 * noise(px * 0.15 + uTime * 3.0);
  vec3 lineArt = vec3(0.92, 0.95, 1.0) * edge * tw * o * 0.9;
  float dark = 0.85 * o;

  // compose (premultiplied): outside is a dark veil plus added light over the real page
  float inMask = 1.0 - smoothstep(-1.5, 1.5, d);
  vec3 outCol = BG * dark + lineArt;
  vec3 col = mix(outCol, inside, inMask) + rimLight + light;
  float alpha = mix(dark, 1.0, inMask);
  gl_FragColor = vec4(col, alpha);
}`;

export function createTouchPortal({ canvas, srcA, srcB, touch }) {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!gl) return null;

  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
    return s;
  };
  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || "link");
  } catch (err) {
    console.error("Touch portal unavailable:", err);
    return null;
  }
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = (n) => gl.getUniformLocation(program, n);
  const loc = {
    res: u("uRes"), aspA: u("uAspA"), aspB: u("uAspB"), touch: u("uTouch"), t: u("uT"), time: u("uTime"),
  };
  gl.uniform1i(u("uA"), 0);
  gl.uniform1i(u("uB"), 1);
  gl.uniform2f(loc.touch, touch[0], touch[1]);

  const textures = [gl.createTexture(), gl.createTexture()];
  let ready = 0;
  [srcA, srcB].forEach((src, i) => {
    const img = new window.Image();
    img.decoding = "async";
    img.src = src;
    img
      .decode()
      .then(() => {
        if (gl.isContextLost()) return;
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, textures[i]);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
        gl.uniform1f(i ? loc.aspB : loc.aspA, img.naturalWidth / img.naturalHeight);
        ready++;
      })
      .catch(() => {});
  });

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, isLowPower() ? 1 : 1.5); // phones: lighter
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };

  return {
    get ready() {
      return ready === 2 && !gl.isContextLost();
    },
    resize,
    render(t, time) {
      if (ready < 2 || gl.isContextLost()) return;
      gl.uniform2f(loc.res, canvas.width, canvas.height);
      gl.uniform1f(loc.t, t);
      gl.uniform1f(loc.time, time);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    clear() {
      if (gl.isContextLost()) return;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    },
    destroy() {
      if (gl.isContextLost()) return;
      textures.forEach((t) => gl.deleteTexture(t));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}

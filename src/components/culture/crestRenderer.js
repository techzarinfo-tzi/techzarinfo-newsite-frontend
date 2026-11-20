// WebGL renderer for the Culture page gallery (CultureGallery.js).
//
// World units are CSS pixels, centred on the screen with y up. Every photo is a finely divided
// sheet: its vertices sit at their place in the rising stream, then are lifted by a hidden arch,
// the upper half of an ellipse whose centre is below the screen, so it sweeps up from the lower
// corners to near the top. Seen in perspective, the lifted part of a sheet grows and bends
// towards you; the shading follows the slope of the arch (light from the upper left), and a
// second pass draws each sheet's shadow on the background, cast down-right and blurring and
// fading as the sheet rises. The sheet's centre is held where it would lie flat, so the photos
// bend in place instead of drifting sideways.
//
// The section (track) is made exactly as tall as the stream needs; while it scrolls past, the
// stage is pinned and the scroll offset (smoothed for inertia) moves the stream up. Fast scrolling
// raises the arch a little ("swell"), settling back as the scroll slows.
//
// Returns null when WebGL isn't available, so the caller keeps its plain grid.

// Look and layout (the reference design's values)
const SLANT = (8 * Math.PI) / 180; // the stream leans left as it rises
const IMAGE_SIZE = 0.7; // photo width relative to its column (wide screens)
const NARROW_IMAGE_SIZE = 0.72; // one column (phones): most of the width, clear of the edges as the stream leans
const CREST_HEIGHT = 0.5;
const CREST_WIDTH = 0.45;
const SWELL = 0.5;
const LIGHT = 0.6;
const SHADOW = 0.6;
const RADIUS = 0.02; // corner radius, relative to photo width
const INERTIA = 0.5;
const DEFAULT_ASPECT = 4 / 5; // until a photo's real shape is known
const GRID = 28; // sheet subdivisions per side
const START_FILL = 0.38; // where the first photos sit when the section reaches the top (of the screen height)
const MAX_DPR = 2;

const COMMON = /* glsl */ `
uniform vec2 uHalf;      // half the screen, px
uniform vec2 uCenter;    // sheet centre, px
uniform vec2 uSize;      // sheet size, px
uniform vec2 uRot;       // cos, sin of the slant
uniform vec4 uArch;      // arch ellipse: centre xy, radii xy (px)
uniform vec2 uLift;      // arch height, half width of its band (px)
uniform float uDist;     // camera distance (px)

// Height of the arch under point p: a band along the ellipse, upper half only
float archHeight(vec2 p) {
  vec2 q = (p - uArch.xy) / uArch.zw;
  float off = (length(q) - 1.0) * min(uArch.z, uArch.w);
  float t = off / uLift.y;
  return uLift.x * exp(-t * t) * smoothstep(-0.35, 0.05, q.y);
}

vec2 turn(vec2 v) {
  return vec2(uRot.x * v.x - uRot.y * v.y, uRot.y * v.x + uRot.x * v.y);
}

// Keeps the sheet centre on screen where it would be flat (perspective would push it outwards)
vec2 hold() {
  return -uCenter * archHeight(uCenter) / uDist;
}
`;

const SHEET_VERT = /* glsl */ `
attribute vec2 aPos; // 0..1 across the sheet, origin bottom left
${COMMON}
uniform float uLight;
varying vec2 vUv;
varying float vShade;

void main() {
  vUv = aPos;
  vec2 p = uCenter + turn((aPos - 0.5) * uSize);
  float z = archHeight(p);

  // Slope of the arch here, for the shading
  const float e = 2.0;
  float dx = archHeight(p + vec2(e, 0.0)) - archHeight(p - vec2(e, 0.0));
  float dy = archHeight(p + vec2(0.0, e)) - archHeight(p - vec2(0.0, e));
  vec3 n = normalize(vec3(-dx / (2.0 * e), -dy / (2.0 * e), 1.0));
  vec3 l = normalize(vec3(-0.45, 0.6, 0.65));
  float facing = dot(n, l) - l.z;                       // 0 when flat
  float gloss = pow(max(dot(n, normalize(l + vec3(0.0, 0.0, 1.0))), 0.0), 48.0);
  float flatGloss = pow(normalize(l + vec3(0.0, 0.0, 1.0)).z, 48.0);
  vShade = 1.0 + (facing * 1.4 + max(gloss - flatGloss, 0.0) * 0.5) * uLight;

  vec2 screen = p + hold();
  gl_Position = vec4(screen / uHalf, 0.0, (uDist - z) / uDist);
}
`;

const SHEET_FRAG = /* glsl */ `
precision mediump float;
uniform sampler2D uTex;
uniform vec4 uUv;          // cover crop: scale xy, offset zw
uniform vec2 uSizeF;       // sheet size, px
uniform float uRadiusPx;
uniform float uLoaded;     // 0 placeholder .. 1 photo
uniform vec3 uBg;
varying vec2 vUv;
varying float vShade;

void main() {
  vec2 p = (vUv - 0.5) * uSizeF;
  vec2 q = abs(p) - (uSizeF * 0.5 - uRadiusPx);
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadiusPx;
  float mask = 1.0 - smoothstep(-0.75, 0.75, d);
  vec3 photo = texture2D(uTex, vUv * uUv.xy + uUv.zw).rgb;
  vec3 placeholder = mix(uBg, vec3(0.5), 0.12);
  vec3 color = mix(placeholder, photo, uLoaded) * vShade;
  gl_FragColor = vec4(color * mask, mask); // premultiplied
}
`;

const SHADOW_VERT = /* glsl */ `
attribute vec2 aPos;
${COMMON}
uniform float uMargin; // px the quad reaches past the sheet, room for the blur
varying vec2 vLocal;
varying float vHeight;

void main() {
  vLocal = (aPos - 0.5) * (uSize + 2.0 * uMargin);
  vec2 edge = clamp(vLocal, -uSize * 0.5, uSize * 0.5);
  vec2 onSheet = uCenter + turn(edge);
  float h = archHeight(onSheet);
  vHeight = h;
  // Cast down and to the right, away from the light, further the higher the sheet
  vec2 fall = vec2(0.6, -0.8) * 0.5 * h;
  vec2 screen = onSheet + turn(vLocal - edge) + fall + hold();
  gl_Position = vec4(screen / uHalf, 0.0, 1.0);
}
`;

const SHADOW_FRAG = /* glsl */ `
precision mediump float;
uniform vec2 uSizeF;
uniform float uRadiusPx;
uniform float uStrength;
uniform float uLoaded;
varying vec2 vLocal;
varying float vHeight;

void main() {
  float soft = 2.0 + vHeight * 0.4;
  vec2 q = abs(vLocal) - (uSizeF * 0.5 - uRadiusPx);
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadiusPx;
  float cover = 1.0 - smoothstep(-soft, soft, d);
  float dark = mix(0.11, 0.3, smoothstep(0.0, 14.0, vHeight)) / (1.0 + vHeight * 0.012);
  gl_FragColor = vec4(0.0, 0.0, 0.0, cover * dark * uStrength * uLoaded);
}
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(log || "shader compile failed");
  }
  return shader;
}

function program(gl, vert, frag) {
  const p = gl.createProgram();
  const vs = compile(gl, gl.VERTEX_SHADER, vert);
  const fs = compile(gl, gl.FRAGMENT_SHADER, frag);
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.bindAttribLocation(p, 0, "aPos");
  gl.linkProgram(p);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || "link failed");
  const uniforms = {};
  const count = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const { name } = gl.getActiveUniform(p, i);
    uniforms[name] = gl.getUniformLocation(p, name);
  }
  return { p, u: uniforms };
}

// A GRID x GRID sheet of triangles over 0..1
function sheetMesh(gl) {
  const verts = new Float32Array((GRID + 1) * (GRID + 1) * 2);
  let k = 0;
  for (let y = 0; y <= GRID; y++) {
    for (let x = 0; x <= GRID; x++) {
      verts[k++] = x / GRID;
      verts[k++] = y / GRID;
    }
  }
  const idx = new Uint16Array(GRID * GRID * 6);
  k = 0;
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const a = y * (GRID + 1) + x;
      const b = a + 1;
      const c = a + GRID + 1;
      const d = c + 1;
      idx.set([a, b, c, b, d, c], k);
      k += 6;
    }
  }
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
  const ibo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
  return { vbo, ibo, count: idx.length };
}

const hexToRgb = (hex) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

// Small deterministic jitter, so the columns don't line up row by row
const jitter = (i) => {
  const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
};

export function createCrestRenderer({ canvas, track, stage, photos, background }) {
  let gl;
  try {
    gl = canvas.getContext("webgl", { alpha: false, antialias: true, depth: false, stencil: false, premultipliedAlpha: true });
  } catch {
    gl = null;
  }
  if (!gl) return null;

  let sheet, shadow, mesh;
  try {
    sheet = program(gl, SHEET_VERT, SHEET_FRAG);
    shadow = program(gl, SHADOW_VERT, SHADOW_FRAG);
    mesh = sheetMesh(gl);
  } catch {
    return null;
  }

  const bg = hexToRgb(background);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

  // A 1x1 texture for sheets whose photo isn't in yet
  const blank = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, blank);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([128, 128, 128, 255]));

  let destroyed = false;
  let W = 0;
  let H = 0;
  let layout = { items: [], length: 0, imageW: 0 };
  let pinLength = 0;
  let target = 0; // scroll offset into the pinned stream (px)
  let current = 0;
  let velocity = 0;
  let swell = 0;
  let raf = 0;
  let lastTime = 0;

  // Photos: their textures load independently; each fades in once ready
  const items = photos.map((photo) => ({ photo, aspect: DEFAULT_ASPECT, tex: null, loaded: 0, ready: false, img: null }));

  const uploadTexture = (item) => {
    const img = item.img;
    // Draw into a canvas at about the size it is shown (sharper than sampling a huge photo)
    const want = Math.min(img.naturalWidth, Math.ceil((layout.imageW || 600) * Math.min(MAX_DPR, window.devicePixelRatio || 1) * 1.5));
    const scale = want / img.naturalWidth;
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(img.naturalWidth * scale));
    c.height = Math.max(1, Math.round(img.naturalHeight * scale));
    const ctx = c.getContext("2d");
    // Transparent areas (PNG, WEBP) show white, like a printed photo, instead of black
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, c.width, c.height);
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    try {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
    } catch {
      // A photo we may not read (cross-origin without CORS): it keeps its placeholder
      gl.deleteTexture(tex);
      return;
    }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (item.tex) gl.deleteTexture(item.tex);
    item.tex = tex;
    item.ready = true;
  };

  const loads = items.map(
    (item) =>
      new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.decoding = "async";
        img.onload = () => {
          if (destroyed) return resolve();
          item.img = img;
          item.aspect = img.naturalWidth / img.naturalHeight || DEFAULT_ASPECT;
          resolve();
        };
        img.onerror = () => resolve();
        img.src = item.photo.src;
      })
  );

  // Masonry in columns, in stream coordinates (x from the centre, y downwards from the stream top)
  const buildLayout = () => {
    const portraitPhone = W < 640;
    const cols = portraitPhone ? 1 : W < 1024 ? 2 : 3;
    const span = Math.min(W, 1440) * (portraitPhone ? 1 : 0.94);
    const colW = span / cols;
    const imageW = colW * (cols === 1 ? NARROW_IMAGE_SIZE : IMAGE_SIZE);
    const gap = imageW * (cols === 1 ? 0.28 : 0.34);
    // Each column starts a little lower than its neighbour, so rows never line up
    const starts = [0.42, 0, 0.7, 0.2, 0.55].slice(0, cols).map((f) => f * imageW);
    const heights = [...starts];
    const placed = items.map((item, i) => {
      let c = 0;
      for (let k = 1; k < cols; k++) if (heights[k] < heights[c] - 1) c = k;
      const w = imageW;
      const h = w / item.aspect;
      const nudge = cols === 1 ? 0 : (jitter(i) - 0.5) * colW * 0.12;
      const x = (c - (cols - 1) / 2) * colW + nudge;
      const y = heights[c] + h / 2;
      heights[c] += h + gap * (0.85 + jitter(i + 7) * 0.3);
      return { item, x, y, w, h };
    });
    layout = { items: placed, length: Math.max(...heights), imageW };
  };

  const size = () => {
    const rect = stage.getBoundingClientRect();
    W = rect.width || window.innerWidth;
    H = rect.height || window.innerHeight;
    const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    buildLayout();
    // Pinned while the whole stream rises from START_FILL down the screen to above the top
    pinLength = Math.max(H, layout.length + H * START_FILL + H * 0.1);
    track.style.height = `${pinLength + H}px`;
  };

  const readScroll = () => {
    const top = track.getBoundingClientRect().top;
    target = Math.min(pinLength, Math.max(0, -top));
  };

  const draw = () => {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(bg[0], bg[1], bg[2], 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const dist = H * 1.2;
    const lift = CREST_HEIGHT * 0.26 * H * (1 + swell * SWELL * 1.6);
    const band = Math.max(80, CREST_WIDTH * 0.42 * H);
    const arch = [0, -H * 0.62, Math.max(W * 0.62, H * 0.5), H * 1.02];
    const cos = Math.cos(SLANT);
    const sin = Math.sin(SLANT);
    const offset = H * (0.5 - START_FILL) + current; // stream y at the screen centre line

    // Sheets on screen (with room for bending and shadows)
    const visible = [];
    for (const p of layout.items) {
      // Stream point -> screen (centred, y up), leaning with the slant as it rises
      const sx = p.x;
      const sy = offset - p.y;
      const x = sx * cos - sy * sin;
      const y = sx * sin + sy * cos;
      const reach = Math.max(p.w, p.h) * 0.75 + 60;
      if (y - reach > H / 2 || y + reach < -H / 2) continue;
      visible.push({ p, x, y });
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.ibo);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const setCommon = (u, v) => {
      gl.uniform2f(u.uHalf, W / 2, H / 2);
      gl.uniform2f(u.uCenter, v.x, v.y);
      gl.uniform2f(u.uSize, v.p.w, v.p.h);
      gl.uniform2f(u.uRot, cos, sin);
      gl.uniform4f(u.uArch, arch[0], arch[1], arch[2], arch[3]);
      gl.uniform2f(u.uLift, lift, band);
      gl.uniform1f(u.uDist, dist);
    };

    // Shadows first, all of them, so no sheet is darkened by a neighbour's shadow drawn later
    gl.useProgram(shadow.p);
    for (const v of visible) {
      const u = shadow.u;
      setCommon(u, v);
      gl.uniform1f(u.uMargin, 40 + lift * 0.4);
      gl.uniform2f(u.uSizeF, v.p.w, v.p.h);
      gl.uniform1f(u.uRadiusPx, RADIUS * v.p.w);
      gl.uniform1f(u.uStrength, SHADOW);
      gl.uniform1f(u.uLoaded, 0.35 + 0.65 * v.p.item.loaded);
      gl.drawElements(gl.TRIANGLES, mesh.count, gl.UNSIGNED_SHORT, 0);
    }

    gl.useProgram(sheet.p);
    for (const v of visible) {
      const u = sheet.u;
      const item = v.p.item;
      setCommon(u, v);
      gl.uniform1f(u.uLight, LIGHT);
      gl.uniform2f(u.uSizeF, v.p.w, v.p.h);
      gl.uniform1f(u.uRadiusPx, RADIUS * v.p.w);
      gl.uniform1f(u.uLoaded, item.loaded);
      gl.uniform3f(u.uBg, bg[0], bg[1], bg[2]);
      // Cover crop, in case the sheet's shape was set before the photo's real shape was known
      const sheetAspect = v.p.w / v.p.h;
      const a = item.aspect;
      if (a > sheetAspect) gl.uniform4f(u.uUv, sheetAspect / a, 1, (1 - sheetAspect / a) / 2, 0);
      else gl.uniform4f(u.uUv, 1, a / sheetAspect, 0, (1 - a / sheetAspect) / 2);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, item.tex || blank);
      gl.uniform1i(u.uTex, 0);
      gl.drawElements(gl.TRIANGLES, mesh.count, gl.UNSIGNED_SHORT, 0);
    }
  };

  const frame = (now) => {
    raf = 0;
    if (destroyed) return;
    const dt = lastTime ? Math.min(0.05, (now - lastTime) / 1000) : 1 / 60;
    lastTime = now;

    readScroll();
    // Inertia: ease towards the scroll position
    const ease = 1 - Math.exp(-dt * (4 + (1 - INERTIA) * 16));
    const before = current;
    current += (target - current) * ease;
    if (Math.abs(target - current) < 0.05) current = target;
    velocity = (current - before) / dt;
    // Swell follows the speed, settling back as it slows
    const wantSwell = Math.min(1, Math.abs(velocity) / (H * 2.2));
    swell += (wantSwell - swell) * (1 - Math.exp(-dt * (wantSwell > swell ? 6 : 2.5)));

    let fading = false;
    for (const item of items) {
      if (item.ready && item.loaded < 1) {
        item.loaded = Math.min(1, item.loaded + dt * 2.5);
        fading = true;
      }
    }

    draw();

    const moving = current !== target || swell > 0.002 || fading;
    if (moving && onScreen) raf = requestAnimationFrame(frame);
    else lastTime = 0;
  };

  let onScreen = true;
  const kick = () => {
    if (!raf && !destroyed && onScreen) raf = requestAnimationFrame(frame);
  };

  size();
  readScroll();
  current = target;
  kick();

  // Once every photo has loaded (or after a short wait), lay out with their real shapes
  let settled = false;
  const settle = () => {
    if (settled || destroyed) return;
    settled = true;
    size();
    for (const item of items) if (item.img && !item.ready) uploadTexture(item);
    kick();
  };
  Promise.allSettled(loads).then(settle);
  const settleTimer = setTimeout(settle, 2500);
  // Photos that arrive after the layout was fixed still get their texture (cover-cropped)
  loads.forEach((p, i) =>
    p.then(() => {
      if (settled && items[i].img && !items[i].ready && !destroyed) {
        uploadTexture(items[i]);
        kick();
      }
    })
  );

  const io = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    kick();
  });
  io.observe(track);
  const ro = new ResizeObserver(() => {
    size();
    readScroll();
    kick();
  });
  ro.observe(stage);
  window.addEventListener("scroll", kick, { passive: true });

  const onLost = (e) => {
    e.preventDefault();
    destroyed = true;
  };
  canvas.addEventListener("webglcontextlost", onLost);

  return {
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      clearTimeout(settleTimer);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", kick);
      canvas.removeEventListener("webglcontextlost", onLost);
      track.style.height = "";
      if (!gl.isContextLost()) {
        for (const item of items) if (item.tex) gl.deleteTexture(item.tex);
        gl.deleteTexture(blank);
        gl.deleteBuffer(mesh.vbo);
        gl.deleteBuffer(mesh.ibo);
        gl.deleteProgram(sheet.p);
        gl.deleteProgram(shadow.p);
      }
    },
  };
}

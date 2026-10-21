// "Disintegrate into dust" effect for a single element (the navbar Services
// menu). A dissolve map gives every pixel the moment it breaks away: mostly
// its height (the element erodes top to bottom) plus fractal noise for a
// ragged front and per-pixel grain so the edge crumbles like sand. The map is
// thresholded into alpha-mask frames, packed into one sprite-sheet PNG that the
// element's mask steps across, while particles are released along the
// eroding edge and drift up.

const FRAME_COUNT = 40;
const PIXEL_BUDGET = 90_000; // per mask frame
const GRAIN_PX = 2.5; // target size of one mask pixel on screen
// Wider than one frame step, so neighbouring frames blend into a soft fade
// instead of the edge visibly ticking from frame to frame.
const EDGE_SOFTNESS = 0.035;

// Brand blues, weighted towards the tones the menu is drawn in.
const DUST_COLORS = ["10,80,165", "11,87,183", "91,143,214", "91,143,214", "140,185,235", "140,185,235", "0,36,97"];

const cache = new Map(); // slot -> { key, w, h, sheet, samples, users, stale }
const pending = new Map(); // slot -> { key, promise }

function hash(x, y) {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function valueNoise(x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const top = hash(xi, yi) + (hash(xi + 1, yi) - hash(xi, yi)) * u;
  const bottom = hash(xi, yi + 1) + (hash(xi + 1, yi + 1) - hash(xi, yi + 1)) * u;
  return top + (bottom - top) * v;
}

function fbm(x, y) {
  let sum = 0;
  let amp = 1;
  let norm = 0;
  for (let o = 0; o < 4; o++) {
    sum += valueNoise(x, y) * amp;
    norm += amp;
    amp *= 0.5;
    x *= 2.03;
    y *= 2.03;
  }
  return sum / norm;
}

function buildMap(w, h) {
  const map = new Float32Array(w * h);
  const freq = 6 / Math.max(w, h); // a handful of noise cells across, square on any aspect
  const offsetX = Math.random() * 1000;
  const offsetY = Math.random() * 1000;
  let min = Infinity;
  let max = -Infinity;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const d =
        0.55 * (y / h) +
        0.3 * fbm(x * freq + offsetX, y * freq + offsetY) +
        0.15 * Math.random();
      map[y * w + x] = d;
      if (d < min) min = d;
      if (d > max) max = d;
    }
  }

  const range = max - min || 1;
  for (let i = 0; i < map.length; i++) map[i] = (map[i] - min) / range;
  return map;
}

// Threshold for frame k: frame 0 is intact, the last frame is fully gone.
const frameThreshold = (k) => -EDGE_SOFTNESS + (k / (FRAME_COUNT - 1)) * (1 + 2 * EDGE_SOFTNESS);

// All frames go into ONE sprite sheet, a grid of cells, and the dissolve only
// moves the mask's position across it. Swapping the mask to a separate image
// per frame made the browser re-resolve a new image every step, and for a frame
// at a time the mask had nothing loaded and the whole menu blinked out.
// Each cell has a 1px border repeating its frame's edge pixels, so filtering
// never bleeds a neighbouring frame into the element's edges.
const SHEET_COLS = 8;
const SHEET_ROWS = Math.ceil(FRAME_COUNT / SHEET_COLS);

async function encodeSheet(map, w, h) {
  const cw = w + 2;
  const ch = h + 2;
  const canvas = document.createElement("canvas");
  canvas.width = cw * SHEET_COLS;
  canvas.height = ch * SHEET_ROWS;
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(canvas.width, canvas.height);
  const px = image.data;

  for (let k = 0; k < FRAME_COUNT; k++) {
    const t = frameThreshold(k);
    const ox = (k % SHEET_COLS) * cw;
    const oy = Math.floor(k / SHEET_COLS) * ch;
    for (let cy = 0; cy < ch; cy++) {
      const row = Math.min(h - 1, Math.max(0, cy - 1)) * w;
      let o = ((oy + cy) * canvas.width + ox) * 4 + 3;
      for (let cx = 0; cx < cw; cx++, o += 4) {
        const a = (map[row + Math.min(w - 1, Math.max(0, cx - 1))] - t) / EDGE_SOFTNESS;
        px[o] = a <= 0 ? 0 : a >= 1 ? 255 : a * 255;
      }
    }
  }

  ctx.putImageData(image, 0, 0);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.src = url;
  await img.decode().catch(() => {});
  return { url, img, cw, ch };
}

// A decoded <img> isn't enough: the first time an element uses the sheet as a
// CSS mask, the browser still resolves it as a style image, and until then the
// mask is empty and the menu vanishes for a few frames. A 1px, practically
// invisible element wearing the sheet as its mask gets that done in advance.
const warmers = new Map(); // slot -> element

function warmUp(slot, url) {
  let el = warmers.get(slot);
  if (!el) {
    el = document.createElement("div");
    el.setAttribute("aria-hidden", "true");
    Object.assign(el.style, {
      position: "fixed",
      left: "0",
      top: "0",
      width: "1px",
      height: "1px",
      pointerEvents: "none",
      background: "rgba(0, 0, 0, 0.004)",
    });
    document.body.appendChild(el);
    warmers.set(slot, el);
  }
  el.style.webkitMaskImage = el.style.maskImage = `url("${url}")`;
}

// Dust release points as normalised [x, y, d] triplets, sorted by d.
function buildSamples(map, w, h, count) {
  const samples = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * w);
    const y = Math.floor(Math.random() * h);
    samples.push([(x + Math.random()) / w, (y + Math.random()) / h, map[y * w + x]]);
  }
  return samples.sort((a, b) => a[2] - b[2]);
}

function gridFor(width, height) {
  let w = Math.max(32, Math.round(width / GRAIN_PX));
  let h = Math.max(32, Math.round(height / GRAIN_PX));
  const scale = Math.min(1, Math.sqrt(PIXEL_BUDGET / (w * h)));
  w = Math.round(w * scale);
  h = Math.round(h * scale);
  return { w, h };
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Builds (or reuses) the mask frames for an element of this size. `slot`
// keeps separate caches per element (e.g. desktop panel vs mobile menu).
// Call it ahead of time, e.g. when the menu opens.
export function prepareDissolve(slot, width, height) {
  if (!width || !height || prefersReducedMotion()) return Promise.resolve(null);
  const { w, h } = gridFor(width, height);
  const key = `${w}x${h}`;
  const cached = cache.get(slot);
  if (cached?.key === key) return Promise.resolve(cached);
  const inFlight = pending.get(slot);
  if (inFlight?.key === key) return inFlight.promise;

  const promise = (async () => {
    const map = buildMap(w, h);
    const sheet = await encodeSheet(map, w, h);
    const count = Math.round(Math.min(4000, Math.max(800, (width * height) / 120)));
    const entry = { key, w, h, sheet, samples: buildSamples(map, w, h, count), users: 0, stale: false };
    warmUp(slot, sheet.url);
    retire(cache.get(slot));
    cache.set(slot, entry);
    return entry;
  })().catch(() => null);

  pending.set(slot, { key, promise });
  promise.finally(() => {
    if (pending.get(slot)?.promise === promise) pending.delete(slot);
  });
  return promise;
}

// A replaced sheet is freed only once no dissolve is still drawing with it;
// revoking it mid-dissolve would blank the mask, and the element with it.
function retire(entry) {
  if (!entry) return;
  entry.stale = true;
  if (entry.users === 0) URL.revokeObjectURL(entry.sheet.url);
}

// Frames already built for this slot (any size; the mask stretches to fit).
export const getDissolve = (slot) => cache.get(slot) ?? null;

// Per element: the sheet its mask is wearing, the frame on show, and the
// cancel() of whichever dissolve or re-form is animating it. One state per
// element means a dissolve and a re-form can hand over mid-way from the exact
// frame on screen, instead of restarting and jumping.
const masks = new WeakMap();

function attachMask(el, assets) {
  const { sheet, w, h } = assets;
  assets.users++;
  // Scale the sheet so one cell's inner w x h lands exactly on the element's
  // border box (offset sizes ignore any transform, like the mask does).
  const sx = el.offsetWidth / w;
  const sy = el.offsetHeight / h;
  const s = el.style;
  const state = {
    assets,
    frame: 0,
    cancel: null,
    released: false,
    show(k) {
      state.frame = k;
      const x = -((k % SHEET_COLS) * sheet.cw + 1) * sx;
      const y = -(Math.floor(k / SHEET_COLS) * sheet.ch + 1) * sy;
      s.webkitMaskPosition = s.maskPosition = `${x}px ${y}px`;
    },
  };
  s.webkitMaskRepeat = s.maskRepeat = "no-repeat";
  s.webkitMaskSize = s.maskSize = `${sheet.cw * SHEET_COLS * sx}px ${sheet.ch * SHEET_ROWS * sy}px`;
  // Frame 0 is fully opaque, so applying the mask changes nothing on screen.
  state.show(0);
  s.webkitMaskImage = s.maskImage = `url("${sheet.url}")`;
  masks.set(el, state);
  return state;
}

// Lets go of the sheet (it may be freed once replaced) without touching the mask.
function release(state) {
  if (state.released) return;
  state.released = true;
  state.assets.users--;
  if (state.assets.stale && state.assets.users === 0) URL.revokeObjectURL(state.assets.sheet.url);
}

// Removes the mask, stopping any dissolve or re-form still playing on `el`
// (its promise resolves straight away). Dust already released keeps drifting off.
export function clearDissolveMask(el) {
  if (!el) return;
  const state = masks.get(el);
  state?.cancel?.();
  const s = el.style;
  s.webkitMaskImage = s.maskImage = "";
  s.webkitMaskSize = s.maskSize = "";
  s.webkitMaskRepeat = s.maskRepeat = "";
  s.webkitMaskPosition = s.maskPosition = "";
  if (state) {
    release(state);
    masks.delete(el);
  }
}

// Half linear, half ease-in-out sine: crumbling is visible from the first
// moments (a pure sine barely moves for half a second, which reads as the
// menu ignoring you) yet still eases gently into the final grains.
const dissolveEase = (p) => 0.5 * p + 0.25 * (1 - Math.cos(Math.PI * p));

// Inverse of dissolveEase (it is monotonic), by bisection.
function dissolveEaseInverse(e) {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (dissolveEase(mid) < e) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
const smoothstep = (x) => x * x * (3 - 2 * x);

const FADE_IN = 0.15; // seconds a grain takes to appear, so none pop in

// One particle system per full-viewport canvas, shared by every dissolve drawn
// on it, so overlapping dissolves never fight over clearing or hiding it. The
// loop stops once no dissolve is emitting and all dust has faded.
const dustSystems = new WeakMap();

function getDust(canvas) {
  const existing = dustSystems.get(canvas);
  if (existing) return existing;

  const ctx = canvas.getContext("2d");
  const buckets = DUST_COLORS.map(() => []);
  let emitters = 0;
  let looping = false;
  let last = 0;
  let clock = 0;
  let vw = 0;
  let vh = 0;

  const start = () => {
    if (looping) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    vw = window.innerWidth;
    vh = window.innerHeight;
    canvas.width = Math.round(vw * dpr);
    canvas.height = Math.round(vh * dpr);
    canvas.style.display = "block";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    looping = true;
    last = performance.now();
    requestAnimationFrame(tick);
  };

  const tick = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    clock += dt;
    ctx.clearRect(0, 0, vw, vh);

    let alive = 0;
    buckets.forEach((bucket, ci) => {
      ctx.fillStyle = `rgb(${DUST_COLORS[ci]})`;
      let write = 0;
      for (let i = 0; i < bucket.length; i++) {
        const p = bucket[i];
        p.life += dt;
        if (p.life >= p.max) continue;
        // Slow buoyant drift with a gentle swirl, like rising dust.
        p.vx += Math.sin(p.y * 0.012 + clock * 1.1 + p.seed) * 18 * dt;
        p.vy -= 22 * dt;
        const drag = 1 - 0.8 * dt;
        p.vx *= drag;
        p.vy *= drag;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const fadeIn = Math.min(1, p.life / FADE_IN);
        const fadeOut = 1 - smoothstep(p.life / p.max);
        ctx.globalAlpha = p.alpha * fadeIn * fadeOut;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        bucket[write++] = p;
      }
      bucket.length = write;
      alive += write;
    });
    ctx.globalAlpha = 1;

    if (emitters > 0 || alive > 0) {
      requestAnimationFrame(tick);
    } else {
      looping = false;
      canvas.style.display = "none";
    }
  };

  // One dissolve's dust. emitUpTo(t) releases every sample whose break-away
  // time is <= t; finish() releases the rest, or drops it when cancelled.
  const emitter = (samples, rect) => {
    emitters++;
    start();
    let cursor = 0;
    let done = false;

    const emitUpTo = (t) => {
      while (cursor < samples.length && samples[cursor][2] <= t) {
        const [nx, ny] = samples[cursor++];
        buckets[Math.floor(Math.random() * DUST_COLORS.length)].push({
          x: rect.left + nx * rect.width,
          y: rect.top + ny * rect.height,
          vx: (Math.random() - 0.35) * 22,
          vy: -(8 + Math.random() * 30),
          life: 0,
          max: 1.8 + Math.random() * 1.4,
          size: 0.8 + Math.random() * 1.6,
          alpha: 0.5 + Math.random() * 0.45,
          seed: Math.random() * Math.PI * 2,
        });
      }
    };

    return {
      emitUpTo,
      // Passes over samples up to t without releasing them.
      skipTo(t) {
        while (cursor < samples.length && samples[cursor][2] <= t) cursor++;
      },
      finish(cancelled) {
        if (done) return;
        done = true;
        if (!cancelled) emitUpTo(Infinity);
        emitters--;
      },
    };
  };

  const system = { emitter };
  dustSystems.set(canvas, system);
  return system;
}

const LAST_FRAME = FRAME_COUNT - 1;
const frontAt = (e) => -EDGE_SOFTNESS + e * (1 + 2 * EDGE_SOFTNESS);

// Erodes `el` into dust over `duration` ms. If the element is part-way through
// re-forming, it carries on from the frame on screen. Resolves when the element
// is fully gone, or early if it is cut short (clearDissolveMask, reformDissolve);
// the mask stays applied (call clearDissolveMask before showing it again).
export function playDissolve({ el, canvas, assets, duration = 2400 }) {
  let state = masks.get(el);
  state?.cancel?.();
  if (!state || state.released) state = attachMask(el, assets);

  // Pick the timeline up where the frame on screen sits on the eased curve.
  const e0 = state.frame / LAST_FRAME;
  const p0 = dissolveEaseInverse(e0);
  const start = performance.now() - p0 * duration;
  const dust = getDust(canvas).emitter(state.assets.samples, el.getBoundingClientRect());
  dust.skipTo(frontAt(e0)); // that part already crumbled once

  return new Promise((resolve) => {
    let active = true;
    const stop = (cancelled) => {
      if (!active) return;
      active = false;
      if (state.cancel === cancel) state.cancel = null;
      dust.finish(cancelled);
      if (!cancelled) release(state);
      resolve();
    };
    const cancel = () => stop(true);
    state.cancel = cancel;

    const step = (now) => {
      if (!active) return;
      const p = Math.min(1, (now - start) / duration);
      const e = dissolveEase(p);
      const k = Math.min(LAST_FRAME, Math.round(e * LAST_FRAME));
      if (k !== state.frame) state.show(k);
      // Release dust along the continuous front rather than per mask frame,
      // so it streams off evenly instead of in bursts.
      dust.emitUpTo(frontAt(e));
      if (p < 1) requestAnimationFrame(step);
      else stop(false);
    };
    requestAnimationFrame(step);
  });
}

const easeOutCubic = (p) => 1 - (1 - p) ** 3;

// Runs a dissolve backwards from the frame on screen, so a menu reopened while
// crumbling gathers itself back together instead of snapping whole. A fully
// dissolved element re-forms over `duration` ms, a part-dissolved one in its
// share of that. Resolves once it is whole, with the mask removed.
export function reformDissolve(el, duration = 700) {
  const state = el && masks.get(el);
  if (!state || state.released) {
    clearDissolveMask(el);
    return Promise.resolve();
  }
  state.cancel?.();
  const k0 = state.frame;
  const span = (duration * k0) / LAST_FRAME;
  const start = performance.now();

  return new Promise((resolve) => {
    let active = true;
    const cancel = () => {
      active = false;
      if (state.cancel === cancel) state.cancel = null;
      resolve();
    };
    state.cancel = cancel;

    const step = (now) => {
      if (!active) return;
      const p = span > 0 ? Math.min(1, (now - start) / span) : 1;
      const k = Math.round(k0 * (1 - easeOutCubic(p)));
      if (k !== state.frame) state.show(k);
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        cancel();
        // Frame 0 is fully opaque, so dropping the mask now is invisible.
        clearDissolveMask(el);
      }
    };
    requestAnimationFrame(step);
  });
}

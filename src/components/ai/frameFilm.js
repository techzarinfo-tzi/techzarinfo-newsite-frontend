// Shared engine for the AI page's scroll-driven films (AiOneStop, AiIsland, AiIndustries, AiApproach):
// plays a numbered image sequence on a canvas, the displayed frame easing towards a target the caller
// sets from the scroll. The caller owns the animation loop: call step(dt) each frame; it returns true
// while still moving.
//
// Desktop (unchanged):
//   - Loading starts only on request (startLoading), coarse to fine (first, last, every 8th, 4th, 2nd,
//     rest), six at a time, so the film is scrubbable early and fills in; a frame not yet loaded falls
//     back to the nearest loaded one.
//   - The two frames either side of the eased position are cross-faded, so even a fast flick reads as
//     continuous motion. Canvas at up to 2x device pixels.
//
// Phones and small touch tablets (lowPower), where decoding and drawing full frames was the main
// cost of the page:
//   - Lighter frames: every 2nd frame, and on portrait screens the central 540 x 720 crop of each
//     (`<folder>/m/NNN.jpg`, all a portrait screen ever shows of a 16:9 frame). The crop is drawn
//     exactly where it sits in the full frame, so every layout (cover or `place`) is unchanged.
//   - Frames are fetched as compressed blobs only; a small window of decoded ImageBitmaps (WINDOW
//     either side of the current frame) is decoded ahead off the main thread and closed as the film
//     moves on, so memory stays bounded and drawing never has to decode.
//   - No cross-fade (one draw per frame) and the canvas at up to 1.25x device pixels.
//
// Optional: place(canvasW, canvasH, frameW, frameH) -> { x, y, w, h } in canvas px to lay the full
// frame out some other way than cover (the canvas is then first filled with `background`).
// mobile: { src(i), count, crop } for the cropped set (crop: share of the full frame's width, centred).

export const LOW_POWER_QUERY = "(max-width: 767px), (pointer: coarse) and (max-width: 1180px)";
export const isLowPower = () => typeof window !== "undefined" && window.matchMedia(LOW_POWER_QUERY).matches;
const PORTRAIT_MAX = 0.75; // the crop's aspect: screens narrower than this only ever see the crop
const WINDOW = 7; // decoded frames kept either side of the current one on phones

export function createFrameFilm({
  canvas,
  stage,
  count,
  src,
  ease = 10,
  onFrameReady,
  place,
  background = "#000",
  // background behind the crop set, when its frames were adjusted (e.g. a baked brightness lift)
  cropBackground,
  mobile,
}) {
  const ctx = canvas.getContext("2d", { alpha: false });
  let alive = true;
  let loading = false;
  let dirty = true;
  let drawn = -1;
  let current = 1;
  let target = 1;
  let progress = 0; // last target, as a share of the film

  // ---- which frame set ----
  // full: desktop; half: every 2nd full frame (low power, landscape); crop: the mobile set
  let mode = "full";
  let n = count; // frames in the active set
  let frameSrc = src;
  let full = null; // natural size of a full frame (from the first full frame seen, or the crop's)
  const choose = () => {
    if (!isLowPower()) return "full";
    const portrait = window.innerWidth / window.innerHeight <= PORTRAIT_MAX;
    return portrait && mobile ? "crop" : "half";
  };
  const apply = (m) => {
    mode = m;
    if (m === "full") {
      n = count;
      frameSrc = src;
    } else if (m === "crop") {
      n = mobile.count;
      frameSrc = mobile.src;
    } else {
      n = Math.ceil(count / 2);
      frameSrc = (i) => src(Math.min(count, i * 2 - 1));
    }
  };
  apply(choose());

  // ---- desktop: decoded <img>s, as before ----
  let images = [];
  // ---- phones: blobs + a bounded window of bitmaps ----
  let blobs = [];
  let bitmaps = new Map();
  let decoding = new Set();

  const order = () => {
    const seen = new Set();
    const list = [];
    for (const step of [n - 1, 8, 4, 2, 1]) {
      for (let i = 1; i <= n; i += Math.max(1, step)) {
        if (!seen.has(i)) {
          seen.add(i);
          list.push(i);
        }
      }
    }
    return list;
  };

  let generation = 0; // bumps when the set changes, so stale loads are dropped
  const startLoading = () => {
    if (loading) return;
    loading = true;
    const gen = generation;
    const queue = order();
    const lean = mode !== "full";
    const next = () => {
      if (!alive || gen !== generation || !queue.length) return;
      const i = queue.shift();
      if (lean) {
        fetch(frameSrc(i))
          .then((r) => (r.ok ? r.blob() : null))
          .then((b) => {
            if (!alive || gen !== generation || !b) return;
            blobs[i] = b;
            keepWindow();
          })
          .catch(() => {})
          .finally(next);
        return;
      }
      const img = new window.Image();
      img.decoding = "async";
      img.src = frameSrc(i);
      img
        .decode()
        .then(() => {
          if (!alive || gen !== generation) return;
          if (!full) full = { w: img.naturalWidth, h: img.naturalHeight };
          images[i] = img;
          dirty = true;
          onFrameReady?.();
        })
        .catch(() => {})
        .finally(next);
    };
    for (let k = 0; k < (lean ? 4 : 6); k++) next();
  };

  // Phones: decode the frames around the current one (nearest first), close the rest
  const keepWindow = () => {
    if (mode === "full" || !alive) return;
    const c = Math.round(current);
    for (const [i, bmp] of bitmaps) {
      if (Math.abs(i - c) > WINDOW + 2) {
        bmp.close?.();
        bitmaps.delete(i);
      }
    }
    const gen = generation;
    for (let d = 0; d <= WINDOW && decoding.size < 2; d++) {
      for (const i of d ? [c + d, c - d] : [c]) {
        if (i < 1 || i > n || bitmaps.has(i) || decoding.has(i) || !blobs[i] || decoding.size >= 2) continue;
        decoding.add(i);
        createImageBitmap(blobs[i])
          .then((bmp) => {
            decoding.delete(i);
            if (!alive || gen !== generation || Math.abs(i - Math.round(current)) > WINDOW + 2) {
              bmp.close?.();
              return;
            }
            if (!full && mode === "crop") full = { w: bmp.width / mobile.crop, h: bmp.height };
            if (!full) full = { w: bmp.width, h: bmp.height };
            bitmaps.set(i, bmp);
            dirty = true;
            onFrameReady?.();
            keepWindow();
          })
          .catch(() => decoding.delete(i));
      }
    }
  };

  const nearestIn = (has, i) => {
    for (let d = 0; d < n; d++) {
      if (has(i - d)) return i - d;
      if (has(i + d)) return i + d;
    }
    return 0;
  };

  const resize = () => {
    // switching between portrait / landscape on a phone, or crossing the breakpoint: change set
    const m = choose();
    if (m !== mode) {
      generation++;
      for (const bmp of bitmaps.values()) bmp.close?.();
      bitmaps = new Map();
      decoding = new Set();
      blobs = [];
      images = [];
      full = null;
      const was = loading;
      loading = false;
      apply(m);
      current = target = 1 + (n - 1) * progress;
      if (was) startLoading();
    }
    const dpr = Math.min(window.devicePixelRatio || 1, mode === "full" ? 2 : 1.25);
    canvas.width = Math.round(stage.clientWidth * dpr);
    canvas.height = Math.round(stage.clientHeight * dpr);
    ctx.imageSmoothingQuality = mode === "full" ? "high" : "medium";
    dirty = true;
  };

  // Draw one frame (img or bitmap): lay out the full frame (cover or place), then draw the image into
  // its part of it (all of it, or the centred crop)
  const paint = (img, alpha) => {
    const fw = full ? full.w : img.width;
    const fh = full ? full.h : img.height;
    let r;
    if (place) r = place(canvas.width, canvas.height, fw, fh);
    else {
      const s = Math.max(canvas.width / fw, canvas.height / fh);
      r = { x: (canvas.width - fw * s) / 2, y: (canvas.height - fh * s) / 2, w: fw * s, h: fh * s };
    }
    ctx.globalAlpha = alpha;
    if (mode === "crop") {
      const cw = r.w * mobile.crop;
      ctx.drawImage(img, r.x + (r.w - cw) / 2, r.y, cw, r.h);
    } else ctx.drawImage(img, r.x, r.y, r.w, r.h);
  };

  const draw = () => {
    const lean = mode !== "full";
    const base = lean ? Math.round(current) : Math.floor(current);
    const a = lean ? nearestIn((i) => bitmaps.has(i), base) : nearestIn((i) => !!images[i], base);
    if (!a || (!dirty && Math.abs(current - drawn) < (lean ? 0.5 : 0.002))) return;
    if (place) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = mode === "crop" && cropBackground ? cropBackground : background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    if (lean) paint(bitmaps.get(a), 1);
    else {
      paint(images[a], 1);
      const frac = current - base;
      if (frac > 0.02 && a === base && images[base + 1]) paint(images[base + 1], frac);
    }
    ctx.globalAlpha = 1;
    drawn = lean ? base : current;
    dirty = false;
    if (!canvas.dataset.live) canvas.dataset.live = "1";
  };

  return {
    startLoading,
    resize,
    // the set in use: "full" (desktop), "half" or "crop" (phones)
    get mode() {
      return mode;
    },
    // Target as a share of the film, 0..1
    setTarget(t) {
      progress = Math.min(1, Math.max(0, t));
      target = 1 + (n - 1) * progress;
    },
    // Redraw on the next step (e.g. the layout changed)
    invalidate() {
      dirty = true;
    },
    jump() {
      current = target;
      dirty = true;
    },
    step(dt) {
      const before = Math.round(current);
      current += (target - current) * (1 - Math.exp(-ease * dt));
      if (Math.abs(target - current) < 0.01) current = target;
      if (mode !== "full" && Math.round(current) !== before) keepWindow();
      draw();
      return current !== target;
    },
    destroy() {
      alive = false;
      generation++;
      for (const bmp of bitmaps.values()) bmp.close?.();
      bitmaps.clear();
      blobs = [];
      images = [];
    },
  };
}

// The cropped mobile set of a film folder: every 2nd frame (and the last), `m/NNN.jpg`
export const mobileSet = (folder, count) => ({
  src: (i) => `/service/AI/${folder}/m/${String(i).padStart(3, "0")}.jpg`,
  count: Math.ceil(count / 2) + (count % 2 === 0 ? 1 : 0),
  crop: 0.421875,
});

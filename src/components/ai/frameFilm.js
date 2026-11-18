// Shared engine for the AI page's scroll-driven films (AiOneStop, AiIsland): plays a numbered image
// sequence on a canvas, the displayed frame easing towards a target the caller sets from the scroll.
//
//   - Loading starts only on request (startLoading), in a coarse-to-fine order (first, last, every
//     8th, 4th, 2nd, rest), six at a time, so the film is scrubbable early and fills in. A frame not
//     yet loaded falls back to the nearest loaded one.
//   - The frame eases towards the target (time based, `ease` per second) and the two frames either
//     side of the eased position are cross-faded, so even a fast flick reads as continuous motion.
//   - The canvas is sized to its stage (device pixel ratio capped at 2) and the frames drawn to
//     cover it, centred. canvas.dataset.live is set once the first frame is drawn (to hide a poster).
//
// The caller owns the animation loop: call step(dt) each frame; it returns true while still moving.

// Optional: place(canvasW, canvasH, imageW, imageH) -> { x, y, w, h } in canvas px to lay the frames
// out some other way than cover (the canvas is then first filled with `background`).
export function createFrameFilm({ canvas, stage, count, src, ease = 10, onFrameReady, place, background = "#000" }) {
  const ctx = canvas.getContext("2d", { alpha: false });
  const images = new Array(count + 1); // 1-based
  let alive = true;
  let loading = false;
  let dirty = true;
  let drawn = -1;
  let current = 1;
  let target = 1;

  const order = () => {
    const seen = new Set();
    const list = [];
    for (const step of [count - 1, 8, 4, 2, 1]) {
      for (let i = 1; i <= count; i += Math.max(1, step)) {
        if (!seen.has(i)) {
          seen.add(i);
          list.push(i);
        }
      }
    }
    return list;
  };

  const startLoading = () => {
    if (loading) return;
    loading = true;
    const queue = order();
    const next = () => {
      if (!alive || !queue.length) return;
      const i = queue.shift();
      const img = new window.Image();
      img.decoding = "async";
      img.src = src(i);
      img
        .decode()
        .then(() => {
          if (!alive) return;
          images[i] = img;
          dirty = true;
          onFrameReady?.();
        })
        .catch(() => {})
        .finally(next);
    };
    for (let k = 0; k < 6; k++) next();
  };

  const nearest = (i) => {
    for (let d = 0; d < count; d++) {
      if (images[i - d]) return i - d;
      if (images[i + d]) return i + d;
    }
    return 0;
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(stage.clientWidth * dpr);
    canvas.height = Math.round(stage.clientHeight * dpr);
    ctx.imageSmoothingQuality = "high";
    dirty = true;
  };

  const cover = (img, alpha) => {
    ctx.globalAlpha = alpha;
    if (place) {
      const r = place(canvas.width, canvas.height, img.naturalWidth, img.naturalHeight);
      ctx.drawImage(img, r.x, r.y, r.w, r.h);
      return;
    }
    const s = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  };

  const draw = () => {
    const base = Math.floor(current);
    const a = nearest(base);
    if (!a || (!dirty && Math.abs(current - drawn) < 0.002)) return;
    if (place) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    cover(images[a], 1);
    const frac = current - base;
    if (frac > 0.02 && a === base && images[base + 1]) cover(images[base + 1], frac);
    ctx.globalAlpha = 1;
    drawn = current;
    dirty = false;
    if (!canvas.dataset.live) canvas.dataset.live = "1";
  };

  return {
    startLoading,
    resize,
    // Target as a share of the film, 0..1
    setTarget(t) {
      target = 1 + (count - 1) * Math.min(1, Math.max(0, t));
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
      current += (target - current) * (1 - Math.exp(-ease * dt));
      if (Math.abs(target - current) < 0.01) current = target;
      draw();
      return current !== target;
    },
    destroy() {
      alive = false;
    },
  };
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { geoInterpolate, geoPath, geoProjection } from "d3-geo";
import { select } from "d3-selection";
import { zoom, zoomIdentity } from "d3-zoom";
import "./WorldRouteMap.css";

// The Contact Us page's world map: real land outlines (Natural Earth, via world-atlas) drawn as a
// dotted map on a canvas, our locations pinned on it and joined by one continuous great-circle
// route, with three planes flying separate stretches of it at once.
//
// Interaction: drag sideways to rotate the world (it wraps round endlessly, like spinning a globe)
// and up/down to pan; pinch, Ctrl/Cmd + scroll or the buttons to zoom. On touch screens a
// one-finger sideways swipe rotates while up/down swipes keep scrolling the page. A pin zooms the
// map to itself.
//
// Everything is laid out in one fixed "base" space (an equirectangular world, BASE_W x BASE_H,
// stretched north-south by Y_STRETCH so the Americas-to-Asia framing fills the design's nearly
// square map box, as the reference does). d3-zoom's transform maps base space onto the screen;
// rotation is a sideways move, so the world is drawn once per copy that is in view (copy n is
// shifted by n * BASE_W).

const BASE_W = 1000;
const Y_STRETCH = 2.1;
const BASE_H = Math.ceil(BASE_W * (Y_STRETCH / 2));
const stretched = (lambda, phi) => [lambda, phi * Y_STRETCH];
stretched.invert = (x, y) => [x, y / Y_STRETCH];
const projection = geoProjection(stretched)
  .scale(BASE_W / (2 * Math.PI))
  .translate([BASE_W / 2, BASE_H / 2]);
const project = (lonLat) => projection(lonLat);

// Pins, in route order (west to east), so the route runs through them as one line
const LOCATIONS = [
  { id: "usa", name: "USA", lonLat: [-89, 38.5] },
  { id: "africa", name: "Africa", lonLat: [18, 1.5] },
  { id: "uae", name: "Middle East", sub: "(UAE)", lonLat: [55.27, 25.2] },
  { id: "india", name: "India", lonLat: [80.27, 13.08] },
  { id: "malaysia", name: "Malaysia", lonLat: [101.69, 3.14] },
];
const at = (id) => LOCATIONS.find((l) => l.id === id).lonLat;

// The part of the world framed at first (lon/lat): the Americas to South-East Asia
const VIEW = { west: -122, east: 146, north: 74, south: -48 };
// How far the map can be panned (lat): Arctic islands to the Southern Ocean
const PAN_NORTH = 84;
const PAN_SOUTH = -60;
const MAX_ZOOM = 8; // times the framing zoom
// Rotation is unlimited; this only keeps d3-zoom's sums finite
const FAR = 1e9;

const DOT_STEP = 4.2; // base units between dots (~1.5 degrees)
const ARC_STEPS = 64; // points per leg of a route
const PLANE_COPIES = 4; // plane elements per flight (one per world copy that can be in view)

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// A great-circle polyline through the given stops, in base space, with running lengths. A route
// that crosses the date line is kept continuous (x carries on past the world's edge into the next
// copy) rather than jumping back across the map.
function polyline(stops) {
  const points = [];
  for (let i = 0; i < stops.length - 1; i++) {
    const leg = geoInterpolate(stops[i], stops[i + 1]);
    for (let s = i === 0 ? 0 : 1; s <= ARC_STEPS; s++) {
      const [x, y] = project(leg(s / ARC_STEPS));
      const prev = points[points.length - 1];
      const unwrapped = prev ? x + Math.round((prev[0] - x) / BASE_W) * BASE_W : x;
      points.push([unwrapped, y]);
    }
  }
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
  }
  return { points, lengths, total: lengths[lengths.length - 1] };
}

// The connected route through every location (drawn dashed)
const ROUTE = polyline(LOCATIONS.map((l) => l.lonLat));

// Three flights on separate stretches of that route, so no two ever share a line. They run on one
// shared CYCLE_MS clock: the Atlantic crossing (twice as long as the other two) flies once per
// cycle, the shorter flights twice, so their speeds stay close and the pattern repeats exactly.
// `phase` (a fraction of each flight's own loop) staggers them so a plane leaves a shared pin
// halfway between arrivals there: the closest two visible planes get is ~48 base units (~40px),
// and each fades out on landing and in at take-off.
//
// The return flight (Malaysia -> USA, east across the Pacific and the date line) is a fourth
// flight on the same clock, drawn as its own pink route with arrowheads so its direction reads at
// a glance. It leaves Malaysia halfway between the Asia flight's arrivals there and lands in the
// USA halfway between the Atlantic flight's departures.
const CYCLE_MS = 9000;
const RETURN_ROUTE = polyline([at("malaysia"), at("usa")]);
const FLIGHTS = [
  { id: "atlantic", route: polyline([at("usa"), at("africa")]), loops: 1, phase: 0.15 },
  { id: "gulf", route: polyline([at("africa"), at("uae")]), loops: 2, phase: 0.8 },
  { id: "asia", route: polyline([at("uae"), at("india"), at("malaysia")]), loops: 2, phase: 0.3 },
  // The Pacific crossing is over twice the Atlantic's length, so it takes two cycles (loops 0.5)
  // to fly at about the same speed as the others
  { id: "return", route: RETURN_ROUTE, loops: 0.5, phase: 0.7, isReturn: true },
];

// Arrowheads along the return route (every ARROW_GAP base units), pointing the way it flies
const ARROW_GAP = 46;
const RETURN_ARROWS = [];
for (let d = ARROW_GAP; d < RETURN_ROUTE.total - ARROW_GAP / 2; d += ARROW_GAP) {
  RETURN_ARROWS.push(pointAlong(RETURN_ROUTE, d / RETURN_ROUTE.total));
}
FLIGHTS.forEach((f) => {
  f.ms = CYCLE_MS / f.loops;
  // Fade over the first/last stretch of each flight (shorter flights fade over a shorter distance)
  f.fade = Math.min(f.route.total * 0.12, 18);
});

// Where a plane is after `fraction` of its route: its point, heading and the index reached
function pointAlong(route, fraction) {
  const target = fraction * route.total;
  const { points, lengths } = route;
  let i = 1;
  while (i < lengths.length - 1 && lengths[i] < target) i++;
  const seg = lengths[i] - lengths[i - 1] || 1;
  const f = Math.min(1, Math.max(0, (target - lengths[i - 1]) / seg));
  const [x0, y0] = points[i - 1];
  const [x1, y1] = points[i];
  return { x: x0 + (x1 - x0) * f, y: y0 + (y1 - y0) * f, angle: Math.atan2(y1 - y0, x1 - x0), index: i, dist: target };
}

const pathFrom = (pts) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");

// The world copies (n) that overlap the view, with `margin` px to spare for labels at the edges
function copiesInView(t, width, margin = 0) {
  const span = BASE_W * t.k;
  const first = Math.floor((-margin - t.x) / span);
  const last = Math.floor((width + margin - t.x) / span);
  const list = [];
  for (let n = first; n <= last; n++) list.push(n);
  return list;
}

// Land dots: rasterise the land once, then keep the grid points that fall on land. Each dot gets a
// steady brightness (from a hash of its position) so the map has the reference's speckled look.
async function buildDots() {
  const [{ feature }, topo] = await Promise.all([
    import("topojson-client"),
    import("world-atlas/land-110m.json").then((m) => m.default),
  ]);
  const land = feature(topo, topo.objects.land);
  const canvas = document.createElement("canvas");
  canvas.width = BASE_W;
  canvas.height = BASE_H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = "#000";
  ctx.beginPath();
  geoPath(projection, ctx)(land);
  ctx.fill();
  const { data } = ctx.getImageData(0, 0, BASE_W, BASE_H);

  const buckets = [[], [], [], []];
  const yMax = project([0, PAN_SOUTH])[1];
  for (let y = DOT_STEP / 2; y < yMax; y += DOT_STEP) {
    for (let x = DOT_STEP / 2; x < BASE_W; x += DOT_STEP) {
      if (data[(Math.round(y) * BASE_W + Math.round(x)) * 4 + 3] < 128) continue;
      const h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      buckets[Math.floor((h - Math.floor(h)) * 4)].push(x, y);
    }
  }
  return buckets.map((list) => Float32Array.from(list));
}

// Dot colours from dim to bright, matching the reference's blue speckle
const DOT_COLORS = ["rgba(37, 88, 201, 0.55)", "rgba(46, 108, 226, 0.7)", "rgba(64, 132, 245, 0.82)", "rgba(110, 168, 255, 0.95)"];

// The framing view (VIEW centred), shifted by whole worlds so it is the copy nearest `centreX`
function framedView(w, h, k, centreX = null) {
  const [vx0, vy0] = project([VIEW.west, VIEW.north]);
  const [vx1, vy1] = project([VIEW.east, VIEW.south]);
  let cx = (vx0 + vx1) / 2;
  if (centreX !== null) cx += Math.round((centreX - cx) / BASE_W) * BASE_W;
  return zoomIdentity.translate(w / 2 - cx * k, h / 2 - ((vy0 + vy1) / 2) * k).scale(k);
}

export default function WorldRouteMap({ className = "" }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const routeRef = useRef(null);
  const returnRef = useRef(null);
  const arrowsRef = useRef(null);
  const trailRefs = useRef([]);
  const planeRefs = useRef([]);
  const dotsRef = useRef(null);
  const zoomRef = useRef(null);
  const transformRef = useRef(zoomIdentity);
  const fitRef = useRef(1);
  const animRef = useRef(0);
  // Each flight's progress (0-1 along its route)
  const progressRef = useRef(FLIGHTS.map((f) => f.phase));
  // The current view, the framing zoom it can't go below, and the map's width (for the pins and
  // zoom buttons)
  const [view, setView] = useState({ t: zoomIdentity, fit: 1, w: 0 });
  const transform = view.t;
  // The key named in the "scroll to zoom" hint while it shows ("Ctrl" or "⌘"), else ""
  const [hint, setHint] = useState("");

  // Draws the dots for the current transform (only when the view changes, not every frame)
  const drawDots = useCallback(() => {
    const canvas = canvasRef.current;
    const dots = dotsRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    if (!dots) return;
    const t = transformRef.current;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const spacing = DOT_STEP * t.k;
    const r = Math.max(0.6, Math.min(spacing * 0.32, 3.2));
    const copies = copiesInView(t, w);
    dots.forEach((list, b) => {
      ctx.fillStyle = DOT_COLORS[b];
      ctx.beginPath();
      for (const n of copies) {
        const ox = t.x + n * BASE_W * t.k;
        for (let i = 0; i < list.length; i += 2) {
          const x = list[i] * t.k + ox;
          const y = list[i + 1] * t.k + t.y;
          if (x < -r || y < -r || x > w + r || y > h + r) continue;
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    });
  }, []);

  // Draws the route, each flight's flown trail and its plane, for the current view and progress
  const drawFlights = useCallback((fade = true) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const t = transformRef.current;
    // One extra copy on the left: the return route runs on past the world's right edge, so the
    // copy to the left of the view is the one whose return flight crosses it
    const inView = copiesInView(t, wrap.clientWidth, 40);
    const copies = [inView[0] - 1, ...inView];
    const screen = (n) => ([x, y]) => [(x + n * BASE_W) * t.k + t.x, y * t.k + t.y];

    routeRef.current?.setAttribute("d", copies.map((n) => pathFrom(ROUTE.points.map(screen(n)))).join(""));
    returnRef.current?.setAttribute("d", copies.map((n) => pathFrom(RETURN_ROUTE.points.map(screen(n)))).join(""));
    // Arrowheads: a small open chevron at each point, turned to the route's heading
    arrowsRef.current?.setAttribute(
      "d",
      copies
        .map((n) =>
          RETURN_ARROWS.map((a) => {
            const [x, y] = screen(n)([a.x, a.y]);
            const c = Math.cos(a.angle);
            const s = Math.sin(a.angle);
            const pt = (u, v) => `${(x + u * c - v * s).toFixed(1)} ${(y + u * s + v * c).toFixed(1)}`;
            return `M${pt(-3, -3.5)}L${pt(2, 0)}L${pt(-3, 3.5)}`;
          }).join("")
        )
        .join("")
    );

    FLIGHTS.forEach((flight, f) => {
      const p = progressRef.current[f];
      const pos = pointAlong(flight.route, p);
      const flown = [...flight.route.points.slice(0, pos.index), [pos.x, pos.y]];
      trailRefs.current[f]?.setAttribute("d", copies.map((n) => pathFrom(flown.map(screen(n)))).join(""));
      // Fades in at take-off and out on landing, so each loop restarts smoothly
      const opacity = fade ? Math.max(0, Math.min(1, pos.dist / flight.fade, (flight.route.total - pos.dist) / flight.fade)) : 1;
      const angle = ((pos.angle * 180) / Math.PI).toFixed(1);
      for (let c = 0; c < PLANE_COPIES; c++) {
        const plane = planeRefs.current[f * PLANE_COPIES + c];
        if (!plane) continue;
        const n = copies[c];
        if (n === undefined) {
          plane.style.opacity = "0";
          continue;
        }
        const [px, py] = screen(n)([pos.x, pos.y]);
        plane.setAttribute("transform", `translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${angle}) scale(0.8)`);
        plane.style.opacity = String(opacity);
      }
    });
  }, []);

  // Zoom, pan and rotation, sizing, and the land dots
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const modKey = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? "⌘" : "Ctrl";
    const panTop = project([0, PAN_NORTH])[1];
    const panBottom = project([0, PAN_SOUTH])[1];
    const [vx0, vy0] = project([VIEW.west, VIEW.north]);
    const [vx1, vy1] = project([VIEW.east, VIEW.south]);

    const behavior = zoom()
      // Mouse drag rotates/pans; wheel zooms only with Ctrl/Cmd (plain scrolling scrolls the page);
      // touch: two fingers pan and pinch here, one finger is handled below
      .filter((e) => {
        if (e.type === "wheel") return e.ctrlKey || e.metaKey;
        if (e.type === "touchstart") return e.touches.length > 1;
        return !e.button;
      })
      .on("zoom", (e) => {
        transformRef.current = e.transform;
        setView({ t: e.transform, fit: fitRef.current, w: wrap.clientWidth });
        drawDots();
        drawFlights(!reducedMotion());
      });
    zoomRef.current = behavior;
    const sel = select(wrap).call(behavior);
    // Vertical swipes keep scrolling the page; sideways swipes and pinches are the map's
    sel.style("touch-action", "pan-y");

    // (Re)frame the view whenever the map's box changes size
    const frame = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const k = Math.max(w / (vx1 - vx0), h / (vy1 - vy0));
      fitRef.current = k;
      behavior
        .extent([[0, 0], [w, h]])
        .scaleExtent([k, k * MAX_ZOOM])
        .translateExtent([[-FAR, panTop], [FAR, panBottom]]);
      sel.call(behavior.transform, framedView(w, h, k));
    };
    frame();
    const ro = new ResizeObserver(frame);
    ro.observe(wrap);

    let alive = true;
    buildDots().then((dots) => {
      if (!alive) return;
      dotsRef.current = dots;
      drawDots();
    });

    // Plain wheel over the map: say how to zoom instead of hijacking the page scroll
    let hintTimer = 0;
    const onWheel = (e) => {
      if (e.ctrlKey || e.metaKey) return;
      setHint(modKey);
      clearTimeout(hintTimer);
      hintTimer = setTimeout(() => setHint(""), 1400);
    };
    wrap.addEventListener("wheel", onWheel, { passive: true });

    // One-finger touch: a sideways swipe rotates the world. The direction is decided after a few
    // px; an up/down swipe is left to the browser (page scroll). Two fingers go to d3-zoom.
    const touches = new Map();
    let swipe = null; // { id, x, y, mode: null | "rotate" | "scroll" }
    const onDown = (e) => {
      if (e.pointerType !== "touch") return;
      touches.set(e.pointerId, true);
      swipe = touches.size === 1 ? { id: e.pointerId, x: e.clientX, y: e.clientY, mode: null } : null;
    };
    const onMove = (e) => {
      if (!swipe || e.pointerId !== swipe.id || touches.size !== 1) return;
      const dx = e.clientX - swipe.x;
      const dy = e.clientY - swipe.y;
      if (!swipe.mode) {
        if (Math.hypot(dx, dy) < 8) return;
        swipe.mode = Math.abs(dx) > Math.abs(dy) ? "rotate" : "scroll";
      }
      if (swipe.mode !== "rotate") return;
      cancelAnimationFrame(animRef.current);
      behavior.translateBy(sel, dx / transformRef.current.k, 0);
      swipe.x = e.clientX;
      swipe.y = e.clientY;
    };
    const onUp = (e) => {
      touches.delete(e.pointerId);
      if (swipe?.id === e.pointerId) swipe = null;
    };
    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerup", onUp);
    wrap.addEventListener("pointercancel", onUp);

    return () => {
      alive = false;
      ro.disconnect();
      clearTimeout(hintTimer);
      wrap.removeEventListener("wheel", onWheel);
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerup", onUp);
      wrap.removeEventListener("pointercancel", onUp);
      sel.on(".zoom", null);
    };
  }, [drawDots, drawFlights]);

  // The flights: each loops along its own route while the map is on screen. With reduced motion
  // the planes rest part-way along their routes, with no movement.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (reducedMotion()) {
      progressRef.current = FLIGHTS.map(() => 0.5);
      drawFlights(false);
      return;
    }
    let frame = 0;
    let last = 0;
    let visible = false;
    const tick = (now) => {
      if (last) {
        const dt = now - last;
        progressRef.current = progressRef.current.map((p, f) => (p + dt / FLIGHTS[f].ms) % 1);
      }
      last = now;
      drawFlights(true);
      frame = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !visible) {
        visible = true;
        last = 0;
        frame = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && visible) {
        visible = false;
        cancelAnimationFrame(frame);
      }
    });
    io.observe(wrap);
    drawFlights(true);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [drawFlights]);

  // Animated move to a new view (the zoom buttons and pins)
  const animateTo = useCallback((target, ms = 550) => {
    const wrap = wrapRef.current;
    const behavior = zoomRef.current;
    if (!wrap || !behavior) return;
    cancelAnimationFrame(animRef.current);
    const sel = select(wrap);
    if (reducedMotion()) return sel.call(behavior.transform, target);
    const from = transformRef.current;
    const start = performance.now();
    const ease = (x) => 1 - Math.pow(1 - x, 3);
    const step = (now) => {
      const f = ease(Math.min(1, (now - start) / ms));
      const k = from.k * Math.pow(target.k / from.k, f);
      // Keep the screen centre moving in a straight line while the scale changes
      const w = wrap.clientWidth / 2;
      const h = wrap.clientHeight / 2;
      const cx = (w - from.x) / from.k + ((w - target.x) / target.k - (w - from.x) / from.k) * f;
      const cy = (h - from.y) / from.k + ((h - target.y) / target.k - (h - from.y) / from.k) * f;
      sel.call(behavior.transform, zoomIdentity.translate(w - cx * k, h - cy * k).scale(k));
      if (f < 1) animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
  }, []);

  // The base-space x at the centre of the view
  const centreX = () => {
    const t = transformRef.current;
    return (wrapRef.current.clientWidth / 2 - t.x) / t.k;
  };

  const zoomBy = (factor) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const t = transformRef.current;
    const fit = fitRef.current;
    const k = Math.min(fit * MAX_ZOOM, Math.max(fit, t.k * factor));
    const w = wrap.clientWidth / 2;
    const h = wrap.clientHeight / 2;
    const cx = (w - t.x) / t.k;
    const cy = (h - t.y) / t.k;
    animateTo(zoomIdentity.translate(w - cx * k, h - cy * k).scale(k));
  };

  // Back to the framing view, on whichever copy of the world is nearest (no long spin back)
  const resetView = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    animateTo(framedView(wrap.clientWidth, wrap.clientHeight, fitRef.current, centreX()));
  };

  // Zooms to a pin, on the copy of the world nearest the current view
  const focusPin = (loc, n) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const [bx, y] = project(loc.lonLat);
    const x = bx + n * BASE_W;
    const k = fitRef.current * 3;
    animateTo(zoomIdentity.translate(wrap.clientWidth / 2 - x * k, wrap.clientHeight / 2 - y * k).scale(k));
  };

  const atFit = transform.k <= view.fit * 1.001;
  const atMax = transform.k >= view.fit * MAX_ZOOM * 0.999;
  const pinCopies = view.w ? copiesInView(transform, view.w, 80) : [0];

  return (
    <div
      ref={wrapRef}
      className={`wrm ${className}`}
      role="region"
      aria-label="Map of Techzarinfo locations: USA, Africa, Middle East (UAE), India and Malaysia. Drag to rotate the world, zoom with the buttons."
    >
      {/* Faint globe lines behind the land */}
      <svg className="wrm-globe" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <ellipse cx="300" cy="300" rx="420" ry="250" />
        <ellipse cx="300" cy="300" rx="320" ry="190" />
        <ellipse cx="300" cy="300" rx="220" ry="130" />
        <path d="M-120 380Q300 160 720 380" />
        <path d="M-120 470Q300 250 720 470" />
      </svg>

      <canvas ref={canvasRef} className="wrm-canvas" aria-hidden="true" />

      <svg className="wrm-route" aria-hidden="true">
        <defs>
          <linearGradient id="wrm-trail" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7dd3fc" stopOpacity="0.35" />
            <stop offset="1" stopColor="#c4b5fd" />
          </linearGradient>
          <linearGradient id="wrm-trail-return" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f9a8d4" stopOpacity="0.35" />
            <stop offset="1" stopColor="#f472b6" />
          </linearGradient>
        </defs>
        <path ref={routeRef} className="wrm-route-line" />
        {/* The return route (Malaysia -> USA), with arrowheads showing its direction */}
        <path ref={returnRef} className="wrm-route-line wrm-route-return" />
        <path ref={arrowsRef} className="wrm-route-arrows" />
        {FLIGHTS.map((flight, f) => (
          <path
            key={flight.id}
            ref={(el) => {
              trailRefs.current[f] = el;
            }}
            className={flight.isReturn ? "wrm-route-trail wrm-route-trail-return" : "wrm-route-trail"}
          />
        ))}
        {FLIGHTS.flatMap((flight, f) =>
          Array.from({ length: PLANE_COPIES }, (_, c) => (
            <g
              key={`${flight.id}-${c}`}
              ref={(el) => {
                planeRefs.current[f * PLANE_COPIES + c] = el;
              }}
              className="wrm-plane"
              style={{ opacity: 0 }}
            >
              {/* Points right (0deg), centred on its own origin */}
              <path d="M11 0L-2 -2.2-6.5 -9.5-9 -9.5-6 -1.9-10.5 -1.4-12.5 -4.2-14 -4.2-13 0-14 4.2-12.5 4.2-10.5 1.4-6 1.9-9 9.5-6.5 9.5-2 2.2Z" />
            </g>
          ))
        )}
      </svg>

      {/* Pins: positioned from the current view (on every copy of the world in view); they don't
          scale with it */}
      <ul className="wrm-pins">
        {pinCopies.flatMap((n) =>
          LOCATIONS.map((loc, i) => {
            const [bx, by] = project(loc.lonLat);
            const x = (bx + n * BASE_W) * transform.k + transform.x;
            const y = by * transform.k + transform.y;
            if (view.w && (x < -80 || x > view.w + 80)) return null;
            return (
              <li key={`${n}-${loc.id}`} className="wrm-pin" style={{ left: `${x}px`, top: `${y}px`, "--d": `${i * 0.35}s` }}>
                <button type="button" onClick={() => focusPin(loc, n)} aria-label={`Zoom to ${loc.name}${loc.sub ? ` ${loc.sub}` : ""}`}>
                  <span className="wrm-chip">
                    <svg viewBox="0 0 12 16" aria-hidden="true">
                      <path d="M6 0a6 6 0 00-6 6c0 4.4 6 10 6 10s6-5.6 6-10a6 6 0 00-6-6zm0 8.4A2.4 2.4 0 116 3.6a2.4 2.4 0 010 4.8z" />
                    </svg>
                    <span>
                      {loc.name}
                      {loc.sub && <small>{loc.sub}</small>}
                    </span>
                  </span>
                  <span className="wrm-stem" />
                  <span className="wrm-dot" />
                </button>
              </li>
            );
          })
        )}
      </ul>

      <div className="wrm-controls">
        <button type="button" onClick={() => zoomBy(1.6)} aria-label="Zoom in" disabled={atMax}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M8 3v10M3 8h10" />
          </svg>
        </button>
        <button type="button" onClick={() => zoomBy(1 / 1.6)} aria-label="Zoom out" disabled={atFit}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8h10" />
          </svg>
        </button>
        <button type="button" onClick={resetView} aria-label="Reset map view">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2.5 8a5.5 5.5 0 109.3-4M12 1v3.2H8.8" />
          </svg>
        </button>
      </div>

      <p className="wrm-hint" data-show={hint ? true : undefined} aria-hidden="true">
        Use {hint || "Ctrl"} + scroll to zoom the map
      </p>
    </div>
  );
}

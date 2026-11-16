"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { geoPath, geoProjection } from "d3-geo";
import { select } from "d3-selection";
import { zoom, zoomIdentity } from "d3-zoom";
import "./WorldRouteMap.css";

// The Contact Us page's world map: real land outlines (Natural Earth, via world-atlas) drawn as a
// dotted map on a canvas, with a slowly spinning 3D pin on each of our offices (the India head
// office larger). Hovering a pin (or tapping it on a touch screen, or focusing it) pops up that
// office's address and enquiry numbers.
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

// Our offices: where each pin sits (the office's city), its label, and the address card shown on
// hover / tap. Addresses and numbers as on the company's office list.
const LOCATIONS = [
  {
    id: "usa",
    name: "USA",
    lonLat: [-77.2, 39.14], // Gaithersburg, Maryland
    office: "USA Office",
    places: [
      {
        city: "Maryland",
        address: "6835 Olney Laytonsville Rd, Gaithersburg, MD 20882",
        phones: [["+1-7039525250", "+17039525250"]],
      },
    ],
  },
  {
    id: "uk",
    name: "UK",
    lonLat: [-1.47, 53.38], // Sheffield
    office: "UK Office",
    places: [
      {
        city: "South Yorkshire",
        address: "27 Batemoor Close, Sheffield, United Kingdom S8 8EA",
        phones: [
          ["+44-7587719203", "+447587719203"],
          ["+44-1223790170", "+441223790170"],
        ],
      },
    ],
  },
  {
    id: "africa",
    name: "Africa",
    lonLat: [57.58, -20.01], // Grand Baie, Mauritius
    office: "Africa Office",
    places: [
      {
        city: "Mauritius",
        address: "B11 Fond Du Sac Road, The Precinct M2 Junction, Grand Baie 1305-02.",
        phones: [["+230-54773555", "+23054773555"]],
      },
    ],
  },
  {
    id: "uae",
    name: "Middle East",
    sub: "(UAE)",
    lonLat: [54.37, 24.45], // Abu Dhabi
    office: "Middle East Office",
    places: [{ city: "UAE", address: "Mazyad Mall, Abudhabi - UAE" }],
  },
  {
    id: "india",
    name: "India",
    lonLat: [80.21, 12.95], // Chennai
    hq: true,
    office: "India Office",
    places: [
      {
        city: "Chennai",
        address: "No: 34, Rakshan, Block-A, Sengalani Amman St, IIT Colony, Pallikaranai, Chennai - 600100.",
        phones: [["+91-9952885799", "+919952885799"]],
      },
      {
        city: "Trichy",
        address: "No.3D, M.S Tower, 4th Floor, Convent Rd, Cantonment, Tiruchirappalli - 620001.",
        phones: [["+91-9952885799", "+919952885799"]],
      },
    ],
  },
  {
    id: "malaysia",
    name: "Malaysia",
    lonLat: [101.69, 3.14], // Kuala Lumpur
    office: "Malaysia Office",
    places: [
      {
        city: "Kuala Lumpur",
        address: "6, Jalan Bullion Mewah 10, Taman Bullion Mewah, 68100, Kuala Lumpur.",
        phones: [["+60-146634733", "+60146634733"]],
      },
    ],
  },
];

// The part of the world framed at first (lon/lat): the Americas to South-East Asia
const VIEW = { west: -122, east: 146, north: 74, south: -48 };
// How far the map can be panned (lat): Arctic islands to the Southern Ocean
const PAN_NORTH = 84;
const PAN_SOUTH = -60;
const MAX_ZOOM = 8; // times the framing zoom
// Rotation is unlimited; this only keeps d3-zoom's sums finite
const FAR = 1e9;

const DOT_STEP = 4.2; // base units between dots (~1.5 degrees)
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
  // Each office gets a bright dot at its exact spot, so its pin always stands on visible land: the
  // dot grid (~1.5 degrees apart) can leave a coastal city (Chennai, Abu Dhabi) just past the last
  // row of land dots, and an island too small for the land data (Mauritius) would have none at all
  for (const { lonLat } of LOCATIONS) buckets[3].push(...project(lonLat));
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
  const dotsRef = useRef(null);
  const zoomRef = useRef(null);
  const transformRef = useRef(zoomIdentity);
  const fitRef = useRef(1);
  const animRef = useRef(0);
  // The current view, the framing zoom it can't go below, and the map's width (for the pins and
  // zoom buttons)
  const [view, setView] = useState({ t: zoomIdentity, fit: 1, w: 0, h: 0 });
  // Which pin's address card is open: hovered/focused (mouse, keyboard) or tapped (touch), as
  // "copy-id" keys; the hovered one wins
  const [hoverPin, setHoverPin] = useState(null);
  const [tapPin, setTapPin] = useState(null);
  const openPin = hoverPin ?? tapPin;
  const pressType = useRef("mouse");
  const uid = useId();
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
        setView({ t: e.transform, fit: fitRef.current, w: wrap.clientWidth, h: wrap.clientHeight });
        drawDots();
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
  }, [drawDots]);

  // A tapped address card closes on a tap elsewhere on the map, and any card on Escape
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const onDown = (e) => {
      if (!e.target.closest(".wrm-pin")) setTapPin(null);
    };
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setTapPin(null);
      setHoverPin(null);
    };
    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("keydown", onKey);
    return () => {
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("keydown", onKey);
    };
  }, []);

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
      aria-label="Map of Techzarinfo offices: USA, UK, Africa, Middle East (UAE), India and Malaysia. Hover or tap a pin to see its address; drag to rotate the world, zoom with the buttons."
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
          {/* The 3D pins' shading: lit from the left, falling to deep blue on the right */}
          <linearGradient id="wrm-pin-body" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8cc4ff" />
            <stop offset="0.38" stopColor="#2f86ff" />
            <stop offset="1" stopColor="#0a3a9c" />
          </linearGradient>
          <radialGradient id="wrm-pin-shine" cx="0.32" cy="0.26" r="0.5">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
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
            const key = `${n}-${loc.id}`;
            const open = openPin === key;
            const cardId = `${uid}-${key}`;
            // The card opens below a pin in the upper part of the map, above it lower down, and
            // leans inwards near the left/right edges so the map never clips it
            const v = view.h && y < view.h * 0.45 ? "below" : "above";
            const h = x < 140 ? "left" : view.w && x > view.w - 140 ? "right" : "center";
            return (
              <li
                key={key}
                className={loc.hq ? "wrm-pin wrm-pin-hq" : "wrm-pin"}
                data-open={open || undefined}
                style={{ left: `${x}px`, top: `${y}px`, "--d": `${i * 0.35}s` }}
                onPointerEnter={(e) => e.pointerType === "mouse" && setHoverPin(key)}
                onPointerLeave={(e) => e.pointerType === "mouse" && setHoverPin((k) => (k === key ? null : k))}
                onFocus={() => setHoverPin(key)}
                onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHoverPin((k) => (k === key ? null : k))}
              >
                {/* Address card: fades and pops in while the pin is hovered, focused or tapped */}
                <div id={cardId} className="wrm-office" data-v={v} data-h={h} inert={!open} aria-hidden={!open}>
                  <p className="wrm-office-title">{loc.office}</p>
                  {loc.places.map((place) => (
                    <div key={place.city} className="wrm-office-place">
                      <p className="wrm-office-city">{place.city}</p>
                      <p className="wrm-office-address">{place.address}</p>
                      {place.phones && (
                        <p className="wrm-office-phones">
                          <span>Enquiry</span>
                          {place.phones.map(([label, tel]) => (
                            <a key={tel} href={`tel:${tel}`}>
                              {label}
                            </a>
                          ))}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={cardId}
                  aria-label={`${loc.office}: show address`}
                  onPointerDown={(e) => {
                    pressType.current = e.pointerType;
                  }}
                  onClick={() => {
                    // Touch: a tap opens (or closes) the address card; mouse and keyboard keep
                    // zooming to the pin, as before (the card already shows on hover / focus)
                    if (pressType.current === "touch") setTapPin((k) => (k === key ? null : key));
                    else focusPin(loc, n);
                    pressType.current = "mouse";
                  }}
                >
                  <span className="wrm-chip">
                    <svg viewBox="0 0 12 16" aria-hidden="true">
                      <path d="M6 0a6 6 0 00-6 6c0 4.4 6 10 6 10s6-5.6 6-10a6 6 0 00-6-6zm0 8.4A2.4 2.4 0 116 3.6a2.4 2.4 0 010 4.8z" />
                    </svg>
                    <span>
                      {loc.name}
                      {loc.sub && <small>{loc.sub}</small>}
                    </span>
                  </span>
                  {/* A glossy 3D pin, its tip on the location, slowly spinning: two crossed faces
                      so it keeps its body side-on, with a ground shadow and a pulse ring */}
                  <span className="wrm-pin3d">
                    <span className="wrm-pin3d-ring" />
                    <span className="wrm-pin3d-shadow" />
                    <span className="wrm-pin3d-spin">
                      {[0, 1].map((face) => (
                        <svg key={face} className="wrm-pin3d-face" viewBox="0 0 24 32">
                          <path
                            d="M12 1C6.2 1 1.5 5.6 1.5 11.4c0 7.6 9 18.3 9.7 19.2a1 1 0 001.6 0c.7-.9 9.7-11.6 9.7-19.2C22.5 5.6 17.8 1 12 1z"
                            fill="url(#wrm-pin-body)"
                          />
                          <path
                            d="M12 1C6.2 1 1.5 5.6 1.5 11.4c0 7.6 9 18.3 9.7 19.2a1 1 0 001.6 0c.7-.9 9.7-11.6 9.7-19.2C22.5 5.6 17.8 1 12 1z"
                            fill="url(#wrm-pin-shine)"
                          />
                          <circle cx="12" cy="11.4" r="4" fill="#ffffff" />
                          <circle cx="12" cy="11.4" r="1.9" fill="#1f6ff0" />
                        </svg>
                      ))}
                    </span>
                  </span>
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

"use client";

import { useEffect, useRef, useState } from "react";
import { createCrestRenderer } from "@/components/culture/crestRenderer";

// The Culture page's photo gallery: a pinned stage where the photos rise in slanted columns and,
// as they pass over a hidden arch, lift towards you and bend like sheets of paper, catching the
// light and casting a softer shadow the higher they lift (crestRenderer.js, WebGL). Scrolling
// glides with a little inertia, and the arch swells while you scroll fast.
//
//   Columns  3 on wide screens, 2 on tablets, 1 on phones (photos fill most of the width).
//   Section  as tall as the stream needs: the stage stays pinned while every photo rises through
//            it, then the page carries on.
//
// The photos are also rendered as a plain grid of <img>s (server-rendered, so they are crawlable
// and readable by screen readers). That grid is what you see without WebGL, with reduced motion,
// or before the script runs; once the stage is live the grid is visually hidden but kept for
// assistive tech.
const BACKGROUND = "#e9ecf1";

export default function CultureGallery({ photos }) {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!photos.length) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const renderer = createCrestRenderer({
      canvas: canvasRef.current,
      track: trackRef.current,
      stage: stageRef.current,
      photos,
      background: BACKGROUND,
    });
    if (!renderer) return; // no WebGL: keep the grid
    setLive(true);

    const onReduced = () => {
      if (reduced.matches) {
        renderer.destroy();
        setLive(false);
      }
    };
    reduced.addEventListener("change", onReduced);
    return () => {
      reduced.removeEventListener("change", onReduced);
      renderer.destroy();
      setLive(false);
    };
  }, [photos]);

  if (!photos.length) {
    return (
      <section className="grid min-h-[70svh] place-items-center px-4 pt-28 pb-16" style={{ background: BACKGROUND }}>
        <p className="text-center text-[15px] text-[#5b6472]">Photos from life at Techzarinfo are coming soon.</p>
      </section>
    );
  }

  return (
    <section
      ref={trackRef}
      aria-label="Photos from life at Techzarinfo"
      data-guide="culturePhotos"
      className="relative"
      style={{ background: BACKGROUND }}
    >
      {/* The WebGL stage, pinned while the photos rise through it */}
      <div ref={stageRef} className={live ? "sticky top-0 h-svh overflow-hidden" : "hidden"} aria-hidden="true">
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>

      {/* The photos as a plain grid: the fallback view, and the accessible copy once the stage is live */}
      <ul
        className={
          live
            ? "sr-only"
            : "mx-auto max-w-[1200px] columns-1 gap-6 px-6 pt-28 pb-20 sm:columns-2 sm:px-8 lg:columns-3 lg:gap-8 lg:pt-36"
        }
      >
        {photos.map((photo) => (
          <li key={photo.id} className="mb-6 break-inside-avoid lg:mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element -- uploads from the API; sizes vary */}
            <img
              src={photo.src}
              alt={photo.title}
              loading="lazy"
              decoding="async"
              className="h-auto w-full rounded-[2%] shadow-[0_18px_40px_-18px_rgba(15,23,42,0.35)]"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

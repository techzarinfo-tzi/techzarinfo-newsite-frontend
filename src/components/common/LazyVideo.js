"use client";

import { useEffect, useRef } from "react";

// A muted, looping clip used in place of a heavy animated image. The file is only fetched once the
// video nears the viewport, it pauses while off screen, and with reduced motion only the poster shows.
export default function LazyVideo({ src, poster, width, height, className, style }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!video.src) video.src = src;
          video.play().catch(() => {});
        } else if (video.src) {
          video.pause();
        }
      },
      { rootMargin: "300px 0px" }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      poster={poster}
      width={width}
      height={height}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className={className}
      style={style}
    />
  );
}

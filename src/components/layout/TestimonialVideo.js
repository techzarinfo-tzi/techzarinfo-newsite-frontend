"use client";

import { useEffect, useRef, useState } from "react";

// A real client video in a testimonial card, kept at the clip's own portrait shape (width x height)
// so its burnt-in captions are never cropped. Nothing but the poster loads until the visitor presses
// play (preload="none"); the clip then plays with sound and the browser's own controls (play/pause,
// seek, volume, fullscreen). Only one testimonial plays at a time, it pauses when scrolled out of
// view, and the play button returns when it ends.
export default function TestimonialVideo({ src, poster, width, height, label }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const video = ref.current;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting && !video.paused) video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, []);

  // play() runs inside the click itself, so mobile browsers allow sound
  const play = () => {
    setStarted(true);
    ref.current.play().catch(() => setStarted(false));
  };

  const pauseOthers = () => {
    document.querySelectorAll("video[data-testimonial]").forEach((v) => {
      if (v !== ref.current) v.pause();
    });
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-[#0a1f4d]"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        preload="none"
        playsInline
        controls={started}
        controlsList="nodownload"
        aria-label={label}
        data-testimonial=""
        onPlay={pauseOthers}
        onEnded={() => setStarted(false)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {!started && (
        <button
          type="button"
          onClick={play}
          aria-label={`Play ${label}`}
          className="absolute inset-0 m-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#002148] shadow-lg transition-transform hover:scale-105"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 translate-x-[1px]">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// One wave period across the 1440-wide box: starts and ends at the same height and slope, so two
// copies side by side join without a seam
const WAVE = "M0 64 C240 0 480 0 720 64 S1200 128 1440 64";

// The wave layers, back to front: filled bands and one outline, each at its own height, opacity
// and speed (s per period), so they drift past one another
const waveLayers = [
  { height: "62%", fill: "rgba(255,255,255,0.08)", duration: 16, delay: -4 },
  { height: "46%", fill: "rgba(255,255,255,0.1)", duration: 11, delay: -7 },
  { height: "74%", stroke: "rgba(255,255,255,0.28)", duration: 20, delay: -12 },
];

// A strip twice the card's width holding two copies of the wave; globals.css .cta-wave-strip
// slides it left by one copy per loop
function WaveLayer({ height, fill, stroke, duration, delay }) {
  const path = fill ? `${WAVE} V320 H0 Z` : WAVE;
  return (
    <div className="absolute inset-x-0 bottom-0" style={{ height }}>
      <div className="cta-wave-strip flex h-full w-[200%]" style={{ "--dur": `${duration}s`, animationDelay: `${delay}s` }}>
        {[0, 1].map((k) => (
          <svg key={k} viewBox="0 0 1440 320" preserveAspectRatio="none" className="h-full w-1/2 shrink-0">
            <path
              d={path}
              fill={fill ?? "none"}
              stroke={stroke ?? "none"}
              strokeWidth={stroke ? 2 : 0}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ))}
      </div>
    </div>
  );
}

// True once the card has scrolled a little way into view (one-off)
function useRevealed(ref) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return shown;
}

// A rounded banner card the e-commerce CTA's width (1057px at 1440), centred: navy-blue on the left
// fading to cyan on the right, the heading and one button on the left, and a white half circle
// cut into the right edge. Button styled as the e-commerce CTA's white one. The card rises in as it
// scrolls into view (the crypto industries reveal, globals.css .crypto-ind-card), and soft white
// waves slide in from the right and keep flowing right to left behind the copy.
export default function BankingCta() {
  const ref = useRef(null);
  const shown = useRevealed(ref);

  return (
    <section data-guide="bankingCta" className="bg-white px-4 pt-6 pb-14 sm:px-6 lg:px-8 lg:pt-10 lg:pb-20">
      <noscript>
        <style>{`.crypto-ind-card { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>

      <div ref={ref} className={`mx-auto max-w-[1057px] ${shown ? "is-shown" : ""}`}>
        <div
          className="crypto-ind-card relative overflow-hidden rounded-[20px] px-6 py-12 pr-[calc(clamp(44px,7vw,78px)+1.5rem)] text-white sm:px-10 sm:pr-[calc(clamp(44px,7vw,78px)+2.5rem)] lg:rounded-[22px] lg:py-[68px] lg:pl-[clamp(40px,6.5vw,68px)]"
          style={{ background: "linear-gradient(90deg, #00419f 0%, #0a63c4 35%, #0496e4 70%, #00bdf7 100%)" }}
        >
          {/* Waves along the bottom, fading out toward the left: they slide in from the right as
              the card appears, then keep flowing right to left */}
          <div aria-hidden="true" className="cta-waves pointer-events-none absolute inset-0">
            {waveLayers.map((layer, i) => (
              <WaveLayer key={i} {...layer} />
            ))}
          </div>

          <h2 className="relative max-w-[17em] text-[24px] font-semibold leading-[1.3] tracking-tight text-balance sm:text-[30px] lg:text-[36px]">
            Ready to Build Your Smart Digital Banking Platform?
          </h2>
          <Link
            href="/contact"
            className="relative mt-8 inline-flex h-11 items-center rounded-[3px] bg-white px-[15px] text-[15px] font-medium text-[#002461] transition-colors hover:bg-white/90 lg:mt-10 lg:text-base"
          >
            Talk to Our Experts
          </Link>

          {/* White half circle cut into the right edge, just below the middle */}
          <span
            aria-hidden="true"
            className="absolute top-[54%] right-0 size-[clamp(88px,14vw,156px)] translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          />
        </div>
      </div>
    </section>
  );
}

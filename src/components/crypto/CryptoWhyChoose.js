"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const DIR = "/service/crypto/whychoose/layers";

// The section artwork ("why choose.svg", one 1672 x 941 image) split in two: the background with
// the coin taken out (plate.webp: where the coin sat, the beam carries on from the machine), and the
// coin itself (coin.webp, a 400 x 400 cut-out). COIN is the coin layer's spot in the image's pixels,
// so at rest the two layers line up exactly with the original artwork.
const IMG = { w: 1672, h: 941 };
const COIN = { x: 390, y: 378, size: 400 };
// Centre of the machine's glowing opening, where the coin is dispensed from
const HOLE = { x: 505, y: 410, w: 360, h: 270 };

const pct = (v, total) => `${((v / total) * 100).toFixed(3)}%`;

// Plays the dispensing loop only while the section is on screen (and restarts it, coin first
// emerging, each time the section comes back into view)
function useOnScreen(ref) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setOn(entry.isIntersecting), { threshold: 0.25 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref]);
  return on;
}

function Artwork({ playing }) {
  return (
    <div className={`relative aspect-1672/941 w-full ${playing ? "is-dispensing" : ""}`}>
      <Image src={`${DIR}/plate.webp`} alt="" fill sizes="100vw" draggable={false} className="select-none object-cover" />
      {/* The coin: emerges from the opening, glides out along the beam to its place in the design,
          hovers, then carries on out of the beam as the next one comes (globals.css .crypto-dispense-coin) */}
      <div
        className="crypto-dispense-coin absolute"
        style={{
          left: pct(COIN.x, IMG.w),
          top: pct(COIN.y, IMG.h),
          width: pct(COIN.size, IMG.w),
          "--from-x": `${(((HOLE.x - (COIN.x + COIN.size / 2)) / COIN.size) * 100).toFixed(2)}%`,
          "--from-y": `${(((HOLE.y - (COIN.y + COIN.size / 2)) / COIN.size) * 100).toFixed(2)}%`,
        }}
      >
        <Image
          src={`${DIR}/coin.webp`}
          alt=""
          width={COIN.size}
          height={COIN.size}
          sizes="(min-width: 1024px) 24vw, 40vw"
          draggable={false}
          className="h-auto w-full select-none"
        />
      </div>
      {/* Flash of light in the opening as each coin is released (hidden at rest) */}
      <div
        aria-hidden="true"
        className="crypto-dispense-flare pointer-events-none absolute rounded-full mix-blend-screen"
        style={{
          left: pct(HOLE.x - HOLE.w / 2, IMG.w),
          top: pct(HOLE.y - HOLE.h / 2, IMG.h),
          width: pct(HOLE.w, IMG.w),
          height: pct(HOLE.h, IMG.h),
          background: "radial-gradient(closest-side, rgba(225,248,255,0.95) 0%, rgba(120,214,255,0.55) 45%, transparent 100%)",
        }}
      />
    </div>
  );
}

// Desktop (lg and up): the artwork spans the full width (56.5vw tall) inside a shorter 47.5vw
// section, raised 2vw so the trim comes off the dark top edge and the fading beam at the bottom; the
// machine and coin stay whole. The heading sits top right (from 51% across) and the paragraph below
// it (from 45% across), both white over the dark background, placed in vw so they hold their spot on
// the artwork. Below lg the copy stacks around the artwork on the artwork's own near-black navy.
export default function CryptoWhyChoose() {
  const ref = useRef(null);
  const playing = useOnScreen(ref);

  return (
    <section ref={ref} data-guide="cryptoWhyChoose" aria-labelledby="crypto-why-title" className="relative overflow-hidden bg-[#000112] text-white lg:h-[47.5vw]">
      <h2
        id="crypto-why-title"
        className="relative z-10 px-4 pt-10 text-center text-[clamp(17px,5.6vw,28px)] font-medium leading-[1.25] tracking-tight sm:px-6 sm:text-[34px] lg:absolute lg:top-[4.4vw] lg:left-[51%] lg:p-0 lg:text-left lg:text-[clamp(24px,2.85vw,42px)]"
      >
        <span className="block whitespace-nowrap">Why Choose TZI as Your Crypto</span>{" "}
        <span className="block whitespace-nowrap">Exchange Development Company?</span>
      </h2>

      <div className="lg:absolute lg:inset-x-0 lg:top-[-2vw]">
        <Artwork playing={playing} />
      </div>

      <p className="relative z-10 px-4 pb-10 text-center text-base leading-[1.7] text-white/90 sm:px-6 sm:text-lg lg:absolute lg:top-[27.4vw] lg:left-[45%] lg:w-[48%] lg:p-0 lg:text-left lg:text-[clamp(16px,1.6vw,23px)] lg:leading-[1.75]">
        At Techzarinfo, we don&apos;t simply build crypto exchange software. We understand your
        business model, target market, trading needs, and growth plans before development begins.
        Every stage of the development process is carefully crafted to match your specific business
        requirements
      </p>
    </section>
  );
}

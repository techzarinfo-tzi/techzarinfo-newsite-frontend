"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const HERO = "/service/digital-marketing/hero";

// The two offer cards. `crop` cuts the artwork out of the hero's offer card image (524 x 715): the
// region's left, top, width and height in image px, so the same artwork is shown without a second copy
// of the file.
const offers = [
  {
    title: "Free 1-Week Paid Ads Campaign",
    text: "Test a short paid campaign to understand lead quality, audience response, and campaign potential before scaling.",
    art: {
      src: `${HERO}/ads.png`,
      alt: "Google Ads and Meta logos on two rising podiums",
      crop: [72, 262, 380, 453],
      // Soft edges, so the podiums sit on the card's own gradient
      className:
        "w-[clamp(96px,11vw,128px)] [mask-image:linear-gradient(to_bottom,transparent,#000_16%,#000_78%,transparent),linear-gradient(to_right,transparent,#000_14%,#000_86%,transparent)] [mask-composite:intersect]",
    },
  },
  {
    title: "Free Website SEO Audit",
    text: "Get a quick review of your website's SEO, structure, and visibility gaps to uncover missed growth opportunities.",
    art: {
      src: `${HERO}/seo.png`,
      alt: "A website card checked under a magnifying glass",
      crop: [58, 303, 408, 412],
      className: "w-[clamp(104px,10.5vw,130px)] rounded-[12px]",
    },
  },
];

// A fixed window onto part of an image: the image is scaled so the crop region fills the box exactly
function CroppedArt({ src, alt, crop: [x, y, w, h], className }) {
  return (
    <span
      className={`relative block shrink-0 overflow-hidden ${className}`}
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- a crop window, not a layout image */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="absolute max-w-none"
        style={{
          width: `${(524 / w) * 100}%`,
          left: `${(-x / w) * 100}%`,
          top: `${(-y / h) * 100}%`,
        }}
      />
    </span>
  );
}

// True once the section has scrolled a little way into view (one-off)
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

// "Unlock Exclusive Growth Offers": a tall navy-blue intro card on the left with a faint ring in its
// top corner and a "Get Started" button, and two blue offer cards stacked on the right, each with its
// copy on the left and its artwork on the right. Stacked on phones and tablets. The three cards rise
// in one after another as the section scrolls into view (the crypto industries reveal,
// globals.css .crypto-ind-card).
export default function MarketingOffers() {
  const ref = useRef(null);
  const shown = useRevealed(ref);

  return (
    <section data-guide="marketingOffers" className="bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <noscript>
        <style>{`.crypto-ind-card { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>

      <div
        ref={ref}
        className={`mx-auto grid max-w-[1146px] gap-5 lg:grid-cols-[minmax(0,366fr)_minmax(0,756fr)] lg:grid-rows-2 lg:gap-x-6 lg:gap-y-[25px] ${
          shown ? "is-shown" : ""
        }`}
      >
        <div className="crypto-ind-card relative flex flex-col items-start overflow-hidden rounded-[20px] bg-linear-to-b from-[#1c3fc5] to-[#0d2373] px-7 py-10 text-white sm:px-9 lg:row-span-2 lg:px-[34px] lg:pt-[38px]">
          {/* Faint ring, partly off the top edge */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-[46%] left-[22%] aspect-square w-[118%] rounded-full border-[26px] border-white/[0.06]"
          />
          <h2 className="relative max-w-[300px] text-[24px] font-semibold leading-[1.3] tracking-tight sm:text-[26px] lg:text-[clamp(24px,2vw,28px)]">
            Unlock Exclusive Growth Offers
          </h2>
          <p className="relative mt-4 max-w-[300px] text-[15px] leading-[1.65] text-white/90 lg:text-base">
            Explore special marketing offers designed to improve visibility, generate more enquiries, and
            support business growth.
          </p>
          <Link
            href="/contact"
            className="relative mt-8 inline-flex h-[42px] items-center rounded-full bg-white px-6 text-[15px] font-semibold text-[#1c3fc5] transition-colors hover:bg-white/90 lg:mt-10"
          >
            Get Started
          </Link>
        </div>

        {offers.map((offer, i) => (
          <div
            key={offer.title}
            className="crypto-ind-card flex min-h-[170px] items-center gap-6 overflow-hidden rounded-[20px] bg-linear-to-r from-[#1c68c3] via-[#4b92de] to-[#83bdf7] px-7 py-8 text-white sm:px-9 lg:min-h-[192px] lg:gap-10 lg:px-[34px]"
            style={{ "--ind-delay": `${(i + 1) * 140}ms` }}
          >
            <div className="min-w-0 flex-1">
              <h3 className="text-[18px] font-semibold leading-snug tracking-tight sm:text-[19px] lg:text-[20px]">
                {offer.title}
              </h3>
              <p className="mt-2 max-w-[380px] text-[14px] leading-[1.6] text-white/90 lg:text-[15px]">{offer.text}</p>
            </div>
            <CroppedArt {...offer.art} className={`hidden sm:block lg:mr-[clamp(0px,3vw,48px)] ${offer.art.className}`} />
          </div>
        ))}
      </div>
    </section>
  );
}

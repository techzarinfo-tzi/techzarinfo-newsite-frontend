"use client";

import { useState } from "react";
import Image from "next/image";

const groups = [
  {
    icon: { src: "admin.svg", width: 142, height: 104 },
    title: "Admin Features",
    items: [
      "Personalized Dashboard Analytics",
      "Trader Management",
      "Liquidity Management",
      "API Management",
      "KYC/AML",
      "Transaction Data",
    ],
  },
  {
    icon: { src: "user.svg", width: 106, height: 97 },
    title: "User Features",
    items: [
      "Strong Trade Engine",
      "Spot, Derivative and Futures",
      "Multi-Chain Crypto Wallet",
      "Trade Analysis Tool",
      "Trade & Transaction History",
      "Multi-language Support",
    ],
  },
  {
    icon: { src: "secure.svg", width: 105, height: 102 },
    title: "Security Features",
    items: ["Data Encryption", "DDoS", "Biometric", "2FA", "SSL Certification", "Withdrawal Whitelisting"],
  },
];

// The design's bullet: a navy disc with a white four-point sparkle
function Bullet() {
  return (
    <span aria-hidden="true" className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[#0b3a8c]">
      <svg viewBox="0 0 12 12" className="size-3">
        <path d="M6 0.8C6.4 4 8 5.6 11.2 6 8 6.4 6.4 8 6 11.2 5.6 8 4 6.4 0.8 6 4 5.6 5.6 4 6 0.8z" fill="none" stroke="#fff" strokeWidth="1.1" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

// Centred heading and intro over three pale blue feature cards (icon, title, bulleted list). The
// highlighted card, as the middle one in the design, has a light blue border and a cyan glow rising
// from its lower half; it starts on the middle card and follows the pointer (or keyboard focus),
// returning to the middle when the pointer leaves the row. Three columns from md; stacked below.
export default function CryptoFeatures() {
  const [active, setActive] = useState(1);

  return (
    <section data-guide="cryptoFeatures" className="bg-white px-4 pt-14 pb-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-[84px] lg:pb-16">
      <div className="text-center">
        <h2 className="mx-auto max-w-[17em] text-[28px] font-medium leading-[1.25] tracking-tight text-balance text-[#002461] sm:text-[34px] lg:text-[40px]">
          Majestic Features We Integrate in Our Crypto Exchange Software Development
        </h2>
        <p className="mx-auto mt-4 max-w-[680px] text-base leading-[1.4] text-[#002461] lg:mt-5 lg:text-[17px]">
          Reputed crypto exchange development company offering customizable features tailored to
          your business needs.
        </p>
      </div>

      <div
        className="mx-auto mt-10 grid max-w-[440px] grid-cols-1 gap-5 md:max-w-[1130px] md:grid-cols-3 md:gap-4 lg:mt-[68px] lg:gap-[34px]"
        onMouseLeave={() => setActive(1)}
      >
        {groups.map(({ icon, title, items }, i) => {
          const on = active === i;
          return (
            <article
              key={title}
              tabIndex={0}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={`relative overflow-hidden rounded-2xl border-2 bg-[#eaf4fe] px-5 pt-5 pb-7 text-[#002461] outline-none transition-[border-color,background-color,box-shadow] duration-500 ease-out focus-visible:ring-2 focus-visible:ring-[#1f63da] md:px-4 lg:px-6 ${
                on ? "border-[#c3dbf6] bg-[#e4f1fe] shadow-[0_10px_30px_-18px_rgba(0,36,97,0.35)]" : "border-transparent"
              }`}
            >
              {/* Cyan glow in the lower half, faded in on the highlighted card */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out ${on ? "opacity-100" : "opacity-0"}`}
                style={{
                  background:
                    "radial-gradient(ellipse 60% 42% at 50% 72%, rgba(120,214,255,0.85) 0%, rgba(160,224,255,0.45) 45%, transparent 100%)",
                }}
              />

              <div className="relative">
                {/* The design's icon artwork (SVGs wrapping raster images), shown as is at its own proportions */}
                <Image
                  src={`/service/crypto/service/${icon.src}`}
                  alt=""
                  width={icon.width}
                  height={icon.height}
                  unoptimized
                  draggable={false}
                  className={`mx-auto h-[86px] w-auto transition-transform duration-500 ease-out lg:h-[100px] ${on ? "-translate-y-1 scale-105" : ""}`}
                />
                <h3 className="mt-2 text-center text-[22px] font-medium leading-tight md:text-[19px] lg:text-[24px]">{title}</h3>
                <ul className="mt-6 space-y-[22px] lg:mt-7">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-[18px] md:gap-3 lg:gap-[18px]">
                      <Bullet />
                      <span className="max-w-[13em] text-[16px] leading-[1.3] md:text-[14px] lg:text-[17px]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import HeroButton, { HeroButtonGroup } from "@/components/common/HeroButton";

const STATS = [
  { value: "2k+", label: "Leads Delivered" },
  { value: "20+", label: "Trusted Brands" },
  { value: "97%", label: "Client Satisfaction" },
];

// The two offer cards, shown one at a time
const OFFERS = [
  { src: "/service/digital-marketing/hero/seo.png", alt: "Free website SEO audit" },
  { src: "/service/digital-marketing/hero/ads.png", alt: "Free 1-week paid ads campaign" },
];

const SWAP_MS = 4500;

// The same hero system as the banking, crypto and blockchain pages: copy on the left, artwork on the
// right, stacked and centred below lg, with the shared entrance (globals.css, .erp-hero-*). The
// artwork cross-fades between the SEO audit and paid ads offer cards (opacity only, both cards share
// one grid cell so nothing shifts); it stays on the first card when reduced motion is requested.
export default function MarketingHero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((i) => (i + 1) % OFFERS.length), SWAP_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section data-guide="marketingHero" className="relative overflow-hidden bg-[#e2f1ff]">
      {/* Sky-blue wash: brighter haze up top, softening to white at the bottom edge */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 40% at 35% 0%, #b3d8f8 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 0% 40%, #c6e7fa 0%, transparent 75%), linear-gradient(180deg, #cbe6fc 0%, #e2f1ff 55%, #ebf5fe 85%, #ffffff 100%)",
        }}
      />

      <div className="relative z-10 grid grid-cols-1 items-center gap-10 pt-28 pb-12 sm:pt-32 lg:min-h-[clamp(600px,52.8vw,800px)] lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-[4vw] lg:pt-[clamp(110px,8.5vw,130px)] lg:pb-[clamp(32px,3vw,48px)]">
        <div className="px-4 text-center sm:px-6 lg:pl-[clamp(2rem,10.35vw,11rem)] lg:pr-0 lg:text-left">
          <h1 className="erp-hero-line mx-auto max-w-[16em] text-[32px] font-medium leading-[1.2] tracking-tight text-balance text-[#002461] sm:text-[40px] lg:mx-0 lg:text-[clamp(40px,3.35vw,52px)]">
            Digital Marketing Company in Chennai That Drives Real Growth
          </h1>
          <p
            className="erp-hero-line mx-auto mt-4 max-w-xl text-base leading-snug text-[#002461] sm:text-lg lg:mx-0 lg:max-w-[600px] lg:text-[clamp(17px,1.3vw,20px)]"
            style={{ "--d": "0.12s" }}
          >
            Techzarinfo is a digital marketing company in Chennai helping businesses grow through SEO,
            Google Ads, Meta Ads, and social media marketing focused on visibility, qualified leads,
            and conversions.
          </p>

          <HeroButtonGroup className="erp-hero-line" style={{ "--d": "0.24s" }}>
            <HeroButton label="Get Free Proposal" href="/contact" />
            <HeroButton label="Free SEO Audit" href="/contact" variant="secondary" />
          </HeroButtonGroup>

          <dl
            className="erp-hero-line mt-8 flex flex-wrap justify-center gap-x-5 gap-y-4 sm:gap-x-10 lg:mt-10 lg:justify-start lg:gap-x-14"
            style={{ "--d": "0.36s" }}
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse">
                <dt className="mt-1 text-[13px] text-[#002461]/80 sm:text-sm lg:text-[15px]">{stat.label}</dt>
                <dd className="text-[26px] font-semibold sm:text-[28px] leading-none tracking-tight text-[#002461] lg:text-[clamp(28px,2.3vw,34px)]">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="erp-hero-art mx-auto w-[min(76vw,340px)] sm:w-[min(52vw,380px)] lg:mr-[clamp(2rem,8.3vw,9.5rem)] lg:w-[clamp(320px,27vw,420px)]">
          <div className="erp-hero-float grid drop-shadow-[0_24px_40px_rgba(0,36,97,0.14)]">
            {OFFERS.map((offer, i) => (
              <Image
                key={offer.src}
                src={offer.src}
                alt={offer.alt}
                aria-hidden={i !== active}
                width={524}
                height={715}
                preload={i === 0}
                className={`col-start-1 row-start-1 h-auto w-full transition-opacity duration-700 ease-in-out ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* White fade so the artwork blends into the next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-linear-to-b from-transparent to-white"
      />
    </section>
  );
}

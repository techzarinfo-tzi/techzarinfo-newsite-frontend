"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const ASSETS = "/product/CRM/features";

const features = [
  {
    title: "Deal Analysis & Intelligence",
    text: "Evaluate leads, identify sales bottlenecks, track pipeline progress, and prioritize high-value deals to improve conversions",
  },
  {
    title: "Won Analysis",
    text: "Analyze closed deals, uncover upselling and cross-selling opportunities, and use customer insights to increase revenue and retention.",
  },
  {
    title: "Sales Leaderboard",
    text: "Track individual and team performance, celebrate top performers, and motivate your sales team to achieve more.",
  },
  {
    title: "Task & Target Management",
    text: "Assign tasks, set sales targets, monitor progress, and keep your team accountable for business goals.",
  },
  {
    title: "Internal Chat Integration",
    text: "Connect your team with instant CRM messaging to share deal updates, collaborate faster, and make better decisions.",
  },
];

// The design's artwork (Content.svg), split into its layers so each card can scale on its own. Every
// layer keeps the full 702×766 canvas, so stacked in this order they draw exactly the original.
// origin: the card's centre on that canvas, which it scales about. range: the stretch of the
// section's scroll progress over which it grows, staggered back to front.
const backdrop = { src: `${ASSETS}/backdrop.svg` };
const cards = [
  {
    src: `${ASSETS}/pipeline.svg`,
    alt: "Pipeline statistics card with an average score, qualifications, proposals, invoices and won deals",
    origin: "64.7% 78.3%",
    range: [0, 0.8],
  },
  {
    src: `${ASSETS}/quick-actions.svg`,
    alt: "Quick actions card with new deal, qualification, proposals, invoices and export shortcuts",
    origin: "31.9% 41.3%",
    range: [0.1, 0.9],
  },
  {
    src: `${ASSETS}/classification.svg`,
    alt: "Classification donut chart splitting customers into upsell, top value, dormant and at risk",
    origin: "73.5% 40.5%",
    range: [0.2, 1],
  },
];

// How small the cards start (as a scale), before the section scrolls in: under a third of their size,
// so the growth is unmistakable. They end at exactly 1, their designed size, so they never outgrow it.
const START_SCALE = 0.3;

const clamp = (v) => Math.min(1, Math.max(0, v));
// A gentle ease-out (quadratic), so the growth keeps going through the scroll rather than all at once
const easeOut = (t) => 1 - (1 - t) ** 2;

// Scales the cards with the scroll: progress runs from 0, as the artwork's top reaches the bottom of
// the screen, to 1, as its centre reaches the middle. Each card maps its own slice of that (range)
// onto START_SCALE → 1. Transform only, written straight to the layers once per frame, so nothing
// around them moves. Reduced motion: the cards stay at full size.
function useScrollScale(artRef, layerRefs) {
  useEffect(() => {
    const art = artRef.current;
    const layers = layerRefs.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const rect = art.getBoundingClientRect();
      const p = clamp((vh - rect.top) / (vh / 2 + rect.height / 2));
      cards.forEach(({ range: [from, to] }, i) => {
        const t = easeOut(clamp((p - from) / (to - from)));
        layers[i].style.transform = `scale(${(START_SCALE + (1 - START_SCALE) * t).toFixed(4)})`;
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [artRef, layerRefs]);
}

// Layout from the 1440px design: centred heading and intro, then the five features on the left
// (~500px wide, one every 134px, as the design places them) and the artwork on the right at its
// native 702×766, vertically centred against the list. Tablet/phone: the list, then the artwork
// below it, scaled to the width.
export default function CrmFeatures() {
  const artRef = useRef(null);
  const layerRefs = useRef([]);
  useScrollScale(artRef, layerRefs);

  return (
    <section data-guide="crmFeatures" className="overflow-hidden bg-white px-4 pt-14 pb-12 sm:px-6 lg:px-8 lg:pt-[90px] lg:pb-11">
      <h2 className="mx-auto max-w-[14em] text-center text-[28px] font-semibold leading-[1.2] text-balance text-[#002461] sm:text-[34px] md:max-w-[19em] lg:text-[42px]">
        Powerful Features of Our Custom CRM Software Development Solutions
      </h2>
      <p className="mx-auto mt-3 max-w-[590px] text-center text-[15px] leading-snug text-[#002461] sm:text-base lg:mt-2 lg:text-xl lg:leading-[1.25]">
        Techzarinfo is the top-rated CRM software development company that brings its own TZI CRM
        product
      </p>

      <div className="mx-auto mt-12 flex max-w-[1180px] flex-col items-center gap-10 lg:mt-[92px] lg:flex-row lg:justify-between lg:gap-0">
        <ul className="flex w-full max-w-[600px] flex-col gap-7 lg:max-w-[498px] lg:shrink-0 lg:gap-0">
          {features.map((feature) => (
            <li key={feature.title} className="lg:h-[134px]">
              <h3 className="text-[17px] font-semibold leading-snug text-[#002461] lg:text-xl">{feature.title}</h3>
              <p className="mt-2 text-[15px] leading-[1.8] text-[#002461]/85 lg:mt-3">{feature.text}</p>
            </li>
          ))}
        </ul>

        <div ref={artRef} className="relative aspect-[702/766] w-full max-w-[702px] lg:shrink-0">
          <Image src={backdrop.src} alt="" width={702} height={766} className="absolute inset-0 h-full w-full" />
          {cards.map((card, i) => (
            <Image
              key={card.src}
              ref={(el) => (layerRefs.current[i] = el)}
              src={card.src}
              alt={card.alt}
              width={702}
              height={766}
              className="absolute inset-0 h-full w-full will-change-transform"
              style={{ transformOrigin: card.origin }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { Brain, Expand, Headset, Settings, Zap } from "lucide-react";
import { useInView } from "@/components/lms/LmsWhichFits";

// Icons from Lucide (lucide.dev), drawn in the design's blue via currentColor. The bolt and the cog
// are solid in the design (the cog keeps its centre hole, punched out in the tile's colour).
const reasons = [
  {
    Icon: Zap,
    solid: true,
    title: "Ready-to-use CRM",
    text: "Start with our branded TZI CRM and customize it to match your workflow.",
  },
  {
    Icon: Settings,
    solid: true,
    title: "Built Around Your Business",
    text: "Need something different? We can develop a CRM from scratch based on your exact requirements.",
  },
  {
    Icon: Brain,
    title: "AI Based Features",
    wide: true,
    text: "Based on your business requirements, we integrate AI-powered features to make your CRM smarter and more efficient.",
  },
  {
    Icon: Expand,
    title: "Flexible & Scalable",
    text: "Add features, integrations, and workflows as your business grows.",
  },
  {
    Icon: Headset,
    title: "Free Demo + Ongoing Support",
    text: "Explore TZI CRM before you decide, with technical support and regular updates after launch.",
  },
];


export default function CrmWhyRecognized() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef);

  return (
    <section
      ref={sectionRef}
      data-guide="crmWhy"
      data-inview={inView}
      className="crm-why bg-white px-4 py-14 sm:px-6 lg:px-8 lg:pt-[72px] lg:pb-[120px]"
    >
      <noscript>
        <style>{`.crm-why .why-anim { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>

      <div className="mx-auto max-w-[1176px]">
        <h2 className="why-anim why-rise max-w-[720px] text-[28px] font-semibold leading-[1.18] text-balance text-[#002461] sm:text-[34px] lg:max-w-none lg:text-[42px] lg:text-wrap">
          {/* The design's line break on desktop; smaller screens balance the lines themselves */}
          Why We Recognized as the Best CRM <br className="hidden lg:block" />
          Software Development Company?
        </h2>
        <p
          className="why-anim why-rise mt-3 max-w-[540px] text-[15px] leading-snug text-[#002461] sm:text-base lg:mt-2 lg:text-xl lg:leading-[1.25]"
          style={{ "--i": 1 }}
        >
          Techzarinfo is the top-rated CRM software development company that brings its own TZI CRM
          product
        </p>

        <ul className="mt-10 grid gap-x-[30px] gap-y-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-y-[83px]">
          {reasons.map(({ Icon, solid, wide, title, text }, i) => (
            <li key={title} className="why-anim why-card flex items-center gap-5 lg:gap-[22px]" style={{ "--i": i }}>
              <span
                aria-hidden="true"
                className="why-tile flex size-16 shrink-0 items-center justify-center rounded-[14px] bg-[#e1edfd] text-[#1a6be8] lg:size-[78px]"
              >
                <Icon
                  strokeWidth={solid ? 1.5 : 2}
                  fill={solid ? "currentColor" : "none"}
                  className={`size-7 lg:size-[38px] ${solid ? "[&_circle]:fill-[#e1edfd]" : ""}`}
                />
              </span>
              <div>
                <h3 className="text-[17px] font-medium leading-snug text-[#002461] lg:text-lg">{title}</h3>
                <p className={`mt-1.5 text-[13px] leading-[1.25] text-[#002461]/75 lg:text-[14px] lg:leading-[1.25] ${wide ? "max-w-[345px] min-[1400px]:w-[345px]" : "max-w-[268px]"}`}>
                  {text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

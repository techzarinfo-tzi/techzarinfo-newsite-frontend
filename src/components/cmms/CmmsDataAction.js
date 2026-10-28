"use client";

import { useRef } from "react";
import { ArrowRight, Database, Gauge, Settings, Shield } from "lucide-react";
import { useInView } from "@/components/lms/LmsWhichFits";

// Four outcome cards from the design, each in its own soft tint (blue, green, violet, blue): a
// tinted card, a deeper tile behind the icon and a matching round arrow badge.
const outcomes = [
  {
    Icon: Gauge,
    title: "Enhanced Reliability and Performance",
    text: "Minimize downtime and keep your assets running at their best with proactive maintenance and real-time insights.",
    tint: "from-[#f4f8ff] to-[#ebf2fe]",
    tile: "bg-[#dbe8fe] text-[#1d5fe0]",
  },
  {
    Icon: Settings,
    title: "Extended Equipment Lifespan",
    text: "Stay ahead of wear and tear with planned maintenance and timely interventions.",
    tint: "from-[#f3fbf6] to-[#e9f7ef]",
    tile: "bg-[#d5f2e1] text-[#1c9a52]",
  },
  {
    Icon: Shield,
    title: "Improved Safety and Compliance",
    text: "Reduce risks and meet industry standards with proper tracking, reporting, and audit readiness.",
    tint: "from-[#f6f5ff] to-[#eeecfe]",
    tile: "bg-[#e2defd] text-[#4537c4]",
  },
  {
    Icon: Database,
    title: "Cost Savings and Operational Efficiency",
    text: "Eliminate reactive repairs, optimize resources, and get more value from your assets and team.",
    tint: "from-[#f4f8ff] to-[#eaf1fe]",
    tile: "bg-[#d9e7ff] text-[#2a6cf0]",
  },
];

// Layout from the 1440px design: a left-aligned heading and intro (865px), then the four cards in a
// row (~300px each, 12px apart). Tablet: two by two. Phone: one column.
// Entrance (globals.css, .cmms-act): once the section is well into view, the heading and intro rise
// in, then the cards rise one after another with their icon tiles popping in (the LMS "Which Fits"
// keyframes). Transform and opacity only, so nothing around them moves. The section is
// server-rendered in its start state (data-inview=false), so nothing flashes before the script runs.
// Hover (pointer devices): the card lifts and its arrow nudges right.
export default function CmmsDataAction() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef);

  return (
    <section
      ref={sectionRef}
      data-guide="cmmsDataAction"
      data-inview={inView}
      className="cmms-act bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
    >
      <noscript>
        <style>{`.cmms-act .act-anim { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>

      <div className="mx-auto max-w-[1215px]">
        <div className="max-w-[865px]">
          <h2 className="act-anim act-rise text-[28px] font-semibold leading-[1.25] tracking-tight text-balance text-[#002461] sm:text-[34px] lg:text-[40px]">
            What Happens When Our CMMS Development Solutions Turn Data into Action
          </h2>
          <p
            className="act-anim act-rise mt-4 text-[15px] leading-normal text-[#002461] sm:text-base lg:mt-8 lg:text-xl"
            style={{ "--i": 1 }}
          >
            Our CMMS development solutions are not just about implementing software into your industry -
            they are about bringing measurable value to your maintenance operations. Our CMMS software
            developers don&apos;t simply hand over the software; they help your team understand,
            configure, and use the system effectively
          </p>
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {outcomes.map(({ Icon, title, text, tint, tile }, i) => (
            <li
              key={title}
              className={`act-anim act-card group flex flex-col rounded-2xl border border-white bg-linear-to-b p-6 shadow-[0_10px_30px_-18px_rgba(0,36,97,0.25)] lg:min-h-[339px] lg:p-[clamp(20px,1.7vw,26px)] ${tint}`}
              style={{ "--i": i }}
            >
              <span aria-hidden="true" className={`act-tile flex size-14 items-center justify-center rounded-xl lg:size-16 ${tile}`}>
                <Icon strokeWidth={2} className="size-7 lg:size-8" />
              </span>
              <h3 className="mt-6 text-[15px] font-semibold uppercase leading-snug tracking-wide text-[#0b1a33] lg:mt-7 lg:text-base">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5b6a85] lg:text-[15px]">{text}</p>
              <span
                aria-hidden="true"
                className="mt-auto pt-6"
              >
                <span className={`act-arrow flex size-9 items-center justify-center rounded-full ${tile}`}>
                  <ArrowRight strokeWidth={2} className="size-4" />
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

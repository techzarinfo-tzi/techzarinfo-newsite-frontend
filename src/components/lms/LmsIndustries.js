"use client";

import Image from "next/image";
import { useState } from "react";

const ASSETS = "/product/LMS/industry/";

// lines: the name as the design breaks it under the card; back: the text on the blue reverse side
const industries = [
  {
    name: "Information Technology (IT)",
    lines: ["Information", "Technology (IT)"],
    image: "IT.webp",
    back: "Deliver technical training, certifications, onboarding, and skill development with an LMS built for fast-changing IT environments.",
  },
  {
    name: "Online Training",
    lines: ["Online", "Training"],
    image: "trainning.webp",
    back: "Create, sell, and deliver online courses with engaging content, assessments, and certificates that keep learners coming back.",
  },
  {
    name: "Finance and Banking",
    lines: ["Finance and", "Banking"],
    image: "finance (2).webp",
    back: "Keep teams compliant and current with regulatory training, risk awareness courses, and audit-ready completion records.",
  },
  {
    name: "Manufacturing and Engineering",
    lines: ["Manufacturing and", "Engineering"],
    image: "manufacture&eng.webp",
    back: "Train workforces on safety, equipment, and processes with consistent, trackable programs for every shift and site.",
  },
  {
    name: "Retail and Customer Service",
    lines: ["Retail and Customer", "Service"],
    image: "support.webp",
    back: "Onboard staff quickly and build product knowledge and service skills that create better customer experiences.",
  },
  {
    name: "Telecommunications",
    lines: ["Telecommunications"],
    image: "telecomunication.webp",
    back: "Upskill technical and support teams on networks, new services, and tools with role-based learning paths.",
  },
  {
    name: "Education",
    lines: ["Education"],
    image: "education.webp",
    back: "Support schools, colleges, and institutes with virtual classrooms, course management, and student progress tracking.",
  },
  {
    name: "Consulting and Professional Services",
    lines: ["Consulting and", "Professional Services"],
    image: "consulting.webp",
    back: "Develop consultants' expertise with structured programs, knowledge sharing, and certifications that strengthen client delivery.",
  },
];

// One flip card. A mouse (or pen) flips it on hover and back when it leaves; a click, tap, Enter or
// Space flips it either way. Touch pointers skip the hover handlers (phones report a tap as a hover
// too), so on touch screens a tap is the one flip. aria-pressed tells screen readers which side is
// showing. The two faces sit in the same grid cell, so they are always exactly the same size and
// position; the back is pre-turned 180°, so it reads the right way round once the card turns, and
// backface-visibility hides whichever face points away (no mirrored text).
function IndustryCard({ industry, flipped, onFlip, onHover }) {
  const hover = (on) => (e) => {
    if (e.pointerType !== "touch") onHover(on);
  };

  return (
    <li className="flex flex-col items-center">
      <button
        type="button"
        aria-pressed={flipped}
        aria-label={`${industry.name}: ${flipped ? "hide" : "show"} details`}
        onClick={onFlip}
        onPointerEnter={hover(true)}
        onPointerLeave={hover(false)}
        className="group w-full touch-manipulation rounded-2xl [perspective:1100px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005EFF]"
      >
        <span className={`ind-flip grid aspect-205/239 w-full ${flipped ? "is-flipped" : ""}`}>
          {/* Front: the round illustration on white */}
          <span className="ind-face col-start-1 row-start-1 flex items-center justify-center rounded-2xl border border-[#9cc2ff] bg-white shadow-[0_6px_18px_-6px_rgba(0,94,255,0.22)] transition-shadow duration-300 group-hover:shadow-[0_10px_26px_-8px_rgba(0,94,255,0.35)]">
            <Image
              src={encodeURI(`${ASSETS}${industry.image}`)}
              alt=""
              width={145}
              height={145}
              className="h-auto w-[71%]"
            />
          </span>

          {/* Back: blue, with the industry's summary */}
          <span className="ind-face ind-back col-start-1 row-start-1 flex items-center justify-center rounded-2xl border border-[#3b7cf5] bg-linear-to-b from-[#2f6ff0] to-[#1f5fe6] px-4 text-center shadow-[0_10px_26px_-8px_rgba(0,94,255,0.45)] sm:px-5">
            <span className="text-[12px] leading-[1.45] text-white sm:text-[13px] lg:text-sm">{industry.back}</span>
          </span>
        </span>
      </button>

      <h3 className="mt-4 text-center text-[15px] leading-snug text-[#002461] sm:text-base lg:mt-5">
        {industry.lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h3>
    </li>
  );
}

// Grid from the 1440px design: four ~205px cards per row, ~38px apart, 930px wide in all, with the
// industry name under each card. Two per row on phones, four from tablets up. Each card flips on its
// own; this section has no scroll effects, so it never interferes with the scroll-driven sections.
export default function LmsIndustries() {
  const [flipped, setFlipped] = useState(() => new Set());

  // on: true / false sets the side; undefined toggles it
  const flip = (name, on) =>
    setFlipped((prev) => {
      const show = on ?? !prev.has(name);
      if (show === prev.has(name)) return prev;
      const next = new Set(prev);
      if (show) next.add(name);
      else next.delete(name);
      return next;
    });

  return (
    <section data-guide="lmsIndustries" className="bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[760px] text-center">
        <h2 className="text-[28px] font-semibold leading-[1.25] tracking-tight text-balance text-[#002461] sm:text-[34px] lg:text-[40px]">
          Evolvera LMS Solutions for Every Industry
        </h2>
        <p className="mx-auto mt-3 max-w-[700px] text-[15px] leading-normal text-[#002461] sm:text-base lg:text-lg">
          Evolvera is a flexible LMS designed to support the unique learning, training, and compliance
          needs of different industries
        </p>
      </div>

      <ul className="mx-auto mt-10 grid max-w-[930px] grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 md:grid-cols-4 md:gap-x-[clamp(20px,3vw,38px)] lg:mt-14 lg:gap-y-14">
        {industries.map((industry) => (
          <IndustryCard
            key={industry.name}
            industry={industry}
            flipped={flipped.has(industry.name)}
            onFlip={() => flip(industry.name)}
            onHover={(on) => flip(industry.name, on)}
          />
        ))}
      </ul>
    </section>
  );
}

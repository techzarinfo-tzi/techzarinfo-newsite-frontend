"use client";

import Image from "next/image";
import { useRef } from "react";
import { StarIcon } from "@/components/cmms/CmmsAppDevelopment";
import { useInView } from "@/components/lms/LmsWhichFits";

const points = [
  "Seamless Content Delivery",
  "Interactive Collabration Tools",
  "Real Time Progress Tracking",
  "Robust Communication Channels",
];

export default function SmsSingleStop() {
  return (
    <SmsSplitSection
      guide="smsSingleStop"
      title="Single Stop Solution For School Management"
      text={
        <>
          Techzarinfo&apos;s online school management software streamlines daily school activities,
          including attendance, timetables, performance tracking, and parent communication. As a
          complete education management system, it automates workflows, reduces manual tasks, and
          provides real-time insights
        </>
      }
      points={points}
      image={{
        src: "/product/SMS/single-stop/single-stop.svg",
        width: 725,
        height: 517,
        alt: "School management dashboard surrounded by panels for content delivery, collaboration tools, progress tracking and communication",
      }}
    />
  );
}

// Layout from the 1440px designs: copy (~600px wide) with the CMMS star bullets on one side, the
// dashboard artwork on the other, both vertically centred. By default the copy sits on the left (from
// ~90px in) and the artwork runs close to the right edge (~725px wide); `reverse` mirrors it, with the
// artwork close to the left edge and the copy filling the rest (from ~48vw). `columns={2}` lays the bullets out in two
// columns on desktop. Below lg the copy is centred above the artwork.
// Entrance reuses the CMMS "Data into Action" styles (globals.css, .cmms-act): the heading, intro and
// bullets rise in one after another, with the artwork rising alongside.
export function SmsSplitSection({ guide, title, text, points: items, image, reverse = false, columns = 1, titleWidth = "lg:max-w-[600px]" }) {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef);

  return (
    <section
      ref={sectionRef}
      data-guide={guide}
      data-inview={inView}
      className={`cmms-act overflow-hidden bg-white px-4 py-14 sm:px-6 lg:py-[clamp(48px,5.8vw,84px)] ${
        reverse ? "lg:pr-[clamp(2rem,6.25vw,90px)] lg:pl-4" : "lg:pr-0 lg:pl-[clamp(2rem,6.25vw,90px)]"
      }`}
    >
      <noscript>
        <style>{`.cmms-act .act-anim { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>

      <div
        className={`mx-auto flex max-w-[1440px] flex-col items-center gap-10 ${
          reverse ? "lg:flex-row-reverse" : "lg:flex-row lg:gap-[2%]"
        }`}
      >
        <div className={`w-full max-w-[640px] text-center lg:text-left ${titleWidth} ${
            reverse ? "lg:min-w-0 lg:flex-1" : "lg:w-[46%] lg:shrink-0"
          }`}>
          <h2 className="act-anim act-rise text-[28px] font-semibold leading-[1.25] tracking-tight text-balance text-[#002461] sm:text-[34px] lg:text-wrap lg:text-[clamp(32px,2.8vw,40px)]">
            {title}
          </h2>
          <p
            className="act-anim act-rise mt-3 text-[15px] leading-[1.4] text-[#002461] sm:text-base lg:mt-[clamp(10px,1vw,14px)] lg:max-w-[600px] lg:text-[clamp(16px,1.25vw,18px)]"
            style={{ "--i": 1 }}
          >
            {text}
          </p>

          <ul
            className={`mx-auto mt-8 grid w-fit gap-4 text-left sm:grid-cols-2 sm:gap-x-10 lg:mx-0 lg:mt-[clamp(28px,2.8vw,40px)] lg:gap-[clamp(14px,1.6vw,23px)] ${
              columns === 2 ? "lg:grid-cols-[repeat(2,clamp(190px,18vw,259px))] lg:gap-x-0" : "lg:grid-cols-1"
            }`}
          >
            {items.map((label, i) => (
              <li
                key={label}
                className="act-anim act-rise flex items-center gap-[15px] text-base text-[#002461] sm:text-lg lg:text-[clamp(16px,1.25vw,18px)]"
                style={{ "--i": i + 2 }}
              >
                <StarIcon />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`act-anim act-rise w-full max-w-[640px] ${
            reverse ? "lg:mr-auto lg:w-[48.1vw] lg:max-w-[693px]" : "lg:ml-auto lg:w-[50.4vw] lg:max-w-[725px]"
          }`}
          style={{ "--i": 2 }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            unoptimized
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}

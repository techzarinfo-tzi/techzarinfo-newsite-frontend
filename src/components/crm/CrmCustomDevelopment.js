"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// The tablet artwork (hands holding the CRM dashboard). Its top ~16% is transparent, above the tablet.
const ARTWORK = { src: "/product/CRM/CRM-page-2.svg", width: 1007, height: 657 };

// Flips true once the whole section is on screen (once only). A section taller than the viewport can
// never be fully visible, so for it "whole" means it fills the viewport instead.
function useFullyInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        const fills = entry.intersectionRect.height >= (entry.rootBounds?.height ?? Infinity) - 2;
        if (entry.intersectionRatio < 0.99 && !fills) return;
        setInView(true);
        io.disconnect();
      },
      { threshold: Array.from({ length: 101 }, (_, i) => i / 100) },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

// Centred copy over the tablet, from the 1440px design: heading on two lines, paragraph ~660px wide,
// then the artwork at its native 1007px, lifted so its transparent top tucks under the paragraph and
// cut flush at the section bottom. The two floating stat cards are not part of the artwork; they sit
// over it at the design's offsets (percentages of the artwork box) and are sized in container units,
// so they scale with the tablet at every width.
// Entrance (globals.css, .crm-dev): while the section scrolls in, the tablet and cards wait a little
// below their places; once the whole section is on screen, the tablet rises into place, then the two
// cards follow, one after the other. Transform only, so nothing around them moves. The section is
// server-rendered in its start state (data-inview=false), so nothing jumps before the script runs.
export default function CrmCustomDevelopment() {
  const sectionRef = useRef(null);
  const inView = useFullyInView(sectionRef);

  return (
    <section
      ref={sectionRef}
      data-guide="crmCustomDevelopment"
      data-inview={inView}
      className="crm-dev relative overflow-hidden bg-white"
    >
      <noscript>
        <style>{`.crm-dev .dev-anim { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>

      {/* Pale blue-grey wash, with a brighter blue haze rising on the right */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 70% at 100% 85%, #c9def8 0%, transparent 75%), radial-gradient(ellipse 40% 50% at 0% 70%, #f4f7fc 0%, transparent 75%), linear-gradient(180deg, #edf2fa 0%, #f3f6fc 45%, #eaf1fb 100%)",
        }}
      />

      <div className="relative px-4 pt-12 sm:px-6 sm:pt-14 lg:pt-[84px]">
        <h2 className="mx-auto max-w-[14em] text-center text-[32px] font-semibold leading-[1.25] tracking-tight text-[#002461] text-balance sm:text-[34px] lg:text-[40px]">
          Custom CRM Development With Techzarinfo
        </h2>
        <p className="mx-auto mt-4 max-w-[660px] text-center text-base leading-[1.35] text-[#002461] lg:mt-5 lg:text-[19px] lg:tracking-[-0.01em]">
          Your business has its own way of selling, managing customers, and driving growth - so your
          CRM should work around your process, not force you to change it.
        </p>

        <div className="@container relative mx-auto -mt-[clamp(8px,5.5vw,80px)] w-full max-w-[1007px]">
          <Image
            src={ARTWORK.src}
            alt="Hands holding a tablet showing a CRM dashboard with deals, revenue, sales performance, deal pipeline, recent contacts and upcoming tasks"
            width={ARTWORK.width}
            height={ARTWORK.height}
            sizes="(max-width: 1007px) 100vw, 1007px"
            className="dev-anim dev-art h-auto w-full"
          />

          <EfficiencyCard />
          <ConversionCard />
        </div>
      </div>
    </section>
  );
}

// Floating card over the left hand: an efficiency donut with its total and legend.
// Ring: from the top, 30% inactive (light blue) then 70% active (dark blue), with gaps between.
function EfficiencyCard() {
  const r = 40;
  const c = 2 * Math.PI * r;
  const gap = 0.012 * c;

  return (
    <div className="dev-anim dev-card absolute top-[26.9%] left-[4.1%] w-[15.3%]" style={{ "--i": 0 }}>
      <div className="animate-float rounded-[1.2cqw] bg-white p-[1.4cqw] text-[1cqw] shadow-[0_1cqw_3cqw_rgba(0,36,97,0.12)]">
        <p className="text-[1.15cqw] font-semibold text-[#1f2937]">Efficiency</p>

        <div className="relative mx-auto mt-[1.2cqw] w-[78%]">
          <svg viewBox="0 0 100 100" className="block h-auto w-full -rotate-90" aria-hidden="true">
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="#b8cdfb"
              strokeWidth="9"
              strokeDasharray={`${0.3 * c - gap} ${c}`}
            />
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="#2f6bf2"
              strokeWidth="9"
              strokeDasharray={`${0.7 * c - gap} ${c}`}
              strokeDashoffset={-0.3 * c}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center leading-tight">
            <span className="text-[0.85cqw] text-[#6b7280]">Total</span>
            <span className="text-[1.55cqw] font-semibold text-[#111827]">$8,590</span>
          </div>
          <span className="absolute top-[4%] right-[-6%] rounded-[0.3cqw] bg-white px-[0.4cqw] py-[0.1cqw] text-[0.7cqw] text-[#4b5563] shadow-[0_0.2cqw_0.6cqw_rgba(0,36,97,0.15)]">
            30%
          </span>
          <span className="absolute bottom-[22%] left-[-8%] rounded-[0.3cqw] bg-white px-[0.4cqw] py-[0.1cqw] text-[0.7cqw] text-[#4b5563] shadow-[0_0.2cqw_0.6cqw_rgba(0,36,97,0.15)]">
            70%
          </span>
        </div>

        <div className="mt-[1.2cqw] flex items-center justify-center gap-[1.6cqw] text-[0.75cqw] text-[#6b7280]">
          <span className="flex items-center gap-[0.4cqw]">
            <span className="h-[0.35cqw] w-[0.9cqw] rounded-full bg-[#2f6bf2]" />
            Active
          </span>
          <span className="flex items-center gap-[0.4cqw]">
            <span className="h-[0.35cqw] w-[0.9cqw] rounded-full bg-[#b8cdfb]" />
            Inactive
          </span>
        </div>
      </div>
    </div>
  );
}

// Floating card over the right hand: conversion rate with a sparkline, its peak marked in red.
function ConversionCard() {
  return (
    <div className="dev-anim dev-card absolute top-[63.3%] left-[68.7%] w-[26.2%]" style={{ "--i": 1 }}>
      <div
        className="animate-float flex items-center gap-[1.6cqw] rounded-[1cqw] bg-white px-[1.8cqw] py-[1.3cqw] shadow-[0_1cqw_3cqw_rgba(0,36,97,0.12)] [animation-delay:-1.75s]"
      >
        <div className="shrink-0 leading-tight">
          <p className="text-[1.9cqw] font-semibold text-[#111827]">15.10%</p>
          <p className="mt-[0.2cqw] text-[0.8cqw] text-[#6b7280]">Conversion rate</p>
        </div>
        <svg viewBox="0 0 120 50" className="h-auto min-w-0 flex-1" aria-hidden="true">
          <path
            d="M2 32 C10 36 14 42 20 40 S32 26 40 25 S52 22 58 16 S64 4 68 6 S76 18 84 18 S96 6 102 8 S112 26 118 40"
            fill="none"
            stroke="#7c9cf5"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="68" cy="6" r="3" fill="#f05252" />
        </svg>
      </div>
    </div>
  );
}

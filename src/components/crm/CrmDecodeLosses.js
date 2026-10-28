"use client";

import { useRef } from "react";
import Image from "next/image";
import { useInView } from "@/components/lms/LmsWhichFits";

// The tilted "High-Value Lost Deals" card; transparent around the card itself
const ARTWORK = { src: "/product/CRM/decode.svg", width: 389, height: 362 };

// Layout from the 1440px design: the locked preview on the left (a 481×370 pale-blue frame with a
// navy border lightening towards its top-right corner), the copy on the right, ~100px apart and vertically centred. The
// deal card inside the frame is blurred, so it reads as a teaser, with the padlock badge at its
// top-right corner. Tablet/phone: the preview stacks above the copy.
// Entrance (globals.css, .crm-decode): once the section is well into view, the preview and the copy
// rise in (the LMS "Which Fits" rise keyframes). Transform and opacity only, so nothing shifts.
export default function CrmDecodeLosses() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef);

  return (
    <section
      ref={sectionRef}
      data-guide="crmDecode"
      data-inview={inView}
      className="crm-decode bg-white px-4 py-14 sm:px-6 lg:px-8 lg:pt-20 lg:pb-[90px]"
    >
      <noscript>
        <style>{`.crm-decode .decode-anim { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>

      <div className="mx-auto flex max-w-[1260px] flex-col items-center gap-10 lg:flex-row lg:gap-[clamp(40px,7vw,100px)]">
        {/* Locked preview */}
        <div className="decode-anim relative aspect-[481/370] w-full max-w-[481px] shrink-0 overflow-hidden decode-frame rounded-[18px] border-[3px] border-transparent">
          <Image
            src={ARTWORK.src}
            alt="Blurred preview of a High-Value Lost Deals report with lost deal values, stages and recovery chances"
            width={ARTWORK.width}
            height={ARTWORK.height}
            sizes="(max-width: 520px) 80vw, 385px"
            className="absolute top-[3%] left-[9.3%] h-auto w-[80%] blur-[4px]"
          />

          {/* Padlock badge: a blue disc in a pale halo */}
          <span
            aria-hidden="true"
            className="absolute top-[17.5%] left-[87.6%] flex aspect-square w-[15.5%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#b9d4fb]/80"
          >
            <span className="flex size-[76%] items-center justify-center rounded-full bg-linear-to-b from-[#3a90f7] to-[#1767e2] shadow-[0_4px_10px_rgba(16,92,214,0.35),inset_0_1px_1px_rgba(255,255,255,0.35)]">
              <Padlock />
            </span>
          </span>
        </div>

        {/* Copy */}
        <div className="decode-anim w-full max-w-[680px] text-[#002461]" style={{ "--i": 1 }}>
          <h2 className="text-[28px] font-semibold leading-[1.22] tracking-tight text-balance sm:text-[32px] lg:text-[clamp(30px,2.55vw,37px)]">
            Decode Your Sales Losses With Insights: Feature You Won&rsquo;t Find Anywhere Else
          </h2>
          <p className="mt-5 max-w-[600px] text-base leading-[1.3] sm:text-lg lg:mt-6 lg:text-[clamp(18px,1.4vw,20px)] lg:leading-[1.25]">
            What if your CRM could reveal why deals slip away before the same mistakes happen again?
            Uncover hidden sales patterns, pinpoint pipeline gaps, identify recurring obstacles, and
            discover opportunities to improve your win rate.
          </p>
          <p className="mt-6 text-base leading-[1.3] sm:text-lg lg:mt-7 lg:text-[clamp(18px,1.4vw,20px)]">
            Your Sales Data Knows More Than You Think. See It Live
          </p>

          <a
            href="#contact"
            onClick={scrollToContact}
            className="mt-8 inline-flex h-[46px] items-center rounded-md bg-[#002461] px-[18px] text-base text-white transition-colors hover:bg-[#0a3480] lg:mt-10 lg:text-[17px]"
          >
            Want to See It in Action?
          </a>
        </div>
      </div>
    </section>
  );
}

// Scrolls to the site-wide Contact Us section (ContactUsSection.js, #contact) at the bottom of the
// page, stopping where that section is laid out to sit: just under the fixed navbar, by the room it
// reserves for it (its --cu-nav, 96px; 84px on phones), so its heading is never hidden. Smooth unless
// the visitor prefers reduced motion. Without the script, the plain #contact link still jumps there.
function scrollToContact(event) {
  const contact = document.getElementById("contact");
  if (!contact) return;
  event.preventDefault();

  const nav = parseFloat(getComputedStyle(contact.querySelector(".cu-in") ?? contact).getPropertyValue("--cu-nav")) || 96;
  const top = contact.getBoundingClientRect().top + window.scrollY - nav;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}

// A gold padlock: a brushed-metal shackle over a gold body with a soft top highlight, a darker base
// and an inset keyhole, lifted off the disc by a small shadow. It swings gently from the top of its
// shackle, like a hanging lock (.decode-lock in globals.css).
function Padlock() {
  return (
    <svg viewBox="0 0 64 64" className="decode-lock h-auto w-[66%] drop-shadow-[0_1.5px_1.5px_rgba(0,30,90,0.35)]">
      <defs>
        <linearGradient id="decode-lock-shackle" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8d97a6" />
          <stop offset="0.3" stopColor="#eef1f5" />
          <stop offset="0.55" stopColor="#b7c0cc" />
          <stop offset="0.8" stopColor="#e3e8ee" />
          <stop offset="1" stopColor="#87919f" />
        </linearGradient>
        <linearGradient id="decode-lock-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe17a" />
          <stop offset="0.45" stopColor="#f7b928" />
          <stop offset="1" stopColor="#dc8f0b" />
        </linearGradient>
        <linearGradient id="decode-lock-keyhole" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a3500" />
          <stop offset="1" stopColor="#8a5703" />
        </linearGradient>
      </defs>

      {/* Shackle, its legs disappearing into the body */}
      <path
        d="M20.5 30V21a11.5 11.5 0 0 1 23 0v9"
        fill="none"
        stroke="url(#decode-lock-shackle)"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <path d="M17.2 28.5h6.6M40.2 28.5h6.6" stroke="#6f7886" strokeOpacity="0.45" strokeWidth="1.2" />

      {/* Body */}
      <rect x="10" y="28" width="44" height="30" rx="7" fill="url(#decode-lock-body)" />
      <rect x="10.6" y="28.6" width="42.8" height="28.8" rx="6.4" fill="none" stroke="#b56f00" strokeOpacity="0.45" strokeWidth="1.2" />
      <rect x="14" y="30.5" width="36" height="5" rx="2.5" fill="#fff" fillOpacity="0.38" />

      {/* Keyhole */}
      <circle cx="32" cy="41.5" r="4.4" fill="url(#decode-lock-keyhole)" />
      <path d="M30 44h4l1.1 6.8a1 1 0 0 1-1 1.2h-4.2a1 1 0 0 1-1-1.2z" fill="url(#decode-lock-keyhole)" />
      <circle cx="32" cy="41.5" r="4.4" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="0.8" transform="translate(0 0.8)" />
    </svg>
  );
}

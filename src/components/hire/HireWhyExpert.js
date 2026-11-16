"use client";

import { useState } from "react";
import Image from "next/image";

// "Why Your Project Needs Our Expert Team": heading and intro, then a row of photo cards where one
// card is open (photo, dark-blue fade, title and text) and the rest are slim strips that step down
// in width the further they are from it. Hovering a card previews it; clicking (or tapping, or
// Enter/Space) keeps it open. Below md the cards stack and open downwards, each strip showing its
// title.
//
// Image: public/hire-a-developer/your-project-need/1.webp (rendered at 2x from the supplied 1.svg),
// used on every card for now; give a card its own `image` to replace it.
const IMAGE = "/hire-a-developer/your-project-need/1.webp";

// Only the first card's text is in the design; the rest are placeholders to replace.
const CARDS = [
  {
    title: "Custom-Tailored Development",
    text: "Every project is designed around your unique workflow and goals. We create solutions that completely suit your business model.",
  },
  {
    title: "Faster Onboarding",
    text: "Skilled AI engineers, architects and product specialists join your project in days, not weeks, with a simple hiring process.",
  },
  {
    title: "Specialist Expertise",
    text: "Full-stack developers, cloud engineers and Claude AI developers who bring hands-on experience to every part of your build.",
  },
  {
    title: "Flexible Engagement",
    text: "Scale your team up or down as your project evolves, with hiring models that fit your timeline and budget.",
  },
  {
    title: "Transparent Collaboration",
    text: "Regular updates, clear communication and full visibility, so you always know where your project stands.",
  },
];

// How much of the row each card takes: the open card most, then less the further a card is from it
// (the design's strips run ~3.6 : 2.9 : 1.9 : 1 against an open card of ~21).
const OPEN_GROW = 21;
const STRIP_GROW = [3.6, 2.85, 1.95, 1];

// Where each strip's photo is cropped, so the slim cards don't all show the same slice
const CROPS = ["50% 50%", "62% 40%", "78% 30%", "88% 55%", "30% 60%"];

export default function  HireWhyExpert() {
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState(null);
  const open = hovered ?? selected;

  return (
    <section
      aria-labelledby="hire-why-title"
      data-guide="hireWhy"
      className="bg-white px-4 py-16 sm:px-6 lg:px-0 lg:py-[clamp(4rem,6.5vw,6.5rem)]"
    >
      <div className="lg:pr-[clamp(2rem,10.35vw,11rem)] lg:pl-[clamp(2rem,10.35vw,11rem)]">
        <h2
          id="hire-why-title"
          className="text-[28px] font-semibold leading-[1.18] tracking-tight text-[#0f2a6b] sm:text-[34px] lg:text-[clamp(34px,3.1vw,46px)]"
        >
          Why Your Project Needs Our Expert Team
        </h2>
        <p className="mt-3 max-w-[56rem] text-[15px] leading-snug text-[#1d2f63] sm:text-[17px] lg:text-[clamp(17px,1.35vw,20px)]">
          Our hiring process is faster than you expect. We follow a simple and efficient hiring model that helps you
          onboard skilled AI engineers, architects, and product specialists in days rather than weeks.
        </p>
      </div>

      <div
        className="mt-10 flex h-[38rem] flex-col gap-2.5 sm:h-[34rem] md:h-[clamp(20rem,27vw,24.5rem)] md:flex-row md:gap-[clamp(0.5rem,1.1vw,1rem)] lg:mt-[clamp(2.5rem,4.2vw,4rem)] lg:pr-[clamp(2rem,12.8vw,13.5rem)] lg:pl-[clamp(2rem,13.2vw,14rem)]"
        onMouseLeave={() => setHovered(null)}
      >
        {CARDS.map((card, i) => {
          const isOpen = i === open;
          const grow = isOpen ? OPEN_GROW : STRIP_GROW[Math.min(Math.abs(i - open), STRIP_GROW.length) - 1];
          return (
            <button
              key={card.title}
              type="button"
              aria-expanded={isOpen}
              aria-label={isOpen ? undefined : card.title}
              onClick={() => setSelected(i)}
              onMouseEnter={() => {
                // Mouse only: on touch screens a tap selects instead of a sticky hover
                if (window.matchMedia("(hover: hover)").matches) setHovered(i);
              }}
              onFocus={() => setHovered(null)}
              style={{ flexGrow: grow }}
              className="group relative min-h-12 min-w-0 basis-0 overflow-hidden rounded-xl text-left transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f6ff0] motion-reduce:transition-none md:min-h-0 md:min-w-3"
            >
              <Image
                src={card.image ?? IMAGE}
                alt=""
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                className={`object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${isOpen ? "scale-100" : "scale-110"}`}
                style={{ objectPosition: isOpen ? "50% 50%" : CROPS[i % CROPS.length] }}
              />

              {/* Dark-blue fade: strong along the bottom-left of the open card, a light tint on strips */}
              <span
                aria-hidden="true"
                className={`absolute inset-0 transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
                style={{
                  background:
                    "linear-gradient(90deg, rgba(4,26,92,0.92) 0%, rgba(8,38,120,0.6) 38%, rgba(10,44,130,0.08) 75%, rgba(10,44,130,0) 100%), linear-gradient(0deg, rgba(4,26,92,0.75) 0%, rgba(4,26,92,0) 55%)",
                }}
              />
              <span
                aria-hidden="true"
                className={`absolute inset-0 bg-[#062a7a]/35 transition-opacity duration-500 ${isOpen ? "opacity-0" : "opacity-100 group-hover:opacity-20"}`}
              />

              {/* Open card: title and text, fading up once the card has room */}
              <span
                aria-hidden={!isOpen}
                className={`absolute inset-x-0 bottom-0 block p-5 text-white sm:p-6 lg:p-[clamp(1.25rem,2vw,2rem)] ${
                  isOpen
                    ? "translate-y-0 opacity-100 transition-[opacity,translate] delay-300 duration-500"
                    : "pointer-events-none translate-y-3 opacity-0 transition-[opacity,translate] duration-200"
                } motion-reduce:transition-none`}
              >
                <span className="block min-w-[16rem] text-[20px] font-medium sm:text-[22px] lg:text-[clamp(22px,1.9vw,27px)]">
                  {card.title}
                </span>
                <span className="mt-2 block max-w-[30rem] min-w-[16rem] text-[14px] leading-snug text-white/85 sm:text-[15px] lg:mt-3 lg:text-[clamp(15px,1.25vw,18px)]">
                  {card.text}
                </span>
              </span>

              {/* Phones: a collapsed strip shows its title */}
              <span
                aria-hidden="true"
                className={`absolute inset-0 flex items-center px-4 text-[15px] font-medium text-white transition-opacity duration-300 md:hidden ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              >
                {card.title}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

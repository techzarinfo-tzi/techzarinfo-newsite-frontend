"use client";

import { useEffect, useRef, useState } from "react";

// "Our Streamlined Contract Staffing Process": centred heading and intro, then the design's row of
// large numerals 1 | 2 | 3 divided by two tall vertical rules, with the current step's title and
// text to their right. Desktop (lg) lays everything out on the design frame (1000 x 640, in % and
// container units, so it scales as a whole); below lg the numerals and rules sit centred above the
// step text.
//
// Motion (globals.css .hp-*), in the site's easing:
//   1. Entrance, once, as the section scrolls in: the rules draw out from their middle, the
//      numerals rise into view one after another, then the step text fades up.
//   2. Steps: hovering a numeral (mouse) previews its step; clicking or tapping it (or Enter/Space)
//      selects it, and it stays selected until another is chosen. The chosen numeral grows while
//      the others shrink slightly and fade back, and the step text swaps (the old step rises away,
//      the new one rises in).
// Reduced motion: everything shows at rest and steps swap without movement.

// The steps, in order; there is one numeral per step
const STEPS = [
  {
    title: "Submit your Developer Request",
    text: "The first step in contract staffing is to share your requirements through filling the form.",
  },
  {
    title: "Screening our Expert’s Resume",
    text: "Our developer's resume will be shared with your mail.",
  },
  {
    title: "Virtual Interview",
    text: "Selected candidates can join a virtual interview with your technical team.",
  },
  {
    title: "Onboard for Your Project",
    text: "Onboard our resource model & kickstart your project.",
  },
];

// Desktop positions (% of the design frame), at the design's spacing: numeral centres, the rules
// between them, and where the step text starts (just past the last numeral)
const NUM_X = [8.3, 20, 34.6, 49.2];
const RULE_X = [12.8, 27.3, 41.9];
const TEXT_X = 41.7 + (NUM_X[STEPS.length - 1] - NUM_X[2]);

export default function HireProcess() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  // The clicked/tapped step, and the one the mouse is over (previewed); the hovered one wins
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState(null);
  const active = hovered ?? selected;

  // Entrance, once
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);


  return (
    <div className="relative">
      <section
        ref={sectionRef}
        aria-labelledby="hire-process-title"
        data-guide="hireProcess"
        data-in={inView}
        className="hp @container overflow-hidden bg-white px-4 py-16 sm:px-6 lg:px-0 lg:py-0"
      >
        {/* Without JavaScript nothing animates in: show everything at rest */}
        <noscript>
          <style>{`.hp .hp-rule, .hp .hp-num { scale: 1 1 !important; translate: 0 0 !important; } .hp .hp-step:first-child + .hp-step, .hp .hp-step { opacity: 1 !important; translate: 0 0 !important; }`}</style>
        </noscript>

        <div className="relative mx-auto w-full max-w-[1440px] lg:aspect-[1000/640]">
          {/* Heading and intro, centred at the top of the frame */}
          <div className="relative mx-auto max-w-[36rem] text-center lg:absolute lg:inset-x-0 lg:top-[9%]">
            <h2
              id="hire-process-title"
              className="mx-auto max-w-[14em] text-[28px] font-semibold leading-[1.25] tracking-tight text-[#0a2463] sm:text-[34px] lg:text-[clamp(30px,2.9cqw,42px)]"
            >
              Our Streamlined Contract Staffing Process
            </h2>
            <p className="mx-auto mt-2 max-w-[27em] text-[15px] leading-snug text-[#1d2f63] sm:text-[17px] lg:text-[clamp(15px,1.4cqw,20px)]">
              You can hire our expert team within a few days. Techzarinfo follows easier steps for contract staffing.
            </p>
          </div>

          {/* Numerals and rules: an evenly spaced row below lg; the design's positions on lg (custom
              properties --x, read by lg:left-(--x)) */}
          <div
            role="group"
            aria-label="Process steps"
            onMouseLeave={() => setHovered(null)}
            className="relative mx-auto mt-10 grid h-[min(46vw,13rem)] max-w-[30rem] grid-cols-4 items-center lg:pointer-events-none lg:absolute lg:inset-0 lg:mt-0 lg:block lg:h-auto lg:max-w-none"
          >
            {RULE_X.slice(0, STEPS.length - 1).map((x, r) => (
              <span
                key={x}
                aria-hidden="true"
                className="hp-rule absolute top-0 bottom-0 left-(--m) w-[2px] bg-linear-to-b from-[#0a2463]/0 via-[#0a2463] to-[#0a2463]/0 lg:top-[24.2%] lg:bottom-[4.7%] lg:left-(--x)"
                style={{ "--i": r, "--x": `${x}%`, "--m": `${((r + 1) / STEPS.length) * 100}%` }}
              />
            ))}
            {STEPS.map((step, i) => (
              <button
                key={step.title}
                type="button"
                aria-pressed={i === selected}
                aria-controls="hire-process-step"
                aria-label={`Step ${i + 1}: ${step.title}`}
                data-active={i === active}
                onClick={() => setSelected(i)}
                onMouseEnter={() => {
                  // Mouse only: on touch screens a tap selects instead of a sticky hover
                  if (window.matchMedia("(hover: hover)").matches) setHovered(i);
                }}
                className="hp-num-btn pointer-events-auto block cursor-pointer justify-self-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f6ff0] lg:absolute lg:top-[59%] lg:left-(--x) lg:-translate-x-1/2"
                style={{ "--x": `${NUM_X[i]}%` }}
              >
                <span className="hp-num-clip block overflow-hidden">
                  <span
                    className="hp-num block text-[min(24vw,8.5rem)] leading-[0.9] font-medium tracking-tight text-[#0a2463] lg:text-[16cqw]"
                    style={{ "--i": i }}
                  >
                    {i + 1}
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* The current step: right of the numerals on lg (title level with the numerals) */}
          <div
            id="hire-process-step"
            className="relative mx-auto mt-8 grid max-w-[30rem] lg:absolute lg:top-[69%] lg:left-(--x) lg:mt-0 lg:max-w-[36%]"
            style={{ "--x": `${TEXT_X}%` }}
          >
            <p className="sr-only" aria-live="polite">
              Step {active + 1} of {STEPS.length}
            </p>
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                aria-hidden={i !== active}
                data-state={i === active ? "on" : i < active ? "past" : "next"}
                className="hp-step col-start-1 row-start-1"
              >
                <h3 className="text-[20px] font-semibold tracking-tight text-[#0a2463] sm:text-[22px] lg:text-[clamp(20px,2.1cqw,30px)]">
                  {step.title}
                </h3>
                <p className="mt-3 text-[15px] leading-snug text-[#1d2f63] sm:text-[17px] lg:mt-[1.6cqw] lg:text-[clamp(16px,1.75cqw,25px)]">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

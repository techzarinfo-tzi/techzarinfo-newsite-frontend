"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    title: "Strategy & Compliance Planning",
    text: "Define product strategy and regulatory requirements",
  },
  {
    title: "UX/UI & Platform Architecture",
    text: "Design intuitive user experience and scalable architecture",
  },
  {
    title: "Core Banking Development",
    text: "Develop secure and reliable core banking features",
  },
  {
    title: "Integration & Testing",
    text: "Integrate APIs and perform rigorous systems testing",
  },
  {
    title: "Deployment & Ongoing Support",
    text: "Launch platform and provide continuous technical support",
  },
];

// True once the steps have scrolled a little way into view (one-off)
function useRevealed(ref) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return shown;
}

// Centred heading over the five steps as a zig-zag cascade: each box ~73% of the column wide,
// the even ones shifted right by the rest, the boxes just touching. Box: blue outline, numbered
// blue badge with a soft halo, then the title and a short line. Phones narrow the shift.
// Animation (globals.css, .approach-*): when the steps scroll into view the heading rises in, then
// each box fades and slides in from its own side (odd from the left, even from the right) while
// growing to full size, one after another, and its badge pops in as it lands. Transform and
// opacity only, so nothing shifts. On hover a box lifts and its outline deepens.
export default function BankingApproach() {
  const listRef = useRef(null);
  const shown = useRevealed(listRef);

  return (
    <section
      data-guide="bankingApproach"
      className={`approach bg-white px-4 py-14 sm:px-6 sm:py-16 lg:py-[clamp(64px,6vw,96px)] ${shown ? "is-shown" : ""}`}
    >
      <noscript>
        <style>{`.approach * { opacity: 1 !important; transform: none !important; animation: none !important; }`}</style>
      </noscript>

      <h2 className="approach-rise mx-auto max-w-[13em] text-center text-[28px] font-semibold leading-[1.25] tracking-tight text-balance text-[#002461] sm:text-[34px] lg:text-[40px]">
        Our Digital Banking Development Approach
      </h2>

      <ol ref={listRef} className="mx-auto mt-10 max-w-[720px] lg:mt-12">
        {steps.map(({ title, text }, i) => {
          const even = i % 2 === 1;
          return (
            <li
              key={title}
              className={`approach-step relative w-[90%] sm:w-[73%] ${even ? "ml-[10%] sm:ml-[27%]" : ""} ${i > 0 ? "-mt-px" : ""}`}
              style={{ "--d": `${0.15 + i * 0.16}s`, "--from": even ? "56px" : "-56px", zIndex: steps.length - i }}
            >
              <article className="flex items-center gap-4 rounded-xl border border-[#1d6fd8] bg-white px-4 py-4 shadow-[0_10px_24px_-16px_rgba(0,36,97,0.4)] transition-[translate,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-[#0b4fc4] hover:shadow-[0_18px_34px_-18px_rgba(0,36,97,0.5)] sm:gap-5 sm:px-5 lg:py-5">
                <span
                  aria-hidden="true"
                  className="approach-badge flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#3d8ff2] to-[#0b4fc4] text-base font-semibold text-white shadow-[0_0_0_5px_rgba(61,143,242,0.16),0_6px_14px_-6px_rgba(11,79,196,0.7)] lg:size-11"
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold leading-snug text-[#002461] lg:text-lg">{title}</h3>
                  <p className="mt-1 text-sm leading-snug text-[#3d4a66]">{text}</p>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

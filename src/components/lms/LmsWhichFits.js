"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Stroke icons (24px grid), drawn white on the blue tiles
const icons = {
  brush: (
    <>
      <path d="M18.4 2.6a2 2 0 0 1 2.9 2.9l-8.6 8.6-2.9-2.9 8.6-8.6Z" />
      <path d="M9.4 11.6c-2 0-3.5 1.6-3.5 3.5 0 1.4-.8 2.5-2.4 3.4 4.9 2 9.4.4 9.4-3.5" />
    </>
  ),
  puzzle: (
    <path d="M10 3.5a2 2 0 0 1 4 0V5h3a2 2 0 0 1 2 2v3h-1.5a2 2 0 0 0 0 4H19v3a2 2 0 0 1-2 2h-3v-1.5a2 2 0 0 0-4 0V19H7a2 2 0 0 1-2-2v-3h1.5a2 2 0 0 0 0-4H5V7a2 2 0 0 1 2-2h3V3.5Z" />
  ),
  diamond: (
    <>
      <path d="M6 3h12l4 6-10 12L2 9l4-6Z" />
      <path d="M2 9h20M12 21 8 9l4-6 4 6-4 12" />
    </>
  ),
  customize: (
    <>
      <path d="m14 7 3 3M5 16l9.5-9.5a2.1 2.1 0 0 1 3 3L8 19H5v-3Z" />
      <path d="M4 4l4 4M7 3 3 7M17 13l4 4M20 14l-4 4" />
    </>
  ),
  ready: (
    <>
      <path d="M12 2.5 14.6 4l3-.2.8 2.9 2.4 1.8-1 2.8.6 2.9-2.6 1.4-1.2 2.7-3-.3-2.6 1.6L9.4 18l-3 .2-.8-2.9-2.4-1.8 1-2.8-.6-2.9 2.6-1.4L7.4 3.7l3 .3L12 2.5Z" />
      <path d="m8.8 11.5 2.2 2.2 4.2-4.2" />
    </>
  ),
  plans: (
    <>
      <path d="m3.5 6 1.5 1.5L8 4.5M3.5 12.5 5 14l3-3M3.5 19l1.5 1.5L8 17.5" />
      <path d="M12 6h8.5M12 12.5h8.5M12 19h8.5" />
    </>
  ),
  setup: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  maintenance: (
    <path d="M14.7 6.3a4 4 0 0 0 5 5L21.5 13a6 6 0 0 1-7.7 1.4L6.5 21.7a2.1 2.1 0 0 1-3-3l7.3-7.3A6 6 0 0 1 12.2 3.7L14 5.5l.7.8Z" />
  ),
};

// lines: the titles as the design breaks them
const columns = [
  {
    heading: "White-Label LMS",
    items: [
      { icon: "brush", lines: ["Fully branded", "platform"] },
      { icon: "puzzle", lines: ["Custom features", "& interface"] },
      { icon: "diamond", lines: ["Your brand &", "identity"] },
      { icon: "customize", lines: ["Greater", "customization"] },
    ],
  },
  {
    heading: "Standard SaaS LMS",
    items: [
      { icon: "ready", lines: ["Ready to use", "platform"] },
      { icon: "plans", lines: ["Flexible features", "& plans"] },
      { icon: "setup", lines: ["Quick setup &", "deployment"] },
      { icon: "maintenance", lines: ["Easy management", "& maintenance"] },
    ],
  },
];

// Flips true once the element is well into view (once only), to start the entrance.
function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        io.disconnect();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

// Layout from the 1440px design: the gradient card (351px) on the left, then the two comparison
// columns (~414px each), 1140px wide in all. Tablet: the card spans the top, the columns sit side by
// side below. Phone: everything stacks.
// Entrance (globals.css, .fit-*): the card slides in from the left, the column headings fade up, and
// the eight rows rise in one after another (--i staggers them, alternating between the columns so
// the two lists fill in together) with their icon tiles popping in. Transform and opacity only, so
// nothing around them moves. The section is server-rendered in its start state (data-inview=false),
// so nothing flashes in place before the script runs.
export default function LmsWhichFits() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef);

  return (
    <section
      ref={sectionRef}
      data-guide="lmsWhichFits"
      data-inview={inView}
      className="lms-fit bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
    >
      <noscript>
        <style>{`.lms-fit .fit-anim { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>

      <div className="mx-auto grid max-w-[1140px] gap-10 md:grid-cols-2 md:gap-x-10 md:gap-y-12 lg:grid-cols-[351px_1fr_1fr] lg:gap-x-[clamp(32px,4.4vw,64px)]">
        {/* Card */}
        <div className="fit-anim fit-card relative flex flex-col overflow-hidden rounded-2xl bg-linear-to-b from-[#2468d0] via-[#164a9e] to-[#0a2552] p-7 text-white shadow-[0_24px_48px_-20px_rgba(10,37,82,0.55)] md:col-span-2 lg:col-span-1 lg:min-h-[495px] lg:p-8">
          <h2 className="max-w-[11em] text-[28px] font-medium leading-tight tracking-tight lg:text-[30px]">
            Which LMS Fits Your Business?
          </h2>
          <p className="mt-5 text-[15px] leading-normal text-white/90 lg:text-base">
            At Techzarinfo, we specialize in both White-Label LMS and Standard SaaS LMS solutions,
            helping businesses choose the right platform for their training, branding, and scalability
            needs
          </p>
          <Link
            href="/contact"
            className="fit-btn mt-8 flex h-[52px] items-center justify-center rounded-lg bg-white text-base font-medium text-[#1f5fd0] shadow-[0_6px_16px_-6px_rgba(0,0,0,0.35)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_22px_-8px_rgba(0,0,0,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:max-w-[320px] lg:mt-auto lg:max-w-none"
          >
            Get Started
          </Link>
        </div>

        {/* Comparison columns */}
        {columns.map((column, c) => (
          <div key={column.heading} className="lg:pt-2">
            <h3 className="fit-anim fit-heading text-base font-medium text-[#002461]" style={{ "--i": c }}>
              {column.heading}
            </h3>
            <ul className="mt-6 flex flex-col gap-7 lg:mt-7 lg:gap-[clamp(28px,3.3vw,46px)]">
              {column.items.map((item, r) => (
                <li
                  key={item.icon}
                  className="fit-anim fit-item group flex items-center gap-5 lg:gap-[27px]"
                  style={{ "--i": r * 2 + c }}
                >
                  <span
                    aria-hidden="true"
                    className="fit-tile flex size-14 shrink-0 items-center justify-center rounded-[10px] bg-linear-to-b from-[#2b6ee0] to-[#1a58c8] text-white shadow-[0_8px_18px_-8px_rgba(26,88,200,0.6)] lg:size-[60px]"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                      {icons[item.icon]}
                    </svg>
                  </span>
                  <span className="text-xl leading-snug text-[#002461] lg:text-[clamp(20px,1.6vw,23px)]">
                    {item.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

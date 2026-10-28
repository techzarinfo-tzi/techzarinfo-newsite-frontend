"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BadgeCheck, Gem, ListChecks, Paintbrush, Puzzle, WandSparkles, Wrench, Zap } from "lucide-react";

// Icons from Lucide (lucide.dev), drawn in the site's colour via currentColor
const icons = {
  brush: Paintbrush,
  puzzle: Puzzle,
  diamond: Gem,
  customize: WandSparkles,
  ready: BadgeCheck,
  plans: ListChecks,
  setup: Zap,
  maintenance: Wrench,
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
export function useInView(ref) {
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
                    {(() => {
  const Icon = icons[item.icon];
  return <Icon aria-hidden="true" strokeWidth={1.8} className="size-6" />;
})()}
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

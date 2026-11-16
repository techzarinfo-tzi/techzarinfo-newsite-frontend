"use client";

import { useEffect, useRef, useState } from "react";
import { BadgeCheck, CalendarClock, CodeXml, Copyright, FlaskConical, LayoutTemplate, LockKeyhole, Users } from "lucide-react";

// "Our Commitments & Ethical Standards": eight cards in two columns (one on phones). Each card has a
// blue gradient icon tile (an icon for its topic), a title and text, and its number in a blue
// quarter-circle in the bottom corner nearest the centre: bottom right in the left column, bottom
// left in the right one, as in the design.
//
// Motion (globals.css .hc-*): the cards fade up one after another as the section scrolls in; on
// hover a card lifts with a stronger border and shadow, its icon tile rises and the number's
// quarter-circle grows. All off with reduced motion.
const COMMITMENTS = [
  {
    title: "Dedicated Skilled Resources",
    text: "We have a dedicated team of skilled developers and technical architects to work on your development project",
    icon: Users,
  },
  {
    title: "Seamless User Experience",
    text: "Build a seamless user experience for your software and apps to add value to them and generate revenue for your.",
    icon: LayoutTemplate,
  },
  {
    title: "Test First Approach",
    text: "We follow a strict test-first methodology to ensure every feature is validated before deployment.",
    icon: FlaskConical,
  },
  {
    title: "Adherence To Deadlines",
    text: "Assurance of adherence to deadlines, on time every time, which translates into zero hassles regarding project delivery.",
    icon: CalendarClock,
  },
  {
    title: "Confidentiality And Security",
    text: "Guaranteed confidentiality and security for your project with strict non-disclosure agreements for every client we work for.",
    icon: LockKeyhole,
  },
  {
    title: "Single Coding Standard",
    text: "We maintain a unified and consistent coding standard across all projects.",
    icon: CodeXml,
  },
  {
    title: "High-Quality Development",
    text: "Get access to multiple user stories, use cases & in depth analysis.",
    icon: BadgeCheck,
  },
  {
    title: "IP Protection",
    text: "You are the sole owner of your IP and we prioritize the IP protection.",
    icon: Copyright,
  },
];

export default function HireCommitments() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-labelledby="hire-commitments-title"
      data-guide="hireCommitments"
      data-in={inView}
      className="hc bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-[clamp(4rem,6vw,6rem)]"
    >
      <noscript>
        <style>{`.hc .hc-card { opacity: 1 !important; translate: 0 0 !important; }`}</style>
      </noscript>

      <div className="mx-auto max-w-[70rem]">
        <h2
          id="hire-commitments-title"
          className="mx-auto max-w-[15em] text-center text-[28px] font-medium leading-[1.25] tracking-tight text-[#0a2463] sm:text-[36px] lg:text-[clamp(36px,3.4vw,48px)]"
        >
          Our Commitments &amp; Ethical Standards
        </h2>

        <ol className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-x-[clamp(1.25rem,2.2vw,2rem)] md:gap-y-[clamp(1.25rem,2.5vw,2.25rem)] lg:mt-[clamp(2.5rem,4.5vw,4rem)]">
          {COMMITMENTS.map(({ title, text, icon: Icon }, i) => {
            // Left column (odd numbers) puts the number bottom right; right column bottom left.
            // On phones (one column) every number goes bottom right.
            const right = i % 2 === 1;
            return (
              <li
                key={title}
                className="hc-card group relative flex gap-4 overflow-hidden rounded-[14px] border-[1.5px] border-[#d6e2fb] bg-linear-to-r from-white to-[#eaf3ff] p-4 pb-6 hover:border-[#a9c6f7] hover:shadow-[0_16px_36px_-18px_rgba(26,123,255,0.45)] sm:p-[clamp(0.9rem,1.2vw,1.1rem)] sm:pb-[clamp(1.4rem,2vw,1.8rem)]"
                style={{ "--i": i }}
              >
                <span className="hc-tile flex size-[clamp(3rem,4.9vw,4.4rem)] shrink-0 items-center justify-center rounded-[11px] bg-linear-to-b from-[#1e74ff] to-[#5aaeff] text-white shadow-[0_8px_18px_-8px_rgba(30,116,255,0.7)] transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transition-none">
                  <Icon className="size-[44%]" strokeWidth={2} aria-hidden="true" />
                </span>

                <div className="min-w-0 pt-1 pr-[clamp(3.5rem,5vw,4.75rem)] md:pr-[clamp(4rem,6vw,5.5rem)]">
                  <h3 className="text-[20px] leading-snug text-[#0a2463] sm:text-[22px] lg:text-[clamp(22px,1.85vw,26px)]">{title}</h3>
                  <p className="mt-2.5 text-[14px] leading-snug text-[#1d2f63] lg:text-[clamp(14px,1.05vw,15px)]">{text}</p>
                </div>

                {/* The number, in a blue quarter-circle tucked into the bottom corner */}
                <span
                  aria-hidden="true"
                  className={`hc-num absolute bottom-0 flex size-[clamp(3.6rem,5.1vw,4.6rem)] items-end bg-[#1a7bff] pb-[0.55em] text-[clamp(17px,1.6vw,22px)] font-medium text-white transition-[scale] duration-300 group-hover:scale-110 motion-reduce:transition-none ${
                    right
                      ? "right-0 origin-bottom-right justify-end rounded-tl-full pr-[0.55em] md:right-auto md:left-0 md:origin-bottom-left md:justify-start md:rounded-tl-none md:rounded-tr-full md:pr-0 md:pl-[0.35em]"
                      : "right-0 origin-bottom-right justify-end rounded-tl-full pr-[0.55em]"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

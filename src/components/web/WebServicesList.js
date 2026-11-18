"use client";

import { useEffect, useRef, useState } from "react";
import { ClipboardList, FileSearch, MonitorSmartphone, Palette, Rocket, SquareTerminal, Workflow, Wrench } from "lucide-react";

// "Best Website Development Services in Chennai for Your Next Digital Project": centred heading and
// two paragraphs, then eight service rows in two columns (one on phones). Each row is a pale-blue
// tile with a navy gradient icon tile and a two-line label, as in the design. Rows are listed in
// reading order (left, right, left, right...).
//
// Motion: the rows fade up one after another as the section scrolls in; on hover a row lifts with a
// soft shadow and its icon tile grows slightly. All off with reduced motion.
const SERVICES = [
  { label: "Business and technical requirement analysis", icon: ClipboardList },
  { label: "Responsive design and performance optimisation", icon: MonitorSmartphone },
  { label: "Website planning and UI/UX design", icon: Palette },
  { label: "Technical SEO foundations and crawlability", icon: FileSearch },
  { label: "Frontend and backend development", icon: SquareTerminal },
  { label: "Quality assurance and deployment", icon: Rocket },
  { label: "Database design and API integrations", icon: Workflow },
  { label: "Maintenance and future enhancements", icon: Wrench },
];

export default function WebServicesList() {
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
      // Once the section top is a fifth of the way up the screen, however tall the section is
      { threshold: 0, rootMargin: "0px 0px -20% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-labelledby="web-services-title"
      data-guide="webServices"
      data-in={inView}
      className="group/ws bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-[clamp(4rem,6vw,6rem)]"
    >
      <noscript>
        <style>{`.ws-row { opacity: 1 !important; translate: 0 0 !important; }`}</style>
      </noscript>

      <div className="mx-auto max-w-[56rem] text-center">
        <h2
          id="web-services-title"
          className="mx-auto max-w-[24em] text-[28px] font-semibold leading-[1.22] tracking-tight text-[#0a2463] sm:text-[34px] lg:text-[clamp(34px,2.9vw,42px)]"
        >
          Best Website Development Services in Chennai for Your Next Digital Project
        </h2>
        <div className="mx-auto mt-3 max-w-[52rem] space-y-5 text-[15px] leading-snug text-[#1d2f63] sm:text-[17px] lg:mt-4 lg:text-[clamp(16px,1.3vw,19px)]">
          <p>Choosing the right development service starts with understanding what you want your website or application to achieve.</p>
          <p>
            A corporate website may need stronger lead-generation journeys. An e-commerce platform may require better
            checkout and inventory workflows. A SaaS product may depend on subscription management, user permissions, and
            integrations. Each project needs a different approach.
          </p>
        </div>
      </div>

      <ul className="mx-auto mt-10 grid max-w-[66rem] grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-[clamp(1.25rem,2.8vw,2.5rem)] md:gap-y-[clamp(1rem,1.7vw,1.5rem)] lg:mt-[clamp(2.5rem,3.5vw,3.25rem)]">
        {SERVICES.map(({ label, icon: Icon }, i) => (
          <li
            key={label}
            className="ws-row opacity-0 translate-y-5 transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[in=true]/ws:opacity-100 group-data-[in=true]/ws:translate-y-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none"
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <div className="group flex items-center gap-4 rounded-[10px] bg-[#e8f3fe] p-2 pr-5 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_-18px_rgba(10,80,165,0.45)] sm:gap-5 lg:gap-[clamp(1.25rem,2.2vw,2rem)] motion-reduce:transition-none">
              <span className="flex size-[clamp(3.25rem,5.3vw,4.75rem)] shrink-0 items-center justify-center rounded-lg bg-linear-to-b from-[#0b2a6b] to-[#1f5fd6] text-white shadow-[0_6px_14px_-8px_rgba(11,42,107,0.7)] transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none">
                <Icon className="size-[42%]" strokeWidth={1.9} aria-hidden="true" />
              </span>
              <span className="max-w-[17em] text-[17px] leading-snug text-[#0a2463] sm:text-[19px] lg:text-[clamp(19px,1.65vw,24px)]">{label}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

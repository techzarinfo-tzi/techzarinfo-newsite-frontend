"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, Gamepad2, GraduationCap, Hospital, Landmark, ShoppingCart } from "lucide-react";

// Icons from Lucide (lucide.dev), drawn white on the design's navy tile
const industries = [
  {
    icon: Landmark,
    title: "Finance",
    text: "TZI's crypto exchange solutions enhance transparency and security in financial transactions.",
  },
  {
    icon: Hospital,
    title: "Healthcare",
    text: "Secure sensitive data and streamline billing with blockchain-powered solutions.",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    text: "Enable secure cryptocurrency payments to increase global customer reach.",
  },
  {
    icon: Gamepad2,
    title: "Gaming",
    text: "Revolutionize in-game purchases with seamless crypto integrations.",
  },
  {
    icon: Building2,
    title: "Real Estate",
    text: "Facilitate global property transactions using smart contracts and crypto payments.",
  },
  {
    icon: GraduationCap,
    title: "Education",
    text: "Introduce decentralized payment systems for international students and institutions.",
  },
];

// True once the grid has scrolled a little way into view (one-off)
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
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return shown;
}

// Centred heading over six industry cards in two columns (one on phones), on white with the
// design's soft blue haze at both sides. Cards: navy icon tile, title and a short line, on a pale
// blue panel with a light blue border. They rise and fade in one after another (row by row, left
// then right) as the grid scrolls into view (globals.css .crypto-ind-card); on hover the card lifts,
// its border deepens and the icon tile grows a touch.
export default function CryptoIndustries() {
  const gridRef = useRef(null);
  const shown = useRevealed(gridRef);

  return (
    <section data-guide="cryptoIndustries" className="relative overflow-hidden bg-white px-4 pt-14 pb-16 sm:px-6 sm:pt-16 lg:px-8 lg:pt-[92px] lg:pb-[120px]">
      <noscript>
        <style>{`.crypto-ind-card { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>

      {/* Soft blue haze down the left and right edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 22% 55% at 0% 60%, rgba(186,220,250,0.75) 0%, transparent 100%), radial-gradient(ellipse 22% 60% at 100% 25%, rgba(176,216,252,0.85) 0%, transparent 100%), radial-gradient(ellipse 50% 30% at 50% 0%, rgba(228,241,254,0.8) 0%, transparent 100%)",
        }}
      />

      <h2 className="relative text-center text-[28px] font-medium leading-[1.25] tracking-tight text-[#002461] sm:text-[34px] lg:text-[44px]">
        Industries We Serve
      </h2>

      <ul
        ref={gridRef}
        className={`relative mx-auto mt-10 grid max-w-[440px] grid-cols-1 gap-5 md:max-w-[900px] md:grid-cols-2 md:gap-x-6 md:gap-y-8 lg:mt-[120px] lg:gap-x-[42px] lg:gap-y-[52px] ${shown ? "is-shown" : ""}`}
      >
        {industries.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="crypto-ind-card" style={{ "--ind-delay": `${i * 90}ms` }}>
            <article className="group flex h-full items-center gap-4 rounded-[14px] border border-[#c9e0f8] bg-[#eef6ff]/90 p-3 transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-[#8fc0f3] hover:shadow-[0_14px_30px_-16px_rgba(0,36,97,0.35)] lg:gap-5">
              <span
                aria-hidden="true"
                className="flex size-[68px] shrink-0 items-center justify-center rounded-xl bg-linear-to-b from-[#0d43a6] to-[#002461] text-white shadow-[0_6px_14px_-6px_rgba(0,36,97,0.55)] transition-transform duration-300 ease-out group-hover:scale-105 lg:size-[80px]"
              >
                <Icon strokeWidth={1.6} className="size-8 lg:size-9" />
              </span>
              <div className="min-w-0 pr-2">
                <h3 className="text-[19px] font-medium leading-tight text-[#002461] lg:text-[21px]">{title}</h3>
                <p className="mt-1.5 text-[13px] leading-[1.4] text-[#3d4a66]">{text}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

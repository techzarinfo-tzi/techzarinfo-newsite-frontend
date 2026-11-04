"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ChartColumn,
  ChartNoAxesCombined,
  CreditCard,
  HandCoins,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Timer,
  UserStar,
  Zap,
} from "lucide-react";

// Icons from Lucide (lucide.dev)
const highlights = [
  { icon: Zap, title: "Real Time Transaction", text: "Instant transfers", color: "#2563eb", fill: true },
  { icon: ShieldCheck, title: "Automation", text: "Smart workflows", color: "#4f46e5", fill: true },
  { icon: Settings, title: "Secure Infrastructure", text: "End-to-end encrypted", color: "#14b8a6", fill: true },
  { icon: ChartColumn, title: "New Revenue Opportunities", text: "Unlock growth areas", color: "#f59e0b" },
];

const benefits = [
  { icon: HandCoins, label: "Reduce Operational Costs" },
  { icon: UserStar, label: "Improve Customer Experience" },
  { icon: Timer, label: "Faster Service Delivery" },
  { icon: ChartNoAxesCombined, label: "Growth & New Opportunities" },
];

// The "Spent this month" card's mini bar chart (bar heights, % of the chart)
const BARS = [45, 70, 55, 95, 75];

// True once the section has scrolled a little way into view (one-off)
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

// A small white tile holding one floating icon in the artwork
function IconTile({ icon: Icon, color, className, style }) {
  return (
    <span
      aria-hidden="true"
      className={`smart-inv-tile absolute flex size-[10cqw] items-center justify-center rounded-[2.4cqw] bg-white shadow-[0_10px_24px_-10px_rgba(0,36,97,0.3)] ${className}`}
      style={style}
    >
      <Icon className="size-[4.6cqw]" fill={color} color="#fff" strokeWidth={1.75} />
    </span>
  );
}

// Desktop follows the 1440px design: the artwork on the left (person holding a phone, ringed by
// floating icon tiles, a "Spent this month" card and the four-highlight card), starting ~8vw in;
// the copy on the right with the four benefits in a row under it. Below lg the copy comes first
// and the artwork sits centred under it. The artwork is one box sized with container units (cqw),
// so the cards and their text scale together and keep their places at every width.
// Animation (globals.css, .smart-inv-*): when the section scrolls into view the copy rises in line
// by line, the person rises in, the tiles pop in and then float, the cards rise in and float, the
// chart bars grow and the benefits rise in one after another.
export default function BankingSmartInvestment() {
  const sectionRef = useRef(null);
  const shown = useRevealed(sectionRef);

  return (
    <section
      ref={sectionRef}
      data-guide="bankingSmartInvestment"
      className={`smart-inv relative overflow-hidden px-4 pt-14 sm:px-6 sm:pt-16 lg:pt-[clamp(48px,4.5vw,72px)] lg:pr-[clamp(2rem,4vw,4rem)] lg:pl-[clamp(2rem,8vw,9rem)] ${shown ? "is-shown" : ""}`}
    >
      <noscript>
        <style>{`.smart-inv * { animation: none !important; }`}</style>
      </noscript>

      {/* Pale periwinkle wash, a little brighter behind the artwork */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 60% at 22% 45%, #e3eafd 0%, transparent 75%), linear-gradient(180deg, #edf1fd 0%, #f2f5fe 60%, #f6f8ff 100%)",
        }}
      />

      <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[clamp(380px,33vw,500px)_minmax(0,1fr)] lg:gap-x-[clamp(3rem,11vw,10rem)]">
        <div className="lg:pb-[clamp(48px,4.5vw,72px)]">
          <h2 className="smart-inv-rise text-[28px] font-semibold leading-[1.25] tracking-tight text-balance text-[#002461] sm:text-[34px] lg:text-[clamp(30px,2.6vw,40px)]">
            What Makes{" "}
            <span className="bg-linear-to-r from-[#14b4ef] to-[#0a4fb0] bg-clip-text text-transparent">
              Digital Banking
            </span>{" "}
            <br className="hidden xl:block" />
            Solutions A Smart Investment?
          </h2>
          <p
            className="smart-inv-rise mt-5 max-w-[640px] text-base leading-[1.75] text-[#3d4a66] lg:text-[clamp(15px,1.1vw,17px)]"
            style={{ "--d": "0.12s" }}
          >
            Digital banking solutions reduce operational costs, improve customer experience and enable
            faster service delivery. With real-time transactions, automation and secure
            infrastructure, financial institutions can scale efficiently. These platforms support
            innovation, enhance customer engagement, and create new revenue opportunities, making
            digital banking a smart investment for long-term growth and competitive advantage.
          </p>

          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:mt-12">
            {benefits.map(({ icon: Icon, label }, i) => (
              <li
                key={label}
                className="smart-inv-rise group flex flex-col items-center text-center"
                style={{ "--d": `${0.3 + i * 0.12}s` }}
              >
                <Icon
                  aria-hidden="true"
                  className="size-12 text-[#1d5fc4] transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105 lg:size-[52px]"
                  strokeWidth={1.25}
                />
                <span className="mt-3 max-w-[11em] text-sm font-semibold leading-snug text-[#002461]">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* The artwork. Positions are % of the box, sizes in cqw (1% of its width). */}
        <div className="@container mx-auto w-full max-w-[480px] lg:order-first lg:max-w-none lg:self-end">
          <div className="relative aspect-[450/440]">
            <Image
              src="/service/digital-banking/smartinverstment/person.png"
              alt="Smiling man in a white T-shirt using a digital banking app on his phone"
              width={523}
              height={664}
              sizes="(min-width: 1024px) 340px, 70vw"
              className="smart-inv-rise absolute top-[15%] left-[18%] h-auto w-[67%]"
              style={{ "--d": "0.1s" }}
            />

            <IconTile icon={CreditCard} color="#1e88e5" className="top-[2%] left-[7%]" style={{ "--d": "0.5s", "--float": "6s" }} />
            <IconTile icon={ShoppingBag} color="#22c55e" className="top-[6%] left-[84%]" style={{ "--d": "0.65s", "--float": "7s" }} />
            <IconTile icon={ShieldCheck} color="#4f46e5" className="top-[85%] left-[5%]" style={{ "--d": "0.8s", "--float": "6.5s" }} />

            {/* "Spent this month" card */}
            <div
              className="smart-inv-card absolute top-[62%] left-[1%] w-[33%] rounded-[3cqw] bg-white px-[3.4cqw] py-[3cqw] shadow-[0_18px_40px_-16px_rgba(0,36,97,0.3)]"
              style={{ "--d": "0.55s", "--float": "7.5s" }}
            >
              <p className="text-[2.3cqw] text-[#8a94a8]">Spent this month</p>
              <div className="mt-[1.6cqw] flex items-end justify-between gap-[2cqw]">
                <p className="text-[4.2cqw] leading-none font-semibold text-[#111827]">$682.5</p>
                <span aria-hidden="true" className="flex h-[6cqw] items-end gap-[0.9cqw]">
                  {BARS.map((h, i) => (
                    <span
                      key={i}
                      className="smart-inv-bar w-[1.2cqw] rounded-full bg-[#6c5ce7]"
                      style={{ height: `${h}%`, "--d": `${0.9 + i * 0.08}s` }}
                    />
                  ))}
                </span>
              </div>
            </div>

            {/* The four highlights */}
            <ul
              className="smart-inv-card absolute top-[55%] left-[55%] w-[45%] rounded-[3cqw] bg-white px-[3cqw] py-[1.6cqw] shadow-[0_18px_40px_-16px_rgba(0,36,97,0.3)]"
              style={{ "--d": "0.7s", "--float": "8s" }}
            >
              {highlights.map(({ icon: Icon, title, text, color, fill }, i) => (
                <li
                  key={title}
                  className="smart-inv-rise flex items-center gap-[2.4cqw] border-[#eef1f6] py-[2.1cqw] not-last:border-b"
                  style={{ "--d": `${0.95 + i * 0.1}s` }}
                >
                  <span
                    aria-hidden="true"
                    className="flex size-[6cqw] shrink-0 items-center justify-center rounded-[1.4cqw]"
                    style={{ backgroundColor: `${color}14` }}
                  >
                    <Icon
                      className="size-[3.4cqw]"
                      color={fill ? (Icon === Zap ? color : "#fff") : color}
                      fill={fill ? color : "none"}
                      strokeWidth={2}
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[2.4cqw] leading-tight font-semibold text-[#111827]">{title}</span>
                    <span className="mt-[0.4cqw] block text-[2cqw] leading-tight text-[#8a94a8]">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

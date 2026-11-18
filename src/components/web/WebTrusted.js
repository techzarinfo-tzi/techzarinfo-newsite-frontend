"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Cloud, Code, Coins, Leaf, ShieldCheck, Smartphone } from "lucide-react";

// "Your Trusted Web Application Development Company in Chennai": centred heading and two
// paragraphs, then two pale-blue cards side by side (stacked below lg):
//   - Cost-Effective Development: a white panel with a "Save up to 42%" badge and two cost bars
//     (traditional development at 100%, our approach at 58%)
//   - Technical Expertise: four service rows, each with a navy icon tile
//
// Motion (globals.css .wt-*), once, as the section scrolls in: the badge pops in, the bars fill to
// their share one after the other and their cost labels fade in, and the service rows slide in in
// turn. Cards and rows lift slightly on hover. All off with reduced motion.

const BARS = [
  { label: "Traditional Development", share: 100, cost: "100% cost" },
  { label: "Our Approach", share: 58, cost: "58% cost", saving: true },
];

const SERVICES = [
  { title: "Frontend & Backend Development", text: "Web applications, API, CMS", icon: Code },
  { title: "Mobile App Development", text: "iOS, Android, Cross platform", icon: Smartphone },
  { title: "Cloud & DevOps", text: "Scalable, secure, High performance", icon: Cloud },
  { title: "Testing", text: "Better quality, fewer issues", icon: ShieldCheck },
];

// The second row: three cards in the same style, each with its illustration panel (the supplied
// panels in public/service/website-page/trust/; the globe, mostly a photo, as WebP)
const TRUST = "/service/website-page/trust/";
const MORE = [
  {
    title: "Scalable Solutions",
    text: "Build applications that adapt as your business grows",
    image: `${TRUST}scalable-solution.svg`,
    alt: "Architecture diagram: a core platform scaling up, linked to an integration hub and modules (API gateway, micro services, data services, AI/ML modules)",
  },
  {
    title: "Flexible Collaboration",
    text: "Enjoy transparent communication and streamlined project delivery",
    image: `${TRUST}flexible.webp`,
    alt: "Project timeline from development to review to deploy, with each stage's progress",
  },
  {
    title: "Global Reach",
    text: "Work with a Chennai-based team serving businesses across markets",
    image: `${TRUST}global.webp`,
    alt: "A globe with glowing connections between locations around the world",
  },
];

const cardClass =
  "wt-card relative overflow-hidden rounded-[15px] p-6 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-24px_rgba(10,80,165,0.35)] sm:p-8 lg:p-[clamp(1.75rem,3.3vw,3rem)] motion-reduce:transition-none";

// compact: the smaller sizes of the three-across row
function CardHead({ title, text, compact = false }) {
  return (
    <>
      <div className="flex items-center gap-4 lg:gap-5">
        <span
          className={`flex size-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-b from-[#0b2a6b] to-[#1f5fd6] text-white shadow-[0_8px_18px_-8px_rgba(11,42,107,0.7)] ${
            compact ? "lg:size-[clamp(3.25rem,4.2vw,4rem)]" : "lg:size-[clamp(3.5rem,5vw,4.6rem)]"
          }`}
        >
          <Coins className="size-[46%]" strokeWidth={2} aria-hidden="true" />
        </span>
        <h3
          className={`max-w-[10em] text-[24px] leading-tight text-[#0a2463] sm:text-[28px] ${
            compact ? "lg:text-[clamp(24px,2vw,30px)]" : "lg:text-[clamp(28px,2.45vw,36px)]"
          }`}
        >
          {title}
        </h3>
      </div>
      <p
        className={`mt-5 max-w-[22em] text-[16px] leading-snug text-[#1d2f63] sm:text-[18px] lg:mt-6 ${
          compact ? "lg:text-[clamp(16px,1.3vw,19px)]" : "lg:text-[clamp(18px,1.55vw,22px)]"
        }`}
      >
        {text}
      </p>
    </>
  );
}

export default function WebTrusted() {
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
      // Fires once the section top is a fifth of the way up the screen, however tall the section is
      // (a percentage threshold could never be met by a section taller than the screen on phones)
      { threshold: 0, rootMargin: "0px 0px -20% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-labelledby="web-trusted-title"
      data-guide="webTrusted"
      data-in={inView}
      className="wt bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-[clamp(4rem,6vw,6rem)]"
    >
      <noscript>
        <style>{`.wt .wt-bar-fill { width: var(--share) !important; } .wt .wt-fade, .wt .wt-row, .wt .wt-rise { opacity: 1 !important; translate: 0 0 !important; }`}</style>
      </noscript>

      <div className="mx-auto max-w-[59rem] text-center">
        <h2
          id="web-trusted-title"
          className="text-[28px] font-semibold leading-[1.22] tracking-tight text-[#0a2463] sm:text-[34px] lg:text-[clamp(34px,2.9vw,42px)]"
        >
          Your Trusted Web Application Development Company in Chennai
        </h2>
        <div className="mx-auto mt-3 max-w-[52rem] space-y-5 text-[15px] leading-snug text-[#1d2f63] sm:text-[17px] lg:mt-4 lg:text-[clamp(17px,1.35vw,20px)]">
          <p>
            As a Web Application Development Company in Chennai, we help startups, SMEs, and enterprises build custom
            digital solutions aligned with their business goals.
          </p>
          <p>
            From planning to deployment, we focus on performance, scalability, security, and user experience to deliver
            applications that support long-term growth.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-[76rem] grid-cols-1 gap-6 lg:mt-[clamp(3rem,5vw,4.5rem)] lg:grid-cols-2 lg:gap-[clamp(1.5rem,2.9vw,2.75rem)]">
        {/* Cost-Effective Development */}
        <article className={cardClass}>
          <CardHead title="Cost-Effective Development" text="Get solutions tailored to your budget and requirements" />

          <div className="mt-6 rounded-xl bg-white p-4 shadow-[0_8px_24px_-16px_rgba(10,80,165,0.35)] sm:p-5 lg:mt-7 lg:p-[clamp(1rem,1.3vw,1.25rem)] lg:pb-[clamp(2rem,3.4vw,3.25rem)]">
            <span className="wt-fade inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#4f8ff7] bg-[#eef4ff] px-4 py-2 text-[16px] text-[#0a2463] lg:text-[clamp(16px,1.35vw,19px)]">
              <Leaf className="size-[1.1em] text-[#16a34a]" strokeWidth={2} aria-hidden="true" />
              Save up to 42%
            </span>

            <ul className="mt-5 space-y-3">
              {BARS.map((bar, i) => (
                <li
                  key={bar.label}
                  className="relative flex h-[clamp(2.9rem,4.4vw,3.4rem)] items-center overflow-hidden rounded-lg bg-[#d6e6fb]"
                  style={{ "--share": `${bar.share}%`, "--i": i }}
                >
                  <span aria-hidden="true" className="wt-bar-fill absolute inset-y-0 left-0 rounded-lg bg-linear-to-r from-[#6ea4f3] to-[#7cb2f8]" />
                  <span className="relative px-4 text-[16px] text-white sm:text-[18px] lg:text-[clamp(17px,1.45vw,21px)]">{bar.label}</span>
                  <span
                    className={`wt-fade wt-cost relative ml-auto mr-3 rounded-md px-2.5 py-1 text-[12px] ${
                      bar.saving ? "bg-[#d4f7df] text-[#16a34a]" : "bg-white/35 text-white"
                    }`}
                  >
                    {bar.cost}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        {/* Technical Expertise */}
        <article className={cardClass}>
          <CardHead title="Technical Expertise" text="Leverage modern frameworks, APIs, databases, and cloud technologies" />

          <ul className="mt-6 space-y-2.5 lg:mt-7">
            {SERVICES.map(({ title, text, icon: Icon }, i) => (
              <li
                key={title}
                className="wt-row group flex items-center gap-3.5 rounded-lg bg-white px-2 py-2 shadow-[0_6px_18px_-14px_rgba(10,80,165,0.4)] transition-[translate,box-shadow] duration-300 hover:shadow-[0_12px_26px_-14px_rgba(10,80,165,0.45)] motion-reduce:transition-none lg:py-[clamp(0.45rem,0.7vw,0.6rem)]"
                style={{ "--i": i }}
              >
                <span className="flex size-[clamp(2.4rem,3.3vw,3rem)] shrink-0 items-center justify-center rounded-md bg-linear-to-b from-[#0b2a6b] to-[#1f5fd6] text-white transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none">
                  <Icon className="size-[46%]" strokeWidth={2} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] text-[#0a2463] lg:text-[clamp(15px,1.15vw,16.5px)]">{title}</span>
                  <span className="mt-0.5 block text-[12px] text-[#5b6687]">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </article>
      </div>

      {/* Second row, continuing the cards above: three across from lg, two from md */}
      <ul className="mx-auto mt-6 grid max-w-[76rem] grid-cols-1 gap-6 md:grid-cols-2 lg:mt-[clamp(1.5rem,2.9vw,2.75rem)] lg:grid-cols-3 lg:gap-[clamp(1.25rem,2.1vw,2rem)]">
        {MORE.map((card, i) => (
          <li key={card.title} className="wt-rise" style={{ "--i": i }}>
            <article className={`${cardClass} h-full lg:p-[clamp(1.25rem,1.9vw,1.75rem)]`}>
              <CardHead title={card.title} text={card.text} compact />
              <div className="mt-6 overflow-hidden rounded-xl shadow-[0_8px_24px_-16px_rgba(10,80,165,0.35)] lg:mt-7">
                <Image
                  src={card.image}
                  alt={card.alt}
                  width={334}
                  height={238}
                  unoptimized={card.image.endsWith(".svg")}
                  sizes="(min-width: 1024px) 24rem, (min-width: 768px) 45vw, 92vw"
                  className="h-auto w-full"
                />
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

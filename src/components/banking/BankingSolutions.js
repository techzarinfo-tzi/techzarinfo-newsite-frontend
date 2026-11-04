"use client";

import { useEffect, useRef } from "react";
import { BadgeDollarSign, Blocks, CircleCheck, HandCoins, Landmark, Store, University } from "lucide-react";

// Icons from Lucide (lucide.dev). Listed in reading order: on desktop the odd ones form the left
// column and the even ones the right.
const solutions = [
  {
    icon: University,
    title: "Digital Retail Banking Platform",
    points: ["Mobile & Web Banking", "Real-time Payments", "Digital Wallets", "Card Issuing"],
  },
  {
    icon: Store,
    title: "Small Business Banking",
    points: ["Multi-User Access", "Invoicing & Payment Tools", "Cash Flow Insights", "Business Debit Cards"],
  },
  {
    icon: Landmark,
    title: "Commercial Banking Systems",
    points: ["Corporate Accounts", "Treasury & Liquidity Tools", "Bulk Payments", "Advanced Role Management"],
  },
  {
    icon: HandCoins,
    title: "Wealth Management Platforms",
    points: ["Portfolio Dashboards", "Robo Advisory Integration", "Investment Tracking", "AI Insights"],
  },
  {
    icon: Blocks,
    title: "White Label Neobanking",
    points: ["Launch in Weeks", "Custom Branding", "Multi-Currency Support", "Open Banking APIs"],
  },
  {
    icon: BadgeDollarSign,
    title: "Fintech & Embedded Finance",
    points: ["Wallet Infrastructure", "Lending Platforms", "Payment Gateways", "Banking-as-a-Service"],
  },
];

// Adds .is-shown to the section and to each card as it scrolls a little way into view (one-off
// each). Set straight on the elements, so revealing a card never re-renders the list.
function useRevealEach(sectionRef) {
  useEffect(() => {
    const section = sectionRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-shown");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(section);
    section.querySelectorAll(".bank-offer-card").forEach((card) => io.observe(card));
    return () => io.disconnect();
  }, [sectionRef]);
}

// Blue sky that fades to white at the bottom. Desktop follows the 1440px design: heading and line
// on the left (~31% wide), pinned below the navbar (sticky) for as long as the cards beside it are
// scrolling, then leaving with the section; the six cards in two columns on the right, the right
// column set ~68px lower so the two stagger. Tablet keeps the pinned heading with one column of
// cards; on phones the heading sits above the cards and scrolls normally (pinned, it would cover
// them). Animation (globals.css, .bank-offer-*): the heading rises in with the section, and each
// card rises in as it reaches the viewport; cards lift a touch on hover.
export default function BankingSolutions() {
  const sectionRef = useRef(null);
  useRevealEach(sectionRef);

  return (
    <section
      ref={sectionRef}
      data-guide="bankingSolutions"
      className="bank-offer relative px-4 pt-14 pb-16 sm:px-6 md:pt-16 lg:pt-[clamp(48px,4vw,64px)] lg:pr-[clamp(2rem,2.5vw,3rem)] lg:pb-[calc(clamp(64px,6vw,96px)+68px)] lg:pl-[clamp(2rem,2.6vw,3rem)]"
      style={{
        background:
          "linear-gradient(180deg, #1b56a8 0%, #2f69b6 18%, #5f8ecb 40%, #92b2db 62%, #c3d5ec 82%, #eef3fa 94%, #ffffff 100%)",
      }}
    >
      <noscript>
        <style>{`.bank-offer * { animation: none !important; }`}</style>
      </noscript>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-x-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.1fr)] lg:gap-x-0">
        <div className="md:sticky md:top-[110px] md:self-start lg:top-[120px] lg:pr-8">
          <h2 className="bank-offer-rise max-w-[11em] text-[32px] font-semibold leading-[1.2] tracking-tight text-white sm:text-[34px] lg:text-[40px]">
            Smart Digital Banking Solutions We Offer
          </h2>
          <p
            className="bank-offer-rise mt-5 max-w-[19em] text-base leading-[1.65] text-white/85 sm:text-lg lg:text-[clamp(18px,1.4vw,20px)]"
            style={{ "--d": "0.12s" }}
          >
            Flexible banking infrastructure for fintech startups, banks, and financial innovators.
          </p>
        </div>

        {/* The cards start lower than the heading (~150px at 1440); on phones they simply follow it */}
        <ul className="grid grid-cols-1 gap-[17px] md:mt-[clamp(72px,9vw,150px)] lg:grid-cols-2">
          {solutions.map(({ icon: Icon, title, points }) => (
            <li key={title} className="bank-offer-card relative lg:even:top-[68px]">
              <article className="h-full rounded-[14px] bg-linear-to-b from-white to-[#f3f6fb] px-6 pt-7 pb-8 shadow-[0_22px_44px_-22px_rgba(0,36,97,0.45)] transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_28px_50px_-22px_rgba(0,36,97,0.55)] sm:px-8">
                <h3 className="flex items-center gap-3 text-base font-semibold leading-snug text-[#002461] lg:text-[17px]">
                  <Icon aria-hidden="true" className="size-9 shrink-0 text-[#1d5fc4]" strokeWidth={1.5} />
                  {title}
                </h3>
                <ul className="mt-7 space-y-[22px]">
                  {points.map((point) => (
                    <li key={point} className="flex items-center gap-2.5 text-base text-[#3d4a66]">
                      <CircleCheck aria-hidden="true" className="size-4 shrink-0 text-[#1d5fc4]" strokeWidth={2.25} />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

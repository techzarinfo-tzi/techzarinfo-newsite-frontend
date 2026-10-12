"use client";

import { useState } from "react";

const items = [
  {
    title: ["Crypto Exchange", "Development Solutions"],
    text: "A blockchain development solution is a technology-driven approach that helps businesses build secure, transparent, and decentralized applications using blockchain networks. It can be customized to meet different business goals, from improving transaction security to creating decentralized ecosystems and reduce dependency on centralized systems",
  },
  {
    title: ["Crypto Wallet", "Development"],
    text: "We build secure, easy-to-use crypto wallets for web and mobile, with multi-currency support, strong key management and smooth integration with exchanges and dApps.",
  },
  {
    title: ["Crypto Payment Gateway", "Development Services"],
    text: "Accept cryptocurrency payments with a gateway built for your business, with fast settlement, real-time conversion and simple integration with your existing checkout.",
  },
  {
    title: ["RWA Tokenization", "Platform Development"],
    text: "Turn real-world assets into secure, tradable digital tokens with a compliant tokenization platform that handles issuance, ownership records and transfers.",
  },
];

function Arrow({ up }) {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 lg:h-9 lg:w-9" fill="none" aria-hidden="true">
      <path
        d={up ? "M12 20V5M6 11l6-6 6 6" : "M12 4v15M6 13l6 6 6-6"}
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Accordion from the 1440px design: 1154px-wide rows, 21px apart, on the hero's left edge.
// Open row: solid sky blue, title left, description in the right half, up arrow bottom-right.
// Closed rows: blue fading to pale blue, title only, down arrow. One row is open at a time.
// Below lg the open row stacks its description under the title.
export default function BlockchainCryptoServices() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-white px-4 py-10 sm:px-6 lg:px-8 lg:pt-[42px] lg:pb-14">
      <ul className="mx-auto flex max-w-[1154px] flex-col gap-4 lg:gap-[21px]">
        {items.map(({ title, text }, i) => {
          const isOpen = open === i;
          const panelId = `crypto-service-${i}`;
          return (
            <li key={title.join(" ")}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className={`relative grid w-full text-left text-white ${
                  isOpen
                    ? "min-h-[200px] gap-4 bg-[#35b6f3] px-6 pt-7 pb-16 lg:min-h-[271px] lg:grid-cols-[minmax(0,1fr)_minmax(0,49%)] lg:gap-6 lg:pt-[30px] lg:pr-[37px] lg:pb-[70px] lg:pl-[42px]"
                    : "min-h-[110px] bg-linear-to-b from-[#41baf4] to-[#b3e5fd] px-6 py-6 lg:min-h-[132px] lg:py-[22px] lg:pr-[75px] lg:pl-[70px]"
                }`}
              >
                <span className="text-[22px] font-medium leading-[1.3] sm:text-[26px] lg:text-[33px]">
                  {title.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
                {isOpen && (
                  <span id={panelId} className="text-[15px] leading-[1.4] text-white/95 lg:pt-1.5 lg:text-[19px] lg:leading-[1.35]">
                    {text}
                  </span>
                )}
                <span className={`absolute right-6 lg:right-[58px] ${isOpen ? "bottom-6 lg:bottom-[22px]" : "bottom-6 lg:top-1/2 lg:bottom-auto lg:-translate-y-1/3"}`}>
                  <Arrow up={isOpen} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

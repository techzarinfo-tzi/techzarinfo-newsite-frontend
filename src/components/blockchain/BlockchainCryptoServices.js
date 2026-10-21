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
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7 lg:h-9 lg:w-9"
      fill="none"
      aria-hidden="true"
    >
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

// Accordion from the 1440px design: centred heading, then 1154px-wide rows, 21px apart.
// Open row: solid sky blue, title left, description in the right half, up arrow bottom-right.
// Closed rows: blue fading to pale blue, title only (vertically centred), down arrow centred on the
// right. Open and closed rows share a 58px side inset (matching the arrow), so a title never shifts
// sideways when its row opens. One row is open at a time.
// Below lg the open row stacks its description under the title.
export default function BlockchainCryptoServices() {
  const [open, setOpen] = useState(0);

  return (
    <section data-guide="bcCrypto" className="bg-white px-4 pt-12 pb-10 sm:px-6 sm:pt-14 sm:pb-12 lg:px-8 lg:pt-16 lg:pb-14">
      <h2 className="mx-auto max-w-[720px] text-center text-[26px] font-semibold leading-[1.25] tracking-tight text-[#002461] sm:text-[34px] lg:text-[40px]">
        Our Blockchain Solutions Built for the New Digital Era{" "}
      </h2>
      <p className="mx-auto mt-2 max-w-[620px] text-center text-[15px] leading-[1.45] text-[#002461] sm:text-lg lg:mt-1 lg:text-[19px]">
        Your vision can go beyond a single blockchain product - we help you
        build a complete crypto ecosystem where assets, users, and transactions
        work together. 
      </p>
      <ul className="mx-auto mt-8 flex max-w-[1154px] flex-col gap-4 sm:mt-10 lg:mt-12 lg:gap-[21px]">
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
                    ? "min-h-[200px] gap-4 bg-[#35b6f3] px-6 pt-7 pb-16 lg:min-h-[271px] lg:grid-cols-[minmax(0,1fr)_minmax(0,49%)] lg:gap-6 lg:pt-[30px] lg:pr-[58px] lg:pb-[70px] lg:pl-[58px]"
                    : "min-h-[110px] content-center bg-linear-to-b from-[#41baf4] to-[#b3e5fd] py-6 pr-16 pl-6 lg:min-h-[132px] lg:py-[22px] lg:pr-[120px] lg:pl-[58px]"
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
                  <span
                    id={panelId}
                    className="text-[15px] leading-[1.4] text-white/95 lg:pt-1.5 lg:text-[19px] lg:leading-[1.35]"
                  >
                    {text}
                  </span>
                )}
                <span
                  className={`absolute right-6 flex lg:right-[58px] ${isOpen ? "bottom-6 lg:bottom-[22px]" : "top-1/2 -translate-y-1/2"}`}
                >
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

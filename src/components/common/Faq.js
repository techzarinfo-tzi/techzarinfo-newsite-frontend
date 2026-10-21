"use client";

import { useId, useState } from "react";

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Shared FAQ accordion: centred title over a column of white cards. One answer is open at a time
// (the first by default). The open card lifts with a deeper shadow and its round icon turns blue and
// points down; the answer slides open by animating the row height (0fr -> 1fr), so no measuring.
// items: [{ q, a }]; description: optional line under the title
export default function Faq({ title = "FAQ", description, items, className = "" }) {
  const [open, setOpen] = useState(0);
  const baseId = useId();

  return (
    <section className={`bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-[100px] ${className}`}>
      <h2 className="mx-auto max-w-[680px] text-center text-[26px] font-semibold leading-[1.25] tracking-tight text-balance text-[#002461] sm:text-[34px] lg:text-[40px]">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-3 max-w-[960px] text-center text-[15px] leading-normal text-[#002461] sm:text-base lg:text-lg">
          {description}
        </p>
      )}

      <ul className="mx-auto mt-8 flex max-w-[860px] flex-col gap-3 sm:mt-10 sm:gap-4 lg:mt-12">
        {items.map(({ q, a }, i) => {
          const isOpen = open === i;
          const buttonId = `${baseId}-q${i}`;
          const panelId = `${baseId}-a${i}`;
          return (
            <li
              key={q}
              className={`group rounded-xl border bg-white transition-[box-shadow,border-color] duration-300 ${
                isOpen
                  ? "border-[#dfe6f2] shadow-[0_14px_32px_-14px_rgba(12,35,80,0.28)]"
                  : "border-[#e9edf4] shadow-[0_2px_10px_-6px_rgba(12,35,80,0.12)] hover:border-[#dfe6f2] hover:shadow-[0_10px_24px_-14px_rgba(12,35,80,0.25)]"
              }`}
            >
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center justify-between gap-4 rounded-xl px-5 py-5 text-left sm:px-7 sm:py-6"
                >
                  <span className="text-[16px] font-semibold leading-[1.3] text-[#0c2350] sm:text-[17px]">{q}</span>
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition-[background-color,color,rotate] duration-300 motion-reduce:transition-none ${
                      isOpen
                        ? "rotate-90 bg-linear-to-b from-[#47b4fb] to-[#0275fb] text-white shadow-[0_4px_10px_-3px_rgba(2,117,251,0.55)]"
                        : "bg-[#eef1f8] text-[#7a86a8] group-hover:bg-[#e2e8f5] group-hover:text-[#0c2350]"
                    }`}
                  >
                    <Chevron />
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden" inert={!isOpen}>
                  <p className="px-5 pb-5 text-[14px] leading-[1.65] text-[#5b6f95] sm:max-w-[92%] sm:px-7 sm:pb-6 sm:text-[15px]">
                    {a}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

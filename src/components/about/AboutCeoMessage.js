"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

// "A Message from Our CEO": the CEO's portrait with name and title on the left; on the right the
// heading and the letter, showing its first half (fading out) until "Read Full Message" smoothly
// opens the rest. Same width as the sections above; below lg the portrait sits above the message.
//
// Portrait: public/about/ceo-portrait.webp, a head-and-shoulders crop (712 x 792, the design's
// ~0.9:1 frame) of the supplied public/about/CEO.png.

const STRATEGIES = [
  "Being the best in the Tech Space at creating web, mobile, and computing applications",
  "Succeed by helping our customers meet their business objectives.",
  "Offer the best consulting services and high-quality products at cost-effective prices to our customers, built on various tech stacks and platforms.",
  "Believing in our team, each of whom plays a key role in keeping our company innovative, competitive, and successful.",
  "Continuing to build the legacy that defines our company.",
];

const body = "text-[15px] leading-snug text-[#1d2f63] sm:text-[17px] lg:text-[clamp(17px,1.3vw,19px)]";

export default function AboutCeoMessage() {
  const [open, setOpen] = useState(false);
  const letterId = useId();
  // The letter's full height in px (re-measured when its width changes); half of it shows collapsed
  const letterRef = useRef(null);
  const [full, setFull] = useState(0);

  useEffect(() => {
    const el = letterRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setFull(el.scrollHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section aria-labelledby="about-ceo" data-guide="aboutCeo" className="bg-white px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
      <div className="mx-auto grid max-w-[69rem] grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1fr)] lg:gap-[clamp(3rem,8vw,7.5rem)]">
        <figure className="mx-auto w-full max-w-[26rem] lg:mx-0 lg:max-w-none">
          <div className="overflow-hidden rounded-2xl shadow-[0_24px_60px_-28px_rgba(0,36,97,0.35)]">
            <Image
              src="/about/ceo-portrait.webp"
              alt="Mohammed Ziya, Founder and CEO of Techzarinfo"
              width={712}
              height={792}
              sizes="(min-width: 1024px) 27rem, (min-width: 640px) 26rem, calc(100vw - 2rem)"
              className="h-auto w-full"
            />
          </div>
          <figcaption className="mt-6 lg:mt-8">
            <p className="text-[24px] font-semibold tracking-tight text-[#0f2a6b] sm:text-[28px] lg:text-[clamp(28px,2.2vw,32px)]">Mohammed Ziya</p>
            <p className="mt-2 text-[15px] text-[#6b7aa0] sm:text-[17px] lg:mt-3 lg:text-[clamp(17px,1.3vw,19px)]">Founder &amp; CEO</p>
          </figcaption>
        </figure>

        <div className="lg:pt-[clamp(0.5rem,1.4vw,1.25rem)]">
          <h2
            id="about-ceo"
            className="text-[28px] font-medium leading-[1.18] tracking-tight text-[#1f4597] sm:text-[34px] lg:text-[clamp(34px,3vw,44px)]"
          >
            A Message from Our CEO
          </h2>





          {/* The letter: the first half shows, fading out, until "Read Full Message" opens the rest */}
          <div
            id={letterId}
            className="relative overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{ maxHeight: full ? `${open ? full : Math.round(full / 2)}px` : open ? "none" : "20rem" }}
          >
            <div>
              <div ref={letterRef} className={`space-y-5 pt-6 ${body}`}>
                <p className="font-medium text-[#0f2a6b]">Dear Clients, Partners, and Associates,</p>
                <p>Welcome, I am Happy, You are here. Please look around and explore.</p>
                <p>
                  We, Techzarinfo, are the company to ensure a promising future for the next generation through
                  Software Development, IT Enablement, and Digital Transformation. We are a company that cares deeply
                  about our connection to the world around us. Our employees have a passion for causes and
                  organizations dear to their hearts, and we are committed to their having the time and energy to give
                  back to the communities where we do business.
                </p>
                <p>
                  One great strength of our company is to focus on the latest technology trends and investment in
                  Innovation. Today, we are one of the leaders in creating cutting-edge applications for various
                  platforms and domains. We continue to innovate with a constant flow of new ideas. Recognizing every
                  customer has his own unique market position and strategies, we work hard to understand and meet those
                  special needs.
                </p>
                <p>Let me list some of our key defining strategies:</p>
                <ul className="space-y-2.5 pl-1">
                  {STRATEGIES.map((s) => (
                    <li key={s} className="flex gap-3">
                      <span className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-[#1f6ff0]" aria-hidden="true" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  We will continue on providing the best performance for inspiring others. We would like to have your
                  support and patronage and are looking forward to doing business with you. Once again, welcome to
                  TZI, and thank you for your interest in our company.
                </p>
              </div>
            </div>
            {/* Fades the cut-off text into the page while collapsed */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-white/0 to-white transition-opacity duration-300 ${open ? "opacity-0" : "opacity-100"}`}
            />
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={letterId}
            className="mt-8 inline-flex items-center gap-2.5 rounded-md text-[15px] font-medium text-[#1f6ff0] transition-colors hover:text-[#0b4fc0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f6ff0] sm:text-[17px] lg:mt-[clamp(2rem,3.4vw,3rem)] lg:text-[clamp(17px,1.3vw,19px)]"
          >
            {open ? "Show Less" : "Read Full Message"}
            <ChevronDown className={`size-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

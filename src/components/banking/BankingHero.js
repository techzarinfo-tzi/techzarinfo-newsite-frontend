import Image from "next/image";
import Link from "next/link";
import { CircleCheck } from "lucide-react";
import HeroButton, { HeroButtonGroup } from "@/components/common/HeroButton";

const HIGHLIGHTS = [
  "White-Label Neobank Solutions",
  "Core Banking Modernization",
  "Compliance-Ready Fintech Architecture",
];

// Desktop follows the 1440px design (the same hero system as the crypto and blockchain pages): copy
// on the left, starting ~10.35vw in and vertically centred; the two bank cards on the right, ~43vw
// wide at 1440, ~100px in from the right edge. Below lg the copy stacks above the cards, both centred.
// Entrance (globals.css, .erp-hero-*): the copy rises in line by line and the cards glide in from
// the right, then float gently. Transform and opacity only, so nothing shifts.
export default function BankingHero() {
  return (
    <section data-guide="bankingHero" className="relative overflow-hidden bg-[#e2f1ff]">
      {/* Sky-blue wash: brighter haze up top, softening to white at the bottom edge */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 40% at 35% 0%, #b3d8f8 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 0% 40%, #c6e7fa 0%, transparent 75%), linear-gradient(180deg, #cbe6fc 0%, #e2f1ff 55%, #ebf5fe 85%, #ffffff 100%)",
        }}
      />

      <div className="relative z-10 grid grid-cols-1 items-center gap-10 pt-28 pb-12 sm:pt-32 lg:min-h-[clamp(600px,52.8vw,800px)] lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-[4vw] lg:pt-[clamp(110px,8.5vw,130px)] lg:pb-[clamp(32px,3vw,48px)]">
        <div className="@container px-4 text-center sm:px-6 lg:pl-[clamp(2rem,10.35vw,11rem)] lg:pr-0 lg:text-left">
          {/* Always two lines: each line is kept whole, and the size is the hero scale capped so the
              longer line (~12.2em) fits the copy column (100cqw / 12.8 leaves a little slack). */}
          <h1 className="erp-hero-line text-[length:min(32px,calc(100cqw/12.8))] font-medium leading-[1.2] tracking-tight text-[#002461] sm:text-[length:min(40px,calc(100cqw/12.8))] lg:text-[length:min(clamp(40px,3.35vw,52px),calc(100cqw/12.8))]">
            <span className="block whitespace-nowrap">Digital Banking &amp; Neobank</span>
            <span className="block whitespace-nowrap">Development Company</span>
          </h1>
          <p
            className="erp-hero-line mx-auto mt-4 max-w-xl text-base leading-snug text-[#002461] sm:text-lg lg:mx-0 lg:max-w-[600px] lg:text-[clamp(17px,1.3vw,20px)]"
            style={{ "--d": "0.12s" }}
          >
            Our digital banking and neobank development services help banks and fintech startups
            launch secure, scalable platforms using mobile apps, real-time payments, and AI automation
            for experiences and growth.
          </p>

          <HeroButtonGroup className="erp-hero-line" style={{ "--d": "0.24s" }}>
            <HeroButton label="Contact Us" href="/contact-us" />
            <HeroButton label="Book a Demo" href="/demo" variant="secondary" />
          </HeroButtonGroup>


        </div>

        <div className="erp-hero-art mx-auto w-[min(86vw,420px)] sm:w-[min(64vw,480px)] lg:mr-[clamp(2rem,6.9vw,8rem)] lg:w-[clamp(400px,40vw,620px)]">
          <Image
            src="/service/digital-banking/hero/hero.png"
            alt="Two TZI digital bank cards"
            width={616}
            height={429}
            preload
            className="erp-hero-float h-auto w-full drop-shadow-[0_24px_40px_rgba(0,36,97,0.14)]"
          />
        </div>
      </div>

      {/* White fade so the artwork blends into the next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-linear-to-b from-transparent to-white"
      />
    </section>
  );
}

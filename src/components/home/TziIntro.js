import Image from "next/image";
import WaterBackground from "./WaterBackground";

// Supplied 1365 x 768 transparent canvas; the phone sits in its middle third.
const PHONE = "/home/intro/phone.png";

// left/top/width: % of the Figma frame (635 x 460) for each card's top-left corner.
const cards = [
  { text: "Streamlined Project And Programme Management", left: 41.7, top: 29.8, width: 26.5 },
  { text: "Comprehensive Digital Engineering Expertise", left: 9.8, top: 46.5, width: 26 },
  { text: "Embrace Everything From Automation And Analytics To Artificial Intelligence (AI)", left: 64.9, top: 53, width: 28.6 },
  { text: "Strategic And In-Depth Consultation Services", left: 37, top: 78.7, width: 25.7 },
];

function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" className="h-[42%] w-[42%]" aria-hidden="true">
      <path d="M12 3c.7 4.6 2.4 6.3 9 9-6.6 2.7-8.3 4.4-9 9-.7-4.6-2.4-6.3-9-9 6.6-2.7 8.3-4.4 9-9Z" />
    </svg>
  );
}

function Card({ text }) {
  return (
    <div className="flex items-center gap-3 rounded-full bg-white/75 p-1.5 pr-5 shadow-[0_8px_30px_rgba(30,80,170,0.14)] ring-1 ring-white/80 backdrop-blur-sm lg:gap-[1.1cqw] lg:p-[0.42cqw] lg:pr-[1.4cqw]">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_25%,#2f6fd6,#0a3a8c_70%)] shadow-[0_4px_10px_rgba(10,58,140,0.35)] lg:h-[4.1cqw] lg:w-[4.1cqw]">
        <Sparkle />
      </span>
      <p className="text-[14px] leading-[1.3] text-[#002148] sm:text-[16px] lg:text-[clamp(9px,1.11cqw,16px)]">{text}</p>
    </div>
  );
}

export default function TziIntro() {
  return (
    <section data-guide="water" className="relative overflow-hidden bg-white">
      <WaterBackground />
      <div className="relative mx-auto w-full max-w-[1440px] [container-type:inline-size]">
        <div className="px-4 py-12 sm:px-6 sm:py-16 lg:relative lg:aspect-[635/460] lg:p-0">
          <div className="text-center lg:absolute lg:inset-x-0 lg:top-[4.3%]">
            <h2 className="mx-auto max-w-[640px] text-[26px] font-semibold leading-[1.3] text-[#002148] sm:text-[34px] lg:max-w-none lg:text-[clamp(22px,2.78cqw,40px)]">
              Techzarinfo is to help companies of all sizes <br className="hidden lg:block" />
              thrive in an ever-changing technical landscape
            </h2>
            <p className="mx-auto mt-4 max-w-[640px] text-[15px] leading-[1.5] text-[#002148] sm:text-[17px] lg:mt-[1.1cqw] lg:max-w-none lg:text-[clamp(11px,1.39cqw,20px)]">
              The digital transformation and IT enablement solution from TZI include in-depth analytics that{" "}
              <br className="hidden lg:block" />
              helps you understand the current pain points and bottlenecks in your organization.
            </p>
          </div>

          {/* Full-frame canvas on desktop (phone lands at the Figma position); cropped and zoomed on smaller screens */}
          <div data-water-source className="pointer-events-none relative z-10 mx-auto mt-6 aspect-[4/3] w-full max-w-[440px] overflow-hidden [mask-image:radial-gradient(closest-side,#000_78%,transparent)] lg:absolute lg:[mask-image:none] lg:left-0 lg:top-[21%] lg:mt-0 lg:aspect-[1365/768] lg:max-w-none lg:overflow-visible">
            {/* Floats on the water: WaterBackground drives this element's transform per frame,
                bobbing and rocking it in sync with the ripple passing under its footprint. */}
            <div data-water-float className="absolute inset-0 will-change-transform origin-[50%_62%]">
              <Image
                src={PHONE}
                alt="TZI mobile app"
                fill
                priority
                sizes="(min-width: 1024px) 1440px, 440px"
                className="origin-[50%_58%] scale-[1.75] object-cover drop-shadow-[0_30px_40px_rgba(20,60,140,0.22)] lg:scale-100 lg:object-contain"
              />
            </div>
          </div>

          <ul className="relative z-20 mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:static lg:mt-0 lg:block">
            {cards.map(({ text, left, top, width }) => (
              <li
                key={text}
                className="lg:absolute lg:z-20 lg:left-[var(--l)] lg:top-[var(--t)] lg:w-[var(--w)]"
                style={{ "--l": `${left}%`, "--t": `${top}%`, "--w": `${width}%` }}
              >
                <Card text={text} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";

const HERO = "/service/mobile-app/hero";

// Mobile App hero artwork, per the design: the tilted phone (1.png) in the middle with the cloud
// (4.svg), AI (2.svg) and API (3.svg) tiles floating around it, and a small analytics card over
// its lower right edge. Everything is placed in % of a fixed-ratio box so the group scales as one
// at every width. The tiles bob gently (mobile-hero-float, staggered via --d).
const ICONS = [
  { src: `${HERO}/4.svg`, alt: "Cloud upload", w: 91, h: 85, className: "left-0 top-[9%] w-[18%]", d: "0s" },
  { src: `${HERO}/2.svg`, alt: "AI chip", w: 118, h: 119, className: "right-[1%] top-[20%] w-[19%]", d: "-1.2s" },
  { src: `${HERO}/3.svg`, alt: "API", w: 135, h: 135, className: "left-[1%] top-[55%] w-[23%]", d: "-2.4s" },
];

function AnalyticsCard() {
  return (
    <div
      aria-hidden="true"
      className="mobile-hero-float absolute left-[58%] top-[62%] w-[29%] overflow-hidden rounded-[0.6vw] bg-white shadow-[0_10px_30px_rgba(0,36,97,0.18)] max-lg:rounded-md"
      style={{ "--d": "-0.6s" }}
    >
      <div className="flex items-center gap-[4%] bg-[#3d7bf2] px-[6%] py-[4%]">
        <span className="aspect-square w-[4%] rounded-full bg-white/90" />
        <span className="aspect-square w-[4%] rounded-full bg-white/90" />
        <span className="aspect-square w-[4%] rounded-full bg-white/90" />
      </div>
      <div className="flex items-center gap-[8%] px-[8%] py-[10%]">
        <svg viewBox="0 0 32 32" className="w-[34%] shrink-0">
          <circle cx="16" cy="16" r="16" fill="#cfe0fb" />
          <path d="M16 16 L16 0 A16 16 0 0 1 31.2 21 Z" fill="#7aa6f5" />
          <path d="M16 16 L31.2 21 A16 16 0 1 1 16 0 Z" fill="#2f6be8" />
        </svg>
        <div className="flex flex-1 flex-col gap-[0.5vw] max-lg:gap-1">
          <span className="h-[0.35vw] min-h-[3px] w-full rounded-full bg-[#b9cdf2]" />
          <span className="h-[0.35vw] min-h-[3px] w-[80%] rounded-full bg-[#b9cdf2]" />
          <span className="h-[0.35vw] min-h-[3px] w-[90%] rounded-full bg-[#b9cdf2]" />
        </div>
      </div>
    </div>
  );
}

export default function MobileHeroArt() {
  return (
    <div className="relative aspect-[300/340] w-full">
      <Image
        src={`${HERO}/1.png`}
        alt="A smartphone showing a finance app dashboard with total balance and recent activity"
        width={358}
        height={558}
        preload
        sizes="(min-width: 1024px) 24vw, 65vw"
        className="absolute left-[8%] top-0 h-auto w-[70%]"
      />
      {ICONS.map((icon) => (
        <Image
          key={icon.src}
          src={icon.src}
          alt={icon.alt}
          width={icon.w}
          height={icon.h}
          unoptimized
          className={`mobile-hero-float absolute h-auto ${icon.className}`}
          style={{ "--d": icon.d }}
        />
      ))}
      <AnalyticsCard />
    </div>
  );
}

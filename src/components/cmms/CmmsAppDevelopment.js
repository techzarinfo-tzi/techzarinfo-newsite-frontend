import Image from "next/image";
import CardStack from "@/components/cmms/CardStack";

const ASSETS = "/product/CMMS/app-development";

// Three alternating feature cards from the 1440px design (1230px wide, 502px tall, 30px apart): copy
// on one side, dashboard artwork on the other. The middle card mirrors the layout (artwork left) and
// drops the outline. Each artwork is pre-cropped by the design on its outer edge (the middle one on
// its left, the last one on its right), so those sit flush with the card edge. Image boxes are the
// design's, as fractions of the 1230px card, so they scale with it on desktop.
const features = [
  {
    title: "Preventive Maintenance",
    text: "Proactive upkeep at your fingertips: Streamline preventive maintenance with our CMMS, ensuring equipment longevity and uninterrupted operations",
    points: ["Scheduled Inspections and Tasks", "Asset Performance Monitoring", "Notification and Alerts", "Historical Analysis"],
    image: {
      src: `${ASSETS}/app-1.svg`,
      width: 660,
      height: 479,
      alt: "Preventive maintenance dashboard with scheduled inspections, maintenance tasks and an upcoming inspection",
      // left 568, top 10, 660 wide
      box: "lg:left-[46.18%] lg:top-[2%] lg:w-[53.66%]",
    },
    outlined: true,
  },
  {
    title: "Breakdown Maintenance",
    text: "Swift resolution, minimal disruption: Address unexpected breakdowns promptly with our CMMS, optimizing equipment uptime and productivity",
    points: ["Instant Issue Reporting", "Prioritization and Assignment", "Real-time Communication", "Maintenance Tracking"],
    image: {
      src: `${ASSETS}/app-2.svg`,
      width: 593,
      height: 399,
      alt: "Breakdown maintenance dashboard with recent incidents, resolution stats and an incident overview chart",
      // flush left, top 59, 593 wide
      box: "lg:left-0 lg:top-[11.75%] lg:w-[48.21%]",
    },
    reverse: true,
  },
  {
    title: "Spares Inventory",
    text: "Efficient inventory control at a glance: Manage and optimize spares inventory seamlessly within our CMMS for streamlined maintenance operations",
    points: ["Inventory Monitoring", "Ordering and Procurement Integration", "Supplier Management", "Reporting and Analysis"],
    image: {
      src: `${ASSETS}/app-3.svg`,
      width: 615,
      height: 415,
      alt: "Spares inventory dashboard with stock levels, purchase orders and supplier details",
      // left 613, top 36, 615 wide (to the card's inner right edge)
      box: "lg:right-0 lg:top-[7.17%] lg:w-[50%]",
    },
    outlined: true,
  },
];

// The design's two blurred glows behind the artwork: a blue one and a cyan one, 265×257 ellipses
// blurred by 170.5px (the SVGs carry the blur, so each box is the ellipse plus 341px on every side).
// Desktop only; offsets are the design's, measured from the artwork's side of the card.
function Glows({ reverse }) {
  const glow = "pointer-events-none absolute hidden h-[939px] w-[947px] max-w-none lg:block";
  return reverse ? (
    <>
      <img src={`${ASSETS}/glow-1.svg`} alt="" aria-hidden="true" className={`${glow} top-[-263px] left-[-13px]`} />
      <img src={`${ASSETS}/glow-2.svg`} alt="" aria-hidden="true" className={`${glow} top-[-163px] left-[-273px]`} />
    </>
  ) : (
    <>
      <img src={`${ASSETS}/glow-1.svg`} alt="" aria-hidden="true" className={`${glow} top-[-265px] right-[-52px]`} />
      <img src={`${ASSETS}/glow-2.svg`} alt="" aria-hidden="true" className={`${glow} top-[-165px] right-[-312px]`} />
    </>
  );
}

function StarIcon() {
  return (
    <span
      aria-hidden="true"
      className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-linear-to-b from-[#005EFF] to-[#5593FF] lg:size-[29px]"
    >
      <img src={`${ASSETS}/star.svg`} alt="" width={17.4} height={17.4} className="size-[15px] lg:size-[17.4px]" />
    </span>
  );
}

function FeatureCard({ title, text, points, image, reverse, outlined }) {
  return (
    <li
      data-stack-card
      className={`relative flex flex-col overflow-hidden rounded-[20px] bg-[#e9f5ff] lg:h-[clamp(440px,40.8vw,502px)] lg:flex-row lg:items-center ${
        outlined ? "border-2 border-[#77a3fa]" : ""
      } ${reverse ? "lg:justify-end" : ""}`}
    >
      <Glows reverse={reverse} />

      <div
        className={`relative z-10 px-6 pt-8 sm:px-10 sm:pt-10 lg:p-0 ${
          // Copy column: left 48 / 667 wide, or (mirrored) from 593 to 44 short of the right edge
          reverse ? "lg:w-[51.8%] lg:pr-[3.6%]" : "lg:w-[58.1%] lg:pl-[3.9%]"
        }`}
      >
        <h3 className="text-2xl font-semibold leading-tight tracking-tight text-[#002461] sm:text-[28px] lg:text-[clamp(26px,2.2vw,30px)]">
          {title}
        </h3>
        <p className="mt-3 max-w-[592px] text-base leading-normal text-[#002461] sm:text-lg lg:mt-[15px] lg:text-[clamp(17px,1.4vw,20px)]">
          {text}
        </p>

        <ul className="mt-6 grid gap-3.5 sm:grid-cols-2 sm:gap-x-6 lg:mt-10 lg:grid-cols-1 lg:gap-[23px]">
          {points.map((label) => (
            <li key={label} className="flex items-center gap-[15px] text-base text-[#002461] sm:text-lg lg:text-[clamp(17px,1.4vw,20px)]">
              <StarIcon />
              {label}
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile: below the copy, at its natural size. Desktop: the design's box on the card. */}
      <div
        className={`relative mt-8 w-[min(100%,620px)] pb-4 lg:absolute lg:mt-0 lg:pb-0 ${image.box} ${
          reverse ? "mr-auto" : "ml-auto"
        }`}
      >
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} className="h-auto w-full" />
      </div>
    </li>
  );
}

export default function CmmsAppDevelopment() {
  return (
    <section data-guide="cmmsAppDevelopment" className="relative bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[776px] text-center">
        <h2 className="mx-auto max-w-[600px] text-[28px] font-semibold leading-[1.25] tracking-tight text-balance text-[#002461] sm:text-[34px] lg:text-[40px]">
          Maintenance Management App Development Solutions
        </h2>
        <p className="mx-auto mt-4 text-[15px] leading-normal text-[#002461] sm:text-base lg:text-xl">
          Empowering businesses to streamline maintenance processes, improve asset performance, and ensure
          operational excellence.
        </p>
      </div>

      {/* Scroll-linked stack: each card pins and the next one slides up over it (CardStack.js) */}
      <CardStack className="mx-auto mt-10 grid max-w-[1230px] gap-6 lg:mt-16 lg:gap-[30px]">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </CardStack>
    </section>
  );
}

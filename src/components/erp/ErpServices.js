"use client";

import { useState } from "react";
import { Building2, HardHat, Layers, Plug, Settings } from "lucide-react";

// Icons from Lucide (lucide.dev), drawn in the site's colour via currentColor
const icons = {
  custom: Layers,
  smes: Settings,
  enterprise: Building2,
  integration: Plug,
  construction: HardHat,
};

// Card styles from the design, left to right: deep navy, pale blue, bright blue, royal blue, and a
// very light blue one with navy text and a blue icon tile.
const services = [
  {
    icon: "custom",
    title: "Custom ERP Development",
    text: "Why change your business to fit software? Build software that fits your business. With custom ERP development, your workflows, departments, and business data become part of one intelligent system.",
    card: "from-[#0b347f] to-[#072763] text-white",
    tile: "bg-white text-[#0b347f]",
    tilt: -5,
  },
  {
    icon: "smes",
    title: "ERP for SMEs",
    text: "Growth should create opportunities, not confusion. Our ERP for SMEs brings sales, inventory, finance, purchasing, and day-to-day operations into one connected system. Get a clear view of your business operations.",
    card: "from-[#8dbbf3] to-[#a6cbf7] text-white",
    tile: "bg-white text-[#1f63da]",
    tilt: 5,
  },
  {
    icon: "enterprise",
    title: "Enterprise-Grade ERP Systems",
    text: "When your business grows bigger, managing it shouldn't become harder. Our Enterprise-Grade ERP systems unite complex operations, multiple departments, and integrations under one powerful platform.",
    card: "from-[#2b78ef] to-[#3d88f6] text-white",
    tile: "bg-white text-[#1f63da]",
    tilt: -5,
  },
  {
    icon: "integration",
    title: "ERP Software Integration",
    text: "Stop switching between five different tools just to find the data you need. Your CRM, HRMS, and finance tools shouldn't work on different platforms. We connect everything into one flow - so your data finally talks.",
    card: "from-[#0a4fd8] to-[#1259e6] text-white",
    tile: "bg-white text-[#0a4fd8]",
    tilt: 4,
  },
  {
    icon: "construction",
    title: "Construction ERP Software Development",
    text: "One delayed shipment, one missed deadline - and suddenly the whole project's timeline is out of track. Our ERP is completely built for construction's moving pieces, this keeps projects, resources, and timelines properly.",
    card: "from-[#e4f0ff] to-[#f1f7ff] text-[#002461]",
    tile: "bg-linear-to-b from-[#2b6ee0] to-[#1a58c8] text-white",
    tilt: -6,
  },
];

// Resting stack order from the design: the middle card on top, each side rising towards it, and the
// far-right card above its neighbour.
const restZ = [1, 2, 5, 3, 4];

// Desktop fan (globals.css .erp-fan): cards sit --pitch apart (67.5% of a card width, so each
// overlaps the next by about a third), tilted alternately. With a card selected, it rises, straightens
// and grows on top, and the cards on each side slide outward, the nearest one the full PUSH (a card
// width share) and farther ones a little less, while shrinking slightly, so the selected card is fully
// clear. Mobile stack: the selected card lifts and grows; its neighbours nudge up and down.
const PUSH = 0.34;
const FALLOFF = 0.85;

function fanTransform(i, active) {
  const { tilt } = services[i];
  if (active === null) return `translate3d(0, 0, 0) rotate(${tilt}deg) scale(1)`;
  if (i === active) return "translate3d(0, -18px, 0) rotate(0deg) scale(1.08)";
  const side = Math.sign(i - active);
  const shift = PUSH * FALLOFF ** (Math.abs(i - active) - 1);
  return `translate3d(calc(var(--card) * ${(side * shift).toFixed(3)}), 6px, 0) rotate(${tilt * 1.2}deg) scale(0.94)`;
}

function stackTransform(i, active) {
  const tilt = services[i].tilt * 0.5;
  if (active === null) return `translate3d(0, 0, 0) rotate(${tilt}deg) scale(1)`;
  if (i === active) return "translate3d(0, 0, 0) rotate(0deg) scale(1.04)";
  const side = Math.sign(i - active);
  return `translate3d(0, ${side * 22}px, 0) rotate(${tilt}deg) scale(0.97)`;
}

function Card({ service, className = "", style, ...rest }) {
  return (
    <article
      className={`erp-svc-card flex flex-col rounded-2xl bg-linear-to-br p-6 shadow-[0_18px_40px_-14px_rgba(0,36,97,0.4)] lg:p-[clamp(20px,1.9vw,28px)] ${service.card} ${className}`}
      style={style}
      {...rest}
    >
      <span
        aria-hidden="true"
        className={`flex size-11 shrink-0 items-center justify-center rounded-lg shadow-[0_4px_10px_rgba(0,36,97,0.15)] ${service.tile}`}
      >
        {(() => {
  const Icon = icons[service.icon];
  return <Icon aria-hidden="true" strokeWidth={1.8} className="size-5" />;
})()}
      </span>
      <h3 className="mt-6 text-[22px] font-medium leading-tight lg:mt-[clamp(20px,2.2vw,32px)] lg:text-[clamp(19px,1.75vw,25px)]">
        {service.title}
      </h3>
      <p className="mt-4 text-sm leading-normal opacity-90 lg:text-[clamp(12.5px,1vw,14.5px)]">{service.text}</p>
    </article>
  );
}

export default function ErpServices() {
  const [active, setActive] = useState(null);
  // The last card to leave the front keeps a raised layer until its transition ends, so it doesn't
  // drop behind its neighbours while it is still shrinking back into the fan.
  const [settling, setSettling] = useState(null);

  const select = (i) => {
    if (i === active) return;
    if (active !== null) setSettling(active);
    setActive(i);
  };
  const clear = () => {
    if (active === null) return;
    setSettling(active);
    setActive(null);
  };
  const toggle = (i) => (active === i ? clear() : select(i));
  const zFor = (i) => (i === active ? 20 : i === settling ? 15 : restZ[i]);
  const onSettled = (i) => (e) => {
    if (e.propertyName === "transform" && i === settling && i !== active) setSettling(null);
  };
  // Mouse and pen hover; touch (which also reports a hover) taps instead
  const hover = (fn) => (e) => {
    if (e.pointerType !== "touch") fn();
  };

  return (
    <section data-guide="erpServices" className="overflow-x-clip bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[820px] text-center">
        <h2 className="mx-auto max-w-[620px] text-[28px] font-semibold leading-[1.25] tracking-tight text-balance text-[#002461] sm:text-[34px] lg:text-[40px]">
          Our ERP Software Development Services
        </h2>
        <p className="mx-auto mt-3 max-w-[760px] text-[15px] leading-normal text-[#002461] sm:text-base lg:text-lg">
          Every business has its own objectives and goals, and likewise, every client has unique
          operational needs. At Techzarinfo, we understand this diversity and deliver tailored ERP
          software development services in India to match your specific requirements
        </p>
      </div>

      {/* Desktop (1280px and up): the fan */}
      <div className="erp-fan relative mx-auto mt-14 hidden xl:block" onPointerLeave={hover(clear)}>
        {services.map((service, i) => (
          <Card
            key={service.title}
            service={service}
            aria-hidden="true"
            className="absolute top-0 h-(--card-h) w-(--card) transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-0"
            style={{ left: `calc(var(--pitch) * ${i})`, zIndex: zFor(i), transform: fanTransform(i, active) }}
            onTransitionEnd={onSettled(i)}
          />
        ))}
        {/* Hover/tap targets: fixed columns over the resting fan, one per card. They never move, so
            the cards sliding aside can't shift which card is under the pointer. They also carry the
            accessible content and keyboard focus for the fan. */}
        <ul className="absolute inset-0 z-30 flex">
          {services.map((service, i) => (
            <li key={service.title} className="h-full flex-1">
              <button
                type="button"
                aria-pressed={active === i}
                className="h-full w-full cursor-pointer rounded-2xl text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005EFF]"
                onPointerEnter={hover(() => select(i))}
                onClick={() => toggle(i)}
                onFocus={() => select(i)}
                onBlur={clear}
              >
                <span className="sr-only">
                  {service.title}. {service.text}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Below 1280px (phones, tablets, small laptops): an overlapping stack */}
      <ul className="mx-auto mt-10 flex max-w-[420px] flex-col xl:hidden">
        {services.map((service, i) => (
          <li key={service.title} className="relative [&:not(:first-child)]:-mt-7" style={{ zIndex: zFor(i) }}>
            <Card
              service={service}
              role="button"
              tabIndex={0}
              aria-pressed={active === i}
              className="cursor-pointer touch-manipulation transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005EFF] motion-reduce:duration-0"
              style={{ transform: stackTransform(i, active) }}
              onClick={() => toggle(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle(i);
                }
              }}
              onTransitionEnd={onSettled(i)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

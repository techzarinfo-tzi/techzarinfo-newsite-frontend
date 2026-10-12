"use client";

import { useEffect, useRef } from "react";

// Six process steps from the 1440px design, in design px on a 1002 x 1326 canvas (the area the
// curve and its text cover). `node` is where the icon sits on the curve; `num` is the top-left of the
// big faded numeral; `text` is the top-left of the title/copy column (`at`) and `w` its width.
const steps = [
  {
    title: "Consultation",
    text: "First, we understand your business goals and create a blockchain strategy tailored to your needs.",
    icon: "meeting",
    node: [407, 67],
    num: [367, 140],
    at: [444, 150],
    w: 300,
  },
  {
    title: "Planning",
    text: "We plan the development roadmap and select the right Blockchain platform, tools, and technologies.",
    icon: "target",
    node: [53, 374],
    num: [141, 305],
    at: [233, 313],
    w: 300,
  },
  {
    title: "Development",
    text: "Our developers will build secure, scalable, and efficient blockchain solutions tailored to your business needs.",
    icon: "laptop",
    node: [247, 546],
    num: [64, 601],
    at: [163, 597],
    w: 300,
  },
  {
    title: "Testing",
    text: "Our testing team will test security, performance, and reliability to ensure a smooth user experience.",
    icon: "search",
    node: [537, 654],
    num: [562, 497],
    at: [660, 509],
    w: 296,
  },
  {
    title: "Deployment",
    text: "Finally, we deploy your blockchain solution and integrate it with your existing systems.",
    icon: "globe",
    node: [608, 895],
    num: [566, 949],
    at: [660, 956],
    w: 300,
  },
  {
    title: "Support",
    text: "After the launch, we provide ongoing support and optimization to keep your blockchain solution running smoothly.",
    icon: "headset",
    node: [318, 1123],
    num: [281, 1200],
    at: [376, 1208],
    w: 330,
  },
];

const CW = 1002;
const CH = 1326;

// The S-shaped road through every node, top-right to bottom-left, in canvas px.
const ROAD =
  "M491 15 C465 30 435 50 407 67 C277 147 53 260 53 374 C53 460 150 515 247 546 C340 575 450 610 537 654 " +
  "C610 690 666 720 666 773 C666 830 640 865 608 895 C530 965 400 1065 318 1123 C260 1163 200 1205 161 1233";

const ICONS = {
  meeting: (
    <>
      <circle cx="8" cy="8" r="3" />
      <path d="M2.5 19c0-3.1 2.5-5.5 5.5-5.5s5.5 2.4 5.5 5.5" />
      <path d="M15 6.5h4.5a1 1 0 0 1 1 1V11a1 1 0 0 1-1 1H17l-2 2v-2" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5.5" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  laptop: (
    <>
      <rect x="4" y="5" width="16" height="11" rx="1.5" />
      <path d="M2 19h20" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m20 20-5.2-5.2" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <path d="M3 12h18M4.6 7.5h14.8M4.6 16.5h14.8" />
    </>
  ),
  headset: (
    <>
      <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
      <rect x="3" y="14" width="4" height="6" rx="1.5" />
      <rect x="17" y="14" width="4" height="6" rx="1.5" />
      <path d="M19 20c0 1.4-1.8 2-4.5 2H13" />
    </>
  ),
};

function StepIcon({ name, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

// White disc with a pale blue ring and glow, the icon in sky blue.
const nodeClass =
  "flex items-center justify-center rounded-full border-2 border-[#cdeafd] bg-white text-[#1d9bf0] shadow-[0_0_0_6px_rgba(42,169,246,0.07),0_4px_16px_rgba(42,169,246,0.32)]";

// Big numeral fading from blue at the top to white at the bottom.
const numeralClass =
  "bg-linear-to-b from-[#3f86dd] via-[#a9c9f1] to-white bg-clip-text font-bold leading-[0.8] text-transparent";

// px in canvas units, scaled to the canvas width (--u = 1 design px).
const u = (n) => `calc(${n} * var(--u))`;

// Fraction (0..1) of the way along `path` where it passes closest to (x, y), in the path's own units.
function lengthFractionAt(path, x, y) {
  const total = path.getTotalLength();
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i <= 400; i++) {
    const p = path.getPointAtLength((total * i) / 400);
    const d = (p.x - x) ** 2 + (p.y - y) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = i / 400;
    }
  }
  return best;
}

// Centred heading and intro, then the roadmap. Desktop (lg+): the design's canvas, every part placed
// in design px and scaled with the canvas width, which sits 50px right of centre as in the design.
// Below lg the S-curve becomes a vertical timeline: the same nodes, numerals and copy down a
// gradient line on the left.
// Animation (.roadmap-* in globals.css), played once when the section scrolls into view: heading and
// intro rise in, then the road draws from top to bottom at a steady speed, and each step reveals as
// the line reaches its node (--at = the node's fraction of the way along the line): node pops in,
// then numeral, then title and copy. Everything then stays in its final state. Without JS, or with
// reduced motion, the section renders in its final state.
export default function BlockchainRoadmap() {
  const sectionRef = useRef(null);
  const roadRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Desktop: where each node sits along the road.
    const road = roadRef.current;
    section.querySelectorAll("[data-road-step]").forEach((li, i) => {
      const [x, y] = steps[i].node;
      li.style.setProperty("--at", lengthFractionAt(road, x, y).toFixed(3));
    });

    // Timeline: where each node's centre sits down the line. Re-measured on play, as the copy may rewrap.
    const measureLine = () => {
      const line = lineRef.current;
      if (!line.offsetHeight) return;
      section.querySelectorAll("[data-line-step]").forEach((li) => {
        const node = li.firstElementChild;
        const centre = li.offsetTop + node.offsetTop + node.offsetHeight / 2;
        const at = Math.min(Math.max((centre - line.offsetTop) / line.offsetHeight, 0), 1);
        li.style.setProperty("--at", at.toFixed(3));
      });
    };
    measureLine();
    section.dataset.anim = "ready"; // start pose; with no JS the attribute never appears

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        measureLine();
        section.dataset.anim = "play";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="roadmap bg-white px-4 pt-14 pb-16 sm:px-6 sm:pt-16 sm:pb-20 lg:px-8 lg:pt-[104px] lg:pb-[106px]"
    >
      <div className="text-center">
        <h2 className="roadmap-rise mx-auto max-w-[600px] text-[26px] font-semibold leading-[1.25] tracking-tight text-[#002461] sm:text-[34px] lg:text-[40px]">
          Roadmap of Our Blockchain Development Process
        </h2>
        <p
          className="roadmap-rise mx-auto mt-3 max-w-[712px] text-[15px] leading-[1.45] text-[#002461]/80 sm:text-base lg:mt-1 lg:text-lg"
          style={{ "--d": "0.15s" }}
        >
          The basic blockchain development process is outlined below. Just as blockchain is transparent by
          nature, our team also maintains complete transparency in our work with clients.
        </p>
      </div>

      {/* Desktop canvas */}
      <div
        className="relative mx-auto mt-[86px] hidden w-full max-w-[1002px] translate-x-[5%] [container-type:inline-size] lg:block"
        style={{ aspectRatio: `${CW} / ${CH}`, "--u": `calc(100cqw / ${CW})` }}
      >
        <svg viewBox={`0 0 ${CW} ${CH}`} className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="roadmap-road" x1="0" y1="0" x2="0" y2={CH} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#2aaaf7" />
              <stop offset="1" stopColor="#0b5cc5" />
            </linearGradient>
          </defs>
          <path
            ref={roadRef}
            d={ROAD}
            pathLength="1"
            className="roadmap-road"
            stroke="url(#roadmap-road)"
            strokeWidth="17"
            strokeLinecap="round"
          />
        </svg>

        <ol>
          {steps.map(({ title, text, icon, node, num, at, w }, i) => (
            <li key={title} data-road-step>
              <span
                className={`roadmap-node absolute ${nodeClass}`}
                style={{ left: u(node[0] - 43), top: u(node[1] - 43), width: u(86), height: u(86) }}
              >
                <StepIcon name={icon} className="h-[37%] w-[37%]" />
              </span>
              <span
                className={`roadmap-num absolute ${numeralClass}`}
                style={{ left: u(num[0]), top: u(num[1]), fontSize: u(136) }}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div className="roadmap-copy absolute" style={{ left: u(at[0]), top: u(at[1]), width: u(w) }}>
                <h3 className="font-semibold leading-[1.3] text-[#0c2350]" style={{ fontSize: u(26) }}>
                  {title}
                </h3>
                <p className="leading-[1.4] text-[#5b6f95]" style={{ marginTop: u(10), fontSize: u(18) }}>
                  {text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Tablet and mobile timeline */}
      <ol className="relative mx-auto mt-10 max-w-[620px] sm:mt-14 lg:hidden">
        <span
          ref={lineRef}
          className="roadmap-line absolute top-7 bottom-7 left-[27px] w-[6px] -translate-x-1/2 rounded-full bg-linear-to-b from-[#2aaaf7] to-[#0b5cc5] sm:left-[32px]"
          aria-hidden="true"
        />
        {steps.map(({ title, text, icon }, i) => (
          <li key={title} data-line-step className="relative flex gap-4 pb-10 last:pb-0 sm:gap-6 sm:pb-12">
            <span className={`roadmap-node relative z-10 h-14 w-14 shrink-0 sm:h-16 sm:w-16 ${nodeClass}`}>
              <StepIcon name={icon} className="h-6 w-6 sm:h-7 sm:w-7" />
            </span>
            <div className="flex min-w-0 gap-3 pt-1 sm:gap-4">
              <span
                className={`roadmap-num w-10 shrink-0 text-center text-[64px] sm:w-14 sm:text-[84px] ${numeralClass}`}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div className="roadmap-copy min-w-0">
                <h3 className="text-xl font-semibold leading-[1.3] text-[#0c2350] sm:text-[22px]">{title}</h3>
                <p className="mt-2 text-[15px] leading-[1.5] text-[#5b6f95] sm:text-base">{text}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// "Onboard Top Tech Talent Across Every Stack": heading and intro, then (lg+) the design's orbit:
// a ring with drifting dots around a glowing </> stack, and seven developer cards placed round it.
// Positions are the design's (every-stack.webp, measured on a 700 x 466 frame) as percentages of a
// box with the same 1144:763 shape, so the composition scales as a whole. Below lg the centrepiece
// sits above the cards, which go two across from sm and stack on phones.
//
// Motion: the cards fade up one after another when the section scrolls into view; the centrepiece
// floats, its glow breathes and the ring's dots drift (all off with reduced motion). Cards lift on
// hover. Icon and centrepiece art are cropped from every-stack.webp into public/hire-a-developer/every-stack/.

const ART = "/hire-a-developer/every-stack";

// x, y, w: left, top and width in % of the orbit box
const ROLES = [
  { id: "full-stack", title: "Full-stack Developer", text: "End-to-end expertise", x: 34.3, y: 6.4, w: 30.7 },
  { id: "ai", title: "AI Developer", text: "Build intelligent solutions", x: 7.1, y: 22.5, w: 29.7 },
  { id: "front-end", title: "Front-end Developer", text: "Beautiful & responsive UI", x: 65, y: 22.5, w: 29.6 },
  { id: "blockchain", title: "Blockchain Developer", text: "Decentralized solutions", x: 2.1, y: 49.4, w: 29.6 },
  { id: "back-end", title: "Back-end Developer", text: "Powerful & scalable systems", x: 67.9, y: 49.8, w: 30.4 },
  { id: "crypto", title: "Crypto Exchange Developer", text: "Secure & high-performance", x: 14.7, y: 75.5, w: 31.7 },
  { id: "mobile", title: "Mobile Developer", text: "iOS & Android applications", x: 56.4, y: 75.1, w: 31.7 },
];

// The ring (in the 700 x 466 frame): its centre and radius, and where its dots sit (degrees, 0 = right)
const RING = { cx: 345, cy: 240, r: 205 };
const DOTS = [229, 189, 153, 92, 21, 349];

// Splits "Full-stack Developer" into its two design lines
const lines = (title) => {
  const i = title.lastIndexOf(" ");
  return [title.slice(0, i), title.slice(i + 1)];
};

function RoleCard({ role, index }) {
  const [first, last] = lines(role.title);
  return (
    <li
      className="stack-card lg:absolute lg:top-(--y) lg:left-(--x) lg:w-(--w)"
      style={{ "--x": `${role.x}%`, "--y": `${role.y}%`, "--w": `${role.w}%`, "--i": index }}
    >
      <Link
        href="/contact-us"
        aria-label={`Hire ${/^[AEIOU]/.test(role.title) ? "an" : "a"} ${role.title}: ${role.text}`}
        className="group flex items-center gap-[clamp(0.6rem,1.2cqw,1rem)] rounded-[2.2rem] border border-white/90 bg-white/75 p-[clamp(0.45rem,0.9cqw,0.75rem)] pr-[clamp(0.75rem,1.4cqw,1.2rem)] shadow-[0_12px_32px_-12px_rgba(37,99,235,0.28)] backdrop-blur-md transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-12px_rgba(37,99,235,0.38)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f6ff0] motion-reduce:transition-none"
      >
        <Image
          src={`${ART}/${role.id}.webp`}
          alt=""
          width={170}
          height={170}
          className="size-[clamp(3.25rem,7.2cqw,5rem)] shrink-0"
        />
        <span className="min-w-0 flex-1">
          <span className="block text-[clamp(15px,1.75cqw,19px)] leading-tight font-semibold text-[#0b1f4d]">
            {first}
            <br />
            {last}
          </span>
          <span className="mt-1 block text-[clamp(12px,1.2cqw,13.5px)] text-[#5b6687]">{role.text}</span>
        </span>
        <span
          aria-hidden="true"
          className="flex size-[clamp(1.75rem,2.9cqw,2.1rem)] shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-[#1f6ff0] transition-transform duration-300 group-hover:translate-x-0.5"
        >
          <ArrowRight className="size-[55%]" strokeWidth={2.2} />
        </span>
      </Link>
    </li>
  );
}

// The glowing </> stack with its soft blue blob
function Centrepiece({ className = "" }) {
  return (
    <div className={`stack-centre pointer-events-none ${className}`} aria-hidden="true">
      <div className="stack-blob absolute inset-0" />
      <Image
        src={`${ART}/stack.webp`}
        alt=""
        width={497}
        height={490}
        className="stack-float absolute top-1/2 left-1/2 h-auto w-[56%] -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}

export default function HireEveryStack() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  // Cards fade up once, the first time the section comes into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-labelledby="hire-stack-title"
      data-guide="hireStack"
      data-in={inView}
      className="stack relative isolate overflow-hidden bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-[clamp(4rem,6vw,6rem)]"
    >
      {/* Soft blue haze behind the orbit */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 45% 50% at 50% 62%, rgba(214,229,255,0.75) 0%, rgba(232,240,255,0.45) 45%, rgba(255,255,255,0) 75%)",
        }}
      />

      <div className="mx-auto max-w-[56rem] text-center">
        <h2
          id="hire-stack-title"
          className="text-[28px] font-semibold leading-[1.18] tracking-tight text-[#0f2a6b] sm:text-[34px] lg:text-[clamp(34px,3vw,44px)]"
        >
          Onboard Top Tech Talent Across Every Stack
        </h2>
        <p className="mt-3 text-[15px] leading-snug text-[#1d2f63] sm:text-[17px] lg:text-[clamp(16px,1.3vw,19px)]">
          Techzarinfo is your one-stop solution for projects of every scale and industry. We have a bunch of talents
          across multiple domains and modern tech stacks, giving you the freedom to hire exactly the experts your
          project needs. From web and mobile to enterprise systems and AI-driven platforms, we match you with developers
          who align with your goals and timelines.
        </p>
      </div>

      <div className="@container relative mx-auto mt-10 max-w-[68rem] lg:mt-[clamp(1.5rem,2.5vw,2.5rem)] lg:aspect-[1144/763]">
        {/* Orbit ring and its drifting dots (lg+) */}
        <svg
          className="absolute inset-0 hidden h-full w-full lg:block"
          viewBox="0 0 700 466"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <circle cx={RING.cx} cy={RING.cy} r={RING.r} fill="none" stroke="#bcd3fb" strokeWidth="1.4" />
          <circle cx={RING.cx} cy={RING.cy - 8} r="122" fill="none" stroke="#d3e2fd" strokeWidth="1" />
          <g className="stack-orbit" style={{ transformOrigin: `${RING.cx}px ${RING.cy}px` }}>
            {DOTS.map((deg) => {
              const a = (deg * Math.PI) / 180;
              return (
                <circle
                  key={deg}
                  cx={RING.cx + RING.r * Math.cos(a)}
                  cy={RING.cy + RING.r * Math.sin(a)}
                  r="3.6"
                  fill="#3b82f6"
                  stroke="#dbe8ff"
                  strokeWidth="2"
                />
              );
            })}
          </g>
          <circle cx="300" cy="145" r="3" fill="#3b82f6" stroke="#dbe8ff" strokeWidth="2" />
        </svg>

        {/* Centrepiece: in the middle of the orbit on lg+, above the cards below lg */}
        <Centrepiece className="relative mx-auto aspect-[280/230] w-[min(70%,20rem)] lg:absolute lg:top-[25.5%] lg:left-[29.3%] lg:w-[40%] lg:max-w-none" />

        <ul className="relative mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:static lg:mt-0 lg:block">
          {ROLES.map((role, i) => (
            <RoleCard key={role.id} role={role} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

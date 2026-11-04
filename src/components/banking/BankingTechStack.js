"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CircleCheck, Cloud, Database, FileText, Fingerprint, Globe, Landmark, Shield } from "lucide-react";

const IMG = "/service/digital-banking/techno";

const cards = [
  {
    image: { src: `${IMG}/2.png`, width: 238, height: 243 },
    alt: "Blue security shield with a check mark",
    title: "Security & Compliance",
    points: ["AML / KYC", "Fraud Detection", "Role-Based Access", "Regulatory Support (CBUAE, ADGM)"],
  },
  {
    image: { src: `${IMG}/3.png`, width: 256, height: 222 },
    alt: "API hub connected to a laptop and a server",
    title: "API-First Architecture",
    points: ["Open Banking APIs", "Microservices Infrastructure", "Third-Party Integrations", "Scalable Cloud Deployment"],
  },
  {
    image: { src: `${IMG}/1.png`, width: 256, height: 256 },
    alt: "A user linked to four connected platforms",
    title: "Omnichannel Experience",
    points: ["Mobile (iOS/Android)", "Web Banking", "Admin Dashboard", "Analytics Portal"],
  },
];

// The floating app tiles on the grid. Icons from Lucide (lucide.dev). x/y: the tile's centre, % of
// the grid panel; size: % of its width.
const tiles = [
  { icon: Shield, color: "#22c55e", x: 33.5, y: 23.5, size: 9.2, fill: true },
  { icon: Landmark, color: "#1554e0", x: 58.8, y: 38, size: 8 },
  { icon: FileText, color: "#1554e0", x: 16.4, y: 51.5, size: 8.6 },
  { icon: Globe, color: "#2b10c9", x: 43.8, y: 60.6, size: 8.6 },
  { icon: Cloud, color: "#1554e0", x: 16.4, y: 76.5, size: 8.6, fill: true },
  { icon: Database, color: "#e67a0b", x: 58.8, y: 78.7, size: 10.2 },
  { icon: Fingerprint, color: "#0bd3e6", x: 32.5, y: 89.6, size: 8.2 },
];

// Time each card stays in front, and how long the shuffle takes (keep in step with globals.css
// .tech-card-leave)
const HOLD_MS = 3600;
const ENTER_STAGGER_MS = 180;

// True once the section has scrolled a little way into view (one-off), and whether it's on screen
// now (so the shuffle only runs while it can be seen)
function useInView(ref) {
  const [state, setState] = useState({ seen: false, visible: false });
  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => setState((s) => ({ seen: s.seen || entry.isIntersecting, visible: entry.isIntersecting })),
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref]);
  return state;
}

// Two columns on white. Left (flush with the page edge): a pale grid fading out to the right and
// bottom, with seven app tiles floating on it, each over a soft reflection. Right: the three
// capability cards stacked, the ones behind peeking out above the front card, smaller and paler.
// Card: the illustration on white, then the title and four points on navy. Phones put the stack
// first and the tiles under it.
// Animation (globals.css, .tech-*): when the section scrolls into view the grid fades in, the tiles
// pop in one by one and then float, and the cards rise in one by one, back to front. Then every
// HOLD_MS the front card swings down and out, tucks in behind the stack, and the others step
// forward. It pauses while the section is off screen, while the tab is hidden, and while a card is
// hovered or focused (so it can be read). With reduced motion the stack stays still.
export default function BankingTechStack() {
  const sectionRef = useRef(null);
  const { seen, visible } = useInView(sectionRef);
  const [front, setFront] = useState(0);
  const frontRef = useRef(0);
  const [leaving, setLeaving] = useState(-1);
  const [live, setLive] = useState(false); // entrance finished; shuffling allowed
  const [paused, setPaused] = useState(false);

  // Start shuffling once the entrance has played
  useEffect(() => {
    if (!seen) return;
    const t = setTimeout(() => setLive(true), cards.length * ENTER_STAGGER_MS + 900);
    return () => clearTimeout(t);
  }, [seen]);

  useEffect(() => {
    if (!live || !visible || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      setLeaving(frontRef.current);
      frontRef.current = (frontRef.current + 1) % cards.length;
      setFront(frontRef.current);
    }, HOLD_MS);
    return () => clearInterval(id);
  }, [live, visible, paused]);

  return (
    <section
      ref={sectionRef}
      data-guide="bankingTechStack"
      className={`tech-stack relative overflow-hidden bg-white py-12 sm:py-14 lg:py-0 ${seen ? "is-shown" : ""}`}
    >
      <noscript>
        <style>{`.tech-stack * { animation: none !important; opacity: 1 !important; }`}</style>
      </noscript>

      <div className="grid grid-cols-1 items-center gap-10 lg:min-h-[clamp(420px,34vw,520px)] lg:grid-cols-[37.5%_minmax(0,1fr)] lg:gap-0">
        {/* The grid with its floating tiles (sized in cqw, so it scales as one piece) */}
        <div className="@container relative order-last mx-auto aspect-[505/460] w-full max-w-[520px] lg:order-none lg:mx-0 lg:aspect-auto lg:max-w-none lg:self-stretch">
          <div
            aria-hidden="true"
            className="tech-grid absolute inset-0 rounded-bl-[28px]"
            style={{
              backgroundImage:
                "linear-gradient(#cfd3da 1px, transparent 1px), linear-gradient(90deg, #cfd3da 1px, transparent 1px)",
              backgroundSize: "16.5cqw 16.5cqw",
              backgroundPosition: "1cqw -2cqw",
            }}
          />
          {tiles.map(({ icon: Icon, color, x, y, size, fill }, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="tech-tile absolute"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${size}cqw`,
                height: `${size}cqw`,
                // Centred on x/y by margins, leaving transform free for the pop and float
                margin: `-${size / 2}cqw 0 0 -${size / 2}cqw`,
                "--d": `${0.15 + i * 0.1}s`,
                "--float": `${5.5 + (i % 3) * 0.9}s`,
                "--float-d": `${(i % 4) * 0.45}s`,
              }}
            >
              {/* Soft reflection under the tile */}
              <span
                className="absolute top-[42%] left-[6%] h-full w-[88%] rounded-[22%] opacity-25"
                style={{ background: `linear-gradient(180deg, ${color} 0%, transparent 85%)` }}
              />
              <span
                className="relative flex size-full items-center justify-center rounded-[22%] text-white"
                style={{ backgroundColor: color, boxShadow: `0 10px 22px -10px ${color}` }}
              >
                <Icon className="size-[50%]" strokeWidth={2.2} fill={fill ? "currentColor" : "none"} />
              </span>
            </span>
          ))}
        </div>

        {/* The card stack: all three cards share one grid cell, so it sizes to the tallest */}
        <div className="px-4 pt-6 sm:px-6 lg:px-[clamp(1.5rem,4vw,4rem)] lg:pt-8">
          <div
            className="tech-glow relative isolate mx-auto grid w-full max-w-[560px] lg:w-[clamp(440px,37vw,560px)]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            {cards.map(({ image, alt, title, points }, i) => {
              const depth = (i - front + cards.length) % cards.length;
              const enterOrder = cards.length - 1 - i; // back card first
              return (
                <article
                  key={title}
                  data-depth={depth}
                  className={`tech-card relative col-start-1 row-start-1 flex flex-col overflow-hidden rounded-2xl border border-[#e1e6f2] bg-white sm:flex-row ${leaving === i ? "tech-card-leave" : ""}`}
                  style={{
                    zIndex: cards.length - depth,
                    "--depth": depth,
                    transitionDelay: live ? undefined : `${enterOrder * ENTER_STAGGER_MS}ms`,
                  }}
                  onAnimationEnd={() => setLeaving((l) => (l === i ? -1 : l))}
                >
                  <div className="flex items-center justify-center bg-white px-6 py-6 sm:w-[36.5%] sm:shrink-0 sm:px-4">
                    <Image
                      src={image.src}
                      alt={alt}
                      width={image.width}
                      height={image.height}
                      sizes="160px"
                      className="h-auto w-[min(150px,70%)] sm:w-[82%]"
                    />
                  </div>
                  <div className="flex-1 bg-[#1f3a8a] px-6 py-6 text-white sm:px-5 lg:px-6 lg:py-7">
                    <h3 className="text-lg font-semibold leading-snug lg:text-[19px]">{title}</h3>
                    <ul className="mt-4 space-y-2.5">
                      {points.map((point) => (
                        <li key={point} className="flex items-center gap-2.5 text-sm text-white/90 lg:text-[15px]">
                          <CircleCheck aria-hidden="true" className="size-[18px] shrink-0" strokeWidth={1.75} />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Paler the further back the card sits */}
                  <span aria-hidden="true" className="tech-card-veil pointer-events-none absolute inset-0 bg-white" />
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

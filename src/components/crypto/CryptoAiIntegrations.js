"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChartColumn, Layers, MessageSquare, Shield, TriangleAlert } from "lucide-react";

// Images shown in the centre circle, one per card (the phone screen for that feature): each card's
// `image` is its file in IMAGE_DIR and the file's own pixel size (it is fitted inside the circle).
// A card with `image: null` simply shows the plain blue circle while it is active.
const IMAGE_DIR = "/service/crypto/ai-integration";

// In the order the outer-circle light visits them (clockwise from the top left). angle: where the
// card's connector meets the circle (degrees, 0 = right, y down). icon: the icon tile's centre and
// side: which way the card extends from it, both in the 1440px design's px from the circle's centre.
const cards = [
  {
    icon: Shield,
    title: "AI Risk Management",
    text: "AI risk management systems use market volatility analysis to identify dangerous trading activities which produce smart alerts that help maintain secure and reliable trading environments",
    image: { src: `${IMAGE_DIR}/phone-1.png`, w: 197, h: 416 },
    angle: -138,
    at: { x: -290, y: -230 },
    side: "left",
  },
  {
    icon: ChartColumn,
    title: "AI Trading Analytics",
    text: "AI-powered trading analytics help users track market trends, analyze trading behavior, and make better investment choices through its ability to deliver real-time market data and advanced data processing capabilities",
    image: { src: `${IMAGE_DIR}/AI-trading-ana.png`, w: 203, h: 399 },
    angle: -42,
    at: { x: 290, y: -230 },
    side: "right",
  },
  {
    icon: TriangleAlert,
    title: "AI Fraud Detection",
    text: "AI fraud detection systems operate in real time to track suspicious transactions and detect abnormal activities which enables cryptocurrency exchanges to enhance their security measures while decreasing their risk of fraudulent activities.",
    image: { src: `${IMAGE_DIR}/AI-fraud.png`, w: 220, h: 456 },
    angle: 42,
    at: { x: 290, y: 257 },
    side: "right",
  },
  {
    icon: MessageSquare,
    title: "AI Chatbots & Support Automation",
    text: "AI chatbots deliver nonstop customer assistance by helping users with transactions and account management and answering their questions which decreases the need for human support work.",
    image: { src: `${IMAGE_DIR}/AI-trading.png`, w: 202, h: 427 },
    angle: 90,
    at: { x: 0, y: 358 },
    side: "below",
  },
  {
    icon: Layers,
    title: "Personalized User Experience",
    text: "Artificial intelligence personalization provides users with personalized trading recommendations and portfolio insights and customized dashboards which are based on their specific trading habits and personal preferences.",
    image: { src: `${IMAGE_DIR}/personalized.png`, w: 252, h: 448 },
    angle: 138,
    at: { x: -290, y: 257 },
    side: "left",
  },
];

// Desktop stage, in the 1440px design's px: 1310 x 835 with the circle's centre at (655, 260). It is
// scaled down as a whole when the screen is narrower than that (xl only; below xl the layout stacks).
const STAGE = { w: 1310, h: 835, cx: 655, cy: 260 };
const HUB = 400; // the circle's box: blue disc 360 across, glow ring around it
const R = 180; // disc radius: where the connectors meet the circle
const CARD_W = 390;
const ICON = 50;

// The light on the outer ring travels to each card's connector in turn (TRAVEL, eased), then rests
// there while that card is highlighted (HOLD). Hovering a card sends the light straight to it and
// holds it there; leaving lets the round carry on after a full HOLD.
const TRAVEL = 0.9; // s
const HOLD = 2.4; // s
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

function cardBox({ at, side }) {
  const x = STAGE.cx + at.x;
  const y = STAGE.cy + at.y;
  if (side === "below") return { left: x - CARD_W / 2, top: y + ICON / 2 + 5 };
  return { left: side === "left" ? x + 25 - CARD_W : x - 25, top: y + ICON / 2 + 12 };
}

// The light's round and the highlighted card. One rAF loop moves the light (a transform on each
// layout's arc, no re-renders) and runs only while the section is on screen; the highlighted card
// changes (a re-render) only when the light arrives at a connector.
function useLightRound(sectionRef, arcRefs) {
  const [active, setActive] = useState(0);
  const api = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = cards.length;
    let a = cards[0].angle; // the light's current angle
    let from = a;
    let to = a;
    let target = 0;
    let phase = "hold";
    let t0 = 0;
    let holdUntil = 0;
    let paused = false;
    let visible = false;
    let raf = 0;

    const draw = () => {
      arcRefs.current.forEach((el) => {
        if (el) el.style.transform = `rotate(${a.toFixed(2)}deg)`;
      });
    };

    const travelTo = (i, now, shortest) => {
      target = i;
      from = a;
      to = cards[i].angle;
      // Normal round: always onwards (clockwise). Hover: whichever way is shorter.
      if (shortest) to += Math.round((from - to) / 360) * 360;
      else while (to <= from + 0.01) to += 360;
      phase = "travel";
      t0 = now;
    };

    const frame = (now) => {
      raf = 0;
      if (phase === "travel") {
        const p = Math.min(1, (now - t0) / 1000 / TRAVEL);
        a = from + (to - from) * ease(p);
        if (p >= 1) {
          a = ((a % 360) + 360) % 360;
          phase = "hold";
          holdUntil = now + HOLD * 1000;
          setActive(target);
        }
        draw();
      } else if (!paused && now >= holdUntil) {
        travelTo((target + 1) % n, now, false);
      }
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (reduced || raf || !visible || document.hidden) return;
      // Coming back on screen: rest a beat on the current card before moving on
      if (phase === "hold") holdUntil = Math.max(holdUntil, performance.now() + 600);
      raf = requestAnimationFrame(frame);
    };

    api.current = {
      // A card hovered, focused or tapped: highlight it now and send the light to it
      select(i, hold) {
        paused = hold;
        setActive(i);
        if (reduced) {
          a = cards[i].angle;
          target = i;
          draw();
          return;
        }
        travelTo(i, performance.now(), true);
        start();
      },
      release() {
        paused = false;
        holdUntil = performance.now() + HOLD * 1000;
      },
    };

    draw();
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    io.observe(sectionRef.current);
    document.addEventListener("visibilitychange", start);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", start);
    };
  }, [sectionRef, arcRefs]);

  const select = useCallback((i, hold = true) => api.current?.select(i, hold), []);
  const release = useCallback(() => api.current?.release(), []);
  return { active, select, release };
}

// The centre circle: soft glow ring, blue disc, the active card's image (cross-faded), the connector
// nodes on the rim and the travelling light on the glow ring. Sized by its parent; everything inside
// is in % or SVG units.
function Hub({ active, arcRef }) {
  const pt = (deg, r) => [Math.cos((deg * Math.PI) / 180) * r, Math.sin((deg * Math.PI) / 180) * r];
  return (
    <div className="relative size-full">
      {/* Glow ring */}
      <div className="absolute inset-0 rounded-full bg-[#dcebfb]/80 shadow-[0_0_50px_6px_rgba(30,127,224,0.28)]" />
      <div className="absolute inset-[2%] rounded-full border border-[#c8def5] bg-[#e6f1fd]" />
      {/* Blue disc */}
      <div className="absolute inset-[5%] overflow-hidden rounded-full bg-[radial-gradient(circle_at_50%_32%,#2c93f2_0%,#1d78e0_55%,#1563c9_100%)] shadow-[inset_0_0_30px_rgba(0,36,97,0.25)]">
        {cards.map((card, i) =>
          card.image ? (
            <Image
              key={card.title}
              src={card.image.src}
              alt=""
              width={card.image.w}
              height={card.image.h}
              sizes="(min-width: 1280px) 230px, 50vw"
              draggable={false}
              // As in the design: 62% of the disc's width, centred, its top 32% down the disc; the
              // lower part of the phone runs off the bottom and is clipped by the disc's edge
              className={`absolute top-[32%] left-1/2 h-auto w-[62%] max-w-none -translate-x-1/2 origin-top transition-[opacity,scale] duration-500 ease-out select-none ${
                active === i ? "scale-100 opacity-100" : "scale-95 opacity-0"
              }`}
            />
          ) : null,
        )}
      </div>
      {/* Connector nodes on the rim; the active one lights up */}
      <svg viewBox="-200 -200 400 400" aria-hidden="true" className="pointer-events-none absolute inset-0 size-full overflow-visible">
        {cards.map((card, i) => {
          const [x, y] = pt(card.angle, R);
          const on = active === i;
          return (
            <circle
              key={card.title}
              cx={x}
              cy={y}
              r={on ? 6.5 : 5}
              fill={on ? "#7fd4ff" : "#ffffff"}
              stroke="#1650a8"
              strokeWidth="2"
              className="transition-all duration-300"
            />
          );
        })}
      </svg>
      {/* The travelling light: a bright arc with a glowing head on the glow ring, turned by the loop */}
      <div ref={arcRef} className="pointer-events-none absolute inset-0 will-change-transform" aria-hidden="true">
        <svg viewBox="-200 -200 400 400" className="size-full overflow-visible drop-shadow-[0_0_6px_rgba(92,200,255,0.9)]">
          <defs>
            <linearGradient id="crypto-ai-arc" gradientUnits="userSpaceOnUse" x1="0" y1="-190" x2="190" y2="0">
              <stop offset="0" stopColor="#5cc8ff" stopOpacity="0" />
              <stop offset="1" stopColor="#8fe0ff" />
            </linearGradient>
          </defs>
          {/* Quarter arc ending at angle 0 (the head); the loop turns it to the light's angle */}
          <path d="M 0 -190 A 190 190 0 0 1 190 0" fill="none" stroke="url(#crypto-ai-arc)" strokeWidth="4" strokeLinecap="round" />
          <circle cx="190" cy="0" r="5" fill="#e8f9ff" />
        </svg>
      </div>
    </div>
  );
}

function IconTile({ icon: Icon, on, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`flex items-center justify-center rounded-lg bg-linear-to-b from-[#0f55b4] to-[#0a3f8f] text-white shadow-[0_6px_14px_-6px_rgba(0,36,97,0.6)] transition-[box-shadow,transform] duration-300 ${
        on ? "scale-105 shadow-[0_0_0_4px_#a9dcfb,0_8px_18px_-6px_rgba(0,94,255,0.6)]" : ""
      } ${className}`}
    >
      <Icon strokeWidth={1.8} className="size-[44%]" />
    </span>
  );
}

function CardBody({ card, on }) {
  return (
    <>
      <h3 className="text-[18px] font-semibold leading-snug text-[#0b4a9e]">{card.title}</h3>
      <p className={`mt-3 text-[15px] leading-[1.25] transition-colors duration-300 ${on ? "text-[#10284d]" : "text-[#6b6b6b]"}`}>
        {card.text}
      </p>
    </>
  );
}

const cardSkin = (on) =>
  `rounded-xl border transition-[background-color,border-color,box-shadow] duration-300 ${
    on ? "border-[#6cbcea] bg-[#93d5f8] shadow-[0_14px_30px_-18px_rgba(0,94,255,0.6)]" : "border-[#d9d9d9] bg-white"
  }`;

// Centred heading over the AI features wired to a central circle. The light on the circle's outer
// ring visits each card's connector in turn, and the card it reaches is highlighted (sky blue, its
// icon ringed, its connector and rim node lit) while the circle shows that card's image. Hovering
// or focusing a card (tapping, on touch) jumps to it and holds; leaving lets the round carry on.
// Desktop (xl): the 1440px design, scaled down as a whole on narrower screens. Below xl: the circle,
// then the cards in a list (two columns on tablets).
export default function CryptoAiIntegrations() {
  const sectionRef = useRef(null);
  const wrapRef = useRef(null);
  const arcRefs = useRef([]);
  const [scale, setScale] = useState(1);
  const { active, select, release } = useLightRound(sectionRef, arcRefs);

  useEffect(() => {
    const wrap = wrapRef.current;
    const ro = new ResizeObserver(() => setScale(Math.min(1, wrap.clientWidth / STAGE.w)));
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  // Mouse/pen hover holds; a tap highlights and lets the round carry on after a full HOLD
  const handlers = (i) => ({
    onPointerEnter: (e) => e.pointerType !== "touch" && select(i, true),
    onPointerLeave: (e) => e.pointerType !== "touch" && release(),
    onClick: (e) => e.nativeEvent.pointerType === "touch" && select(i, false),
    onFocus: () => select(i, true),
    onBlur: release,
  });

  const node = (deg, r) => [STAGE.cx + Math.cos((deg * Math.PI) / 180) * r, STAGE.cy + Math.sin((deg * Math.PI) / 180) * r];

  return (
    <section ref={sectionRef} data-guide="cryptoAi" className="overflow-x-clip bg-white px-4 py-14 sm:px-6 lg:px-8 lg:pt-[72px] lg:pb-20">
      <h2 className="mx-auto max-w-[16em] text-center text-[28px] font-medium leading-[1.25] tracking-tight text-balance text-[#002461] sm:text-[34px] lg:text-[40px]">
        Powerful AI Integrations for Your Crypto Exchange Software Development
      </h2>

      {/* Desktop (xl): the design's stage */}
      <div ref={wrapRef} className="mx-auto mt-[72px] hidden w-full max-w-[1310px] xl:block" style={{ height: STAGE.h * scale }}>
        <div className="relative origin-top-left" style={{ width: STAGE.w, height: STAGE.h, transform: `scale(${scale})` }}>
          <div className="absolute" style={{ left: STAGE.cx - HUB / 2, top: STAGE.cy - HUB / 2, width: HUB, height: HUB }}>
            <Hub active={active} arcRef={(el) => {
              arcRefs.current[0] = el;
            }} />
          </div>

          {/* Connectors: from just outside the rim node to the icon tile, drawn over the glow ring;
              the active one lights up */}
          <svg viewBox={`0 0 ${STAGE.w} ${STAGE.h}`} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full">
            {cards.map((card, i) => {
              const [x1, y1] = node(card.angle, R + 7);
              return (
                <line
                  key={card.title}
                  x1={x1}
                  y1={y1}
                  x2={STAGE.cx + card.at.x}
                  y2={STAGE.cy + card.at.y}
                  stroke={active === i ? "#2f8fff" : "#1650a8"}
                  strokeWidth={active === i ? 2.5 : 1.6}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          <ul>
            {cards.map((card, i) => {
              const on = active === i;
              const box = cardBox(card);
              return (
                <li key={card.title}>
                  <span
                    aria-hidden="true"
                    className="absolute z-10"
                    style={{ left: STAGE.cx + card.at.x - ICON / 2, top: STAGE.cy + card.at.y - ICON / 2, width: ICON, height: ICON }}
                  >
                    <IconTile icon={card.icon} on={on} className="size-full" />
                  </span>
                  <article
                    tabIndex={0}
                    {...handlers(i)}
                    className={`absolute cursor-pointer px-[26px] pt-5 pb-6 outline-none focus-visible:ring-2 focus-visible:ring-[#1f63da] ${cardSkin(on)}`}
                    style={{ left: box.left, top: box.top, width: CARD_W }}
                  >
                    <CardBody card={card} on={on} />
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Below xl: the circle, then the cards */}
      <div className="xl:hidden">
        <div className="mx-auto mt-10 size-[min(78vw,340px)]">
          <Hub active={active} arcRef={(el) => {
            arcRefs.current[1] = el;
          }} />
        </div>
        <ul className="mx-auto mt-10 grid max-w-[440px] gap-4 md:max-w-[860px] md:grid-cols-2">
          {cards.map((card, i) => {
            const on = active === i;
            return (
              <li key={card.title}>
                <article
                  tabIndex={0}
                  {...handlers(i)}
                  className={`flex h-full cursor-pointer gap-4 p-5 outline-none focus-visible:ring-2 focus-visible:ring-[#1f63da] ${cardSkin(on)}`}
                >
                  <IconTile icon={card.icon} on={on} className="size-11 shrink-0" />
                  <div>
                    <CardBody card={card} on={on} />
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

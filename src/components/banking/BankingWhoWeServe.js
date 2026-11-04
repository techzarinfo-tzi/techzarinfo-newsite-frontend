"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const IMG = "/service/digital-banking/who-we-serve";

// Each icon is a 256x140 image with transparent margins around the artwork
const audiences = [
  {
    image: `${IMG}/bank.png`,
    alt: "Bank building",
    title: "Traditional Banks",
    text: "Modernize legacy systems and launch seamless digital banking experiences. Enable faster services, better customer engagement and scalable growth.",
  },
  {
    image: `${IMG}/startup.png`,
    alt: "Rocket taking off",
    title: "Fintech Startups",
    text: "Launch innovative financial products quickly with flexible fintech infrastructure. Scale your neobank or fintech platform with secure, API-driven technology.",
  },
  {
    image: `${IMG}/card.png`,
    alt: "Two payment cards",
    title: "Payment Service Provider",
    text: "Build reliable payment ecosystems with advanced transaction processing. Support secure, fast, and compliant digital payment solutions.",
  },
  {
    image: `${IMG}/iversement.png`,
    alt: "Rising investment chart",
    title: "Investment & Wealth Firms",
    text: "Deliver smarter wealth management platforms and digital investment tools. Empower clients with secure portfolio management and insights.",
  },
  {
    image: `${IMG}/corprate.png`,
    alt: "Corporate office tower",
    title: "Corporate Enterprises",
    text: "Integrate financial services into your business with embedded finance solutions. Streamline payments, accounts, and financial operations with ease.",
  },
];

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = (t) => 1 - (1 - t) ** 3;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

// How quickly the animation catches up with the scroll position (per second)
const FOLLOW = 10;
// Scroll distance the pinned section plays over, in screen heights
const SCROLL_SCREENS = 2.4;
// Timeline (0 to 1 over that scroll): the cards deal into the fan one by one up to DEAL_END, the
// full fan holds until SPREAD_START, then it opens out into the row.
const DEAL_END = 0.6;
const SPREAD_START = 0.7;
const DEAL_DUR = 0.32; // share of the deal each card takes to fly in (they overlap)
// The fan: cards rotate about a point below them, spread over +-FAN_ANGLE, their centres
// FAN_RADIUS card heights from that point.
const FAN_ANGLE = (55 * Math.PI) / 180;
const FAN_RADIUS = 0.8;
// The fan's largest card size, and its largest width as a share of the row's
const FAN_MAX_SCALE = 0.8;
const FAN_MAX_WIDTH = 0.76;

// The section pins (sticky) while the spacer below it scrolls past, and scroll progress drives a
// timeline: each card flies up from below the fan's centre into its slot on a half arc (rotated, a
// little smaller), one after another; once all five are in, the fan opens out into the plain row
// (or the wrapped grid on smaller screens). Same pinning and smoothing scheme as the crypto
// services row: one scroll handler wakes a rAF loop that eases toward the scroll position and
// sleeps once there. Cards move by transform and opacity only, so there's no layout per frame.
function useFanSpread(stageRef, sectionRef, listRef, spacerRef) {
  useEffect(() => {
    const stage = stageRef.current;
    const section = sectionRef.current;
    const list = listRef.current;
    const spacer = spacerRef.current;
    const cards = [...list.children].map((li) => ({ li, x: 0, y: 0, slotX: 0, slotY: 0, angle: 0 }));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      cards.forEach((c) => (c.li.style.opacity = "1"));
      return;
    }

    let pinTop = 0;
    let scale = 1; // the fanned cards' size
    let fromX = 0; // where the cards fly in from (list coords)
    let fromY = 0;
    let p = 0; // eased progress
    let last = 0;
    let raf = 0;

    const target = () => {
      const range = stage.offsetHeight - section.offsetHeight;
      return range > 0 ? clamp((pinTop - stage.getBoundingClientRect().top) / range, 0, 1) : 1;
    };

    const render = () => {
      const spread = easeInOut(clamp((p - SPREAD_START) / (1 - SPREAD_START), 0, 1));
      const deal = clamp(p / DEAL_END, 0, 1);
      const stagger = cards.length > 1 ? (1 - DEAL_DUR) / (cards.length - 1) : 0;
      cards.forEach((c, i) => {
        const a = easeOut(clamp((deal - i * stagger) / DEAL_DUR, 0, 1));
        // In the fan: flying up from below its centre into the slot
        const fx = lerp(fromX, c.slotX, a);
        const fy = lerp(fromY, c.slotY, a);
        const fs = lerp(scale * 0.7, scale, a);
        const fr = lerp(0, c.angle, a);
        // Then opening out to the card's own place in the row
        const dx = lerp(fx, c.x, spread) - c.x;
        const dy = lerp(fy, c.y, spread) - c.y;
        const s = lerp(fs, 1, spread);
        const r = lerp(fr, 0, spread);
        c.li.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) rotate(${r.toFixed(4)}rad) scale(${s.toFixed(4)})`;
        c.li.style.opacity = Math.min(1, a * 2).toFixed(3);
      });
    };

    const frame = (now) => {
      const goal = target();
      const dt = Math.min((now - last) / 1000, 1 / 20);
      last = now;
      p += (goal - p) * (1 - Math.exp(-FOLLOW * dt));
      // Close enough: land exactly on the mark and let the loop sleep until the next scroll
      if (Math.abs(goal - p) < 0.0005) {
        p = goal;
        render();
        raf = 0;
        return;
      }
      render();
      raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const measure = () => {
      spacer.style.height = `${Math.round(window.innerHeight * SCROLL_SCREENS)}px`;
      // Centre the pinned section on screen, but never under the fixed navbar. One taller than the
      // screen (the wrapped grid on tablets and phones) pins just below the navbar, and the rest
      // of the grid scrolls into view once the fan has opened.
      const nav = (document.querySelector("header")?.getBoundingClientRect().bottom ?? 0) - 24;
      const free = window.innerHeight - section.offsetHeight;
      pinTop = free >= 0 ? Math.max(free / 2, Math.min(free, nav)) : Math.max(nav, 0);
      section.style.top = `${pinTop}px`;

      // offsetLeft/offsetTop ignore transforms, so these are the plain layout's card centres
      cards.forEach((c) => {
        c.x = c.li.offsetLeft + c.li.offsetWidth / 2;
        c.y = c.li.offsetTop + c.li.offsetHeight / 2;
      });
      const w = cards[0].li.offsetWidth;
      const h = Math.max(...cards.map((c) => c.li.offsetHeight));

      // The room the fan can use (list coords): the list's width, and from its top down to the
      // bottom of the part of the section that's on screen while pinned
      const listTop = list.getBoundingClientRect().top - section.getBoundingClientRect().top;
      const visibleBottom = Math.min(section.offsetHeight, window.innerHeight - pinTop) - 16;
      const room = Math.max(visibleBottom - listTop, h * 0.4);
      const sin = Math.sin(FAN_ANGLE);
      const cos = Math.cos(FAN_ANGLE);
      // The fan's width and height at full card size, the outer cards' rotated boxes included
      const fanW = 2 * FAN_RADIUS * h * sin + w * cos + h * sin;
      const fanH = FAN_RADIUS * h * (1 - cos) + h / 2 + (h * cos) / 2 + (w * sin) / 2;
      // On wide screens kept to ~3/4 of the row's width, so opening out into the row is a real
      // spread; narrower screens open into a wrapped grid anyway, so there the fan uses the width
      const share = list.clientWidth >= 900 ? FAN_MAX_WIDTH : 0.96;
      scale = Math.min(FAN_MAX_SCALE, (list.clientWidth * share) / fanW, room / fanH);

      const radius = FAN_RADIUS * h * scale;
      // Spare height goes mostly below the fan, so it sits near the heading on tall screens
      const fanTop = Math.max(0, (room - fanH * scale) * 0.3);
      const pivotX = list.clientWidth / 2;
      const pivotY = fanTop + radius + (h * scale) / 2;
      cards.forEach((c, i) => {
        c.angle = cards.length > 1 ? lerp(-FAN_ANGLE, FAN_ANGLE, i / (cards.length - 1)) : 0;
        c.slotX = pivotX + radius * Math.sin(c.angle);
        c.slotY = pivotY - radius * Math.cos(c.angle);
      });
      fromX = pivotX;
      fromY = fanTop + fanH * scale;
    };

    const onResize = () => {
      measure();
      // Jump straight to the new spot: a resize shouldn't replay the animation
      p = target();
      render();
    };

    onResize();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(list);
    document.fonts?.ready.then(onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [stageRef, sectionRef, listRef, spacerRef]);
}

// Centred heading over five cards in one row (wrapping to two per row on phones and tablets), on
// white with the pale city skyline behind the cards, ~1.16x the row's width, cut off by the section
// bottom. Card: white frame around a navy-to-white panel holding the icon, then the title and a
// short line. Scrolling deals the cards one by one into a half-arc fan, then opens the fan out into
// the row (useFanSpread); on hover a card lifts and its icon grows. Without JavaScript or with
// reduced motion the row is simply shown.
export default function BankingWhoWeServe() {
  const stageRef = useRef(null);
  const sectionRef = useRef(null);
  const listRef = useRef(null);
  const spacerRef = useRef(null);
  useFanSpread(stageRef, sectionRef, listRef, spacerRef);

  return (
    <div ref={stageRef} className="relative">
      <noscript>
        <style>{`.wws-card { opacity: 1 !important; transform: none !important; } .wws-spacer { display: none; }`}</style>
      </noscript>

      <section
        ref={sectionRef}
        data-guide="bankingWhoWeServe"
        data-guide-ref="parent"
        className="sticky top-0 overflow-hidden bg-white px-4 pt-14 pb-14 sm:px-6 sm:pt-16 lg:pt-[clamp(56px,4.5vw,72px)] lg:pb-[clamp(56px,5vw,80px)]"
      >
        <h2 className="text-center text-[28px] font-semibold uppercase leading-[1.25] tracking-tight text-[#002461] sm:text-[34px] lg:text-[44px]">
          Who We Serve
        </h2>

        <div className="relative mx-auto mt-12 max-w-[1200px] lg:mt-[clamp(56px,5vw,80px)]">
          {/* Skyline: starts a little above the cards and runs past the section bottom */}
          <Image
            src={`${IMG}/bg.png`}
            alt=""
            aria-hidden="true"
            width={1342}
            height={854}
            sizes="(min-width: 1024px) 1390px, 124vw"
            className="pointer-events-none absolute -top-[30px] left-1/2 h-auto w-[116%] max-w-none -translate-x-1/2 select-none"
          />

          {/* Cards start hidden (opacity-0) so they don't flash in the row before the fan takes over */}
          <ul ref={listRef} className="relative flex flex-wrap items-stretch justify-center gap-3 sm:gap-4">
            {audiences.map(({ image, alt, title, text }) => (
              <li
                key={title}
                className="wws-card w-[calc(50%-6px)] max-w-[240px] opacity-0 will-change-transform sm:w-[220px] lg:w-[min(228px,calc((100%-64px)/5))]"
              >
                <article className="group flex h-full flex-col rounded-[14px] bg-white p-1.5 shadow-[0_10px_30px_-12px_rgba(0,36,97,0.28)] transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-16px_rgba(0,36,97,0.4)]">
                  <div
                    className="flex aspect-[126/150] items-center justify-center rounded-[10px]"
                    style={{ background: "linear-gradient(180deg, #0b2c78 0%, #1257c4 55%, #5d93db 80%, #e8f0fb 100%)" }}
                  >
                    <Image
                      src={image}
                      alt={alt}
                      width={256}
                      height={140}
                      sizes="140px"
                      className="h-auto w-[66%] transition-transform duration-300 ease-out group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-1 flex-col px-2.5 pt-4 pb-5 text-center sm:px-3">
                    <h3 className="mx-auto max-w-[10em] text-base font-semibold leading-snug text-[#002461] sm:text-[17px] lg:text-[19px]">
                      {title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-[1.6] text-[#3d4a66] sm:text-sm">{text}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Scroll room the pinned section plays its animation over (height set in useFanSpread) */}
      <div ref={spacerRef} aria-hidden="true" className="wws-spacer" />
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { ArrowLeftRight, Bitcoin, Combine, CreditCard, Landmark, Network, Smartphone, Tag, Wallet } from "lucide-react";

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// Icons from Lucide (lucide.dev), drawn white on the design's navy tile
const services = [
  {
    icon: Bitcoin,
    title: "Centralized Crypto Exchange Development",
    text: "Want more control over your crypto business? Then get our centralized crypto exchange development services that puts trading, users, and platform operations under your control.",
  },
  {
    icon: Network,
    title: "Decentralized Exchange Development",
    text: "Planning to build a crypto exchange without controlling the user assets? Our decentralized exchange development services help you create a peer-to-peer trading platform.",
  },
  {
    icon: Tag,
    title: "White Label Crypto Exchange Solutions",
    text: "Have an idea for your own crypto exchange but worried about the time and cost of development? Our white label crypto exchange development solutions provide a ready-made trading platform.",
  },
  {
    icon: Combine,
    title: "Hybrid Exchange Development",
    text: "Looking to combine the control of centralized exchanges with the flexibility of decentralized platforms? Our hybrid exchange development services bring CEX and DEX functionalities together.",
  },
  {
    icon: Wallet,
    title: "Crypto Wallet Development",
    text: "Need a secure way for your traders to manage multiple digital assets? Our crypto wallet development solutions help businesses build multi-currency wallets with effortless transactions.",
  },
  {
    icon: Landmark,
    title: "Security Token Offering (STO) Development",
    text: "Have real-world assets you want to bring onto the blockchain? Our Security Token Offering (STO) development solutions help businesses create blockchain-based security tokens.",
  },
  {
    icon: Smartphone,
    title: "Crypto Exchange Mobile App Development",
    text: "Looking to bring crypto trading to your traders fingertips? We can build crypto exchange mobile apps in both Android and iOS apps where users can trade, buy, and sell digital assets in a few clicks.",
  },
  {
    icon: CreditCard,
    title: "Cryptocurrency Payment Gateway Development",
    text: "Get ready to accept crypto payments from your customer. Our cryptocurrency payment gateway development helps businesses accept digital asset payments across the globe.",
  },
  {
    icon: ArrowLeftRight,
    title: "P2P Crypto Exchange Development",
    text: "Looking to create a crypto trading platform without relying on traditional intermediaries? Our P2P crypto exchange development services enable your traders to trade digital assets directly.",
  },
];

// How quickly the row catches up with the scroll position (1/s). An exponential ease with no
// overshoot: it smooths out wheel steps and stops cleanly when scrolling stops.
const FOLLOW = 10;
// The cover stack: a card that reaches the row's left edge stays there and the next one slides over
// it. Each card covered steps it back: a little smaller, dimmer, and nudged left so its edge peeks
// out behind the stack. Past DEPTH cards deep it fades away, so the stack never piles up.
const DEPTH = 3;
const STEP_SCALE = 0.05;
const STEP_PEEK = 14; // px per card covered (capped by the side padding on narrow screens)
const STEP_DIM = 0.12;
// Cards still coming in past the right edge sit slightly lower, smaller and fainter, and rise into
// place as they arrive.
const ENTER_SCALE = 0.08;
const ENTER_DROP = 24; // px
const ENTER_FADE = 0.45;

// The section pins (sticky) while the spacer below it scrolls past; the spacer is exactly as tall as
// the row is wider than the screen, so scrolling down 1px moves the row 1px left (and back on the way
// up). One scroll handler wakes a rAF loop that eases the row onto that spot and sleeps once there.
// Same pinning scheme as the LMS feature drive; here each card is placed on its own, using only
// transform and opacity (compositor-only, no layout or repaint per frame), to build the cover stack.
function useCoverRow(stageRef, sectionRef, viewportRef, trackRef, spacerRef) {
  useEffect(() => {
    const stage = stageRef.current;
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const spacer = spacerRef.current;
    const cards = [...track.children].map((li) => ({
      li,
      dim: li.querySelector("[data-dim]"),
      lift: li.querySelector("[data-lift]"),
      left: 0,
    }));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let pinTop = 0;
    let maxShift = 0;
    let pad = 0; // the row's left content edge, where cards stack (px)
    let right = 0; // the row's right content edge (px)
    let width = 1;
    let step = 1; // card width + gap
    let peek = STEP_PEEK;
    let s = 0; // eased scroll distance (px, 0 to maxShift)
    let last = 0;
    let raf = 0;

    const target = () => {
      const range = stage.offsetHeight - section.offsetHeight;
      const p = range > 0 ? clamp((pinTop - stage.getBoundingClientRect().top) / range, 0, 1) : 0;
      return p * maxShift;
    };

    const render = () => {
      let prevX = -Infinity;
      for (let i = 0; i < cards.length; i++) {
        const c = cards[i];
        const natural = c.left - s; // where the card would sit in a plain sliding row
        const x = Math.max(natural, pad);
        const covered = clamp((pad - natural) / step, 0, DEPTH + 1); // cards slid over this one so far
        // How far this card overlaps the one before it (0 to 1)
        const overlap = clamp((prevX + width - x) / width, 0, 1);
        prevX = x;

        const fade = clamp(DEPTH + 1 - covered, 0, 1); // past DEPTH, fade out at the back
        c.li.style.visibility = fade > 0 ? "" : "hidden";
        if (reduced) {
          c.li.style.transform = `translate3d(${(x - c.left).toFixed(2)}px, 0, 0)`;
          c.li.style.opacity = fade.toFixed(3);
          continue;
        }

        const depth = Math.min(covered, DEPTH);
        const enter = clamp((x + width - right) / width, 0, 1);
        const scale = 1 - depth * STEP_SCALE - enter * ENTER_SCALE;
        // Stacked: shrink about the left edge and peek out leftwards. Arriving: shrink about the centre.
        const tx = x - c.left - depth * peek + (enter * ENTER_SCALE * width) / 2;
        const ty = enter * ENTER_DROP;
        c.li.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
        c.li.style.opacity = (fade * (1 - enter * ENTER_FADE)).toFixed(3);
        // Dims as the next card slides over it, then a step more per card covered
        c.dim.style.opacity = (Math.min(covered, DEPTH) * STEP_DIM).toFixed(3);
        // Casts its shadow while sliding over the card before it; hidden again once covered itself
        c.lift.style.opacity = (overlap * (1 - Math.min(covered, 1))).toFixed(3);
      }
    };

    const frame = (now) => {
      const goal = target();
      const dt = Math.min((now - last) / 1000, 1 / 20);
      last = now;
      s = reduced ? goal : s + (goal - s) * (1 - Math.exp(-FOLLOW * dt));
      // Close enough: land exactly on the mark and let the loop sleep until the next scroll
      if (Math.abs(goal - s) < 0.1) {
        s = goal;
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
      // offsetLeft/offsetWidth ignore transforms, so these are the plain row's positions
      cards.forEach((c) => (c.left = c.li.offsetLeft));
      pad = cards[0].left;
      width = cards[0].li.offsetWidth;
      step = cards.length > 1 ? cards[1].left - cards[0].left : width;
      right = viewport.clientWidth - pad;
      peek = Math.min(STEP_PEEK, (pad * 0.75) / DEPTH);
      maxShift = Math.max(0, track.scrollWidth - viewport.clientWidth);
      spacer.style.height = `${maxShift}px`;
      // Centre the pinned section on screen; one taller than the screen pins with its bottom showing
      const free = window.innerHeight - section.offsetHeight;
      pinTop = free >= 0 ? free / 2 : free;
      section.style.top = `${pinTop}px`;
    };

    const onResize = () => {
      measure();
      // Jump straight to the new spot: a resize shouldn't make the row slide across the screen
      s = target();
      render();
    };

    onResize();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(track);
    document.fonts?.ready.then(onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [stageRef, sectionRef, viewportRef, trackRef, spacerRef]);
}

// Centred heading and intro, then nine service cards in one row. Scrolling down slides the row right
// to left: cards rise in from the right, and each one that reaches the left edge stays there while
// the next card slides over it, building a shallow stack that steps back and fades. Pale blue cards:
// navy icon tile with the title beside it, description at the bottom. Without JavaScript the row is
// a normal horizontal scroller instead.
export default function CryptoServices() {
  const stageRef = useRef(null);
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const spacerRef = useRef(null);
  useCoverRow(stageRef, sectionRef, viewportRef, trackRef, spacerRef);

  return (
    <div ref={stageRef} className="crypto-services relative">
      <noscript>
        <style>{`.cs-viewport { overflow-x: auto; } .cs-spacer { display: none; }`}</style>
      </noscript>

      <section
        ref={sectionRef}
        aria-labelledby="crypto-services-title"
        data-guide="cryptoServices"
        data-guide-ref="parent"
        className="sticky top-0 bg-white py-12 sm:py-14 lg:py-16"
      >
        <div className="px-4 text-center sm:px-6 lg:px-8">
          <h2
            id="crypto-services-title"
            className="mx-auto max-w-[17em] text-[28px] font-medium leading-[1.25] tracking-tight text-balance text-[#002461] sm:text-[34px] lg:text-[40px]"
          >
            Our Iconic Cryptocurrency Exchange Development Services
          </h2>
          <p className="mx-auto mt-4 max-w-[760px] text-base leading-[1.4] text-[#002461] lg:mt-5 lg:text-[17px]">
            Launch a secure, feature-rich cryptocurrency exchange without overspending. Our
            cost-effective solutions are built to scale, helping startups and enterprises enter the
            crypto market with confidence
          </p>
        </div>

        {/* Vertical padding leaves room for the arriving cards' drop and the cover shadows */}
        <div ref={viewportRef} className="cs-viewport mt-2 overflow-hidden py-8 lg:mt-6">
          <ul ref={trackRef} className="flex w-max items-stretch gap-(--cs-gap) px-(--cs-pad)">
            {services.map(({ icon: Icon, title, text }) => (
              <li key={title} className="relative flex w-(--cs-card) shrink-0 origin-left will-change-transform">
                {/* Cover shadow, pre-rendered and faded in, so moving it costs no repaint */}
                <span
                  aria-hidden="true"
                  data-lift
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 shadow-[-18px_0_36px_-14px_rgba(0,36,97,0.35),0_18px_40px_-18px_rgba(0,36,97,0.3)]"
                />
                <article className="relative flex min-h-[calc(var(--cs-card)*0.98)] w-full flex-col overflow-hidden rounded-2xl bg-[#e6f2fe] p-5 text-[#002461] lg:p-6">
                  <div className="flex items-start gap-3.5">
                    <span
                      aria-hidden="true"
                      className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#002461] text-white lg:size-[52px]"
                    >
                      <Icon strokeWidth={2} className="size-6" />
                    </span>
                    <h3 className="pt-0.5 text-[18px] font-medium leading-[1.3] lg:text-[clamp(17px,1.35vw,20px)]">
                      {title}
                    </h3>
                  </div>
                  <p className="mt-auto pt-8 text-[15px] leading-normal lg:text-[clamp(14px,1.1vw,16px)]">{text}</p>
                  {/* Depth shade: deepens as the card is covered and steps back in the stack */}
                  <span aria-hidden="true" data-dim className="pointer-events-none absolute inset-0 bg-[#002461] opacity-0" />
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pinned scroll distance: as tall as the row is wider than the screen (sized in CSS so the
          page doesn't jump on load; the script then sets the exact figure) */}
      <div ref={spacerRef} aria-hidden="true" className="cs-spacer" />
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";

const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const easeOut = (t) => 1 - (1 - t) ** 3;
const easeInOut = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
// Where t sits inside [from, to], as 0..1
const span = (t, [from, to]) => clamp((t - from) / (to - from));

// Triangle: each card collapses towards (and grows out of) a compact triangle at the centre of
// the group, pointing right like the desktop arrangement (top-left, right, bottom-left).
// VERTICES are unit directions; SPREAD is the compact triangle's radius in px.
const VERTICES = [
  { x: -0.7, y: -0.7 },
  { x: 1, y: 0 },
  { x: -0.7, y: 0.7 },
];
const SPREAD = 56;
// With "reduce motion" on (an OS setting, e.g. Windows' Animation effects) the cards cover only this
// fraction of the trip and barely shrink: the same triangle, with much less movement.
const REDUCED_TRAVEL = 0.3;

// On entry the cards follow one another by this share of the phase
const STAGGER = 0.12;
const staggered = (t, i) => clamp((t - i * STAGGER) / (1 - 2 * STAGGER));

// Pinned timeline, as a share of the pinned scroll distance. Over SWAP, every old card rises and
// fades out while its replacement rises from below and fades in, both driven by the same progress,
// so they are on screen together the whole way. The section darkens over the first half and
// lightens over the second (darkest at the midpoint). The holds at either end let each set rest.
const SWAP = [0.1, 0.9];
// Each pair travels its slot's height plus this gap (px): the old card ends exactly where the new
// one started, so the two are always GAP apart and never overlap.
const GAP = 48;
// During the swap each slot masks its cards to a soft-edged window just larger than itself
// (.tm-window-masked in globals.css), so the cards dissolve out of the top of their own slot and in
// from the bottom, instead of drifting over the heading or being cut off by a hard edge.

// Icons in the design's filled-blue style; they take the theme's icon colour via currentColor.
const icons = {
  creation: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m14.5 5.5 4 4L8 20H4v-4L14.5 5.5Z" />
      <path d="m12.5 7.5 4 4" />
      <path d="M19 2v3M17.5 3.5h3M21 9v2M20 10h2" />
    </svg>
  ),
  management: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h3.6a2 2 0 0 1 1.4.6L12 6h6.5A2.5 2.5 0 0 1 21 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11Z" />
      <path d="M3 10h18" stroke="var(--tm-card-from)" strokeWidth="1.5" />
    </svg>
  ),
  journeys: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3 1.5 8.5 12 14l8.5-4.45V16h2V8.5L12 3Z" />
      <path d="M5.5 12.6v3.9c0 1.9 2.9 3.5 6.5 3.5s6.5-1.6 6.5-3.5v-3.9L12 16l-6.5-3.4Z" />
    </svg>
  ),
  branding: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.5a9.5 9.5 0 0 0 0 19c1.3 0 2-1 2-2 0-.6-.3-1-.6-1.4-.3-.4-.5-.8-.5-1.3 0-1 .8-1.8 1.8-1.8h2.1a4.7 4.7 0 0 0 4.7-4.7C21.5 6 17.2 2.5 12 2.5Z" />
      <circle cx="7.5" cy="11" r="1.4" fill="var(--tm-card-from)" />
      <circle cx="10" cy="7" r="1.4" fill="var(--tm-card-from)" />
      <circle cx="14.5" cy="7" r="1.4" fill="var(--tm-card-from)" />
      <circle cx="17" cy="11" r="1.4" fill="var(--tm-card-from)" />
    </svg>
  ),
  integrations: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3v5M15 3v5" />
      <path d="M6 8h12v3a6 6 0 0 1-12 0V8Z" />
      <path d="M12 17v4" />
    </svg>
  ),
  security: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z" />
      <path d="m8.5 12 2.5 2.5 4.5-4.5" fill="none" stroke="var(--tm-card-from)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// One slot per position; each slot holds a card from both sets, stacked in the same grid cell, so
// the slot is always as tall as the taller of the two and swapping sets never moves anything.
// Positions are from the 1440px design (in % of the section, so they hold as it scales on xl):
// two cards on the left (top and bottom), one on the right just above the centred heading.
const slots = [
  {
    place: "xl:left-[13.2%] xl:top-[12%]",
    cards: [
      {
        icon: "creation",
        title: "User-Friendly Content Creation",
        text: "Create engaging training materials with easy-to-use tools that simplify course development and content customization",
      },
      {
        icon: "branding",
        title: "Custom Branding & White Labeling",
        text: "Add your logo, colors, and domain so the platform looks and feels like your organization's own learning portal",
      },
    ],
  },
  {
    place: "xl:right-[6%] xl:top-[26.4%]",
    cards: [
      {
        icon: "management",
        title: "Centralized Content Management",
        text: "Organize, update, and manage training materials in one central location for easy access and efficient content delivery",
      },
      {
        icon: "integrations",
        title: "Seamless System Integrations",
        text: "Connect with your HRMS, CRM, single sign-on, and video conferencing tools for one unified training ecosystem",
      },
    ],
  },
  {
    // Tablet: the odd slot out spans the 2-column grid, centred at one column's width
    place: "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-10px)] lg:col-span-1 lg:w-auto xl:left-[13.2%] xl:top-[74.3%]",
    cards: [
      {
        icon: "journeys",
        title: "Personalized Learning Journeys",
        text: "Customize learning paths based on employee roles, skills, and performance to support individual development goals",
      },
      {
        icon: "security",
        title: "Secure & Scalable Infrastructure",
        text: "Protect training data with role-based access and encryption while scaling effortlessly as your workforce grows",
      },
    ],
  },
];

// Measures each slot's resting place and stores the vector to its triangle point in --tm-fx/--tm-fy
// (read by both of its cards). Slots are never transformed, so offsetLeft/Top are stable.
function placeTriangle(slotEls, travel) {
  const centres = slotEls.map((el) => ({
    x: el.offsetLeft + el.offsetWidth / 2,
    y: el.offsetTop + el.offsetHeight / 2,
  }));
  const cx = centres.reduce((sum, c) => sum + c.x, 0) / centres.length;
  const cy = centres.reduce((sum, c) => sum + c.y, 0) / centres.length;
  slotEls.forEach((el, i) => {
    el.style.setProperty("--tm-fx", `${(cx + VERTICES[i].x * SPREAD - centres[i].x) * travel}px`);
    el.style.setProperty("--tm-fy", `${(cy + VERTICES[i].y * SPREAD - centres[i].y) * travel}px`);
  });
}

// Everything is scrubbed by scroll position (no timers), so it runs both ways, never flickers and
// always matches where the visitor is. Per frame it writes, per card, --k (triangle: 0 = in place,
// 1 = gathered into the triangle), --tm-y (vertical offset, px) and --tm-o (swap opacity), and for
// the section --tm-dark (0 = light, 1 = dark); globals.css turns those into transforms, opacity and
// the mixed theme colours.
//   1. Entering the viewport, the first set grows out of the triangle.
//   2. The section pins; the first set rises and fades out while the section darkens, then the
//      second set rises in from below as it lightens again.
function useScrollTimeline(stageRef, sectionRef, listRef, slotRefs, windowRefs, cardRefs) {
  useEffect(() => {
    const stage = stageRef.current;
    const section = sectionRef.current;
    const list = listRef.current;
    const slotEls = slotRefs.current;
    const windowEls = windowRefs.current;
    const [setA, setB] = cardRefs.current;
    const travel = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? REDUCED_TRAVEL : 1;
    if (travel !== 1) section.style.setProperty("--tm-shrink", "0.1");

    let raf = 0;
    let pinTop = 0;
    let entryEl = section;
    let rises = [];
    let clipped = false;

    const measure = () => {
      // Pin at the top; a section taller than the screen pins with its bottom on-screen instead.
      pinTop = Math.min(0, window.innerHeight - section.offsetHeight);
      section.style.top = `${pinTop}px`;
      // Below xl the list is a real grid with height; on xl the cards float in the section itself.
      entryEl = list.offsetHeight > 0 ? list : section;
      placeTriangle(slotEls, travel);
      rises = slotEls.map((el) => el.offsetHeight + GAP);
    };

    const setCard = (el, k, y, o) => {
      el.style.setProperty("--k", k.toFixed(4));
      el.style.setProperty("--tm-y", `${y.toFixed(2)}px`);
      el.style.setProperty("--tm-o", o.toFixed(4));
      // Fully transparent cards are hidden outright, so the invisible set never covers the visible one
      el.style.visibility = (1 - k) * o < 0.001 ? "hidden" : "";
    };

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      // Entry: 0 as the cards' area reaches the bottom of the screen, 1 once it's 40% up.
      const entry = clamp((vh - entryEl.getBoundingClientRect().top) / (vh * 0.6));
      // Pinned progress: 0 when the pin starts, 1 when the stage scrolls on.
      const range = stage.offsetHeight - section.offsetHeight;
      const p = range > 0 ? clamp((pinTop - stage.getBoundingClientRect().top) / range) : 0;

      // One progress value drives all six cards and the background, so everything stays in step
      const swap = easeInOut(span(p, SWAP));
      const mid = (SWAP[0] + SWAP[1]) / 2;
      const dark = p <= mid ? easeInOut(span(p, [SWAP[0], mid])) : 1 - easeInOut(span(p, [mid, SWAP[1]]));
      section.style.setProperty("--tm-dark", dark.toFixed(4));

      // Mask only once the entrance is done (the triangle reaches outside the slots); the cards are
      // at rest inside their window then, so switching it on changes nothing visible.
      const clip = entry >= 1;
      if (clip !== clipped) {
        clipped = clip;
        windowEls.forEach((el) => el.classList.toggle("tm-window-masked", clip));
      }

      setA.forEach((el, i) => setCard(el, 1 - easeOut(staggered(entry, i)), -rises[i] * swap, 1 - swap));
      setB.forEach((el, i) => setCard(el, 0, rises[i] * (1 - swap), swap));
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      schedule();
    };

    measure();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(section);
    document.fonts?.ready.then(onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [stageRef, sectionRef, listRef, slotRefs, windowRefs, cardRefs]);
}

// Below xl the heading leads and the cards follow in a grid (1 column on mobile, 2 on tablet,
// 3 on small desktops). From xl the design's floating layout takes over.
// The stage is the section plus a spacer; the section is sticky inside it, so it stays pinned
// while the spacer scrolls past, which is the distance the card swap plays over.
export default function LmsTailorMade() {
  const stageRef = useRef(null);
  const sectionRef = useRef(null);
  const listRef = useRef(null);
  const slotRefs = useRef([]);
  const cardRefs = useRef([[], []]);
  const windowRefs = useRef([]);
  useScrollTimeline(stageRef, sectionRef, listRef, slotRefs, windowRefs, cardRefs);

  return (
    <div ref={stageRef} className="relative">
      {/* Without JavaScript nothing is scrubbed: show the first set in place and drop the spacer */}
      <noscript>
        <style>{`.tm-card[data-set="0"] { --k: 0; --tm-o: 1; } .tm-spacer { display: none; }`}</style>
      </noscript>

      <section
        ref={sectionRef}
        data-guide="lmsTailorMade"
        data-guide-ref="parent"
        className="lms-tm sticky top-0 overflow-hidden px-4 pt-20 pb-14 sm:px-6 sm:pt-24 lg:px-8 lg:pb-20 xl:h-[clamp(740px,56.6vw,815px)] xl:p-0"
      >
        {/* Soft glow behind the heading (only visible while the section is dark) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 45% 35% at 50% 56%, var(--tm-glow) 0%, transparent 70%)" }}
        />

        <div className="relative mx-auto max-w-[760px] text-center xl:absolute xl:inset-x-0 xl:top-[47%] xl:max-w-none xl:px-8">
          <h2 className="mx-auto max-w-[680px] text-[28px] font-semibold leading-[1.25] tracking-tight text-balance text-(--tm-heading) sm:text-[34px] lg:text-[40px]">
            Tailor-Made White Label LMS for Corporate Training App Development
          </h2>
          <p className="mx-auto mt-3 max-w-[720px] text-[15px] leading-normal text-(--tm-text) sm:text-base lg:text-lg">
            Discover the potential of a tailored Learning Management System designed to meet your
            organization&apos;s unique training needs
          </p>
        </div>

        <ul ref={listRef} className="relative mx-auto mt-10 grid max-w-[1100px] grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:static xl:m-0 xl:block xl:max-w-none">
          {slots.map((slot, i) => (
            <li
              key={slot.cards[0].title}
              ref={(el) => {
                slotRefs.current[i] = el;
              }}
              className={`grid xl:absolute xl:w-[clamp(320px,24.8vw,357px)] ${slot.place}`}
            >
              {/* Swap window: reaches 48px past the slot's sides, 24px above and 48px below, with
                  matching padding so it takes exactly the slot's space in the layout. The soft mask
                  (.tm-window-masked) is applied to this box during the swap. */}
              <div
                ref={(el) => {
                  windowRefs.current[i] = el;
                }}
                className="-mx-12 -mt-6 -mb-12 grid px-12 pt-6 pb-12"
              >
              {slot.cards.map((card, set) => (
                <div
                  key={card.title}
                  ref={(el) => {
                    cardRefs.current[set][i] = el;
                  }}
                  data-set={set}
                  className="tm-card col-start-1 row-start-1 rounded-xl border border-(--tm-card-border) bg-linear-to-br from-(--tm-card-from) to-(--tm-card-to) p-5 shadow-[0_8px_24px_var(--tm-card-shadow)]"
                >
                  <div className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-(--tm-icon)">
                      {icons[card.icon]}
                    </span>
                    <div>
                      <h3 className="text-lg font-medium leading-snug text-(--tm-heading) lg:text-xl">{card.title}</h3>
                      <p className="mt-2.5 text-sm leading-normal text-(--tm-card-text)">{card.text}</p>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Pinned scroll distance for the swap */}
      <div aria-hidden="true" className="tm-spacer h-[260svh]" />
    </div>
  );
}

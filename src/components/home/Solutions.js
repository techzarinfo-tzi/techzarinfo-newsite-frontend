import Image from "next/image";
import Link from "next/link";

const BASE = "/home/solution/";
const PIN = BASE + "pin.webp";

// Each card image already has its title, copy, icon, tilt and shadow baked in by design,
// so this only has to place them (plus the pushpin overlay) where the design puts them.
// left/top/w are % of the desktop board (1200x780 reference frame).
//
// pin.x/pin.y/pin.w were measured directly off the source design screenshot (not eyeballed):
// each card's visible rounded-rect was isolated by color, then the pin's own solid-blue blob
// was isolated the same way and its centroid converted into a % of that card's *full image
// canvas* (the canvas includes the transparent shadow margin around the visible card, which is
// why these aren't round numbers). Because every card is rotated by a different amount, the
// pin's highest point on the card differs card to card — e.g. "tailored" leans hard right,
// "agile" sits left of center — so these are per-card, not a single shared offset.
const cards = [
  {
    id: "tailored",
    src: BASE + "solution1.svg",
    alt: "Tailored Solutions",
    width: 385,
    height: 441,
    left: 7.5,
    top: 11.54,
    w: 25,
    pin: { x: 69.08, y: 8.59, w: 27.7 },
  },
  {
    id: "security",
    src: BASE + "solution2.png",
    alt: "Robust Security",
    width: 378,
    height: 397,
    left: 38.33,
    top: 1.28,
    w: 24.17,
    pin: { x: 51.11, y: 8.71, w: 28.1 },
  },
  {
    id: "design",
    src: BASE + "solution3.svg",
    alt: "User-Centric Design",
    width: 371,
    height: 383,
    left: 69.17,
    top: 12.18,
    w: 23.33,
    pin: { x: 50.54, y: 8.36, w: 28.4 },
  },
  {
    id: "technology",
    src: BASE + "solution4.svg",
    alt: "Cutting Edge Technology",
    width: 375,
    height: 402,
    left: 7.92,
    top: 55.13,
    w: 24.17,
    pin: { x: 51.48, y: 9.03, w: 28.3 },
  },
  {
    id: "agile",
    src: BASE + "solution5.svg",
    alt: "Agile Development",
    width: 391,
    height: 478,
    left: 37.92,
    top: 49.36,
    w: 25,
    pin: { x: 45.98, y: 8.12, w: 27.1 },
  },
  {
    id: "support",
    src: BASE + "solution6.svg",
    alt: "Ongoing Support",
    width: 374,
    height: 408,
    left: 68.75,
    top: 53.85,
    w: 23.75,
    pin: { x: 50.89, y: 8.69, w: 28.3 },
  },
];

// The pin image's own solid pushpin graphic isn't centred in its 89x89 canvas (there's extra
// transparent margin left/top for its drop shadow) — its measured centroid sits at
// (60.4%, 50.8%) of the canvas. Translating by that instead of the usual 50/50 is what
// makes the pin's actual tip land exactly on `pin.x`/`pin.y`, not the middle of its empty
// canvas. The artwork's tilt is baked into the asset itself and is identical on every card,
// so no extra rotation is applied here.
function Pin({ x, y, w }) {
  return (
    <Image
      src={PIN}
      alt=""
      width={89}
      height={89}
      unoptimized
      aria-hidden="true"
      className="absolute z-10"
      style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, transform: "translate(-60.4%, -50.8%)" }}
    />
  );
}

// `className` must include a position value (absolute for the desktop board, relative for
// the mobile stack) — an absolutely positioned element is itself a valid containing block
// for the pin, so it doesn't also need `relative`.
//
// The hover/touch float is applied to the card *photo* only (`card-photo`), not this wrapper —
// the pin is a sibling, positioned against the wrapper's own untouched box, so it stays put
// exactly like a real pin holding down a photo that drifts under it.
function Card({ card, className, style }) {
  return (
    <div className={`${className} card-hover-zone`} style={style}>
      <Pin x={card.pin.x} y={card.pin.y} w={card.pin.w} />
      <Image
        src={card.src}
        alt={card.alt}
        width={card.width}
        height={card.height}
        unoptimized
        className="card-photo h-auto w-full"
      />
    </div>
  );
}

export default function Solutions() {
  return (
    <section data-guide="solutions" className="relative bg-white py-14 sm:py-16 lg:py-20">
      {/* Concentric rings: placeholder for the animated wave background (asset + motion to follow).
          Sized to frame the desktop scatter-board's square footprint, so it only renders from lg
          up — below that the cards stack into a much taller list and the rings would simply cut
          off partway down, leaving the lower cards floating on plain white. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden items-start justify-center lg:flex">
        <div className="relative mt-16 aspect-square w-[92%] max-w-[780px]">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute rounded-full border border-[#d3e3f8]"
              style={{ inset: `${i * 9}%` }}
            />
          ))}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <h2 className="mx-auto max-w-[820px] text-center text-[28px] font-bold leading-[1.2] text-[#002148] sm:text-[36px] lg:text-[46px]">
          What Sets Our Solutions Apart?
        </h2>

        {/* Desktop: pinned scatter board matching the design */}
        <div className="relative mx-auto mt-12 hidden w-full max-w-[1100px] lg:mt-14 lg:block lg:aspect-[1200/780]">
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              className="absolute"
              style={{ left: `${card.left}%`, top: `${card.top}%`, width: `${card.w}%` }}
            />
          ))}
        </div>

        {/* Mobile/tablet: same pinned cards, stacked in normal flow. Each card's own canvas
            already reserves generous space below it for its drop shadow to fade out, so the
            grid gap here is deliberately tight to avoid doubling up on that whitespace. */}
        <ul className="mt-12 grid grid-cols-1 gap-x-4 sm:grid-cols-2 lg:hidden">
          {cards.map((card) => (
            <li key={card.id} className="mx-auto w-full max-w-[320px]">
              <Card card={card} className="relative" />
            </li>
          ))}
        </ul>

        <div className="relative mt-12 text-center lg:mt-14">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-[10px] bg-[#002148] px-10 py-3.5 text-[16px] font-medium text-white transition-colors hover:bg-[#003070]"
          >
            Let&rsquo;s Talk
          </Link>
        </div>
      </div>
    </section>
  );
}

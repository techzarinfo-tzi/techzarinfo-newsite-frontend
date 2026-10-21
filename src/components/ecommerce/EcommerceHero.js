import Image from "next/image";
import Link from "next/link";

// The visual box is the person (right-aligned, 87% wide) plus room on the left, so the cards
// have space to swing out past her arm. The card SVGs already carry their own tilt, label and heart.
//
// 3D orbit: the person is fixed and the three cards ride one shared, tilted circular orbit around
// her (seen in perspective, so it reads as an ellipse): the near half passes in front of her, the
// far half behind. All cards share one speed and sit exactly a third of the orbit apart, so the gap
// between them never changes. Sizes and radii are in cqw (% of the visual box width), so the whole
// orbit scales with the layout.
const ORBIT = {
  center: { left: "52%", top: "55%" }, // her chest, in % of the visual box
  rx: 46, // cqw: half-width of the orbit (stays inside the box, which is flush with the screen edge on desktop)
  ry: 16, // cqw: half-height (the tilt): far side passes behind her shoulders, near side over her chest
  period: 18, // seconds per revolution
};

// phase: start point as a fraction of the orbit (0 = far left, 0.25 = front, 0.5 = far right, 0.75 = back)
const cards = [
  { label: "Shirt", src: "/ecommerce/hero/shirt.webp", width: 171, height: 182, size: 24.9, phase: 0 },
  { label: "Shoes", src: "/ecommerce/hero/shoes.webp", width: 174, height: 184, size: 25.4, phase: 1 / 3 },
  { label: "Lens", src: "/ecommerce/hero/lens.svg", width: 156, height: 168, size: 22.8, phase: 2 / 3 },
];

// x and y are two sine swings a quarter-turn apart, which traces the ellipse. Negative delays start
// each card part-way round, so the orbit is already in motion on page load and never resets.
function orbitStyle(phase) {
  const { center, rx, ry, period } = ORBIT;
  return {
    ...center,
    "--orbit-rx": `${rx}cqw`,
    "--orbit-ry": `${ry}cqw`,
    "--orbit-half": `${period / 2}s`,
    "--orbit-dx": `${(-phase * period).toFixed(3)}s`,
    "--orbit-dy": `${(-(phase + 0.25) * period).toFixed(3)}s`,
  };
}

// Each card is drawn twice on the same path: one copy under the person and one over her. The top
// copy fades out across the far side of the orbit, so the card slips gradually behind her body
// (and re-emerges in front) with no z-index pop or flicker where it overlaps her.
function OrbitCard({ card, layer }) {
  const front = layer === "front";
  return (
    <div
      className={`orbit-y absolute ${front ? "orbit-front z-20" : "z-0"}`}
      style={orbitStyle(card.phase)}
      aria-hidden={front ? undefined : true}
    >
      <div className="orbit-x">
        <Image
          src={card.src}
          alt={front ? `${card.label} product card` : ""}
          width={card.width}
          height={card.height}
          className="absolute top-0 left-0 h-auto max-w-none -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_10px_18px_rgba(0,36,97,0.12)]"
          style={{ width: `${card.size}cqw` }}
        />
      </div>
    </div>
  );
}

export default function EcommerceHero() {
  return (
    <section data-guide="ecommerceHero" className="relative overflow-hidden bg-[#e2f1ff]">
      {/* Sky-blue wash: brighter haze up top, softening to white at the bottom edge */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 40% at 35% 0%, #b3d8f8 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 0% 40%, #c6e7fa 0%, transparent 75%), linear-gradient(180deg, #cbe6fc 0%, #e2f1ff 55%, #ebf5fe 85%, #ffffff 100%)",
        }}
      />

      <div className="relative z-10 grid grid-cols-1 gap-10 pt-28 sm:pt-32 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-[1.5vw] lg:pt-11">
        <div className="px-4 text-center sm:px-6 lg:self-center lg:pl-[clamp(2rem,10.35vw,11rem)] lg:pr-0 lg:text-left">
          {/* Wraps naturally: balanced lines so no word is left stranded, sized to the column (w-full) and
              capped in em so the cap scales with the font. "E-commerce" never splits at its hyphen. */}
          <h1 className="mx-auto w-full max-w-xl text-[32px] text-balance wrap-break-word font-medium leading-[1.2] tracking-tight text-[#002461] sm:text-[40px] lg:mx-0 lg:text-[clamp(40px,3.35vw,52px)] lg:max-w-[13em]">
            <span className="whitespace-nowrap">E-commerce</span> Development Company in India
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-snug text-[#002461] sm:text-lg lg:mx-0 lg:text-[clamp(18px,1.4vw,22px)]">
            Launch a high-performing e-commerce website built around your brand
            and business goals. We develop scalable online stores with seamless
            shopping experiences.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:mt-10 lg:justify-start lg:gap-6">
            <Link
              href="/contact"
              className="rounded-[3px] border border-[#002461] bg-[#002461] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0a3480] lg:text-base"
            >
              Start a Project
            </Link>
            <Link
              href="/demo"
              className="rounded-[3px] border border-[#002461] px-5 py-2.5 text-sm font-medium text-[#002461] transition-colors hover:bg-[#002461]/5 lg:text-base"
            >
              Free Demo
            </Link>
          </div>
        </div>

        <div className="@container relative mx-auto aspect-561/652 w-[min(100%_-_2rem,460px)] sm:w-130 lg:mx-0 lg:w-[clamp(440px,44.8vw,720px)] lg:self-end">
          {cards.map((card) => (
            <OrbitCard key={`${card.label}-back`} card={card} layer="back" />
          ))}
          <Image
            src="/ecommerce/hero/person.webp"
            alt="Shopper browsing an online store on a phone"
            width={561}
            height={749}
            preload
            className="absolute right-0 bottom-0 z-10 h-auto w-[87%]"
          />
          {cards.map((card) => (
            <OrbitCard key={`${card.label}-front`} card={card} layer="front" />
          ))}
        </div>
      </div>

      {/* White fade so the person blends into the next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-linear-to-b from-transparent to-white"
      />
    </section>
  );
}

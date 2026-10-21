import Image from "next/image";
import Link from "next/link";

// The hero artwork: already tilted and cropped on its right side. The monitor starts 14.4% in from
// the left and 13% down from the top; the rest of those margins is transparent.
const ARTWORK = { src: "/product/ERP/ERO-Hero.svg", width: 704, height: 572 };

// Desktop follows the 1440px design (the same hero system as the LMS, e-commerce and blockchain
// pages): copy on the left, starting ~10.35vw in and vertically centred; the tilted dashboard on the
// right. Placed by the monitor itself, not the artwork's transparent margins: its left edge at 53.3vw
// with the rest running off the right edge (box 54.6vw wide from 45.4vw), its top ~27% down the hero
// (box at 8vw), and its bottom past the section edge, where overflow-hidden clips it.
// Below lg the copy stacks above the artwork, which stays flush right and is clipped at the bottom.
// Entrance (globals.css, .erp-hero-*): the copy rises in line by line and the dashboard glides in
// from the right, then floats gently. Transform and opacity only, so nothing shifts.
export default function ErpHero() {
  return (
    <section
      data-guide="erpHero"
      className="relative overflow-hidden bg-[#e2f1ff] lg:min-h-[clamp(560px,50.9vw,780px)]"
    >
      {/* Sky-blue wash: brighter haze up top, softening to white at the bottom edge */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 40% at 35% 0%, #b3d8f8 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 0% 40%, #c6e7fa 0%, transparent 75%), linear-gradient(180deg, #cbe6fc 0%, #e2f1ff 55%, #ebf5fe 85%, #ffffff 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col gap-10 pt-28 sm:pt-32 lg:min-h-[clamp(560px,50.9vw,780px)] lg:justify-center lg:pt-[clamp(72px,6vw,96px)]">
        <div className="px-4 text-center sm:px-6 lg:w-[52vw] lg:pl-[clamp(2rem,10.35vw,11rem)] lg:pr-0 lg:text-left">
          <h1 className="erp-hero-line mx-auto w-full max-w-xl text-[32px] text-balance font-medium leading-[1.2] tracking-tight text-[#002461] sm:text-[40px] lg:mx-0 lg:max-w-none lg:text-[clamp(34px,2.9vw,44px)] lg:text-wrap">
            {/* The design's line break on desktop; smaller screens balance the lines themselves */}
            ERP Software Development <br className="hidden lg:block" />
            Company
          </h1>
          <p
            className="erp-hero-line mx-auto mt-4 max-w-xl text-base leading-snug text-[#002461] sm:text-lg lg:mx-0 lg:max-w-[640px] lg:text-[clamp(16px,1.25vw,19px)]"
            style={{ "--d": "0.12s" }}
          >
            Every department has its own in-charge, but keeping track of everyone shouldn&apos;t become
            another daily challenge. A customized ERP brings your teams, data, and daily operations
            together in one place
          </p>

          <div
            className="erp-hero-line mt-8 flex flex-wrap items-center justify-center gap-4 lg:mt-10 lg:justify-start lg:gap-6"
            style={{ "--d": "0.24s" }}
          >
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

        {/* Mobile: a fixed-height window clips the artwork's bottom. Desktop: pinned from ~53vw to past
            the right edge, overflowing the section bottom. */}
        <div className="ml-auto h-[min(70vw,440px)] w-[min(92%,600px)] overflow-hidden lg:pointer-events-none lg:absolute lg:top-[8vw] lg:left-[45.4vw] lg:ml-0 lg:h-auto lg:w-[54.6vw] lg:overflow-visible">
          <div className="erp-hero-art">
            <Image
              src={ARTWORK.src}
              alt="ERP dashboard showing total sales, operating expenses and a revenue forecast chart"
              width={ARTWORK.width}
              height={ARTWORK.height}
              preload
              className="erp-hero-float h-auto w-full drop-shadow-[0_24px_40px_rgba(0,36,97,0.14)]"
            />
          </div>
        </div>
      </div>

      {/* White fade so the artwork blends into the next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-linear-to-b from-transparent to-white"
      />
    </section>
  );
}

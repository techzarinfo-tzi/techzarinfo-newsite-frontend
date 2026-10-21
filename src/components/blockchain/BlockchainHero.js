import Link from "next/link";
import CoinOrbit from "./CoinOrbit";

// Desktop follows the 1440px design (the same hero system as the e-commerce page): copy on the
// left, starting ~10.35vw in and vertically centred; the phone-and-coins artwork on the right,
// ~689px wide at 1440 (47.8vw), flush with the right edge, starting ~90px down, its wrist running
// past the section bottom into the white fade. The copy is centred on the full section height
// (its negative top margin cancels the top padding the artwork needs).
// Below lg the copy stacks above the artwork, both centred.
export default function BlockchainHero() {
  return (
    <section data-guide="bcHero" className="relative overflow-hidden bg-[#e2f1ff]">
      {/* Sky-blue wash: brighter haze up top, softening to white at the bottom edge */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 40% at 35% 0%, #b3d8f8 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 0% 40%, #c6e7fa 0%, transparent 75%), linear-gradient(180deg, #cbe6fc 0%, #e2f1ff 55%, #ebf5fe 85%, #ffffff 100%)",
        }}
      />

      <div className="relative z-10 grid grid-cols-1 gap-6 pt-24 lg:min-h-[580px] lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-0 lg:pt-[clamp(72px,6.25vw,100px)]">
        <div className="px-4 text-center sm:px-6 lg:-mt-[clamp(72px,6.25vw,100px)] lg:self-center lg:pl-[clamp(2rem,10.35vw,11rem)] lg:pr-0 lg:text-left">
          <h1 className="mx-auto w-full max-w-xl text-[32px] font-medium leading-[1.2] tracking-tight text-[#002461] sm:text-[40px] lg:mx-0 lg:max-w-[13em] lg:text-[clamp(40px,3.35vw,52px)]">
            Blockchain Development Company
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-snug text-[#002461] sm:text-lg lg:mx-0 lg:max-w-[600px] lg:text-[clamp(18px,1.4vw,22px)]">
            Techzarinfo is a blockchain development company in India, builds
            crypto exchanges, digital wallets, smart contracts, DeFi platforms,
            and Web3 applications to help businesses grow with blockchain
            technology.
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

        {/* The wrist runs a little past the section edge, into the white fade */}
        <div className="relative mx-auto -mb-[calc(min(100vw_-_2rem,520px)*0.1)] w-[min(100%_-_2rem,520px)] lg:mx-0 lg:-mb-[calc(clamp(420px,47.8vw,740px)*0.12)] lg:w-[clamp(420px,47.8vw,740px)] lg:self-end">
          {/* The same artwork split into layers, so the coins can orbit the phone (see CoinOrbit) */}
          <CoinOrbit alt="Hand holding a phone with a crypto portfolio app, surrounded by Bitcoin, Ethereum, BNB and Tether coins" />
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

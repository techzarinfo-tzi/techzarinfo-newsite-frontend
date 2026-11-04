import HeroButton, { HeroButtonGroup } from "@/components/common/HeroButton";
import { DEMO_URL } from "@/config/demo";
import CryptoCoins from "./CryptoCoins";

// Desktop follows the 1440px design (the same hero system as the blockchain page): copy on the
// left, starting ~10.35vw in and vertically centred; the three coins on the right, ~454px wide at
// 1440 (31.5vw), ~100px in from the right edge. Below lg the copy stacks above the coins, both
// centred.
export default function CryptoHero() {
  return (
    <section data-guide="cryptoHero" className="relative overflow-hidden bg-[#e2f1ff]">
      {/* Sky-blue wash: brighter haze up top, softening to white at the bottom edge */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 40% at 35% 0%, #b3d8f8 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 0% 40%, #c6e7fa 0%, transparent 75%), linear-gradient(180deg, #cbe6fc 0%, #e2f1ff 55%, #ebf5fe 85%, #ffffff 100%)",
        }}
      />

      <div className="relative z-10 grid grid-cols-1 items-center gap-8 pt-28 pb-12 sm:pt-32 lg:min-h-[clamp(600px,52.8vw,800px)] lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-[4vw] lg:pt-[clamp(110px,8.5vw,130px)] lg:pb-[clamp(32px,3vw,48px)]">
        <div className="px-4 text-center sm:px-6 lg:pl-[clamp(2rem,10.35vw,11rem)] lg:pr-0 lg:text-left">
          <h1 className="mx-auto w-full max-w-xl text-[32px] font-medium leading-[1.2] tracking-tight text-balance text-[#002461] sm:text-[40px] lg:mx-0 lg:max-w-[13em] lg:text-[clamp(40px,3.35vw,52px)]">
            Cryptocurrency Exchange Development Company
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-snug text-[#002461] sm:text-lg lg:mx-0 lg:max-w-[clamp(560px,52vw,780px)] lg:text-[clamp(17px,1.3vw,20px)]">
            Every big crypto exchange platform started as someone&apos;s first step. As a top
            cryptocurrency exchange development company, we turn that first step into a high end
            trading platform where we combine bank-grade security, a lightning-fast trading engine,
            and real launch experience
          </p>

          <HeroButtonGroup>
            <HeroButton label="Start a Project" href="#contact" />
            <HeroButton label="Free Demo" href={DEMO_URL} variant="secondary" />
          </HeroButtonGroup>
        </div>

        <CryptoCoins className="mx-auto w-[min(72vw,340px)] sm:w-[min(50vw,380px)] lg:mr-[clamp(2rem,6.9vw,8rem)] lg:w-[clamp(340px,31.5vw,500px)]" />
      </div>
    </section>
  );
}

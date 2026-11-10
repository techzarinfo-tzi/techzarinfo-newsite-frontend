import Image from "next/image";
import HeroButton, { HeroButtonGroup } from "@/components/common/HeroButton";
import HeroGraphic from "./HeroGraphic";
import StatsRow from "./StatsRow";

const stats = [
  { value: "15+", label: "Years" },
   
  { value: "900+", label: "Projects" },
  { value: "400+", label: "Clients" },
  { value: "15+", label: "Countries" },
  { value: "9001-2015", label: "ISO Certified" },
];

export default function Hero() {
  return (
    <section data-guide="hero" className="relative overflow-hidden bg-sky-50">
      <Image
        src="/home/hero-background.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8 lg:pt-32 lg:pb-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[2fr_3fr] lg:gap-8">
          <div className="text-center lg:text-left">
            <h1 className="mx-auto max-w-lg text-3xl font-semibold leading-[1.15] tracking-tight text-blue-950 sm:text-4xl lg:mx-0 lg:text-[42px]">
              You Dream Big. We Build Bigger.
            </h1>
            <p className="mx-auto mt-4 max-w-md text-[20px] leading-relaxed text-[#01215A] sm:text-base lg:mx-0">
              Your dream isn’t just another project to us. We turn your
              ambitious visions into powerful digital products & services that
              move your businesses forward.
            </p>

            <HeroButtonGroup tone="home">
              <HeroButton tone="home" label="Start a Project" href="#contact" />
              <HeroButton
                tone="home"
                label="Schedule a Demo"
                href="/demo"
                variant="secondary"
              />
            </HeroButtonGroup>

            <StatsRow stats={stats} />
          </div>

          <HeroGraphic />
        </div>
      </div>
    </section>
  );
}

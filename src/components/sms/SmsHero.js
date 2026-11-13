import Image from "next/image";
import HeroButton, { HeroButtonGroup } from "@/components/common/HeroButton";

// The product hero system (as on the CRM page): sky-blue wash, copy on the left from the site's
// 10.35vw edge, the dashboard artwork flush with the right edge. Per the SMS design (1440px): the copy
// starts ~16vw down, the artwork ~8vw down at 46.2vw wide (its own white margin included), running
// slightly past the bottom into the white fade. Below lg the copy is centred above the artwork.
export default function SmsHero() {
  return (
    <section
      data-guide="smsHero"
      className="relative overflow-hidden bg-[#e2f1ff] lg:min-h-[clamp(560px,54.3vw,820px)]"
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

      <div className="relative z-10 flex flex-col gap-10 pt-28 sm:pt-32 lg:min-h-[clamp(560px,54.3vw,820px)] lg:pt-[clamp(140px,16vw,240px)]">
        <div className="px-4 text-center sm:px-6 lg:w-[50vw] lg:pl-[clamp(2rem,10.35vw,11rem)] lg:pr-0 lg:text-left">
          {/* Always exactly these two lines: each is kept whole, and the size scales with the screen
              so the longer line always fits its column (and clear of the artwork on desktop) */}
          <h1 className="mx-auto w-full text-[clamp(20px,7vw,32px)] font-medium leading-[1.2] tracking-tight text-[#002461] sm:text-[40px] lg:mx-0 lg:text-[clamp(28px,3.2vw,52px)]">
            <span className="block whitespace-nowrap">School Management System</span>{" "}
            <span className="block whitespace-nowrap">for Modern Education</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-snug text-[#002461] sm:text-lg lg:mx-0 lg:max-w-[620px] lg:text-[clamp(16px,1.25vw,19px)]">
            Simplify school operations, automate daily tasks, and keep your entire school connected
            with one smart platform.
          </p>

          <HeroButtonGroup>
            <HeroButton label="Get a Free Quote" href="/contact-us" />
            <HeroButton label="Book a Free Consultation" href="/contact-us" variant="secondary" />
          </HeroButtonGroup>
        </div>

        <div className="ml-auto w-[min(92%,600px)] lg:absolute lg:top-[clamp(90px,7.9vw,120px)] lg:right-0 lg:ml-0 lg:w-[46.2vw]">
          <Image
            src="/product/SMS/hero/SMS-hero.svg"
            alt="School management dashboard showing student, teacher and class totals, weekly attendance and recent activity"
            width={658}
            height={701}
            preload
            unoptimized
            className="h-auto w-full"
          />
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

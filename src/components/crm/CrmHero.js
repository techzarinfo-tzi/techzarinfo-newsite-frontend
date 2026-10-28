import Image from "next/image";
import Link from "next/link";

// Desktop follows the 1440px design (the same hero system as the LMS, CMMS, ERP, e-commerce and
// blockchain pages): copy on the left, starting ~10.35vw in. The CRM user-management screenshot sits
// on the right, ~46.4vw wide, flush with the right edge. Copy and artwork share one top offset
// (--hero-top, ~15vw), so their tops line up exactly at every width. The artwork itself is cropped on
// its right side, and it runs past the section bottom, where overflow-hidden clips it, so the
// dashboard reads as continuing off-screen.
// Below lg the copy stacks above the artwork, which stays flush right and is clipped at the bottom.
export default function CrmHero() {
  return (
    <section
      id="custom-crm-solutions"
      data-guide="crmHero"
      className="relative overflow-hidden bg-[#e2f1ff] lg:min-h-[clamp(560px,54.3vw,820px)] lg:[--hero-top:clamp(130px,15.1vw,230px)]"
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

      <div className="relative z-10 flex flex-col gap-10 pt-28 sm:pt-32 lg:min-h-[clamp(560px,54.3vw,820px)] lg:pt-(--hero-top)">
        <div className="px-4 text-center sm:px-6 lg:w-[48vw] lg:pl-[clamp(2rem,10.35vw,11rem)] lg:pr-0 lg:text-left">
          <h1 className="mx-auto w-full max-w-xl text-[32px] text-balance font-medium leading-[1.2] tracking-tight text-[#002461] sm:text-[40px] lg:mx-0 lg:max-w-[13em] lg:text-[clamp(40px,3.35vw,52px)]">
            CRM Development Company
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-snug text-[#002461] sm:text-lg lg:mx-0 lg:max-w-[600px] lg:text-[clamp(18px,1.4vw,22px)]">
            Every client inquiry is more than just data - it can be a
            revenue-driving opportunity for your business. At Techzarinfo, we
            offer CRM solutions that help businesses manage those valuable
            client relationships more effectively
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

        {/* Mobile: a fixed-height window clips the artwork's bottom. Desktop: pinned to the right
            edge and left to overflow the section bottom. */}
        <div className="ml-auto h-[min(72vw,460px)] w-[min(90%,560px)] overflow-hidden lg:absolute lg:top-(--hero-top) lg:right-0 lg:ml-0 lg:h-auto lg:w-[46.4vw] lg:overflow-visible">
          <Image
            src="/product/CRM/CRM-hero.svg"
            alt="CRM user management screen listing team members, their roles and account permissions"
            width={675}
            height={574}
            preload
            className="h-auto w-full drop-shadow-[0_10px_30px_rgba(0,36,97,0.10)]"
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

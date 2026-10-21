import WhyChooseOrbit from "./WhyChooseOrbit";

export default function BlockchainWhyChoose() {
  return (
    <section data-guide="bcWhyChoose" className="overflow-x-clip bg-white px-4 py-8 text-center sm:px-6 sm:py-12 md:py-14 lg:px-8 lg:py-12">
      <div className="relative mx-auto [--coin:clamp(60px,19vw,76px)] [--gap:14px] [--r:clamp(100px,32vw,128px)] sm:[--coin:88px] sm:[--r:150px] md:w-fit md:p-[calc(var(--coin)+var(--gap))] lg:[--coin:128px] lg:[--gap:16px] xl:[--coin:160px] xl:[--gap:18px]">
        <div className="why-glass relative z-10 mx-auto  px-5 py-6 sm:px-8 sm:py-8 md:w-[516px] md:px-7 md:py-8 lg:w-[672px] lg:rounded-[28px] lg:px-10 lg:py-10 xl:w-[760px]">
          <h2 className="mx-auto max-w-[820px] text-[26px] font-semibold leading-[1.25] tracking-tight text-[#002461] sm:text-[36px] lg:text-[48px]">
            Why Choose TZI for Blockchain App Development Services in India?
          </h2>
          <p className="mx-auto mt-4 max-w-[880px] lg:max-w-[905px] text-base leading-[1.55] text-[#002461] sm:text-xl lg:mt-5 lg:text-[26px] lg:leading-[1.27]">
            When you choose us as a development partner for your blockchain project, you&apos;re not just
            handing over an idea and waiting for the finished product. You will travel with us through the
            questions, changes, challenges, and decisions that come along the way.
          </p>
        </div>

        <WhyChooseOrbit className="relative mx-auto mt-6 sm:mt-10 md:absolute md:inset-0 md:mt-0" />
      </div>
    </section>
  );
}

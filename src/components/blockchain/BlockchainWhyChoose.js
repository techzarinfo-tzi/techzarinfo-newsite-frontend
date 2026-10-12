// Centred copy block from the 1440px design: two-line heading (~48px) and a ~905px-wide paragraph
// (~31px), both in the site navy. Scales down on tablet and mobile (heading 26/36px, copy 16/20px).
export default function BlockchainWhyChoose() {
  return (
    <section className="bg-white px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-[120px]">
      <h2 className="mx-auto max-w-[820px] text-[26px] font-semibold leading-[1.25] tracking-tight text-[#002461] sm:text-[36px] lg:text-[48px]">
        Why Choose TZI for Blockchain App Development Services in India?
      </h2>
      <p className="mx-auto mt-4 max-w-[880px] lg:max-w-[905px] text-base leading-[1.55] text-[#002461] sm:text-xl lg:mt-5 lg:text-[26px] lg:leading-[1.27]">
        When you choose us as a development partner for your blockchain project, you&apos;re not just
        handing over an idea and waiting for the finished product. You will travel with us through the
        questions, changes, challenges, and decisions that come along the way.
      </p>
    </section>
  );
}

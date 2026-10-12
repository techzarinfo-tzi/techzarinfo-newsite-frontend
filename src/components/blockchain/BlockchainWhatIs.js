// Desktop follows the 1440px design: copy left-aligned on the same left edge as the hero
// (~10.35vw in), heading ~660px wide on two lines, paragraph ~840px wide.
// Tablet/mobile: same left-aligned block with the page's standard side padding.
export default function BlockchainWhatIs() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-14 lg:pt-[84px] lg:pr-8 lg:pb-16 lg:pl-[clamp(2rem,10.35vw,11rem)]">
      <h2 className="max-w-[16em] text-[28px] font-bold leading-[1.25] tracking-tight text-[#002461] sm:text-[34px] lg:text-[40px]">
        What Is a Blockchain Development Solution?
      </h2>
      <p className="mt-4 max-w-[830px] text-base leading-[1.35] text-[#002461] lg:mt-5 lg:text-[19px] lg:tracking-[-0.01em]">
        A blockchain development solution is a technology-driven approach that helps businesses build
        secure, transparent, and decentralized applications using blockchain networks. It can be
        customized to meet different business goals, from improving transaction security to creating
        decentralized ecosystems and reduce dependency on centralized systems.
      </p>
    </section>
  );
}

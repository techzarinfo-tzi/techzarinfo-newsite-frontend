// The intro section's typography and colours (as on the Blockchain page's "What Is" section), laid
// out side by side per the crypto design: heading on the left from the hero's left edge
// (~10.35vw), paragraph in the right half (~620px wide at 1440). Below lg the paragraph stacks
// under the heading with the page's standard side padding.
export default function CryptoWhatIs() {
  return (
    <section data-guide="cryptoWhatIs" className="bg-white px-4 py-12 sm:px-6 sm:py-14 lg:py-16 lg:pr-[clamp(2rem,6vw,8rem)] lg:pl-[clamp(2rem,10.35vw,11rem)]">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-x-12">
        <h2 className="max-w-[14em] text-[32px] font-semibold leading-[1.25] tracking-tight text-[#002461] sm:text-[34px] lg:text-[40px]">
          What is Cryptocurrency Exchange Development?
        </h2>
        <p className="max-w-[830px] text-base leading-[1.45] text-[#002461] lg:max-w-none lg:text-[19px] lg:tracking-[-0.01em]">
          Cryptocurrency exchange development involves planning, constructing, and launching a
          digital platform that allows users to interact with cryptocurrencies in a variety of ways
          buying, selling, trading, and managing them online and securely. Essentially, these
          exchanges help the traders to trade their Bitcoin, Ethereum, and other types of
          cryptocurrencies virtually.
        </p>
      </div>
    </section>
  );
}

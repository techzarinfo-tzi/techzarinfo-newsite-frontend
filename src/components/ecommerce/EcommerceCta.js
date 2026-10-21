import Link from "next/link";

// Gradient sampled from the design: solid navy across the top quarter, deepening into royal blue
// and fading to a pale sky blue at the bottom, plus a soft light glow toward the lower right.
const background = [
  "radial-gradient(ellipse 45% 55% at 68% 100%, rgba(222, 234, 255, 0.75) 0%, rgba(222, 234, 255, 0) 70%)",
  "linear-gradient(180deg, #001667 0%, #001667 25%, #011a6f 40%, #052a88 50%, #1548af 60%, #3e78db 70%, #70a0f2 80%, #a1c2f8 90%, #c0d5f8 100%)",
].join(", ");

// Desktop follows the 1440px design: a 1057px rounded card (26px corners), centred.
// Shared by other pages: title, text and guide (the AI guide's data-guide key) default to the
// e-commerce page's own content, so that page passes nothing.
export default function EcommerceCta({
  title = "Make Your Next Online Sale Easier",
  text = (
    <>
      Bring everything together in an <span className="whitespace-nowrap">e-commerce</span> experience designed around how your customers
      actually shop.
    </>
  ),
  guide = "ecommerceCta",
}) {
  return (
    <section data-guide={guide} className="bg-white px-4 pt-10 pb-14 sm:px-6 lg:px-8 lg:pt-16 lg:pb-20">
      <div
        className="mx-auto max-w-[1057px] rounded-[20px] px-6 pt-14 pb-20 text-center text-white sm:px-10 lg:rounded-[26px] lg:pt-[78px] lg:pb-[110px]"
        style={{ background }}
      >
        <h2 className="text-[26px] font-semibold leading-[1.25] tracking-tight sm:text-[34px] lg:text-[42px]">
          {title}
        </h2>
        <p className="mx-auto mt-3.5 max-w-[560px] text-base leading-[1.35] text-white/90 lg:text-xl">
          {text}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:gap-[27px]">
          <Link
            href="/contact"
            className="inline-flex h-11 items-center rounded-[3px] bg-white px-[15px] text-[15px] font-medium text-[#002461] transition-colors hover:bg-white/90 lg:text-base"
          >
            Start a Project
          </Link>
          <Link
            href="/demo"
            className="inline-flex h-11 items-center rounded-[3px] border border-white/70 px-[15px] text-[15px] font-medium text-white transition-colors hover:bg-white/10 lg:text-base"
          >
            Free Demo
          </Link>
        </div>
      </div>
    </section>
  );
}

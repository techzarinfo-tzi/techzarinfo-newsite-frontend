import Image from "next/image";

const GIF = "/ecommerce/why-choose/whychoose.webp"; // animated WebP (same frames as the original GIF)

// Desktop (lg+): the section is half the screen height (never under 400px, so the copy always
// fits). Heading pinned top-left and copy bottom-right; horizontal positions and type sizes follow
// the 1440px design in cqw (% of the max-1440px container). The animated sphere is sized from the
// section height (a square as tall as the section) and centred, so it shrinks with the section.
// The GIF has a solid black background, so the section is black too and its edges disappear.
// Below lg everything stacks: heading, sphere, then the copy pulled up into the GIF's empty lower
// third. The GIF is served as-is (unoptimized) so it keeps animating.
export default function EcommerceWhyChoose() {
  return (
    <section data-guide="ecommerceWhyChoose" className="relative overflow-hidden bg-black text-white">
      <div className="@container mx-auto max-w-[1440px]">
        <div className="relative px-4 pt-10 pb-14 sm:px-6 lg:h-[max(70svh,400px)] lg:p-0">
          <h2 className="relative z-10 max-w-[620px] text-[26px] font-medium leading-[1.27] tracking-tight sm:text-[36px] lg:absolute lg:top-[clamp(24px,8%,48px)] lg:left-[6.3cqw] lg:max-w-[50cqw] lg:text-[clamp(32px,3.05cqw,44px)]">
            Why Choose TZI for <span className="whitespace-nowrap">E-Commerce</span> Development Services in India?
          </h2>

          <div className="relative mx-auto mt-6 w-full max-w-[520px] -mb-[calc(min(100%,520px)*0.3)] lg:absolute lg:top-0 lg:left-[51%] lg:mt-0 lg:mb-0 lg:aspect-square lg:h-full lg:w-auto lg:max-w-none lg:-translate-x-1/2">
            <Image
              src={GIF}
              alt=""
              width={500}
              height={500}
              unoptimized
              className="h-auto w-full lg:h-full"
              // Soft edges so the GIF's square frame never shows against the section background
              style={{
                maskImage: "radial-gradient(closest-side, #000 82%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(closest-side, #000 82%, transparent 100%)",
              }}
            />
          </div>

          <p className="relative z-10 mx-auto max-w-[630px] text-base leading-[1.4] text-[#ffff] sm:text-lg lg:absolute lg:bottom-[clamp(24px,8%,48px)] lg:left-[51.4cqw] lg:mx-0 lg:w-[43.75cqw] lg:max-w-none lg:text-[clamp(15px,1.53cqw,22px)] lg:leading-[1.28]">
            <span className="text-white/90">
              Choosing the right e-commerce development partner can make a real difference to how your
              online business performs. TZI combines practical business
            </span>{" "}
            understanding with modern development expertise to build e-commerce platforms that are easy to
            use, secure, scalable, and ready to grow with your business.
          </p>
        </div>
      </div>
    </section>
  );
}

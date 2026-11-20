import Image from "next/image";
import LensZoom from "./LensZoom";

const ASSETS = "/ecommerce/industry";

// label: the design's line breaks. Each image is the complete card (white tile, light-blue
// border and the round icon) at its native 141 x 171, so only the caption is text.
const industries = [
  { src: `${ASSETS}/e-commerce.webp`, label: ["E-Commerce"] },
  { src: `${ASSETS}/retail.webp`, label: ["Retail"] },
  { src: `${ASSETS}/fashion.webp`, label: ["Fashion and Apparel"] },
  { src: `${ASSETS}/food.webp`, label: ["Food and Beverage"] },
  { src: `${ASSETS}/homeappliance.webp`, label: ["Home Appliances", "and Furniture"] },
];

// Also used on the Mobile App page with its own heading, intro and six cards; `listWidth` is the
// desktop row's width (the cards spread evenly across it).
export default function EcommerceIndustries({
  guide = "ecommerceIndustries",
  title = (
    <>
      <span className="whitespace-nowrap">E-Commerce</span> Solutions for Every Industry
    </>
  ),
  text = "Scalable e-commerce solutions built around your products, business model, and changing growth needs.",
  items = industries,
  listWidth = "lg:max-w-[1033px]",
  titleWidth = "lg:max-w-[560px]",
}) {
  return (
    <section data-guide={guide} className="bg-white px-4 pt-14 pb-14 sm:px-6 lg:px-8 lg:pt-12 lg:pb-16">
      <h2 className={`mx-auto max-w-[460px] text-center text-[28px] font-semibold leading-[1.25] tracking-tight text-[#002461] sm:text-[34px] lg:text-[42px] ${titleWidth}`}>
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-[580px] text-center text-base leading-[1.45] text-[#002461] lg:text-[19px]">
        {text}
      </p>

      <ul className={`mx-auto mt-12 flex max-w-[560px] flex-wrap justify-center gap-x-6 gap-y-10 sm:gap-x-12 lg:mt-[75px] lg:flex-nowrap lg:justify-between lg:gap-x-0 ${listWidth}`}>
        {items.map(({ src, label }) => (
          <li key={src} className="flex w-[128px] flex-col items-center sm:w-[141px]">
            <LensZoom src={src}>
              <Image src={src} alt="" width={141} height={171} draggable={false} className="h-auto w-full" />
            </LensZoom>
            <p className="mt-6 text-center text-[13px] leading-[1.35] text-[#222] lg:mt-[30px] font-bold">
              {label.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

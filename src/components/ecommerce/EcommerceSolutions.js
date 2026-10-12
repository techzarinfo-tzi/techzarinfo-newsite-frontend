import Image from "next/image";

const ASSETS = "/ecommerce/developmentsolution";

// Bento layout from the 1440px design: three 321px columns with 14px gaps.
//   left:   Global Market Reach (tall, globe)        / Data-Driven Insights (short)
//   middle: Scalability & Flexibility (full height, storefront chart)
//   right:  Enhanced User Experience (short)         / Improved Operational Efficiency (tall, dashboard)
// On desktop the grid's height follows the screen (so the whole section fits in one view; --sol-chrome
// is the heading + spacing around the grid, tightened on short screens), with the
// rows kept in the design's 238 : 180 : 241 proportion. Image cards give the image whatever space the
// copy leaves and centre it in that space; text-only cards centre their copy vertically.
// md:order-* pairs the two image cards, then the two text cards, on the 2-column tablet grid.
// title: the design's two-line break.
const cards = [
  {
    title: ["Global Market", "Reach"],
    text: "Reach customers across regions with a scalable e-commerce store built to support your products and growing market presence.",
    image: { src: `${ASSETS}/global-market.svg`, width: 321, height: 344 },
    place: "md:order-1 lg:order-none lg:col-start-1 lg:row-span-2 lg:row-start-1",
    outlined: true,
  },
  {
    title: ["Data-Driven", "Insights"],
    text: "Understand customer behaviour and sales performance through meaningful data that helps you make smarter business decisions.",
    place: "md:order-3 lg:order-none lg:col-start-1 lg:row-start-3",
  },
  {
    title: ["Scalability &", "Flexibility"],
    text: "Expand your online store as your business grows with flexible features, integrations, and technology built for changing needs.",
    image: { src: `${ASSETS}/scalblity.svg`, width: 321, height: 368 },
    place: "md:order-2 lg:order-none lg:col-start-2 lg:row-span-3 lg:row-start-1",
  },
  {
    title: ["Enhanced User", "Experience"],
    text: "Deliver smoother shopping experiences with intuitive navigation, mobile-friendly design, faster browsing, and easy checkout.",
    place: "md:order-4 lg:order-none lg:col-start-3 lg:row-start-1",
  },
  {
    title: ["Improved Operational", "Efficiency"],
    text: "Simplify everyday operations by connecting your store with payments, inventory, CRM, shipping, and essential business tools.",
    image: { src: `${ASSETS}/improvement.svg`, width: 298, height: 223 },
    place: "md:order-5 md:col-span-2 lg:order-none lg:col-span-1 lg:col-start-3 lg:row-span-2 lg:row-start-2",
  },
];

// Faint white grid that fades out with the card's blue wash
const gridStyle = {
  backgroundImage:
    "linear-gradient(to right, rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.7) 1px, transparent 1px)",
  backgroundSize: "28px 28px",
  maskImage: "linear-gradient(to bottom, #000 0%, transparent 65%)",
  WebkitMaskImage: "linear-gradient(to bottom, #000 0%, transparent 65%)",
};

const fadeOut = "linear-gradient(to bottom, #000 55%, transparent 100%)";

function SolutionCard({ title, text, image, place, outlined }) {
  return (
    <li
      className={`relative flex flex-col overflow-hidden rounded-xl bg-linear-to-b from-[#e5f2fd] to-white ${image ? "" : "lg:justify-center"} ${place}`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={gridStyle} />
      {outlined && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl border border-[#b5cfff]"
          style={{ maskImage: fadeOut, WebkitMaskImage: fadeOut }}
        />
      )}

      {image && (
        // Desktop: the image area takes the space the copy leaves; the image is centred in it on both
        // axes (object-contain keeps its aspect ratio) and nudged up in size to match the design.
        <div className="relative lg:min-h-0 lg:flex-1">
          <Image
            src={image.src}
            alt=""
            width={image.width}
            height={image.height}
            className="relative mx-auto h-auto w-full max-w-(--img-w) lg:absolute lg:inset-0 lg:h-full lg:max-w-none lg:scale-[1.1] lg:object-contain"
            style={{ "--img-w": `${Math.round(image.width * 1.12)}px` }}
          />
        </div>
      )}

      <div className={`relative px-[18px] ${image ? "-mt-6 pb-8 sm:-mt-10 lg:-mt-8 lg:pb-6" : "py-8 lg:py-5"}`}>
        <h3 className="text-xl font-semibold leading-[1.36] text-[#002461] lg:text-[23px]">
          {title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h3>
        <p className="mt-2 text-[15px] leading-[1.35] text-[#002461]/75 lg:text-base lg:leading-[1.3]">{text}</p>
      </div>
    </li>
  );
}

export default function EcommerceSolutions() {
  return (
    <section data-guide="ecommerceSolutions" className="relative bg-white px-4 pt-10 pb-14 sm:px-6 lg:px-8 lg:pt-10 lg:pb-10 [@media(max-height:820px)]:[--sol-chrome:200px] [@media(max-height:820px)]:lg:pt-8 [@media(max-height:820px)]:lg:pb-8">
      <h2 className="mx-auto max-w-[600px] text-center text-[28px] font-semibold leading-[1.25] tracking-tight text-[#002461] sm:text-[34px] lg:text-[40px]">
        E-Commerce Development Solutions
      </h2>

      <ul className="mx-auto mt-10 grid max-w-[991px] grid-cols-1 gap-[14px] md:grid-cols-2 lg:mt-12 lg:h-[clamp(560px,calc(100svh-var(--sol-chrome)),687px)] [@media(max-height:820px)]:lg:mt-9 lg:grid-cols-3 lg:grid-rows-[238fr_180fr_241fr]">
        {cards.map((card) => (
          <SolutionCard key={card.title.join(" ")} {...card} />
        ))}
      </ul>
    </section>
  );
}

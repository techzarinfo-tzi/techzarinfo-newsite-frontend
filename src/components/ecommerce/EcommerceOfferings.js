import Image from "next/image";

const offerings = [
  {
    title: "Custom Platform Development",
    tagline: "Built around your business",
    text: "We create flexible e-commerce platforms designed around your products, customers, and workflows.",
  },
  {
    title: "Mobile App Development",
    tagline: "Shopping, made mobile",
    text: "We build fast, intuitive apps that make browsing, buying, and managing orders effortless.",
  },
  {
    title: "Integration Services",
    tagline: "Everything working together",
    text: "Connect payments, CRM, ERP, and other tools to create a smoother, more connected store.",
  },
  {
    title: "Migration & Upgradation",
    tagline: "Move forward with confidence",
    text: "Upgrade or migrate your e-commerce platform with your data, features, and customer experience intact.",
  },
];

const SPIRE = "/ecommerce/gimini/gimini.svg";

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[46%] w-[46%]" fill="none" aria-hidden="true">
      <path
        d="M5 7.5h14v10.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7.5Z"
        stroke="#fff"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M9 11.5a3 3 0 0 0 6 0" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M5 7.5 6.5 4.5h11L19 7.5" stroke="#fff" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowButton({ label }) {
  return (
    <span
      role="img"
      aria-label={`Learn more about ${label}`}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e6fd9] text-white"
    >
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

// Proportions follow the 1440px design: 877px-wide spire whose flared base sits behind the card
// row (cards start ~64% of the way down the spire), 4 x 293px cards with 30px gaps.
// --spire-w drives the spire size and the card overlap together, so they stay locked at every size.
//
// The section background (white backdrop + glow + light bands + spire) lives in its own layer,
// [data-offer-bg], behind the cards; an empty box of the same size holds the spire's place in the
// flow, so the cards sit exactly where they would if the spire were inline. The opaque backdrop is
// what lets this section cover the pinned Services section in ServicesOfferingsTransition, and
// [data-offer-bg-edge] is the soft leading edge that fades in while it slides over.
export default function EcommerceOfferings() {
  return (
    <section
      data-offer-section
      data-guide="ecommerceOfferings"
      className="relative overflow-x-clip pt-4 pb-14 [--spire-w:min(88vw,420px)] sm:pb-16 sm:[--spire-w:min(72vw,560px)] lg:pt-8 lg:pb-12 lg:[--spire-w:clamp(600px,61vw,877px)]"
    >
      <div data-offer-bg className="pointer-events-none absolute inset-0 bg-white pt-4 lg:pt-8" aria-hidden="true">
        {/* Soft leading edge, only shown while the layer is travelling over the Services section */}
        <div data-offer-bg-edge className="absolute inset-x-0 bottom-full h-32 bg-linear-to-b from-transparent to-white opacity-0" />
        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          {/* Spire with its glow and soft vertical light bands */}
          <div className="relative mx-auto aspect-806/849 w-(--spire-w)">
            <div
              className="absolute -inset-x-[45%] -top-[6%] bottom-[22%]"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(77, 138, 245, 0.42) 0%, rgba(77, 138, 245, 0.16) 55%, transparent 100%)",
              }}
            />
            <div className="absolute -top-[3%] bottom-[34%] left-[19.7%] w-[15.1%] bg-linear-to-b from-transparent via-[#c2d8ff] to-transparent blur-[6px]" />
            <div className="absolute -top-[3%] bottom-[34%] left-[34.8%] w-[30.7%] bg-linear-to-b from-[#cfe0ff] via-[#9fc2ff] to-transparent blur-[6px]" />
            <div className="absolute -top-[3%] bottom-[34%] left-[65.5%] w-[14.8%] bg-linear-to-b from-transparent via-[#c2d8ff] to-transparent blur-[6px]" />

            {/* Soft bloom: a blurred copy of the spire behind the sharp one */}
            <Image src={SPIRE} alt="" width={806} height={849} className="absolute inset-0 h-full w-full scale-x-110 opacity-80 blur-[22px]" />
            <Image src={SPIRE} alt="" width={806} height={849} className="absolute inset-0 h-full w-full" />
            {/* The design shows the spire in a deeper blue than the raw asset's white core:
                a blue multiply layer, clipped to the spire's own shape, tints it to match. */}
            <div
              className="absolute inset-0 bg-[#4d8af5] opacity-50 mix-blend-multiply"
              style={{
                maskImage: `url(${SPIRE})`,
                WebkitMaskImage: `url(${SPIRE})`,
                maskSize: "100% 100%",
                WebkitMaskSize: "100% 100%",
              }}
            />
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto aspect-806/849 w-(--spire-w)" aria-hidden="true" />

        <ul className="relative z-10 mx-auto -mt-[calc(var(--spire-w)*0.413)] grid max-w-[1256px] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-[30px]">
          {offerings.map(({ title, tagline, text }) => (
            <li
              key={title}
              className="flex flex-col rounded-lg bg-[#e5f2fd] bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,rgba(255,255,255,0.55),transparent_70%)] p-4 lg:min-h-[336px] lg:p-[14px]"
            >
              <div className="flex items-center gap-4 lg:gap-7">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-linear-to-br from-[#3b8fe6] to-[#1f63c9] lg:h-[52px] lg:w-[52px]">
                  <BagIcon />
                </span>
                <h3 className="max-w-[9em] text-[17px] font-semibold leading-[1.3] text-[#002461]">{title}</h3>
              </div>

              <div className="mt-6 lg:mt-[88px]">
                <p className="text-base font-semibold leading-snug text-[#002461] lg:text-[17px]">{tagline}</p>
                <p className="mt-1.5 text-[15px] leading-[1.45] text-[#002461] lg:text-[17px]">{text}</p>
              </div>

              <div className="mt-4 flex justify-end lg:mt-auto lg:mr-6 lg:mb-[15px]">
                <ArrowButton label={title} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

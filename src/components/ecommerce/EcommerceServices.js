import Image from "next/image";

const points = [
  "Reach more customers across markets.",
  "Deliver personalized shopping experiences.",
  "Enable secure and seamless transactions.",
];

function CheckBadge() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
      <circle cx="8" cy="8" r="8" fill="#1369ff" />
      <path
        d="M5 8.2l2 2 4-4.2"
        fill="none"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Proportions follow the 1440px design: image ~386px wide with ~97px between it and the copy.
// On desktop the image + copy pair is one block centred with margin-inline: auto, so the left and
// right spacing stay balanced at any screen width.
export default function EcommerceServices() {
  return (
    <section data-guide="ecommerceServices" data-guide-ref="[data-guide-anchor]" className="relative overflow-hidden bg-white">
      {/* Faint blue glow along the bottom edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{
          background: "radial-gradient(ellipse 30% 100% at 50% 100%, #eef4ff 0%, transparent 100%)",
        }}
      />

      <div className="relative grid grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:mx-auto lg:max-w-300 lg:grid-cols-[auto_minmax(0,540px)] lg:justify-center lg:gap-x-[clamp(48px,6.7vw,110px)] lg:px-8">
        <Image
          src="/ecommerce/webdevelop/trally.svg"
          alt="Shopping cart full of blue shopping bags"
          width={386}
          height={372}
          className="mx-auto h-auto w-[min(100%,300px)] sm:w-85 lg:mx-0 lg:w-[clamp(300px,26.8vw,420px)]"
        />

        <div className="text-center lg:text-left">
          <h2 className="mx-auto max-w-[560px] text-[26px] font-medium leading-[1.2] tracking-tight text-[#002461] sm:text-[30px] lg:mx-0 lg:text-[32px]">
            Our E-commerce Web Development Services in India
          </h2>
          <p className="mx-auto mt-4 max-w-[540px] text-base leading-[1.45] text-[#002461] lg:mx-0 lg:mt-5 lg:text-[18px]">
            We create user-friendly e-commerce websites that connect businesses
            with customers and support online growth.
          </p>

          <ul className="mt-10 inline-flex flex-col gap-3 text-left lg:mt-16">
            {points.map((point) => (
              <li
                key={point}
                className="flex items-center gap-3.5 text-[15px] leading-[1.45] text-[#002461] lg:text-[18px]"
              >
                <CheckBadge />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

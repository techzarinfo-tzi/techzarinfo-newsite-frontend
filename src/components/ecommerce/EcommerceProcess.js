import Image from "next/image";

const DIAGRAM = "/ecommerce/development-process/development-process.webp";
const DIAGRAM_W = 1251;
const DIAGRAM_H = 844;

// The flow in the design's order. icon = top-left of that step's 64px icon circle inside the
// diagram asset, so the stacked (tablet/mobile) layout reuses the exact same artwork.
const steps = [
  { title: "Idea", text: "We listen, Understand and turn your ideas into possibilities", icon: [286, 4] },
  { title: "Define", text: "We define the scope, features and functionality.", icon: [592, 4] },
  { title: "Estimation", text: "We analyze and provide accurate time and cost estimation", icon: [897, 4] },
  { title: "Design", text: "We design UI/UX that delivers great experiences", icon: [1090, 272] },
  { title: "Development", text: "We build powerful, scalable and secure solutions.", icon: [897, 475] },
  { title: "Testing", text: "We test thoroughly to ensure quality and bug free delivery", icon: [592, 516] },
  { title: "Live", text: "We deploy and launch your product to the world", icon: [286, 475] },
  { title: "Support", text: "We provide ongoing support and maintenance", icon: [95, 272] },
];

// A window onto part of the diagram asset at its native scale (crisp, no re-drawing).
function DiagramCrop({ x, y, w, h, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`block bg-no-repeat ${className}`}
      style={{
        width: w,
        height: h,
        backgroundImage: `url("${DIAGRAM}")`,
        backgroundSize: `${DIAGRAM_W}px ${DIAGRAM_H}px`,
        backgroundPosition: `-${x}px -${y}px`,
      }}
    />
  );
}

function ArrowDown() {
  return (
    <svg viewBox="0 0 24 40" className="mx-auto h-10 w-6 text-[#094fa4]" fill="none" aria-hidden="true">
      <path d="M12 2v34M4 28l8 9 8-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Desktop (lg+): the design's circular flow, shown as the provided artwork at up to its native
// 1251px width, so cards, icons, connectors and arrows line up exactly as designed. Its card text
// would be unreadably small on narrower screens, so below lg the same eight steps are laid out as
// a vertical flow of real cards (icons and centre artwork cropped from the same asset), joined by
// down arrows in the same order. That list stays available to screen readers on desktop too.
export default function EcommerceProcess() {
  return (
    <section data-guide="ecommerceProcess" className="relative bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <h2 className="mx-auto max-w-[620px] text-center text-[28px] font-semibold leading-[1.25] tracking-tight text-[#002461] sm:text-[34px] lg:text-[42px]">
        Our E-commerce Website Development Process
      </h2>
      <p className="mx-auto mt-3 max-w-[680px] text-center text-base leading-[1.3] text-[#002461] lg:text-[19px]">
        Every business is unique, so we take a custom approach to each project based on your specific
        requirements.
      </p>

      {/* Desktop: the designed circular flow */}
      <div className="mx-auto mt-[100px] hidden max-w-[1251px] lg:block">
        <Image
          src={DIAGRAM}
          alt=""
          width={DIAGRAM_W}
          height={DIAGRAM_H}
          className="h-auto w-full"
          style={{ marginBottom: "-8.6%" }} /* the asset has empty space below the last row */
        />
      </div>

      {/* Tablet / mobile: the same flow, stacked */}
      <div className="mt-10 lg:sr-only">
        <figure className="flex flex-col items-center" aria-hidden="true">
          <DiagramCrop x={518} y={209} w={212} h={216} className="scale-90 sm:scale-100" />
          <figcaption className="mt-1 text-base font-bold tracking-wide text-[#032684]">PROCESS</figcaption>
        </figure>

        <ol className="mx-auto max-w-[340px] pt-8">
          {steps.map(({ title, text, icon }, i) => (
            <li key={title}>
              {i > 0 && (
                <div className="py-3">
                  <ArrowDown />
                </div>
              )}
              <div className="relative mt-8 rounded-xl border-[1.5px] border-[#c7e0ff] bg-white px-5 pt-10 pb-5 text-center shadow-[0_14px_30px_-12px_rgba(10,80,165,0.3)]">
                <DiagramCrop
                  x={icon[0]}
                  y={icon[1]}
                  w={64}
                  h={64}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-full"
                />
                <h3 className="text-[15px] font-bold uppercase tracking-wide text-[#1a3b93]">
                  <span className="sr-only">Step {i + 1}: </span>
                  {title}
                </h3>
                <p className="mt-2 text-[15px] leading-normal text-[#3d4c8d]">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

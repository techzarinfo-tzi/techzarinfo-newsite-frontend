// Service cards fanned out on a large wheel, as in the 1440px design: the centre card stands upright
// and its neighbours sit 25deg apart around a pivot far below the section, so the outer cards tilt
// away and are cut off by the section's bottom edge.
// Everything is sized from one value, --cw (card width): card 260 x 332 and wheel radius 865 at
// 1440px, scaling down on smaller screens, so the fan keeps the same shape at every breakpoint.
const services = [
  {
    title: "Blockchain-as-a-Service",
    text: "Our BaaS offering lets you build, host and run blockchain applications on managed infrastructure, without the cost of running your own network.",
  },
  {
    title: "Blockchain Consulting",
    text: "Our blockchain consulting and strategy experts help you identify the right use cases, choose the right platform and plan a smooth rollout.",
  },
  {
    title: "Blockchain Application Development",
    text: "Our blockchain application development services deliver a variety of cryptocurrency wallets alongside decentralized finance solutions that benefit different sectors with smooth operation and increased user participation.",
  },
  {
    title: "Custom Blockchain Development Services",
    text: "Our custom blockchain development services build secure, scalable networks and smart contracts tailored to your business processes and goals.",
  },
  {
    title: "Blockchain Platform Development",
    text: "We build and maintain private, public and hybrid blockchain platforms with the performance, security and governance your business needs.",
  },
];

const STEP = 25; // degrees between neighbouring cards

// Animation: the wheel turns clockwise at a steady speed, so the cards travel along the arc from left
// to right (.services-spin in globals.css). One loop turns exactly one list's worth (5 x 25deg); the
// cards repeat the list in order round the wheel, so the end of a loop looks exactly like its start.
// Slots run from -275deg to +150deg: enough to keep the visible arc (about +-80deg) full for the
// whole turn, but never more than one full circle, so no card ever comes round onto another.
// Slot 0 (upright) starts with "Blockchain Application Development", as in the static design.
const FIRST_SLOT = -11;
const LAST_SLOT = 6;
const ring = Array.from({ length: LAST_SLOT - FIRST_SLOT + 1 }, (_, k) => {
  const slot = FIRST_SLOT + k;
  return { ...services[(((2 + slot) % services.length) + services.length) % services.length], slot };
});

function CubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[46%] w-[46%]" fill="none" aria-hidden="true">
      <path
        d="M12 2.8 20 7.2v9.6L12 21.2 4 16.8V7.2L12 2.8Z"
        stroke="#0b3f8f"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M4 7.2 12 11.6l8-4.4M12 11.6v9.6" stroke="#0b3f8f" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export default function BlockchainServices() {
  return (
    <section data-guide="bcServices" className="relative overflow-hidden bg-white pt-8 sm:pt-10 lg:pt-10">
      <div className="px-4 text-center sm:px-6">
        <h2 className="mx-auto max-w-[540px] text-[32px] font-semibold leading-[1.25] tracking-tight text-[#002461] sm:text-[34px] lg:text-[40px]">
          Our Prestigious Blockchain Development Services
        </h2>
        <p className="mx-auto mt-3 max-w-[620px] text-base leading-[1.45] text-[#002461]/80 lg:text-lg">
          We are highly dedicated to deliver end-to-end blockchain development services to enhance your
          business function globally and reach more heights in the respective sectors.
        </p>
      </div>

      {/* The wheel. --cw drives every size; the pivot sits R below the centre card's centre. */}
      <div
        className="relative mt-6 [--cw:clamp(230px,18vw,280px)] lg:mt-10"
        style={{ height: "calc(var(--cw) * 1.6)" }}
      >
        <ul
          className="services-spin absolute left-1/2 h-0 w-0"
          style={{
            top: "calc(var(--cw) * 1.277 / 2 + var(--cw) * 3.33)",
            "--spin-to": `${services.length * STEP}deg`,
          }}
        >
          {ring.map(({ title, text, slot }) => (
            <li
              key={slot}
              // screen readers get each service once: the five slots around the upright card
              aria-hidden={Math.abs(slot) <= 2 ? undefined : true}
              className="absolute top-0 left-0 flex flex-col rounded-xl bg-linear-to-b from-[#1680fa] to-[#0a5fc4] text-white"
              style={{
                width: "var(--cw)",
                height: "calc(var(--cw) * 1.277)",
                padding: "calc(var(--cw) * 0.055)",
                transform: `translate(-50%, -50%) rotate(${slot * STEP}deg) translateY(calc(var(--cw) * -3.33))`,
              }}
            >
              <span
                className="flex shrink-0 items-center justify-center rounded-[10px] bg-white"
                style={{ width: "calc(var(--cw) * 0.21)", height: "calc(var(--cw) * 0.21)" }}
              >
                <CubeIcon />
              </span>
              <h3
                className="font-medium leading-[1.3]"
                style={{ marginTop: "calc(var(--cw) * 0.1)", fontSize: "calc(var(--cw) * 0.07)" }}
              >
                {title}
              </h3>
              <p
                className="leading-[1.45] text-white/85"
                style={{ marginTop: "calc(var(--cw) * 0.05)", fontSize: "calc(var(--cw) * 0.05)" }}
              >
                {text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

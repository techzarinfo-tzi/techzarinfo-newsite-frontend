import Image from "next/image";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  className: "h-[46%] w-[46%]",
};

const icons = {
  monitor: (
    <svg {...iconProps}>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
  terminal: (
    <svg {...iconProps}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 10l3 2-3 2M13 15h4" />
    </svg>
  ),
  bulb: (
    <svg {...iconProps}>
      <path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0012 3z" />
    </svg>
  ),
  user: (
    <svg {...iconProps}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 20c0-3.3 2.7-6 6-6 1 0 1.900.2 2.700.6" />
      <circle cx="17.500" cy="17" r="2" />
      <path d="M17.500 13v1.300M17.500 19.700V21M21 17h-1.300M15.300 17H14M20 14.500l-.9.900M15.900 18.600l-.9.900M20 19.500l-.9-.9M15.900 15.400l-.9-.9" />
    </svg>
  ),
};

const services = [
  {
    icon: "monitor",
    title: "Digitization",
    text: "TZI helps clients transition to a digital enterprise by leveraging cloud, analytics, digital, infrastructure, and security paradigms.",
  },
  {
    icon: "terminal",
    title: "Development & Automation",
    text: "Technology solutions to improve business agility and efficiency by building innovative cutting-edge mobile and web software solutions",
  },
  {
    icon: "bulb",
    title: "Consulting",
    text: "TZI as a Consulting Company provides a wide range of services under one roof, from conceptualizing and project planning, through staffing, project management, and post-launch support.",
  },
  {
    icon: "user",
    title: "Resource Engagement",
    text: "We empower our clients to recruit talented, certified and experienced on-demand employees to scale your existing team, to fill necessary skill gaps and for the timely completion of the project.",
  },
];

export default function Services() {
  return (
    <section data-guide="flight" className="flight-section flex min-h-[100svh] items-center overflow-x-clip py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-[1100px] [container-type:inline-size]">
          {/* 762.16 × 630.62 on desktop, scaling down proportionally on smaller screens */}
          <div className="flight-rocket relative z-0 mx-auto aspect-[762.16/630.62] w-full max-w-[762.16px]">
            <div className="flight-rocket-inner absolute inset-0">
            {/* The artwork is baked in at an angle; this counter-rotation makes the rocket stand upright */}
            <Image
              src="/home/flights/rocket img 1.webp"
              alt="Rocket"
              width={762}
              height={631}
              unoptimized
              priority={false}
              className="absolute inset-0 h-full w-full -rotate-[35deg] translate-y-[6%] object-contain"
            />
            </div>
          </div>

          {/* Cards overlap the lower part of the rocket (engine/flame) and sit in front of it */}
          <ul
            className="flight-cards relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6"
            style={{ marginTop: "calc(min(762.16px, 100cqw) * -0.2)" }}
          >
            {services.map(({ icon, title, text }) => (
              <li
                key={title}
                className="rounded-2xl bg-[#EFF9FE] p-5 sm:p-6 lg:p-8"
              >
                <span className="flex h-[41px] w-[41px] items-center justify-center rounded-lg bg-[#0B57B7] text-white">
                  {icons[icon]}
                </span>
                <h3 className="mt-4 text-[24px] font-medium leading-[1.2] text-[#002148] sm:text-[28px] lg:text-[32px]">
                  {title}
                </h3>
                <p className="mt-3 text-[16px] leading-[1.5] text-[#002148]/80 sm:text-[18px] lg:text-[20px]">
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

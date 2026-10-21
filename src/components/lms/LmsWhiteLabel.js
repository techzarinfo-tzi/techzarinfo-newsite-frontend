import Image from "next/image";

const ASSETS = "/product/LMS/whitelable";

// Stroke icons (24px grid) for the feature bullets, drawn white on a blue disc.
const icons = {
  navigation: <path d="M3 11 21 3l-8 18-2-8-8-2Z" />,
  devices: (
    <>
      <rect x="2" y="4" width="14" height="10" rx="1.5" />
      <path d="M6 18h6" />
      <rect x="17" y="8" width="5" height="12" rx="1" />
    </>
  ),
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </>
  ),
  progress: (
    <>
      <path d="M3 3v18h18" />
      <path d="m7 15 4-4 3 3 5-6" />
    </>
  ),
  assessment: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  collaboration: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6" />
    </>
  ),
  roles: (
    <>
      <circle cx="10" cy="8" r="4" />
      <path d="M3 21a7 7 0 0 1 11-5.7" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M18 13.5v2M18 20.5v2M13.5 18h2M20.5 18h2" />
    </>
  ),
  content: <path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z" />,
  analytics: <path d="M5 21V11M12 21V4M19 21v-7" />,
  integration: (
    <>
      <path d="M9 3v5M15 3v5" />
      <path d="M6 8h12v3a6 6 0 0 1-12 0V8Z" />
      <path d="M12 17v4" />
    </>
  ),
};

// Three alternating feature cards from the 1440px design (1240px wide, ~480px tall): copy on one
// side, artwork on the other. The middle card mirrors the layout (artwork left). The last card's
// artwork is pre-cropped on its right side, so it sits flush with the card's right edge and reads
// as running off the card.
const features = [
  {
    title: "Seamless User Interface",
    text: "Designed for effortless navigation and smooth user engagement across devices, delivering a flexible and convenient learning experience",
    points: [
      ["navigation", "Intuitive Navigation"],
      ["devices", "Multi-device Accessibility"],
      ["dashboard", "Personalized Dashboards"],
      ["search", "Easy Course Search & Enrolment"],
    ],
    image: {
      src: `${ASSETS}/whitelable-1.svg`,
      width: 582,
      height: 498,
      alt: "Learner home screen on desktop and mobile, showing continue learning progress and enrolled courses",
    },
  },
  {
    title: "Comprehensive Course Management",
    text: "Manage diverse course formats, including video lectures, interactive quizzes, and assignments, while tracking learner progress and engagement",
    points: [
      ["layers", "Diverse Course Formats"],
      ["progress", "Progress Tracking & Recording"],
      ["assessment", "Flexible Assessments"],
      ["collaboration", "Learner Collaboration"],
    ],
    image: {
      src: `${ASSETS}/whitelable-2.svg`,
      width: 615,
      height: 447,
      alt: "Course player with video lesson, lesson checklist, quick quiz and assignment upload",
    },
    reverse: true,
  },
  {
    title: "Advanced Administration & Analytics",
    text: "Efficiently manage users, roles, and learning content while gaining valuable insights into learner engagement and overall system performance",
    points: [
      ["roles", "User & Role Management"],
      ["content", "Content Management"],
      ["analytics", "Learning Analytics"],
      ["integration", "Integration & Scalability"],
    ],
    image: {
      src: `${ASSETS}/whitelable-3.svg`,
      width: 612,
      height: 457,
      alt: "Admin overview dashboard with learner stats, engagement chart, user roles and content library",
    },
    bleed: true,
  },
];

function FeatureIcon({ name }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-[#005EFF] to-[#5593FF] shadow-[0_4px_10px_rgba(0,94,255,0.25)] lg:size-9"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4 text-white lg:size-[18px]"
      >
        {icons[name]}
      </svg>
    </span>
  );
}

function FeatureCard({ title, text, points, image, reverse, bleed }) {
  return (
    <li className="relative grid grid-cols-1 items-center overflow-hidden rounded-2xl border border-[#d5e7fb] bg-linear-to-br from-[#dcecfd] via-[#e9f4fe] to-[#f5faff] shadow-[0_10px_30px_rgba(0,36,97,0.06)] lg:min-h-[clamp(420px,33.3vw,480px)] lg:grid-cols-2">
      {/* Soft white haze behind the artwork side */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 55% 70% at ${reverse ? "20%" : "80%"} 50%, rgba(255,255,255,0.7) 0%, transparent 70%)`,
        }}
      />

      <div
        className={`relative px-6 pt-8 sm:px-10 sm:pt-10 lg:py-12 ${
          reverse ? "lg:order-2 lg:pr-[clamp(2rem,4.2vw,3.75rem)] lg:pl-[clamp(1rem,2vw,2rem)]" : "lg:pr-[clamp(1rem,2vw,2rem)] lg:pl-[clamp(2rem,4.2vw,3.75rem)]"
        }`}
      >
        <h3 className="text-2xl font-semibold leading-tight tracking-tight text-[#002461] sm:text-[28px] lg:text-[clamp(26px,2.2vw,32px)]">
          {title}
        </h3>
        <p className="mt-3 max-w-[34em] text-[15px] leading-normal text-[#002461]/80 sm:text-base lg:mt-4 lg:text-[clamp(16px,1.25vw,18px)]">
          {text}
        </p>

        <ul className="mt-6 grid gap-3.5 sm:grid-cols-2 sm:gap-x-6 lg:mt-8 lg:grid-cols-1 lg:gap-4">
          {points.map(([icon, label]) => (
            <li key={label} className="flex items-center gap-3 text-[15px] font-medium text-[#002461] sm:text-base lg:text-[clamp(16px,1.25vw,18px)]">
              <FeatureIcon name={icon} />
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div
        className={`relative mt-8 lg:mt-0 lg:self-stretch ${reverse ? "lg:order-1" : ""} ${
          bleed ? "ml-auto w-[92%] sm:w-[78%] lg:flex lg:w-full lg:items-center lg:justify-end" : "mx-auto w-[min(100%,560px)] px-4 pb-4 sm:px-8 lg:flex lg:w-full lg:items-center lg:justify-center lg:p-6"
        }`}
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className={`h-auto w-full ${bleed ? "lg:w-[96%]" : "lg:max-w-[clamp(440px,40.4vw,582px)]"}`}
        />
      </div>
    </li>
  );
}

export default function LmsWhiteLabel() {
  return (
    <section data-guide="lmsWhiteLabel" className="relative bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[820px] text-center">
        <h2 className="text-[28px] font-semibold leading-[1.25] tracking-tight text-balance text-[#002461] sm:text-[34px] lg:text-[40px]">
          White Label Learning Management System (LMS) Development
        </h2>
        <p className="mx-auto mt-4 max-w-[700px] text-[15px] leading-normal text-[#002461]/80 sm:text-base lg:text-lg">
          Build a branded LMS tailored to your training needs, with the flexibility to manage courses,
          engage learners, and support your organization&apos;s learning goals
        </p>
      </div>

      <ul className="mx-auto mt-10 grid max-w-[1240px] gap-6 lg:mt-14 lg:gap-10">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </ul>
    </section>
  );
}
  
import { Tag, Timer, Users } from "lucide-react";
import { StarIcon } from "@/components/cmms/CmmsAppDevelopment";
import ProcessMotion from "@/components/ecommerce/ProcessMotion";

// "Our World-Class Engagement Models": centred heading and intro, then three pale-blue cards in a
// row (stacked below lg): a navy icon tile, an upper-case title, a short description and four points
// with the site's blue star bullets (StarIcon, as on the CMMS cards). Sizes are the 1440px design's.
//
// Motion (globals.css .em-*, played by ProcessMotion): as each card scrolls in it fades up, the
// three a beat apart, and its points follow one after another; on hover a card lifts with a soft
// blue shadow and its icon tile rises and tilts slightly. Reduced motion / no JS: shown at rest.
const MODELS = [
  {
    icon: Tag,
    title: "Fixed Price",
    text: "Small business owners generally prefer to choose a fixed model price for their app development services. Best for businesses with predefined requirements. Fixed timeline and budget.",
    points: ["Pre-Defined Scope", "Less financial risk", "Quick Estimation", "Improved project predictability"],
  },
  {
    icon: Timer,
    title: "Time and Material",
    text: "Have requirements for the project that keep evolving? Here is when you need to sign with time & material. Suitable for ongoing projects with evolving needs. Pay only for the actual development work",
    points: ["Cost-Optimized", "Flexible", "Wider Scope", "Agile process"],
  },
  {
    icon: Users,
    title: "Dedicated Team",
    text: "Have a long-term app development process? How about hiring our developers for your project. Ideal for long-term projects needing a dedicated team, Seamless collaboration and project control",
    points: ["Wider Scope", "Crucial project involvement", "Work Transparency", "Collaborative team effort"],
  },
];

export default function MobileEngagementModels() {
  return (
    <section data-guide="mobileEngagement" className="bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <ProcessMotion className="mx-auto max-w-[1230px]">
        <div className="mx-auto max-w-[800px] text-center">
          <h2 className="text-[28px] font-semibold leading-[1.25] tracking-tight text-balance text-[#002461] sm:text-[34px] lg:text-[40px]">
            Our World-Class Engagement Models
          </h2>
          <p className="mx-auto mt-3 text-[15px] leading-snug text-[#002461] sm:text-base lg:text-lg">
            We empower our clients to recruit talented, certified and experienced on-demand employees to
            scale your existing team, to fill necessary skill gaps and for the timely completion of the
            project in time.
          </p>
        </div>

        <ul className="mx-auto mt-10 grid max-w-[480px] gap-6 lg:mt-[clamp(48px,5vw,72px)] lg:max-w-none lg:grid-cols-3 lg:gap-[clamp(24px,2.6vw,37px)]">
          {MODELS.map(({ icon: Icon, title, text, points }, i) => (
            <li
              key={title}
              data-proc-watch
              className="em-card group rounded-xl bg-[#e9f5ff] p-6 hover:shadow-[0_22px_44px_-22px_rgba(10,80,165,0.45)] lg:p-[clamp(20px,1.6vw,24px)] lg:pb-[clamp(24px,2.2vw,32px)]"
              style={{ "--i": i }}
            >
              <span className="em-tile flex size-[52px] items-center justify-center rounded-[10px] bg-[#0a2a63] text-white lg:size-[clamp(48px,3.8vw,56px)]">
                <Icon aria-hidden="true" strokeWidth={1.8} className="size-[48%]" />
              </span>

              <h3 className="mt-6 text-[22px] font-medium uppercase leading-tight text-[#002461] lg:mt-[clamp(22px,2.1vw,30px)] lg:text-[clamp(20px,1.65vw,24px)]">
                {title}
              </h3>
              <p className="mt-4 text-[15px] leading-snug text-[#002461] lg:mt-[clamp(14px,1.4vw,20px)] lg:text-[clamp(14px,1.05vw,15px)]">
                {text}
              </p>

              <ul className="mt-6 grid gap-4 lg:mt-[clamp(20px,1.9vw,28px)] lg:gap-[clamp(14px,1.4vw,20px)]">
                {points.map((label, j) => (
                  <li
                    key={label}
                    className="em-point flex items-center gap-3 text-[15px] text-[#002461] lg:text-[clamp(14px,1.05vw,15px)]"
                    style={{ "--j": j }}
                  >
                    <StarIcon sizeClass="size-[20px]" />
                    {label}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </ProcessMotion>
    </section>
  );
}

import { Eye, Target } from "lucide-react";

// "Our Mission" / "Our Vision": two pale-blue cards side by side (stacked on phones), each with a
// dark-blue icon tile (a target for the mission, an eye for the vision), a title and the copy.
// Same width as the hero above (max-w-[69rem]).
const CARDS = [
  {
    id: "mission",
    title: "Our Mission",
    icon: Target,
    text:
      "With a mission to develop the client’s performance in their business, our company is sincerely working harder for showing profit-oriented results to their clients all over the World. We provide a consultative session to help the client in articulating the right web-based solution to solve their business challenge.",
  },
  {
    id: "vision",
    title: "Our Vision",
    icon: Eye,
    text:
      "TechZarInfo team has been delivering innovative, cost-effective, and timely solutions that drive the growth of small and medium-sized businesses worldwide. TechZarInfo with a strong team of high-quality professionals and management instilling matured processes, help forward-thinking companies achieve and surpass their business goals.",
  },
];

export default function AboutMissionVision() {
  return (
    <section aria-label="Our mission and vision" data-guide="aboutMissionVision" className="bg-white px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
      <div className="mx-auto grid max-w-[69rem] grid-cols-1 gap-5 md:grid-cols-2 md:gap-[clamp(1.25rem,3.4vw,3rem)]">
        {CARDS.map(({ id, title, icon: Icon, text }) => (
          <article
            key={id}
            aria-labelledby={`about-${id}`}
            className="rounded-xl bg-[#e8f3fe] p-5 transition-shadow duration-300 hover:shadow-[0_14px_36px_-18px_rgba(10,80,165,0.3)] sm:p-6 lg:p-[clamp(1.25rem,1.8vw,1.75rem)]"
          >
            <div className="flex items-center gap-3 lg:gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-[#2a6ee6] to-[#0b2f8a] text-white shadow-[0_6px_14px_-6px_rgba(11,47,138,0.6)] lg:size-12">
                <Icon className="size-5 lg:size-6" strokeWidth={2} aria-hidden="true" />
              </span>
              <h2 id={`about-${id}`} className="text-[22px] font-medium tracking-tight text-[#1b2f6e] sm:text-[26px] lg:text-[clamp(26px,2.1vw,30px)]">
                {title}
              </h2>
            </div>
            <p className="mt-4 text-[15px] leading-snug text-[#1d2f63] sm:text-[17px] lg:mt-5 lg:text-[clamp(17px,1.3vw,19px)]">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

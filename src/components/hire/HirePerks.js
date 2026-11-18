import Image from "next/image";
import { Layers, ShieldCheck, Zap } from "lucide-react";

// "Major Perks on Hiring Development Team from Techzarinfo": the laptop illustration on the left
// over a soft lavender glow; heading, intro and three perk cards on the right. Desktop follows the
// 1440px design: art from ~3vw at ~32vw wide, copy from ~42vw to the site's 10.35vw right edge.
// Below lg the art sits centred above the copy; the cards go three across from sm, stacked below.
// Cards lift on hover like the Careers job cards.
//
// Art: public/hire-a-developer/majore-perk.webp, rendered at 2x from the supplied majore-perk.webp
// (a 1.3 MB PNG-in-SVG), transparent background kept.
const PERKS = [
  {
    title: "Flexibility",
    text: "Scale your team up or down as your needs evolve.",
    icon: Layers,
    tile: "bg-[#efe8ff] text-[#7c3aed]",
  },
  {
    title: "Cost saving",
    text: "Get top talent without the overhead of full time hiring",
    icon: Zap,
    tile: "bg-[#e3f1ff] text-[#1f6ff0]",
  },
  {
    title: "Transparency",
    text: "Stay in control with clear processes and open communication",
    icon: ShieldCheck,
    tile: "bg-[#dff7e8] text-[#16a34a]",
  },
];

export default function HirePerks() {
  return (
    <section
      aria-labelledby="hire-perks-title"
      data-guide="hirePerks"
      className="relative isolate overflow-hidden bg-white px-4 py-16 sm:px-6 lg:py-[clamp(4rem,6vw,6rem)] lg:pr-[clamp(2rem,10.35vw,11rem)] lg:pl-[3vw]"
    >
      {/* Soft lavender glow behind the laptop, fading to white */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 34% 55% at 16% 62%, rgba(232,214,255,0.85) 0%, rgba(243,234,255,0.5) 45%, rgba(255,255,255,0) 75%)",
        }}
      />

      <div className="mx-auto grid max-w-3xl grid-cols-1 items-center gap-10 lg:mx-0 lg:max-w-none lg:grid-cols-[32vw_minmax(0,1fr)] lg:gap-[6.8vw]">
        <Image
          src="/hire-a-developer/majore-perk.webp"
          alt="A laptop showing a code symbol, with developer profile cards rising behind it"
          width={1384}
          height={996}
          sizes="(min-width: 1024px) 36vw, min(96vw, 31rem)"
          // ~12% larger than its column on desktop, spilling evenly into the free space either side
          // (so the copy column doesn't move)
          className="mx-auto h-auto w-[min(96%,31rem)] lg:-mx-[6%] lg:w-[112%] lg:max-w-none"
        />

        <div>
          <h2
            id="hire-perks-title"
            className="max-w-[18em] text-[28px] font-medium leading-[1.2] tracking-tight text-[#0f2a6b] sm:text-[34px] lg:text-[clamp(30px,2.6vw,38px)]"
          >
            Major Perks on Hiring Development Team from Techzarinfo
          </h2>
          <p className="mt-4 text-[15px] leading-snug text-[#1d2f63] sm:text-[17px] lg:text-[clamp(16px,1.25vw,18px)]">
            Through contract staffing, your vision gains clarity, your strategy gains direction, and your business gains
            real momentum. Our IT experts not only turn your complex ideas into scalable digital solutions, you will get
            a lot of benefits &amp; perks through our staff augmentation services. Here is the list of primary
            advantages.
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:mt-[clamp(2rem,3.4vw,3rem)] lg:gap-[clamp(1rem,1.7vw,1.5rem)]">
            {PERKS.map(({ title, text, icon: Icon, tile }) => (
              <li
                key={title}
                className="rounded-xl border border-[#cfe0fb] bg-linear-to-b from-white to-[#eef4ff] p-5 shadow-[0_10px_30px_rgba(10,80,165,0.08)] transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(10,80,165,0.14)] motion-reduce:transition-none lg:p-[clamp(1rem,1.5vw,1.4rem)]"
              >
                <span className={`flex size-8 items-center justify-center rounded-lg ${tile}`}>
                  <Icon className="size-4" strokeWidth={2.2} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-[20px] font-medium text-[#0f2a6b] lg:text-[clamp(20px,1.7vw,24px)]">{title}</h3>
                <p className="mt-3 text-[14px] leading-snug text-[#4b5a85] lg:text-[clamp(14px,1.1vw,16px)]">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

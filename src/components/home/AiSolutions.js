import Image from "next/image";
import Link from "next/link";
import AiSequence from "./AiSequence";

// Asset paths supplied by design.
const BACKGROUND = "/home/hero-background.png";
const BOT = "/home/ai-development/ai bot 1.webp";
// Transparent copies of the supplied icon files (originals sit alongside in /home/ai-development).
const ICONS = "/home/ai-development/icons/";

// left/top: % position of each item's icon centre inside the Figma frame (586 x 455).
// lines: the label's line breaks in the design (used from lg up; smaller screens wrap naturally).
const features = [
  { lines: ["AI Voice Agent", "- AI That Talks"], icon: ICONS + "voice.png", left: 24.1, top: 34.7 },
  { lines: ["AI RAG Bot - AI", "That Knows"], icon: ICONS + "rag.png", left: 28.8, top: 53.8 },
  { lines: ["AI Autonomous", "Agent - AI That Acts"], icon: ICONS + "agent.png", left: 50, top: 67 },
  { lines: ["AI Workflow", "Automation - AI That", "Gets Work Done"], icon: ICONS + "workflow.png", left: 72.5, top: 53.6 },
  { lines: ["AI Multimodal - AI That", "Sees & Understands"], icon: ICONS + "multimodal.png", left: 75.6, top: 34.1 },
];

// The supplied icons are 88px frames (1440px design) with the bubble centred inside.
const ICON = "h-16 w-16 lg:h-[clamp(40px,6.11cqw,88px)] lg:w-[clamp(40px,6.11cqw,88px)]";

function Label({ lines }) {
  return lines.map((line, i) => (
    <span key={line}>
      {i > 0 && <br className="hidden lg:block" />}
      {i > 0 && <span className="lg:hidden"> </span>}
      {line}
    </span>
  ));
}

export default function AiSolutions() {
  return (
    <section data-guide="ai" className="relative bg-[#dcecfb]">
      <AiSequence className="lg:h-[620svh]">
      <div className="ai-stage relative overflow-hidden lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-end lg:justify-center">
      {BACKGROUND ? (
        <Image src={BACKGROUND} alt="" fill sizes="100vw" className="object-cover object-center" />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(135deg,#eef6ff_0%,#cfe4fa_55%,#eaf4ff_100%)]"
        />
      )}

      <div className="relative mx-auto w-full max-w-[1440px] [container-type:inline-size] lg:mx-0 lg:w-[min(100%,1440px,calc((100svh_-_4.5rem)*586/455))]">
        <div className="px-4 py-12 sm:px-6 sm:py-16 lg:relative lg:aspect-[586/455] lg:p-0">
          {/* Heading */}
          <div className="text-center lg:absolute lg:inset-x-0 lg:top-[3.4%]">
            <h2 data-seq="title" className="mx-auto max-w-[640px] text-[32px] font-semibold leading-[1.2] text-[#002148] sm:text-[40px] lg:max-w-none lg:text-[clamp(20px,3.33cqw,48px)]">
              Step Into the Future with Our <br className="hidden lg:block" />
              AI Development Solutions
            </h2>
            <p data-seq="sub" className="mx-auto mt-4 max-w-[560px] text-[16px] leading-[1.45] text-[#002148] sm:text-[18px] lg:mt-[1.7cqw] lg:max-w-none lg:text-[clamp(9px,1.39cqw,20px)]">
              Want to turn your entire business into an AI-Powered Business? -{" "}
              <br className="hidden lg:block" />
              Our AI development solutions make it possible
            </p>
          </div>

          {/* Centre visual */}
          <div data-seq="bot" className="relative z-10 mx-auto mt-8 w-[64%] max-w-[300px] lg:absolute lg:left-[35.4%] lg:top-[20.6%] lg:mt-0 lg:w-[29.2%] lg:max-w-none">
            <Image
              src={BOT}
              alt="AI assistant"
              width={1104}
              height={1425}
              unoptimized
              className="h-auto w-full"
            />
          </div>

          {/* Features: around the bot on desktop, a grid beneath it on smaller screens */}
          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:mt-0 lg:block">
            {features.map(({ lines, icon, left, top }) => (
              <li
                key={lines[0]}
                data-seq="item"
                className="z-0 flex flex-col items-center text-center lg:absolute lg:left-[var(--l)] lg:top-[calc(var(--t)-3.05cqw)] lg:-translate-x-1/2 lg:whitespace-nowrap"
                style={{ "--l": `${left}%`, "--t": `${top}%` }}
              >
                <span className={`block ${ICON}`}>
                  {icon && (
                    <Image src={icon} alt="" width={60} height={60} unoptimized className="h-full w-full object-contain" />
                  )}
                </span>
                <span className="mt-1 text-[16px] leading-[1.45] text-[#002148] sm:text-[18px] lg:-mt-[0.4cqw] lg:text-[clamp(9px,1.39cqw,20px)]">
                  <Label lines={lines} />
                </span>
              </li>
            ))}
          </ul>

          {/* Call to action */}
          <div className="mt-10 text-center lg:mt-0">
            <p data-seq="cta" className="text-[24px] leading-[1.2] text-[#002148] sm:text-[28px] lg:absolute lg:inset-x-0 lg:top-[83.6%] lg:text-[clamp(14px,2.36cqw,34px)]">
              Have an AI Vision? Let&rsquo;s Build It
            </p>
            <Link
              data-seq="cta"
              href="/demo"
              className="mt-4 inline-flex items-center justify-center rounded-[3px] bg-[#002148] px-6 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#003070] sm:text-[16px] lg:absolute lg:left-1/2 lg:top-[92.1%] lg:mt-0 lg:h-[3.05cqw] lg:w-[12.5cqw] lg:-translate-x-1/2 lg:p-0 lg:whitespace-nowrap lg:text-[clamp(8px,1.11cqw,16px)]"
            >
              Book a Free Demo
            </Link>
          </div>
        </div>
      </div>
      </div>
      </AiSequence>
    </section>
  );
}

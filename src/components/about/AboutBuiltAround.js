import Image from "next/image";
import { Star } from "lucide-react";

// "Built Around Your Business, Not Just Technology": heading, intro and four strengths (each with
// a round blue star badge) on the left; the meeting-room photo on the right. Same width as the
// sections above (max-w-[69rem]); below lg the photo moves under the text.
//
// Photo: public/about/buildaround.webp, rendered from the supplied buildaround.svg (a PNG wrapped
// in SVG, 3.7 MB) at twice its 495 x 521 size, so the crop is exactly the SVG's.
const POINTS = ["Consultative Approach", "Enterprise Security Mindset", "Agile Engineering Processes", "Transparent Communication"];

export default function AboutBuiltAround() {
  return (
    <section aria-labelledby="about-built-around" data-guide="aboutBuiltAround" className="bg-white px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
      <div className="mx-auto grid max-w-[69rem] grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.18fr)_minmax(0,1fr)] lg:gap-[clamp(2.5rem,4.5vw,4.5rem)]">
        <div>
          <h2
            id="about-built-around"
            className="max-w-[17em] text-[28px] font-semibold leading-[1.18] tracking-tight text-[#0f2a6b] sm:text-[34px] lg:text-[clamp(34px,2.8vw,40px)]"
          >
            Built Around Your Business, Not Just Technology
          </h2>
          <p className="mt-4 max-w-[38rem] text-[15px] leading-snug text-[#1d2f63] sm:text-[17px] lg:text-[clamp(17px,1.3vw,19px)]">
            Techzarinfo brings together energetic, curious, and committed software engineers, architects, and digital
            consultants. We specialize in turning intricate technical requirements into streamlined, user-centered
            digital solutions
          </p>

          <ul className="mt-8 space-y-5 lg:mt-[clamp(2rem,3.2vw,2.75rem)] lg:space-y-[clamp(1.25rem,1.9vw,1.75rem)]">
            {POINTS.map((point) => (
              <li key={point} className="flex items-center gap-3 text-[15px] text-[#1d2f63] sm:text-[17px] lg:gap-4 lg:text-[clamp(17px,1.3vw,19px)]">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#4f8ff7] to-[#1f5fd6] text-white shadow-[0_4px_10px_-4px_rgba(31,95,214,0.7)] lg:size-8">
                  <Star className="size-3.5 lg:size-4" strokeWidth={2.2} aria-hidden="true" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-[31rem] overflow-hidden rounded-xl shadow-[0_24px_60px_-28px_rgba(0,36,97,0.35)] lg:max-w-none">
          <Image
            src="/about/buildaround.webp"
            alt="A Techzarinfo consultant presenting to a client team in a glass-walled meeting room"
            width={990}
            height={1042}
            sizes="(min-width: 1024px) 31rem, (min-width: 640px) 31rem, calc(100vw - 2rem)"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}

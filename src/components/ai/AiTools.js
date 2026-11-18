"use client";

import { useEffect, useRef } from "react";
import Reveal from "@/components/common/Reveal";

// "Tech Tools We Utilize for AI Product Development" and "Why Pick Techzarinfo..." on the AI page,
// after the features section. Black, like the end of the features section (which fades into it), so
// the two flow together; the copy rises in with the site's Reveal.
//
// The tools: app-icon tiles scattered in a dark glass panel lit blue from below, as in the design.
// When the panel comes into view they pop out of its centre to their places one after another;
// hovering (or tapping) a tile bounces it, squashing and stretching like a ball.

const BG = "#05070c";

// Tile centre (share of the panel), tilt, tile colour; from the design
const TOOLS = [
  { name: "DeepSeek", src: "deepseek", x: 0.511, y: 0.25, r: -6, bg: "#fff" },
  { name: "Hugging Face", src: "huggingface", x: 0.638, y: 0.35, r: 8, bg: "#fff" },
  { name: "Kimi", src: "kimi", x: 0.456, y: 0.49, r: 0, bg: "#1c1c1e" },
  { name: "TensorFlow", src: "tensorflow", x: 0.65, y: 0.63, r: 14, bg: "#fff" },
  { name: "Azure AI", src: "azure-ai", x: 0.563, y: 0.74, r: -4, bg: "#fff" },
  { name: "React", src: "react", x: 0.731, y: 0.78, r: 4, bg: "#fff" },
  { name: "Claude", src: "claude", x: 0.382, y: 0.815, r: 8, bg: "#d97757" },
  { name: "OpenAI", src: "openai", x: 0.269, y: 0.83, r: -4, bg: "#fff" },
];

export default function AiTools() {
  const panelRef = useRef(null);

  // Tiles pop in once the panel is on screen
  useEffect(() => {
    const panel = panelRef.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      panel.dataset.in = "1";
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        panel.dataset.in = "1";
        io.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    io.observe(panel);
    return () => io.disconnect();
  }, []);

  return (
    <section
      data-guide="aiTools"
      aria-labelledby="ai-tools-title"
      className="relative px-4 pb-[clamp(4rem,9vw,7rem)] pt-[clamp(3rem,7vw,5.5rem)] text-white sm:px-6"
      style={{ backgroundColor: BG }}
    >
      <Reveal className="mx-auto max-w-[44rem] text-center">
        <h2
          id="ai-tools-title"
          className="mx-auto max-w-[34rem] text-[28px] font-semibold leading-[1.18] tracking-tight sm:text-[36px] lg:text-[clamp(36px,2.9vw,44px)]"
        >
          Tech Tools We Utilize for AI Product Development
        </h2>
        <p className="mx-auto mt-3 max-w-[36rem] text-[14px] leading-snug text-white/75 sm:text-[15px] lg:text-[16px]">
          Our AI/ML engineers stay aligned with modern AI technologies to deliver high-performance intelligent systems.
        </p>
      </Reveal>

      {/* The tools panel */}
      <Reveal className="mx-auto mt-[clamp(2.5rem,6vw,4.5rem)] w-full max-w-[42rem]">
        <div
          ref={panelRef}
          className="group/panel relative aspect-[674/390] w-full overflow-hidden rounded-[clamp(14px,2vw,22px)] border border-white/20 [container-type:inline-size]"
          style={{
            background:
              "radial-gradient(120% 75% at 50% 112%, rgba(96,128,230,0.95) 0%, rgba(58,82,170,0.55) 32%, rgba(18,24,48,0.15) 62%, transparent 78%), linear-gradient(180deg, #06080f 0%, #070a14 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 40px rgba(120,150,255,0.08), 0 30px 80px -30px rgba(70,100,220,0.45)",
          }}
        >
          <ul aria-label="AI tools we use" className="absolute inset-0">
            {TOOLS.map(({ name, src, x, y, r, bg }, i) => (
              <li
                key={name}
                className="ai-tool absolute size-[10.6cqw] min-h-9 min-w-9"
                style={{
                  left: `${x * 100}%`,
                  top: `${y * 100}%`,
                  "--r": `${r}deg`,
                  "--dx": `${(0.5 - x) * 100}cqw`,
                  "--dy": `${(0.5 - y) * 58}cqw`,
                  transitionDelay: `${i * 70}ms`,
                }}
              >
                <button
                  type="button"
                  aria-label={name}
                  className="ai-tool-bounce block size-full rounded-[24%] outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  <span
                    className="grid size-full place-items-center rounded-[24%] shadow-[0_6px_16px_-4px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.6)]"
                    style={{ background: bg, rotate: "var(--r)" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- small static SVG logos */}
                    <img src={`/service/AI/tools/${src}.svg`} alt="" className="size-[62%]" draggable="false" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* Why pick us */}
      <Reveal className="mx-auto mt-[clamp(4rem,9vw,7rem)] max-w-[44rem]">
        <h2 className="text-[26px] font-semibold leading-[1.2] tracking-tight sm:text-[34px] lg:text-[clamp(34px,2.7vw,42px)]">
          Why Pick Techzarinfo As Your Custom AI Development Company Partner?
        </h2>
        <p className="mt-5 text-[15px] leading-relaxed text-white/85 sm:text-[16px] lg:text-[17px]">
          Techzarinfo is a leading custom AI development company with 13+ years of experience in the artificial intelligence
          era. Our AI/ML engineers are highly talented &amp; experienced in working on multiple AI projects as per the needs
          &amp; requirements of the clients. We use highly advanced algorithms for making your AI powered products that will
          evolve your brand as unique in the market. Our technical team will provide 24×7 support, you can get updates
          regarding the project at any time. Get ready to transform your business with our AI consulting to enhance your human
          capabilities and increase performance for more effective results across your organization. Book your free AI
          consultation with us to launch your dream project.
        </p>
      </Reveal>
    </section>
  );
}

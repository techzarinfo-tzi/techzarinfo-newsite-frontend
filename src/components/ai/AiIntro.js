// "AI Software Development" intro on the Artificial Intelligence page. Rendered inside AiHeroStage,
// which scrolls it up over the pinned hero: a tall gradient (transparent -> the hero's dark) lets it
// emerge out of the hero's darkness, the heading rises in (--ai-h) and the paragraph's words light
// up one by one as it scrolls (--r, --i, --n). Without the stage's script every variable falls back
// to its finished state, so the section always reads in full.

const BG = "#02050d";

const TEXT =
  "AI software development is the process of developing intelligent software that learns from data, automates complex tasks, predicts outcomes, and adapts to business needs. Our AI development solutions can help your organization with 10× smarter operations, 5× faster workflows, and 24/7 intelligent assistance to maximize efficiency and accelerate business growth";

export default function AiIntro() {
  const words = TEXT.split(" ");

  return (
    <section data-guide="aiIntro" aria-labelledby="ai-intro-title" className="relative text-white">
      {/* Emerges out of the hero: from clear to the hero's dark, eased so no band shows */}
      <div
        data-ai-fade
        aria-hidden="true"
        className="h-[42svh]"
        style={{
          background: `linear-gradient(to bottom, rgba(2,5,13,0) 0%, rgba(2,5,13,0.06) 18%, rgba(2,5,13,0.2) 34%, rgba(2,5,13,0.42) 50%, rgba(2,5,13,0.66) 66%, rgba(2,5,13,0.86) 82%, ${BG} 100%)`,
        }}
      />

      <div style={{ backgroundColor: BG }} className="-mt-px px-4 pb-28 pt-6 sm:px-6 lg:pb-44">
        <div className="mx-auto max-w-[62rem] text-center">
          <h2
            id="ai-intro-title"
            data-ai-heading
            className="text-[28px] font-semibold leading-[1.2] tracking-tight sm:text-[36px] lg:text-[clamp(36px,3vw,48px)] motion-reduce:transform-none!"
            style={{
              opacity: "var(--ai-h, 1)",
              transform: "translate3d(0, calc((1 - var(--ai-h, 1)) * 40px), 0)",
              filter: "blur(calc((1 - var(--ai-h, 1)) * 6px))",
            }}
          >
            AI Software Development: Built for Smarter Business Operations
          </h2>

          <p
            data-ai-words
            className="mx-auto mt-6 max-w-[56rem] text-[16px] leading-[1.7] sm:text-[18px] lg:mt-8 lg:text-[clamp(18px,1.45vw,22px)]"
            style={{ "--n": words.length }}
          >
            {words.map((word, i) => (
              <span
                key={i}
                className="transition-opacity duration-150 ease-out"
                style={{
                  "--i": i,
                  opacity: "clamp(0.22, calc(0.22 + (var(--r, 1) * var(--n) - var(--i)) * 0.78), 1)",
                }}
              >
                {word}
                {i < words.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

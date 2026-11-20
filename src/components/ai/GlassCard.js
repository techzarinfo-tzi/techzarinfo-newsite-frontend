import { BrainCircuit } from "lucide-react";

// Shared by the AI page's film sections (AiIsland, AiApproach). The sheen reads --p from the stage.
// Apple-style glass: translucent frosted fill, fine light border with a brighter top edge, layered
// soft shadows, a gentle reflection on the upper half and a light sheen that glides across as the
// card moves.
//
// sizeSet: every card in the section ({ title, text }). Their contents are stacked invisibly in the
// same grid cell as this card's own, so the card is as tall as the tallest of them at any width:
// all cards in a section come out exactly the same size (widths are set by the section), with no
// measuring. Hidden copies are invisible and aria-hidden, so they are never seen or read out.
function Content({ title, text, icon: Icon = BrainCircuit, sizer = false }) {
  const Title = sizer ? "div" : "h3";
  return (
    <>
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/35 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
          <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
        </span>
        <Title className="max-w-[11rem] text-[16px] font-semibold leading-tight tracking-tight [text-shadow:0_1px_12px_rgba(0,0,0,0.35)] lg:text-[clamp(16px,1.2vw,19px)]">
          {title}
        </Title>
      </div>
      <p className="mt-3 text-[14px] leading-relaxed text-white/85 [text-shadow:0_1px_10px_rgba(0,0,0,0.45)] lg:mt-4 lg:text-[clamp(14px,1vw,16px)]">
        {text}
      </p>
    </>
  );
}

export default function GlassCard({ title, text, icon, sizeSet = [] }) {
  return (
    <div
      className="ai-glass relative overflow-hidden rounded-[22px] border border-white/25 p-5 lg:p-6"
      style={{
        background: "linear-gradient(150deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.05) 100%)",
        backdropFilter: "blur(22px) saturate(170%)",
        WebkitBackdropFilter: "blur(22px) saturate(170%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.06), 0 24px 60px -18px rgba(0,0,0,0.5), 0 6px 18px -6px rgba(0,0,0,0.25)",
      }}
    >
      {/* Reflection on the upper half */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/12 to-transparent"
      />
      {/* Sheen, gliding across with the scroll */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 motion-reduce:hidden"
        style={{
          background: "linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.13) 50%, transparent 62%)",
          backgroundSize: "300% 100%",
          backgroundPosition: "calc(100% - var(--p) * 260%) 0",
        }}
      />
      <div className="relative grid">
        {/* Sizers: the other cards' contents, invisible, in the same cell */}
        {sizeSet.map((card, k) => (
          <div key={k} aria-hidden="true" className="invisible [grid-area:1/1]">
            <Content title={card.title} text={card.text} sizer />
          </div>
        ))}
        <div className="[grid-area:1/1]">
          <Content title={title} text={text} icon={icon} />
        </div>
      </div>
    </div>
  );
}

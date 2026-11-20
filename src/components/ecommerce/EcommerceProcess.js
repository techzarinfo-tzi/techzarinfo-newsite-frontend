import { Fragment } from "react";
import Image from "next/image";
import ProcessMotion from "@/components/ecommerce/ProcessMotion";

const DIAGRAM = "/ecommerce/development-process/development-process.webp";
const DIAGRAM_W = 1251;
const DIAGRAM_H = 844;

// Animated diagram (opt-in, `animated`): the artwork is split into pieces, each a full-size copy of
// the same image clipped to one region, so every piece lines up pixel for pixel with the original.
// Regions are [left, top, right, bottom] in the asset's native pixels (1147 x 774), kept from
// overlapping so the soft shadows never double up. Order: the centre, then each card clockwise
// followed by the arrow leading out of it; `dir` is the way that arrow points (it draws that way).
const NATIVE_W = 1147;
const NATIVE_H = 774;
const CENTRE = [462, 185, 684, 436];
const PIECES = [
  { card: [195, 0, 388, 275], arrow: [390, 80, 478, 122], dir: "r" }, // Idea
  { card: [478, 0, 668, 184], arrow: [670, 80, 758, 122], dir: "r" }, // Define
  { card: [758, 0, 950, 275], arrow: [970, 110, 1065, 215], dir: "d" }, // Estimation
  { card: [940, 240, 1130, 445], arrow: [975, 445, 1050, 555], dir: "d" }, // Design
  { card: [760, 428, 940, 700], arrow: [670, 530, 758, 572], dir: "l" }, // Development
  { card: [478, 470, 668, 745], arrow: [390, 530, 478, 572], dir: "l" }, // Testing
  { card: [195, 430, 388, 700], arrow: [95, 449, 192, 545], dir: "u" }, // Live
  { card: [20, 240, 212, 448] }, // Support
];

const pct = (v, total) => `${((v / total) * 100).toFixed(3)}%`;

// clip-path insets for a region, and (for arrows) the collapsed start it draws out from
function insets([l, t, r, b], dir) {
  let top = t, right = r, bottom = b, left = l;
  if (dir === "r") right = l;
  if (dir === "l") left = r;
  if (dir === "d") bottom = t;
  if (dir === "u") top = b;
  return `inset(${pct(top, NATIVE_H)} ${pct(NATIVE_W - right, NATIVE_W)} ${pct(NATIVE_H - bottom, NATIVE_H)} ${pct(left, NATIVE_W)})`;
}

function Piece({ region, dir, kind, delay, loopDelay }) {
  const [l, t, r, b] = region;
  return (
    <div
      aria-hidden="true"
      className={`proc-piece proc-${kind} absolute inset-0`}
      style={{
        "--clip": insets(region),
        "--clip-from": dir ? insets(region, dir) : undefined,
        "--d": `${delay}s`,
        "--loop-d": loopDelay !== undefined ? `${loopDelay}s` : undefined,
        transformOrigin: `${pct((l + r) / 2, NATIVE_W)} ${pct((t + b) / 2, NATIVE_H)}`,
      }}
    >
      <Image src={DIAGRAM} alt="" width={DIAGRAM_W} height={DIAGRAM_H} className="h-auto w-full" />
    </div>
  );
}

// Timing: the centre pops first, then a card every STEP seconds with its arrow just after; once the
// whole flow is in, the steps take turns lifting, one every LOOP_STEP seconds (8 x 1.4s cycle).
const START = 0.45;
const STEP = 0.34;
const LOOP_START = START + STEP * PIECES.length + 0.6;
const LOOP_STEP = 1.4;

function AnimatedDiagram() {
  return (
    <div data-proc-watch className="relative">
      {/* Sizes the box (and keeps the original spacing); the pieces paint over it */}
      <Image
        src={DIAGRAM}
        alt=""
        width={DIAGRAM_W}
        height={DIAGRAM_H}
        className="invisible h-auto w-full"
        style={{ marginBottom: "-8.6%" }}
      />
      <Piece region={CENTRE} kind="centre" delay={0} />
      {PIECES.map((p, i) => (
        <Fragment key={i}>
          <Piece region={p.card} kind="card" delay={START + i * STEP} loopDelay={LOOP_START + i * LOOP_STEP} />
          {p.arrow && <Piece region={p.arrow} dir={p.dir} kind="arrow" delay={START + i * STEP + 0.2} />}
        </Fragment>
      ))}
    </div>
  );
}

// The flow in the design's order. icon = top-left of that step's 64px icon circle inside the
// diagram asset, so the stacked (tablet/mobile) layout reuses the exact same artwork.
const steps = [
  { title: "Idea", text: "We listen, Understand and turn your ideas into possibilities", icon: [286, 4] },
  { title: "Define", text: "We define the scope, features and functionality.", icon: [592, 4] },
  { title: "Estimation", text: "We analyze and provide accurate time and cost estimation", icon: [897, 4] },
  { title: "Design", text: "We design UI/UX that delivers great experiences", icon: [1090, 272] },
  { title: "Development", text: "We build powerful, scalable and secure solutions.", icon: [897, 475] },
  { title: "Testing", text: "We test thoroughly to ensure quality and bug free delivery", icon: [592, 516] },
  { title: "Live", text: "We deploy and launch your product to the world", icon: [286, 475] },
  { title: "Support", text: "We provide ongoing support and maintenance", icon: [95, 272] },
];

// A window onto part of the diagram asset at its native scale (crisp, no re-drawing).
function DiagramCrop({ x, y, w, h, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`block bg-no-repeat ${className}`}
      style={{
        width: w,
        height: h,
        backgroundImage: `url("${DIAGRAM}")`,
        backgroundSize: `${DIAGRAM_W}px ${DIAGRAM_H}px`,
        backgroundPosition: `-${x}px -${y}px`,
      }}
    />
  );
}

function ArrowDown() {
  return (
    <svg viewBox="0 0 24 40" className="mx-auto h-10 w-6 text-[#094fa4]" fill="none" aria-hidden="true">
      <path d="M12 2v34M4 28l8 9 8-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Desktop (lg+): the design's circular flow, shown as the provided artwork at up to its native
// 1251px width, so cards, icons, connectors and arrows line up exactly as designed. Its card text
// would be unreadably small on narrower screens, so below lg the same eight steps are laid out as
// a vertical flow of real cards (icons and centre artwork cropped from the same asset), joined by
// down arrows in the same order. That list stays available to screen readers on desktop too.
// Also used on the Mobile App page with its own heading and no intro (pass text={null}).
const DEFAULT_TEXT =
  "Every business is unique, so we take a custom approach to each project based on your specific requirements.";

export default function EcommerceProcess({
  guide = "ecommerceProcess",
  title = "Our E-commerce Website Development Process",
  text = DEFAULT_TEXT,
  animated = false,
}) {
  // Animated: the section content sits in ProcessMotion, which plays the pieces as they scroll in
  const Wrap = animated ? ProcessMotion : "div";
  return (
    <section data-guide={guide} className="relative bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <Wrap>
      <h2 className="mx-auto max-w-[620px] text-center text-[28px] font-semibold leading-[1.25] tracking-tight text-[#002461] sm:text-[34px] lg:text-[42px]">
        {title}
      </h2>
      {text && (
        <p className="mx-auto mt-3 max-w-[680px] text-center text-base leading-[1.3] text-[#002461] lg:text-[19px]">
          {text}
        </p>
      )}

      {/* Desktop: the designed circular flow */}
      <div className="mx-auto mt-[100px] hidden max-w-[1251px] lg:block">
        {animated ? (
          <AnimatedDiagram />
        ) : (
          <Image
            src={DIAGRAM}
            alt=""
            width={DIAGRAM_W}
            height={DIAGRAM_H}
            className="h-auto w-full"
            style={{ marginBottom: "-8.6%" }} /* the asset has empty space below the last row */
          />
        )}
      </div>

      {/* Tablet / mobile: the same flow, stacked */}
      <div className="mt-10 lg:sr-only">
        <figure className="flex flex-col items-center" aria-hidden="true">
          <DiagramCrop x={518} y={209} w={212} h={216} className="scale-90 sm:scale-100" />
          <figcaption className="mt-1 text-base font-bold tracking-wide text-[#032684]">PROCESS</figcaption>
        </figure>

        <ol className="mx-auto max-w-[340px] pt-8">
          {steps.map(({ title, text, icon }, i) => (
            <li key={title}>
              {i > 0 && (
                <div data-proc-watch className="proc-m-arrow py-3">
                  <ArrowDown />
                </div>
              )}
              <div data-proc-watch className="proc-m-card relative mt-8 rounded-xl border-[1.5px] border-[#c7e0ff] bg-white px-5 pt-10 pb-5 text-center shadow-[0_14px_30px_-12px_rgba(10,80,165,0.3)]">
                <DiagramCrop
                  x={icon[0]}
                  y={icon[1]}
                  w={64}
                  h={64}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-full"
                />
                <h3 className="text-[15px] font-bold uppercase tracking-wide text-[#1a3b93]">
                  <span className="sr-only">Step {i + 1}: </span>
                  {title}
                </h3>
                <p className="mt-2 text-[15px] leading-normal text-[#3d4c8d]">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      </Wrap>
    </section>
  );
}

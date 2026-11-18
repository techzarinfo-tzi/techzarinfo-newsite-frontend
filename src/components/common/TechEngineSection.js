import Image from "next/image";

// A technologies section: centred heading and one-line intro, then a row of logo tiles in a zigzag
// that runs like an engine. First built for the Blockchain page; shared, so the design and motion
// live here and pages pass only their content.
//
// Props:
//   guide      the AI Guide step (data-guide) for the section
//   title      the heading
//   intro      the line under it
//   tools      [{ name, src, low, slot }], left to right: `low` tiles sit one row down so the row
//              zigzags; `slot` is the tile's place in the engine's firing order (0..n-1)
//   tileSize   the tile size (--t), a CSS length; by default it shrinks on small screens so the
//              whole row always fits the width
//   titleWidth the heading's max-width class
//
// Each tile is --t square with the logo centred at 76% of it; neighbours step just over a tile
// across and alternate a row up/down, so the tiles meet corner to corner.
// Animation (globals.css .engine-*): the tiles run like an inline engine. Each fires every second
// crank turn, one n-th of that two-turn cycle after the last (--fire), and strokes once per turn
// with its top dead centre at the firing point (--tdc). Logos turn like meshing gears and the row
// shakes as it runs.
export default function TechEngineSection({
  guide,
  title,
  intro,
  tools,
  tileSize,
  titleWidth = "max-w-[720px]",
}) {
  const n = tools.length;
  // Fit the whole row in the screen width: n tiles at ~1.05 tiles' pitch, plus the side padding
  const size = tileSize ?? `clamp(30px, calc((100vw - 2rem) / ${(n * 1.05 + 0.2).toFixed(2)}), 84px)`;

  return (
    <section data-guide={guide} className="bg-white px-4 pt-14 pb-16 text-center sm:px-6 sm:pt-16 sm:pb-20 lg:px-8 lg:pt-[88px] lg:pb-[164px]">
      <h2 className={`mx-auto ${titleWidth} text-[32px] font-semibold leading-[1.25] tracking-tight text-[#002461] sm:text-[34px] lg:text-[40px]`}>
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-[620px] text-[15px] leading-[1.45] text-[#002461] sm:text-lg lg:mt-1 lg:text-[19px]">{intro}</p>

      <ul
        className="engine-block mx-auto mt-12 flex w-max items-start gap-[calc(var(--t)*0.048)] sm:mt-16 lg:mt-[136px]"
        style={{ "--t": size }}
      >
        {tools.map(({ name, src, low, slot }, i) => (
          <li
            key={name}
            className="engine-piston flex aspect-square w-(--t) items-center justify-center rounded-[calc(var(--t)*0.2)] border border-white bg-linear-to-b from-[#f1f3fe] to-[#e2e7fb] shadow-[0_10px_24px_rgba(84,104,214,0.18)]"
            style={{
              "--fire": slot / n,
              "--tdc": ((2 * slot) / n) % 1,
              ...(low && { marginTop: "calc(var(--t) * 1.02)" }),
            }}
          >
            <Image
              src={encodeURI(src)}
              alt={name}
              title={name}
              width={64}
              height={64}
              unoptimized
              className={`engine-gear h-auto w-[calc(var(--t)*0.762)] ${i % 2 ? "engine-gear-rev" : ""}`}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

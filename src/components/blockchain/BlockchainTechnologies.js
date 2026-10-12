import Image from "next/image";

const DIR = "/service/blockchain/blockchain-tools";

// Left to right, as in the design. `low` tiles sit one row down, so the row zigzags.
// `slot` is the tile's place in the straight-six firing order 1-5-3-6-2-4 (see .engine-* in globals.css).
const tools = [
  { name: "Cardano", file: "cardano 1.svg", low: true, slot: 0 },
  { name: "BNB Smart Chain", file: "binance-smart-chain 2.svg", low: false, slot: 4 },
  { name: "Polygon", file: "polygon 2.svg", low: true, slot: 2 },
  { name: "Ethereum", file: "ethereum 2.svg", low: false, slot: 5 },
  { name: "Solana", file: "solana 1.svg", low: true, slot: 1 },
  { name: "Hyperledger", file: "hyperledger 1.svg", low: false, slot: 3 },
];

// Centred heading and one-line intro from the 1440px design, then six logo tiles in a zigzag: each
// tile is 84px with the 64px logo centred, neighbours step 88px across and alternate a row up/down,
// so the tiles meet corner to corner. Everything is sized from --t (tile size), which shrinks on
// small screens so the whole row always fits the width.
// Animation: the tiles run like a straight-six engine. Each fires every second crank turn, one
// sixth of that two-turn cycle after the last (--fire), and strokes once per turn with its top dead
// centre at the firing point (--tdc). Logos turn like meshing gears and the row shakes on each firing.
export default function BlockchainTechnologies() {
  return (
    <section className="bg-white px-4 pt-14 pb-16 text-center sm:px-6 sm:pt-16 sm:pb-20 lg:px-8 lg:pt-[88px] lg:pb-[164px]">
      <h2 className="mx-auto max-w-[720px] text-[26px] font-semibold leading-[1.25] tracking-tight text-[#002461] sm:text-[34px] lg:text-[40px]">
        Technologies We Use for Blockchain Application Development
      </h2>
      <p className="mx-auto mt-2 max-w-[620px] text-[15px] leading-[1.45] text-[#002461] sm:text-lg lg:mt-1 lg:text-[19px]">
        We leverage the latest blockchain platforms and technologies.
      </p>

      <ul className="engine-block mx-auto mt-12 flex w-max items-start gap-[calc(var(--t)*0.048)] [--t:clamp(48px,14vw,84px)] sm:mt-16 lg:mt-[136px]">
        {tools.map(({ name, file, low, slot }, i) => (
          <li
            key={name}
            className="engine-piston flex aspect-square w-(--t) items-center justify-center rounded-[calc(var(--t)*0.2)] border border-white bg-linear-to-b from-[#f1f3fe] to-[#e2e7fb] shadow-[0_10px_24px_rgba(84,104,214,0.18)]"
            style={{
              "--fire": slot / 6,
              "--tdc": (slot / 3) % 1,
              ...(low && { marginTop: "calc(var(--t) * 1.02)" }),
            }}
          >
            <Image
              src={encodeURI(`${DIR}/${file}`)}
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

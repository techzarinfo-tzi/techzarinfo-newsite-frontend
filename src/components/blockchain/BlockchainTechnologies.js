import TechEngineSection from "@/components/common/TechEngineSection";

const DIR = "/service/blockchain/blockchain-tools";

// Left to right, as in the design. `low` tiles sit one row down, so the row zigzags.
// `slot` is the tile's place in the straight-six firing order 1-5-3-6-2-4 (see .engine-* in globals.css).
const tools = [
  { name: "Cardano", src: `${DIR}/cardano 1.webp`, low: true, slot: 0 },
  { name: "BNB Smart Chain", src: `${DIR}/binance-smart-chain 2.webp`, low: false, slot: 4 },
  { name: "Polygon", src: `${DIR}/polygon 2.webp`, low: true, slot: 2 },
  { name: "Ethereum", src: `${DIR}/ethereum 2.webp`, low: false, slot: 5 },
  { name: "Solana", src: `${DIR}/solana 1.webp`, low: true, slot: 1 },
  { name: "Hyperledger", src: `${DIR}/hyperledger 1.webp`, low: false, slot: 3 },
];

// The Blockchain page's six platform logos on the shared engine-row technologies section
// (common/TechEngineSection.js). Tiles 84px, shrinking to 14vw (never under 48px) on small screens.
export default function BlockchainTechnologies() {
  return (
    <TechEngineSection
      guide="bcTech"
      title="Technologies We Use for Blockchain Application Development"
      intro="We leverage the latest blockchain platforms and technologies."
      tools={tools}
      tileSize="clamp(48px,14vw,84px)"
    />
  );
}

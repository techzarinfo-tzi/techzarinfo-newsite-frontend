import ErpTechnologies from "@/components/erp/ErpTechnologies";

const CHAINS = "/service/blockchain/blockchain-tools/";
const TECH = "/service/crypto/technologies/";

// The crypto exchange stack from the design, on the ERP arch's tile spots (in % of the arch box):
// the same outer six, with Kubernetes in the middle in place of the ERP page's two inner tiles.
// order/depth as on the ERP page (entrance from the top outwards; outer tiles drift more).
const tiles = [
  { name: "Solidity", src: `${TECH}solidity.svg`, x: 14.4, y: 75.3, order: 4, depth: 0.9 },
  { name: "Polygon", src: `${CHAINS}polygon 2.svg`, x: 23.2, y: 44, order: 3, depth: 0.7 },
  { name: "BNB Chain", src: `${CHAINS}binance-smart-chain 2.svg`, x: 33.5, y: 22.7, order: 1, depth: 0.5 },
  { name: "Ethereum", src: `${CHAINS}ethereum 2.svg`, x: 49, y: 13.3, order: 0, depth: 0.25 },
  { name: "Kubernetes", src: `${TECH}kubernetes.svg`, x: 49, y: 45.6, order: 2, depth: 0.35 },
  { name: "React", src: `${TECH}react.svg`, x: 63.6, y: 22.7, order: 1, depth: 0.5 },
  { name: "Node.js", src: `${TECH}nodejs.svg`, x: 74.6, y: 44, order: 3, depth: 0.7 },
  { name: "Docker", src: `${TECH}docker.svg`, x: 82.9, y: 75.3, order: 4, depth: 0.9 },
];

// The ERP page's technologies arch (same tiles, motion and layout), with the crypto exchange
// page's content and logos. The heading runs a little wider so it breaks into the design's two lines.
export default function CryptoTechnologies() {
  return (
    <ErpTechnologies
      title="Technologies We Use for Our Crypto Exchange Software Development"
      guide="cryptoTech"
      tiles={tiles}
      titleWidth="max-w-[560px] xl:max-w-[720px]"
    >
      As the best crypto exchange software solution providers of this business, we always utilizes
      highly sophisticated tools and technologies for crypto exchange software development
    </ErpTechnologies>
  );
}

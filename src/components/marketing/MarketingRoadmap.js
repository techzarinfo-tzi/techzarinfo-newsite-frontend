import { RoadmapSection } from "@/components/blockchain/BlockchainRoadmap";

// The Blockchain page's roadmap (same S-curve, nodes, numerals, draw-in animation and mobile
// timeline), with the five digital marketing steps from the design. The design places its nodes at
// the top, the left bend, part-way down the middle run, the right bulge and the lower diagonal, so
// each step carries its own node, numeral and copy positions (canvas px, as in BlockchainRoadmap.js).
const steps = [
  {
    title: "Discovery",
    text: "We understand your business, audience, goals and lead requirements.",
    icon: "search",
    node: [407, 67],
    num: [367, 148],
    at: [441, 153],
    w: 300,
  },
  {
    title: "Strategy",
    text: "We build a focused digital marketing plan around the channels that fit your growth goals.",
    icon: "target",
    node: [53, 374],
    num: [139, 311],
    at: [233, 316],
    w: 340,
  },
  {
    title: "Launch",
    text: "We launch campaigns, optimize pages and execute the strategy.",
    icon: "rocket",
    node: [319, 569],
    num: [175, 638],
    at: [274, 653],
    w: 320,
  },
  {
    title: "Optimize",
    text: "We improve performance through data, testing and ongoing refinements.",
    icon: "gear",
    node: [666, 773],
    num: [590, 848],
    at: [693, 853],
    w: 305,
  },
  {
    title: "Scale",
    text: "We scale the strategies that drive the best traffic, leads and business results.",
    icon: "trend",
    node: [318, 1123],
    num: [410, 1088],
    at: [503, 1093],
    w: 340,
  },
];

export default function MarketingRoadmap() {
  return (
    <RoadmapSection guide="marketingRoadmap" title="Our Digital Marketing Process" content={steps} />
  );
}

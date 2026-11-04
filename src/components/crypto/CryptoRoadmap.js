import { RoadmapSection } from "@/components/blockchain/BlockchainRoadmap";

// The Blockchain page's roadmap (same S-curve, nodes, numerals, draw-in animation and mobile
// timeline), with the crypto exchange development steps from the design, top to bottom. The icons
// match the Blockchain steps in the same positions, as in the design.
const steps = [
  { title: "Requirement Analysis", text: "Understand client goals and define key features" },
  { title: "Design and Prototyping", text: "Create wireframes and UI/UX for seamless user experience" },
  { title: "Development", text: "Code the exchange platform using cutting-edge tools and technologies." },
  { title: "Testing and QA", text: "Perform rigorous testing to ensure security and performance" },
  { title: "Deployment", text: "Launch the platform with live user monitoring" },
  { title: "Post-Launch Support", text: "Provide maintenance, updates, and feature enhancements" },
];

export default function CryptoRoadmap() {
  return (
    <RoadmapSection
      guide="cryptoRoadmap"
      title="Powerful AI Integrations for Your Crypto Exchange Software Development"
      titleWidth="max-w-[820px]"
      content={steps}
    />
  );
}

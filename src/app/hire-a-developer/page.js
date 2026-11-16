import ProductHero from "@/components/common/ProductHero";
import RevealEach from "@/components/common/RevealEach";
import HireWhyExpert from "@/components/hire/HireWhyExpert";
import HirePerks from "@/components/hire/HirePerks";
import HireEveryStack from "@/components/hire/HireEveryStack";
import ErpTechnologies from "@/components/erp/ErpTechnologies";
import HeroButton from "@/components/common/HeroButton";
import { TailorMadeSection } from "@/components/lms/LmsTailorMade";
import HireProcess from "@/components/hire/HireProcess";
import HireCommitments from "@/components/hire/HireCommitments";

// Capability / Agility / Infrastructure, then Experience / Quality Testing / End-to-End Services:
// the LMS "Tailor-Made" section (TailorMadeSection, as reused by the CRM, CMMS and SMS pages), with
// the client's six cards as two sets, so the first three grow out of the triangle on entry and the
// second three swap in while the section is pinned. Card positions are the LMS page's, as in the
// design (top left, right, bottom left); every card uses the laptop icon, plain, as in the design.
const STRENGTH_SLOTS = [
  {
    place: "xl:left-[13.2%] xl:top-[12%]",
    cards: [
      {
        icon: "it",
        title: "CAPABILITY",
        text: "A team of capable developers, designers, testers, and project managers with access to the latest tools, technologies, and technology stacks.",
      },
      {
        icon: "it",
        title: "EXPERIENCE",
        text: "A rich and variant experience in delivering a range of projects for enterprises and startups across different industry segments.",
      },
    ],
  },
  {
    place: "xl:right-[6%] xl:top-[26.4%]",
    cards: [
      {
        icon: "it",
        title: "AGILITY",
        text: "An agile approach that gets your project done within the minimal time span while adhering to the highest standards and best practices.",
      },
      {
        icon: "it",
        title: "QUALITY TESTING",
        text: "Focus on delivering flawless products that are made to undergo rigorous testing to ensure that they perform seamlessly.",
      },
    ],
  },
  {
    // Tablet: the odd slot out spans the 2-column grid, centred at one column's width
    place: "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-10px)] lg:col-span-1 lg:w-auto xl:left-[13.2%] xl:top-[74.3%]",
    cards: [
      {
        icon: "it",
        title: "INFRASTRUCTURE",
        text: "Best-in-class infrastructure and collaborative work environment that are aimed at driving for optimum productivity in workflow and processes.",
      },
      {
        icon: "it",
        title: "END-TO-END SERVICES",
        text: "Delivery of end-to-end services for quick deployments, shorter delivery cycles, and reduced probability of failure.",
      },
    ],
  },
];

// "Onboard Our Experts by Skills": the ERP page's technology arch (ErpTechnologies), reused as is
// with this page's tiles and copy. Tile centres are the design's, in % of the arch box (the
// design's full width and the band from the top tile to the bottom tiles, as on the ERP page);
// order: entrance order from the top outwards; depth: pointer drift. The three Kubernetes tiles
// use separate copies of the logo, as the component keys tiles by image path.
const BLOCKCHAIN = "/service/blockchain/blockchain-tools/";
const TECH = "/service/crypto/technologies/";
const SKILLS = [
  { name: "Solidity", src: `${TECH}solidity.svg`, x: 15.5, y: 75.8, order: 4, depth: 0.9 },
  { name: "Polygon", src: `${BLOCKCHAIN}polygon 2.svg`, x: 24.4, y: 44.5, order: 3, depth: 0.7 },
  { name: "BNB Chain", src: `${BLOCKCHAIN}binance-smart-chain 2.svg`, x: 34.9, y: 22.8, order: 1, depth: 0.5 },
  { name: "Kubernetes", src: `${TECH}kubernetes.svg`, x: 39.8, y: 45.8, order: 2, depth: 0.35 },
  { name: "Ethereum", src: `${BLOCKCHAIN}ethereum 2.svg`, x: 50.7, y: 13.3, order: 0, depth: 0.25 },
  { name: "Kubernetes", src: "/hire-a-developer/skills/kubernetes-2.svg", x: 50.7, y: 33.8, order: 1, depth: 0.3 },
  { name: "Kubernetes", src: "/hire-a-developer/skills/kubernetes-3.svg", x: 61.7, y: 45.8, order: 2, depth: 0.35 },
  { name: "React", src: `${TECH}react.svg`, x: 65.5, y: 22.8, order: 1, depth: 0.5 },
  { name: "Node.js", src: `${TECH}nodejs.svg`, x: 76.9, y: 44.5, order: 3, depth: 0.7 },
  { name: "Docker", src: `${TECH}docker.svg`, x: 85.3, y: 74.1, order: 4, depth: 0.9 },
];

const path = "/hire-a-developer";

export const metadata = {
  title: "Hire Dedicated Software Developers",
  description:
    "Hire a developer to build secure, scalable web, mobile, and enterprise software customized to your business needs, with full-stack developers, cloud engineers, and Claude AI developers.",
  alternates: {
    canonical: path,
  },
};

// Hero: the shared product hero (common/ProductHero.js), as on the SMS page. Per the design the
// artwork (public/hire-a-developer/hero/hire-a-dev-hero.webp, rendered at 2x from the supplied
// hire-a-dev-hero.svg, a 3.6 MB PNG-in-SVG) sits level with the copy, ~47vw wide, just in from the
// right edge.
export default function HireADeveloperPage() {
  return (
    <RevealEach>
      <ProductHero
        guide="hireHero"
        lines={[
          <>
            Hire <span className="text-[#2e5aa8]">Our Dedicated</span>
          </>,
          "Software Developers",
        ]}
        description="Hire a developer to build secure, scalable web, mobile, and enterprise software customized to your business needs. Our expert team includes full-stack developers, cloud engineers, and Claude AI developers to create intelligent applications and automation solutions."
        descriptionClassName="lg:max-w-[680px]"
        buttons={[
          { label: "Get a Free Quote", href: "/contact-us" },
          { label: "Book a Free Consultation", href: "/contact-us", variant: "secondary" },
        ]}
        image={{
          src: "/hire-a-developer/hero/hire-a-dev-hero.webp",
          alt: "A developer working at a desk in a creative studio, with code on screen and an inspiration wall",
          width: 1510,
          height: 1220,
        }}
        artClassName="ml-auto w-[min(92%,640px)] lg:absolute lg:top-[clamp(110px,15.6vw,236px)] lg:right-[2.6vw] lg:ml-0 lg:w-[47vw]"
      />
      <HireWhyExpert />
      <HirePerks />
      <HireEveryStack />
      <ErpTechnologies
        guide="hireSkills"
        tiles={SKILLS}
        titleWidth="max-w-none"
        title={
          <>
            Onboard Our Experts
            <br />
            by Skills
          </>
        }
      >
        We are having talented and skilled developers who work hard to turn your ideas into strong, scalable digital
        solutions. If you need any other specialized skills for your project, we can find the right people to fit what
        you&rsquo;re looking for.
        {/* The design's button; the component's copy block is a paragraph, so it rides in as a block span */}
        <span className="mt-8 block">
          <HeroButton label="Send Request" href="#contact" />
        </span>
      </ErpTechnologies>
      {/* Heading and intro as in the design screenshot, until this page's own copy is supplied */}
      <TailorMadeSection
        guide="hireStrengths"
        title="Tailor-Made White Label LMS for Corporate Training App Development"
        text="Discover the potential of a tailored Learning Management System designed to meet your organization's unique training needs"
        slots={STRENGTH_SLOTS}
      />
      <HireProcess />
      <HireCommitments />
    </RevealEach>
  );
}

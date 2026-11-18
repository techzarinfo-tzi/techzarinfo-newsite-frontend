import ProductHero from "@/components/common/ProductHero";
import RevealEach from "@/components/common/RevealEach";
import WebTrusted from "@/components/web/WebTrusted";
import FeatureDriveSection from "@/components/common/FeatureDriveSection";
import WebServicesList from "@/components/web/WebServicesList";
import TechEngineSection from "@/components/common/TechEngineSection";
import Faq from "@/components/common/Faq";
import EcommerceCta from "@/components/ecommerce/EcommerceCta";

// FAQ: the shared accordion (common/Faq.js), as on the other pages, with this page's questions
const FAQ = [
  {
    q: "What services does a website development company in Chennai offer?",
    a: "Website development, custom web applications, e-commerce, SaaS solutions, and maintenance.",
  },
  {
    q: "How much does website development cost in Chennai?",
    a: "Costs depend on project complexity, features, design, and integrations.",
  },
  {
    q: "How long does website development take?",
    a: "A basic website may take weeks, while complex applications can take several months.",
  },
  {
    q: "Do you develop custom web applications for startups?",
    a: "Yes, we build tailored applications, MVPs, and SaaS products for startups.",
  },
  {
    q: "Do you serve clients outside Chennai?",
    a: "Yes, we collaborate remotely with businesses across India and globally.",
  },
  {
    q: "Do you provide website maintenance?",
    a: "Yes, maintenance can include bug fixes, security updates, and performance improvements.",
  },
];

// Technologies: the Blockchain page's engine-row section (common/TechEngineSection.js) with web
// technologies. Logos reused from the CRM/crypto and ERP pages where they exist; Next.js,
// TypeScript, MongoDB and MySQL are Simple Icons brand marks (CC0) in their brand colours.
// low: zigzag (alternate tiles one row down, starting low as on the Blockchain page); slot: firing
// order, stepping 4 places each time so neighbouring tiles fire far apart.
const WEB_TECH = [
  { name: "React.js", src: "/service/crypto/technologies/react.svg" },
  { name: "Next.js", src: "/service/website-page/technologies/nextjs.svg" },
  { name: "Node.js", src: "/service/crypto/technologies/nodejs.svg" },
  { name: "HTML5", src: "/product/ERP/utilize/html 1.webp" },
  { name: "CSS3", src: "/product/ERP/utilize/css 1.webp" },
  { name: "JavaScript", src: "/product/ERP/utilize/js 1.webp" },
  { name: "TypeScript", src: "/service/website-page/technologies/typescript.svg" },
  { name: "MongoDB", src: "/service/website-page/technologies/mongodb.svg" },
  { name: "MySQL", src: "/service/website-page/technologies/mysql.svg" },
].map((tool, i, all) => ({ ...tool, low: i % 2 === 0, slot: (i * 4) % all.length }));
import { ChartColumn, Handshake, Layers, LifeBuoy, Settings, ShieldCheck, TrendingUp, UserStar } from "lucide-react";
import { withSeo } from "@/lib/seo";

// "Why Choose Techzarinfo for Website Development?": the LMS page's tilted cards that drive sideways
// on scroll (common/FeatureDriveSection.js), with this page's heading and eight points
const WHY_CHOOSE = {
  heading: {
    title: "Why Choose Techzarinfo for Website Development?",
    text: "Selecting a development partner is an important business decision. You need a team that understands your requirements, communicates clearly, and builds software with long-term usability in mind.",
  },
  features: [
    {
      icon: <Layers />,
      title: "Custom-built solutions",
      text: "Development tailored to your business model, workflows, and customer expectations.",
    },
    {
      icon: <Settings />,
      title: "Technical expertise",
      text: "Access to web development capabilities across frontend, backend, databases, APIs, and integrations.",
    },
    {
      icon: <UserStar />,
      title: "Clear project communication",
      text: "Defined requirements, milestone reviews, and visibility into development progress.",
    },
    {
      icon: <ChartColumn />,
      title: "Quality-focused delivery",
      text: "Testing and validation to help ensure the platform works as intended before launch.",
    },
    {
      icon: <ShieldCheck />,
      title: "Security-conscious engineering",
      text: "Appropriate access controls, secure coding practices, and data protection measures based on the project.",
    },
    {
      icon: <TrendingUp />,
      title: "Scalable foundations",
      text: "Architecture and implementation choices that account for expected growth and future requirements.",
    },
    {
      icon: <Handshake />,
      title: "Flexible engagement",
      text: "Project-based development or ongoing collaboration, depending on the scope and agreed working model.",
    },
    {
      icon: <LifeBuoy />,
      title: "Post-launch assistance",
      text: "Support for maintenance, issue resolution, technical updates, and further development where agreed.",
    },
  ],
};

const path = "/web-development-company-in-chennai";

export const metadata = withSeo({
  title: "Website Development Company in Chennai",
  description:
    "Build a powerful digital presence with custom websites and web applications designed around your business goals, from startup platforms and enterprise applications to e-commerce stores and SaaS products.",
  alternates: {
    canonical: path,
  },
});

// Hero: the shared product hero (common/ProductHero.js), as on the SMS and Hire a Developer pages.
// Per the design the monitor artwork (public/service/website-page/hero/website-hero.webp, rendered
// at 2x from the supplied website-hero.svg, a 2.3 MB PNG-in-SVG, transparent margin included) sits
// ~8vw down at ~46vw wide, just in from the right edge; "Development" and "in Chennai" take the
// lighter blue.
export default function WebDevelopmentCompanyPage() {
  return (
    <RevealEach>
      <ProductHero
        guide="webHero"
        lines={[
          <>
            Website <span className="text-[#2e5aa8]">Development</span>
          </>,
          <>
            Company <span className="text-[#2e5aa8]">in Chennai</span>
          </>,
        ]}
        description="Build a powerful digital presence with custom websites and web applications designed around your business goals. From startup platforms and enterprise applications to e-commerce stores and SaaS products, we deliver end-to-end website solutions that support growth, improve efficiency, and create better customer experiences."
        buttons={[
          { label: "Get a Free Quote", href: "/contact-us" },
          { label: "Book a Free Consultation", href: "/contact-us", variant: "secondary" },
        ]}
        image={{
          src: "/service/website-page/hero/website-hero.webp",
          alt: "A desktop monitor showing a modern website with the headline 'Build something great, together.'",
          width: 1320,
          height: 1056,
        }}
        artClassName="ml-auto w-[min(92%,600px)] lg:absolute lg:top-[clamp(90px,7.8vw,120px)] lg:right-[3vw] lg:ml-0 lg:w-[46vw]"
      />
      <WebTrusted />
      <FeatureDriveSection guide="webWhyChoose" heading={WHY_CHOOSE.heading} features={WHY_CHOOSE.features} />
      <WebServicesList />
      <TechEngineSection
        guide="webTech"
        title="Technologies We Use for Web Development"
        intro="Technology stacks are the backbone of your architected software. We build your software with the latest and top core technologies"
        tools={WEB_TECH}
      />
      {/* Wrapper only carries the AI Guide stop (the shared Faq component stays untouched) */}
      <div data-guide="webFaq">
        <Faq title="Frequently Asked Questions" items={FAQ} />
      </div>
      {/* Closing call to action: the shared CTA banner (as on the E-commerce and LMS pages) */}
      <EcommerceCta
        guide="webCta"
        title="Ready to Start Your Web Development Project?"
        text="Whether you need a high-converting business website, a custom web application, or a full-scale SaaS platform, our team is ready to turn your vision into a reliable, high-performing product. Share your requirements and we will respond with a tailored proposal and estimate."
      />
    </RevealEach>
  );
}

import IndustriesSphere from "@/components/industries/IndustriesSphere";
import { withSeo } from "@/lib/seo";

const path = "/industries";

export const metadata = withSeo({
  title: "Industries We Serve",
  description:
    "Industry solutions from TechZarinfo help your business get the most value from your IT investments: automotive, finance, e-governance, IT, engineering, manufacturing, education, healthcare, sports, media, oil & gas and construction.",
  alternates: {
    canonical: path,
  },
});

const IMG = "/industries/web";

// Copy as on the current techzarinfo.com industries page. Images are web-sized copies of the
// supplied PNGs (public/industries), matched to each card by what they show, as in the design.
const INDUSTRIES = [
  {
    title: "Media / Publishing",
    image: `${IMG}/media.webp`,
    text: "TechZarInfo renders cutting-edge solutions including content platforms, e-publishing, and media collectives that are fully functional across the entire industry.",
  },
  {
    title: "Engineering",
    image: `${IMG}/engineering.webp`,
    text: "TechZarInfo renders cutting-edge solutions including content platforms, e-publishing, and media collectives that are fully functional across the entire industry.",
  },
  {
    title: "Manufacturing",
    image: `${IMG}/manufacturing.webp`,
    text: "Our Manufacturing solutions incorporate ERP and inventory management systems with web applications for enhanced data and legacy migration.",
  },
  {
    title: "Sports",
    image: `${IMG}/sports.webp`,
    text: "we at TechZarInfo provide Sports Technology analysis with pioneer custom-built technology for various sports.",
  },
  {
    title: "Oil & Gas",
    image: `${IMG}/oilgas.webp`,
    text: "To contrive supply chain collaboration TechZarInfo develops end-to-end Oil & Gas business solutions focusing on dealer management, CRM, and ERP solutions.",
  },
  {
    title: "Education",
    image: `${IMG}/education.webp`,
    text: "Inventive virtual learning solutions from TechZarInfo are focus on taking classroom learning a grade higher. Integrating solutions with industry excellence enables TechZarInfo to deliver top-notch solutions.",
  },
  {
    title: "E-Governance",
    image: `${IMG}/egovernance.webp`,
    text: "TechZarInfo IT services enable government IT departments to improve citizen services, more transparency increase efficiency, and keeps data more secure. We have worked directly with the government IT.",
  },
  {
    title: "Financial Service",
    image: `${IMG}/financial.webp`,
    text: "The finance industry needs an efficient distribution model. IT solutions contribute by TechZarInfo focuses on data assets, development of mobile wallets, and well-made financial applications.",
  },
  {
    title: "Health Care",
    image: `${IMG}/healthcare.webp`,
    text: "TechZarInfo is one of the leading software providers for the healthcare industry. we work with healthcare organizations to identify their needs and develop customized versions to meet their exact requirements.",
  },
  {
    title: "Automotive",
    image: `${IMG}/automotive.webp`,
    text: "To contrive supply chain collaboration and diversify product offerings, TechZarInfo develops end-to-end Oil & Gas business solutions focusing on dealer management, CRM, and ERP solutions.",
  },
  {
    title: "Information Technology",
    image: `${IMG}/information.webp`,
    text: "Whether you are seeking solutions for Accounting, Research, and Development, Architecture and Business Process Management, or Marketing Project Management, TechZarInfo offers branch-out customization.",
  },
  {
    title: "Construction & Telecom",
    image: `${IMG}/construction.webp`,
    text: "Manage your construction field from office and Business comes easy",
  },
];

export default function IndustriesPage() {
  return (
    <>
      <h1 className="sr-only">Industries We Serve</h1>
      <IndustriesSphere industries={INDUSTRIES} />
    </>
  );
}

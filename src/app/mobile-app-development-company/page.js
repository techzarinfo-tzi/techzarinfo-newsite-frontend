import ProductHero from "@/components/common/ProductHero";
import RevealEach from "@/components/common/RevealEach";
import MobileHeroArt from "@/components/mobile/MobileHeroArt";
import MobileAppServices from "@/components/mobile/MobileAppServices";
import MobileWhyChoose from "@/components/mobile/MobileWhyChoose";
import EcommerceProcess from "@/components/ecommerce/EcommerceProcess";
import MobileEngagementModels from "@/components/mobile/MobileEngagementModels";
import MobileIndustries from "@/components/mobile/MobileIndustries";
import { withSeo } from "@/lib/seo";

const path = "/mobile-app-development-company";

const DESCRIPTION =
  "The mobile application development services in Chennai, India, have become a highly competitive and dynamic industry, with numerous companies striving to claim the top spot. Among them, TZI stands out as one of the best mobile app development companies in Chennai due to its innovative and cost-effective approach. With a track record of delivering successful applications, TZI is steadily earning recognition as a household name in the industry.";

export const metadata = withSeo({
  title: "Mobile App Development Company in Chennai",
  description:
    "TZI is one of the best mobile app development companies in Chennai, delivering innovative, cost-effective iOS, Android and cross-platform applications.",
  alternates: {
    canonical: path,
  },
});

// Hero: the shared product hero (common/ProductHero.js), as on the Web Development and Hire a
// Developer pages. Per the design the artwork (phone with floating cloud/AI/API tiles,
// components/mobile/MobileHeroArt.js) sits ~11vw down at ~33vw wide, just in from the right edge.
export default function MobileAppDevelopmentPage() {
  return (
    <RevealEach>
      <ProductHero
        guide="mobileHero"
        lines={["Mobile App Development", "Company in Chennai"]}
        description={DESCRIPTION}
        descriptionClassName="lg:w-[46vw] lg:max-w-[720px]"
        buttons={[
          { label: "Get a Free Quote", href: "/contact-us" },
          { label: "Book a Free Consultation", href: "/contact-us", variant: "secondary" },
        ]}
        art={<MobileHeroArt />}
        artClassName="mx-auto w-[min(80%,420px)] pb-10 lg:absolute lg:top-[clamp(90px,11.4vw,170px)] lg:right-[3vw] lg:mx-0 lg:w-[33vw] lg:pb-0"
      />
      <MobileAppServices />
      <MobileWhyChoose />
      {/* The E-commerce page's circular process diagram (same eight steps), with this page's heading */}
      <EcommerceProcess guide="mobileProcess" title="Our App Development Process" text={null} animated />
      <MobileEngagementModels />
      <MobileIndustries />
    </RevealEach>
  );
}

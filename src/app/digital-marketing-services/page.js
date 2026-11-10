import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingGrowOnline from "@/components/marketing/MarketingGrowOnline";
import MarketingWhyChoose from "@/components/marketing/MarketingWhyChoose";
import MarketingRoadmap from "@/components/marketing/MarketingRoadmap";
import MarketingIndustries from "@/components/marketing/MarketingIndustries";
import MarketingOffers from "@/components/marketing/MarketingOffers";
import MarketingFaq from "@/components/marketing/MarketingFaq";
import RevealEach from "@/components/common/RevealEach";

const path = "/digital-marketing-services";

export const metadata = {
  title: "Digital Marketing Company in Chennai",
  description:
    "Techzarinfo is a digital marketing company in Chennai helping businesses grow through SEO, Google Ads, Meta Ads, and social media marketing focused on visibility, qualified leads, and conversions.",
  alternates: {
    canonical: path,
  },
};

export default function DigitalMarketingServicesPage() {
  return (
    <RevealEach>
      <MarketingHero />
      <MarketingGrowOnline />
      <MarketingWhyChoose />
      <MarketingRoadmap />
      <MarketingIndustries />
      <MarketingOffers />
      <MarketingFaq />
    </RevealEach>
  );
}

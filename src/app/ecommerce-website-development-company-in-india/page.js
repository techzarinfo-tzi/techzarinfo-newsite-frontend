import EcommerceHero from "@/components/ecommerce/EcommerceHero";
import EcommerceServices from "@/components/ecommerce/EcommerceServices";
import EcommerceOfferings from "@/components/ecommerce/EcommerceOfferings";
import ServicesOfferingsTransition from "@/components/ecommerce/ServicesOfferingsTransition";
import EcommerceSolutions from "@/components/ecommerce/EcommerceSolutions";
import EcommerceProcess from "@/components/ecommerce/EcommerceProcess";
import EcommerceWhyChoose from "@/components/ecommerce/EcommerceWhyChoose";
import EcommerceIndustries from "@/components/ecommerce/EcommerceIndustries";
import EcommerceCta from "@/components/ecommerce/EcommerceCta";
import RevealEach from "@/components/common/RevealEach";

const path = "/ecommerce-website-development-company-in-india";

export const metadata = {
  title: "E-commerce Development Company in India",
  description:
    "Launch a high-performing e-commerce website built around your brand and business goals. We develop scalable online stores with seamless shopping experiences.",
  alternates: {
    canonical: path,
  },
};

export default function EcommerceWebsiteDevelopmentPage() {
  return (
    <RevealEach>
      <EcommerceHero />
      <ServicesOfferingsTransition services={<EcommerceServices />} offerings={<EcommerceOfferings />} />
      <EcommerceSolutions />
      <EcommerceProcess />
      <EcommerceWhyChoose />
      <EcommerceIndustries />
      <EcommerceCta />
    </RevealEach>
  );
}

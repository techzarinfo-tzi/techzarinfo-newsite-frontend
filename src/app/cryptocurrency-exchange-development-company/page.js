import CryptoHero from "@/components/crypto/CryptoHero";
import CryptoWhatIs from "@/components/crypto/CryptoWhatIs";
import CryptoServices from "@/components/crypto/CryptoServices";
import CryptoFeatures from "@/components/crypto/CryptoFeatures";
import CryptoRevenue from "@/components/crypto/CryptoRevenue";
import CryptoIndustries from "@/components/crypto/CryptoIndustries";
import CryptoWhyChoose from "@/components/crypto/CryptoWhyChoose";
import CryptoAiIntegrations from "@/components/crypto/CryptoAiIntegrations";
import CryptoRoadmap from "@/components/crypto/CryptoRoadmap";
import CryptoTechnologies from "@/components/crypto/CryptoTechnologies";
import CryptoFaq from "@/components/crypto/CryptoFaq";
import RevealEach from "@/components/common/RevealEach";

const path = "/cryptocurrency-exchange-development-company";

export const metadata = {
  title: "Cryptocurrency Exchange Development Company",
  description:
    "Techzarinfo is a cryptocurrency exchange development company that builds high-end trading platforms with bank-grade security, a lightning-fast trading engine and real launch experience.",
  alternates: {
    canonical: path,
  },
};

export default function CryptocurrencyExchangeDevelopmentPage() {
  return (
    <RevealEach>
      <CryptoHero />
      <CryptoWhatIs />
      <CryptoServices />
      <CryptoFeatures />
      <CryptoRevenue />
      <CryptoIndustries />
      <CryptoWhyChoose />
      <CryptoAiIntegrations />
      <CryptoRoadmap />
      <CryptoTechnologies />
      <CryptoFaq />
    </RevealEach>
  );
}

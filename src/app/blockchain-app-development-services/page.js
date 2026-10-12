import BlockchainHero from "@/components/blockchain/BlockchainHero";
import BlockchainWhatIs from "@/components/blockchain/BlockchainWhatIs";
import BlockchainServices from "@/components/blockchain/BlockchainServices";
import BlockchainCryptoServices from "@/components/blockchain/BlockchainCryptoServices";
import BlockchainWhyChoose from "@/components/blockchain/BlockchainWhyChoose";
import BlockchainBenefits from "@/components/blockchain/BlockchainBenefits";
import BlockchainTechnologies from "@/components/blockchain/BlockchainTechnologies";
import BlockchainRoadmap from "@/components/blockchain/BlockchainRoadmap";

const path = "/blockchain-app-development-services";

export const metadata = {
  title: "Blockchain Development Company",
  description:
    "Build your business on trust, transparency, and security with Techzarinfo's blockchain solutions, from crypto and wallets to smart contracts, DeFi, and Web3.",
  alternates: {
    canonical: path,
  },
};

export default function BlockchainAppDevelopmentServicesPage() {
  return (
    <>
      <BlockchainHero />
      <BlockchainWhatIs />
      <BlockchainServices />
      <BlockchainCryptoServices />
      <BlockchainWhyChoose />
      <BlockchainBenefits />
      <BlockchainTechnologies />
      <BlockchainRoadmap />
    </>
  );
}

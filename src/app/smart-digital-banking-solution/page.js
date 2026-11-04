import BankingHero from "@/components/banking/BankingHero";
import Clients from "@/components/home/Clients";
import BankingSmartInvestment from "@/components/banking/BankingSmartInvestment";
import BankingSolutions from "@/components/banking/BankingSolutions";
import BankingWhoWeServe from "@/components/banking/BankingWhoWeServe";
import BankingTechStack from "@/components/banking/BankingTechStack";
import BankingApproach from "@/components/banking/BankingApproach";
import BankingFaq from "@/components/banking/BankingFaq";
import BankingCta from "@/components/banking/BankingCta";

const path = "/smart-digital-banking-solution";

export const metadata = {
  title: "Digital Banking & Neobank Development Company",
  description:
    "Our digital banking and neobank development services help banks and fintech startups launch secure, scalable platforms using mobile apps, real-time payments, and AI automation.",
  alternates: {
    canonical: path,
  },
};

export default function SmartDigitalBankingSolutionPage() {
  return (
    <>
      <BankingHero />
       <Clients />
      <BankingSmartInvestment />
      <BankingSolutions />
      <BankingWhoWeServe />
      <BankingTechStack />
      <BankingApproach />
      <BankingFaq />
      <BankingCta />
    </>
  );
}

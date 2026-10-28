import ErpHero from "@/components/erp/ErpHero";
import Clients from "@/components/home/Clients";
import ErpWhatIs from "@/components/erp/ErpWhatIs";
import ErpServices from "@/components/erp/ErpServices";
import ErpFeaturesOrbit from "@/components/erp/ErpFeaturesOrbit";
import ErpBenefits from "@/components/erp/ErpBenefits";
import ErpCostEstimator from "@/components/erp/ErpCostEstimator";
import ErpTechnologies from "@/components/erp/ErpTechnologies";
import ErpFaq from "@/components/erp/ErpFaq";

const path = "/erp-software-development";

export const metadata = {
  title: "ERP Software Development Company",
  description:
    "A customized ERP brings your teams, data, and daily operations together in one place. Techzarinfo builds ERP software tailored to how your business runs.",
  alternates: {
    canonical: path,
  },
};

export default function ErpSoftwareDevelopmentPage() {
  return (
    <>
      <ErpHero />
      <Clients />
      <ErpWhatIs />
      <ErpServices />
      <ErpFeaturesOrbit />
      <ErpBenefits />
      <ErpCostEstimator />
      <ErpTechnologies />
      <ErpFaq />
    </>
  );
}

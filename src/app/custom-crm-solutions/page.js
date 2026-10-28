import CrmHero from "@/components/crm/CrmHero";
import Clients from "@/components/home/Clients";
import CrmCustomDevelopment from "@/components/crm/CrmCustomDevelopment";
import CrmOneStopServices from "@/components/crm/CrmOneStopServices";
import CrmBenefits from "@/components/crm/CrmBenefits";
import CrmDecodeLosses from "@/components/crm/CrmDecodeLosses";
import CrmFeatures from "@/components/crm/CrmFeatures";
import CrmWhyRecognized from "@/components/crm/CrmWhyRecognized";
import CrmIndustries from "@/components/crm/CrmIndustries";
import CrmTechnologies from "@/components/crm/CrmTechnologies";

const path = "/custom-crm-solutions";

export const metadata = {
  title: "CRM Development Company",
  description:
    "Every client inquiry can be a revenue-driving opportunity. Techzarinfo offers CRM solutions that help businesses manage valuable client relationships more effectively.",
  alternates: {
    canonical: path,
  },
};

export default function CustomCrmSolutionsPage() {
  return (
    <>
      <CrmHero />
      <Clients />
      <CrmCustomDevelopment />
      <CrmOneStopServices />
      <CrmBenefits />
      <CrmDecodeLosses />
      <CrmFeatures />
      <CrmWhyRecognized />
      <CrmIndustries />
      <CrmTechnologies />
    </>
  );
}

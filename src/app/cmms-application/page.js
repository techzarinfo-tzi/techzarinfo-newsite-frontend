import CmmsHero from "@/components/cmms/CmmsHero";
import Clients from "@/components/home/Clients";
import CmmsAppDevelopment from "@/components/cmms/CmmsAppDevelopment";
import CmmsServices from "@/components/cmms/CmmsServices";
import CmmsFeaturesOrbit from "@/components/cmms/CmmsFeaturesOrbit";
import CmmsBenefits from "@/components/cmms/CmmsBenefits";
import CmmsDataAction from "@/components/cmms/CmmsDataAction";
import CmmsWhyChoose from "@/components/cmms/CmmsWhyChoose";
import CmmsFaq from "@/components/cmms/CmmsFaq";

const path = "/cmms-application";

export const metadata = {
  title: "CMMS Application for Smarter Maintenance",
  description:
    "A Computerized Maintenance Management System (CMMS) to schedule preventive maintenance, manage work orders and track asset performance with less downtime.",
  alternates: {
    canonical: path,
  },
};

export default function CmmsApplicationPage() {
  return (
    <>
      <CmmsHero />
      <Clients />
      <CmmsAppDevelopment />
      <CmmsServices />
      <CmmsFeaturesOrbit />
      <CmmsBenefits />
      <CmmsDataAction />
      <CmmsWhyChoose />
      <CmmsFaq />
    </>
  );
}

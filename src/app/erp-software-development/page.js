import ErpHero from "@/components/erp/ErpHero";
import Clients from "@/components/home/Clients";
import ErpWhatIs from "@/components/erp/ErpWhatIs";

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
    </>
  );
}

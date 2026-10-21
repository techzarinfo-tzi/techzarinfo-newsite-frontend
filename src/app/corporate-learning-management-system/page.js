import Clients from "@/components/home/Clients";
import LmsHero from "@/components/lms/LmsHero";
import LmsWhiteLabel from "@/components/lms/LmsWhiteLabel";
import LmsTailorMade from "@/components/lms/LmsTailorMade";
import LmsFeatureDrive from "@/components/lms/LmsFeatureDrive";
import LmsIndustries from "@/components/lms/LmsIndustries";
import LmsWhyChoose from "@/components/lms/LmsWhyChoose";
import LmsWhichFits from "@/components/lms/LmsWhichFits";
import EcommerceCta from "@/components/ecommerce/EcommerceCta";

const path = "/corporate-learning-management-system";

export const metadata = {
  title: "Learning Management System for Online Training",
  description:
    "A powerful Learning Management System (LMS) for online training that streamlines training, tracks learner progress and supports effective skill development.",
  alternates: {
    canonical: path,
  },
};

export default function CorporateLearningManagementSystemPage() {
  return (
    <>
      <LmsHero />
      <Clients/>
      <LmsWhiteLabel />
      <LmsTailorMade />
      <LmsFeatureDrive />
      <LmsIndustries />
      <LmsWhyChoose />
      <LmsWhichFits />
      {/* The e-commerce page's CTA, with the LMS page's copy */}
      <EcommerceCta
        title="Make Your Next Training Program Easier"
        text="Bring everything together in a learning platform designed around how your teams actually learn."
        guide="lmsCta"
      />
    </>
  );
}

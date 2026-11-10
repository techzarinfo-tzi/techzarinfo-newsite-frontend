import SmsHero from "@/components/sms/SmsHero";
import SmsAiPowered from "@/components/sms/SmsAiPowered";
import SmsTailorMade from "@/components/sms/SmsTailorMade";
import SmsFeatures from "@/components/sms/SmsFeatures";
import SmsSingleStop from "@/components/sms/SmsSingleStop";
import SmsCustomized from "@/components/sms/SmsCustomized";
import SmsAdvantages from "@/components/sms/SmsAdvantages";
import SmsFaq from "@/components/sms/SmsFaq";
import RevealEach from "@/components/common/RevealEach";

// Linked from the Products menu (config/navigation.js)
const path = "/school-management-system-software";

export const metadata = {
  title: "School Management System",
  description:
    "Simplify school operations, automate daily tasks, and keep your entire school connected with one smart platform: Techzarinfo's school management system for modern education.",
  alternates: {
    canonical: path,
  },
};

export default function SchoolManagementSystemSoftwarePage() {
  return (
    <RevealEach>
      <SmsHero />
      <SmsAiPowered />
      <SmsTailorMade />
      <SmsFeatures />
      <SmsSingleStop />
      <SmsCustomized />
      <SmsAdvantages />
      <SmsFaq />
    </RevealEach>
  );
}

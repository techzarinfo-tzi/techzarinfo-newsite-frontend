import { ServicesFan } from "@/components/erp/ErpServices";

// The ERP services fan (same cards, tilts, colours, hover/tap fan-out and mobile stack), with the
// CMMS benefits from the design, left to right. Only the icons are new: each matches its benefit.
const benefits = [
  {
    icon: "productivity",
    title: "Improved Productivity",
    text: "Streamline maintenance tasks, prioritize workflows, and allocate resources efficiently, ultimately boosting overall operational productivity and reducing downtime.",
  },
  {
    icon: "reliability",
    title: "Enhanced Equipment Reliability",
    text: "Regular preventive maintenance schedules and automated alerts help identify potential issues early, ensuring equipment reliability and minimizing unexpected breakdowns.",
  },
  {
    icon: "inventory",
    title: "Optimized Inventory Management",
    text: "Track and manage spare parts and inventory levels effectively, reducing excess inventory costs and ensuring timely availability of essential components for maintenance activities.",
  },
  {
    icon: "compliance",
    title: "Compliance and Reporting Accuracy",
    text: "Maintain compliance with industry regulations by generating accurate and comprehensive maintenance reports, aiding in audits and demonstrating adherence to compliance standards.",
  },
  {
    icon: "insights",
    title: "Data-Driven Decision Making",
    text: "Utilize data analytics and insights derived from maintenance records to make informed decisions, improve maintenance strategies, and allocate resources strategically for better outcomes.",
  },
];

export default function CmmsBenefits() {
  return (
    <ServicesFan
      guide="cmmsBenefits"
      title="What Your Maintenance Team Gains with Our Custom Maintenance Management Software"
      titleWidth="max-w-[880px]"
      services={benefits}
    />
  );
}

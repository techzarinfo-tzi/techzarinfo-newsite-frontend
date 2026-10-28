import Faq from "@/components/common/Faq";

// Questions and the first answer are from the FAQ design. TODO(content): answers 2-5 are drafts
// written from this page's content; replace with approved copy when available.
const items = [
  {
    q: "What is ERP software, and how can it benefit my business?",
    a: "ERP (Enterprise Resource Planning) software is a comprehensive suite of integrated applications that streamline and automate business processes. It helps manage various aspects like accounting, human resources, inventory, sales, and more from a centralized platform. The benefits include improved efficiency, enhanced productivity, better decision-making, and cost savings through process optimization.",
  },
  {
    q: "How can Techzarinfo's ERP software integrate with our existing systems?",
    a: "We connect your ERP with the tools you already use, such as CRM, HRMS, payroll, accounting, and e-commerce platforms, through secure APIs and custom connectors. Your data flows between systems automatically, so your teams don't have to switch between platforms or enter the same information twice.",
  },
  {
    q: "Can Techzarinfo's ERP software be customized to meet our specific business requirements?",
    a: "Yes. Every ERP we build starts from your workflows, departments, and goals. We tailor the modules, features, dashboards, reports, and user roles to how your business actually runs, and we can add new capabilities as your requirements change.",
  },
  {
    q: "What is the implementation process like for Techzarinfo's ERP software?",
    a: "We begin by understanding your processes and requirements, then plan and design the solution with you. After development and testing, we migrate your data, deploy the system, and train your teams. Once you're live, we continue to provide support and maintenance so your ERP keeps running smoothly.",
  },
  {
    q: "Is ERP software suitable for my industry and company size?",
    a: "ERP software benefits businesses of every size, from growing SMEs to large enterprises, across industries such as manufacturing, construction, retail and e-commerce, healthcare, and real estate. We scale the solution to your needs, so you only pay for what your business uses today, with room to grow tomorrow.",
  },
];

export default function ErpFaq() {
  // Wrapper only carries the AI guide tour hook (the shared Faq component stays untouched)
  return (
    <div data-guide="erpFaq">
      <Faq title="Frequently Asked Questions" items={items} />
    </div>
  );
}

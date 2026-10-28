import Faq from "@/components/common/Faq";

// Questions and the first answer are from the FAQ design. TODO(content): answers 2-5 are drafts
// written from this page's content; replace with approved copy when available.
const items = [
  {
    q: "What is a CMMS, and how does it benefit my organization?",
    a: "A Computerized Maintenance Management System (CMMS) is a software that helps streamline maintenance activities, manage assets, track work orders, and optimize maintenance schedules. It enhances efficiency, reduces downtime, and ultimately saves costs for your organization.",
  },
  {
    q: "Can a CMMS integrate with other systems we use in our organization?",
    a: "Yes. We connect your CMMS with the systems you already rely on, such as ERP, inventory, procurement, accounting, and IoT or sensor platforms, through secure APIs and custom connectors. Asset, inventory, and work order data then flows between them automatically, with no double entry.",
  },
  {
    q: "How does a CMMS help in preventive maintenance?",
    a: "A CMMS schedules inspections and maintenance tasks automatically based on time, usage, or equipment condition, and sends alerts before anything is due. Technicians get clear task lists, and every completed job is recorded, so you catch issues early, extend equipment life, and avoid unexpected breakdowns.",
  },
  {
    q: "Can a CMMS support mobile access for remote work or field operations?",
    a: "Yes. Our mobile CMMS applications let technicians receive and update work orders, access asset information and maintenance history, report issues, and log completed tasks from their phones or tablets, wherever they are, with real-time updates for the whole team.",
  },
  {
    q: "Is a cloud-based or on-premise CMMS better for our organization?",
    a: "It depends on your needs. A cloud-based CMMS offers quick setup, lower upfront costs, automatic updates, and access from anywhere, while an on-premise CMMS gives you full control over your data and infrastructure for strict security or compliance requirements. We help you choose the right option and can build either.",
  },
];

export default function CmmsFaq() {
  // Wrapper only carries the AI guide tour hook (the shared Faq component stays untouched)
  return (
    <div data-guide="cmmsFaq">
      <Faq title="Frequently Asked Questions" items={items} />
    </div>
  );
}

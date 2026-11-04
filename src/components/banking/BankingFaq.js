import Faq from "@/components/common/Faq";

// TODO(content): only the first answer comes from the approved design. The other four answers are
// drafts built only from this page's own sections (hero, Smart Investment, Solutions, Tech Stack,
// Approach); replace with approved copy when available.
const items = [
  {
    q: "What is Smart Digital Banking Platform Development?",
    a: "Smart digital banking platform development involves building secure, scalable, and user-friendly banking systems that offer services like account management, payments, lending, and financial analytics. A fintech application development company creates customized platforms tailored to business needs.",
  },
  {
    q: "What features are included in End-to-End Digital Banking Systems?",
    a: "End-to-end digital banking systems include mobile and web banking, real-time payments, digital wallets, card issuing, multi-user access, invoicing and payment tools, and cash flow insights. They are built on security and compliance foundations such as AML/KYC, fraud detection and role-based access, with open banking APIs, microservices infrastructure and admin and analytics dashboards.",
  },
  {
    q: "Do you provide Custom Fintech Software Development Services?",
    a: "Yes. We build custom fintech platforms for banks, fintech startups, payment service providers, investment and wealth firms, and corporate enterprises, including white label neobanking, wealth management platforms, lending platforms, payment gateways, embedded finance and Banking-as-a-Service.",
  },
  {
    q: "How long does Fintech and Digital Banking Platform Development take?",
    a: "The timeline depends on the scope, features and integrations your platform needs. Our approach runs from strategy and compliance planning, through UX/UI and platform architecture, core banking development, and integration and testing, to deployment and ongoing support. White label neobanking solutions can launch in weeks.",
  },
  {
    q: "Why Choose Techzarinfo Smart Digital Banking Development?",
    a: "We help banks and fintech startups launch secure, scalable platforms using mobile apps, real-time payments, and AI automation. Our solutions are compliance-ready, API-first and omnichannel, and we support you from strategy through launch and beyond, with a free 30-minute strategy consultation to get started.",
  },
];

// The shared FAQ accordion (as on the crypto and ERP pages), with this page's questions
export default function BankingFaq() {
  // Wrapper only carries the AI guide tour hook (the shared Faq component stays untouched)
  return (
    <div data-guide="bankingFaq">
      <Faq title="Frequently Asked Questions" items={items} />
    </div>
  );
}

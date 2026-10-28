import ErpBenefits from "@/components/erp/ErpBenefits";

// In the design's reading order: left column, right column, row by row
const benefits = [
  { icon: "relationships", title: "Enhanced Customer Relationships", text: "Deliver personalized experiences and maintain long-term client loyalty." },
  { icon: "workflow", title: "Streamlined Workflow & Automation", text: "Automate repetitive tasks to boost productivity and reduce errors." },
  { icon: "sales", title: "Improved Sales Performance", text: "Accelerate conversions with streamlined pipelines and lead tracking." },
  { icon: "data", title: "Centralized Data Access", text: "Unify customer information across departments for seamless collaboration." },
  { icon: "retention", title: "Better Customer Retention", text: "Utilize data insights to proactively engage and retain customers." },
  { icon: "target", title: "Increased ROI", text: "Maximize returns through smarter engagement and operational efficiency." },
];

// The ERP page's benefits section, with the CRM page's content
export default function CrmBenefits() {
  return (
    <ErpBenefits
      title={
        <>
          {/* The design's line break from tablets up; phones balance the lines themselves */}
          Key Benefits of Using CRM <br className="hidden md:block" />
          Development Services From TZI
        </>
      }
      benefits={benefits}
      guide="crmBenefits"
    >
      {/* The design's line break on desktop; smaller screens wrap naturally */}
      Our CRM development services are not restricted to one particular region or{" "}
      <br className="hidden lg:block" />
      industries. Our services are open to all types of business models.
    </ErpBenefits>
  );
}

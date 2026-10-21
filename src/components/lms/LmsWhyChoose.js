import Faq from "@/components/common/Faq";

// "Why Choose TZI" accordion, on the shared Faq component (the same accordion as the Blockchain
// page's FAQ). The first point's text is from the design. TODO(content): points 2-4 are drafts;
// replace with approved copy when available.
const items = [
  {
    q: "Built for Your Users",
    a: "We focus on simple navigation, intuitive learning experiences, and engaging interfaces that make training easier to adopt",
  },
  {
    q: "Ready to Scale",
    a: "Our LMS grows with your organization, handling more learners, courses, and locations without slowing down, so your platform keeps pace as your training needs expand",
  },
  {
    q: "Seamless Integration",
    a: "We connect your LMS with HRMS, CRM, single sign-on, video conferencing, and other business tools, so training fits naturally into the systems your teams already use",
  },
  {
    q: "Reliable Support & Maintenance",
    a: "From launch onwards, our team provides updates, monitoring, and quick support to keep your learning platform secure, stable, and running smoothly",
  },
];

export default function LmsWhyChoose() {
  // Wrapper only carries the AI guide tour hook (the shared Faq component stays untouched)
  return (
    <div data-guide="lmsWhyChoose">
      <Faq
        title={
          <>
            {/* The design's line break; phones wrap naturally */}
            Why Choose TZI for Custom LMS <br className="hidden sm:block" />
            Software Development
          </>
        }
        description="Choose our company for Custom learning management system development and experience unparalleled expertise dedicated to crafting tailored solutions for your unique training needs"
        items={items}
      />
    </div>
  );
}

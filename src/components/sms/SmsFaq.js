import Faq from "@/components/common/Faq";

// TODO(content): the design shows only the first answer. The other five are drafts built from this
// page's own sections; replace with approved copy when available.
const items = [
  {
    q: "Expertise and Specialization",
    a: "Benefit from our dedicated focus on education technology, ensuring tailored solutions finely tuned to the academic landscape.",
  },
  {
    q: "User-Centric Approach",
    a: "We design every module around the people who use it every day: administrators, teachers, students, and parents. Clear dashboards and simple workflows make the platform easy to adopt across your institution.",
  },
  {
    q: "Customization and Flexibility",
    a: "Every institution has unique requirements. Our school management software adapts to your academic and administrative workflows, with flexible modules for attendance, communication, scheduling, assessments, and performance tracking.",
  },
  {
    q: "Cutting-Edge Technology",
    a: "We build with modern, scalable technology and AI-powered features, from curriculum and student management to real-time analytics, so your platform stays fast, secure, and ready to grow.",
  },
  {
    q: "End-to-End Support",
    a: "From requirement analysis and design to development, deployment, and training, we stay with you at every stage, and provide ongoing maintenance and updates after launch.",
  },
  {
    q: "Proven Track Record",
    a: "Techzarinfo has delivered education platforms, e-learning apps, and learning management systems that help institutions simplify administration, improve communication, and deliver engaging learning experiences.",
  },
];

// The shared FAQ accordion (as on the ERP page), with this page's "Why Choose TZI" points
export default function SmsFaq() {
  // Wrapper only carries the AI guide tour hook (the shared Faq component stays untouched)
  return (
    <div data-guide="smsFaq">
      <Faq
        // Desktop breaks after "Management", as in the design
        title={
          <>
            <span className="lg:whitespace-nowrap">Why Choose TZI for School Management</span> App Development
          </>
        }
        titleWidth="max-w-[800px]"
        description="Join hands with us to embark on an educational transformation, empowering your institution with modern, efficient, and learner-centric applications."
        items={items}
      />
    </div>
  );
}

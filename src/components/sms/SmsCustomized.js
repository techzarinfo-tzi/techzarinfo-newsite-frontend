import { SmsSplitSection } from "@/components/sms/SmsSingleStop";

// Bullets read down each column, as in the design: Reports, Curriculum, Cohorts | Assessment, ...
const points = ["Reports", "Assessment", "Curriculum", "Attendance", "Cohorts", "Classroom"];

// The "Single Stop" layout mirrored: artwork on the left, copy on the right, six bullets in two columns
export default function SmsCustomized() {
  return (
    <SmsSplitSection
      guide="smsCustomized"
      title="Customized School Management System for Your Unique Needs"
      titleWidth="lg:max-w-[640px]"
      text="Every educational institution has unique requirements. Our customized school management system adapts to your academic and administrative workflows with flexible modules for attendance, communication, scheduling, and performance tracking."
      points={points}
      columns={2}
      reverse
      image={{
        src: "/product/SMS/customised-school.svg",
        width: 693,
        height: 474,
        alt: "School management dashboard surrounded by panels for reports, curriculum, cohorts, assessment, attendance and classroom",
      }}
    />
  );
}

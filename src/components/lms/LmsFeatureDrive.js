import { Award, ChartNoAxesCombined, LibraryBig, Plug, Route, ShieldCheck, Smartphone, Trophy, Workflow } from "lucide-react";
import FeatureDriveSection from "@/components/common/FeatureDriveSection";

// The LMS page's nine feature cards, on the shared tilted-cards row that drives sideways as you
// scroll (common/FeatureDriveSection.js, where the design and motion live). Icons from Lucide.
const features = [
  {
    icon: <LibraryBig />,
    title: "Centralized Learning Hub",
    text: "Bring courses, training materials, videos, documents, and resources together in one secure platform. Give employees easy access to everything they need for learning without switching between multiple systems.",
  },
  {
    icon: <Workflow />,
    title: "Automated Training Management",
    text: "Simplify the entire training lifecycle with automated enrollment, course assignments, reminders, progress tracking, and reporting. Reduce administrative work and keep employees on track with required training.",
  },
  {
    icon: <Route />,
    title: "Personalized Learning Paths",
    text: "Create learning journeys based on employee roles, skills, experience, and career goals. Deliver relevant courses and training recommendations that support individual development and organizational objectives.",
  },
  {
    icon: <ChartNoAxesCombined />,
    title: "Real-Time Reports & Analytics",
    text: "Track employee progress, course completion, assessment results, and engagement in real time. Gain insights through detailed dashboards and reports to make training more effective.",
  },
  {
    icon: <Award />,
    title: "Assessments & Certifications",
    text: "Evaluate learning with quizzes, assignments, and skill assessments. Issue certificates automatically when employees complete courses and meet the required standards.",
  },
  {
    icon: <Smartphone />,
    title: "Mobile-Friendly Learning",
    text: "Let employees learn anytime, anywhere with a responsive platform that works smoothly on desktops, tablets, and smartphones, so training fits into every schedule.",
  },
  {
    icon: <Trophy />,
    title: "Gamified Engagement",
    text: "Motivate learners with points, badges, leaderboards, and rewards. Turn training into an engaging experience that encourages participation and course completion.",
  },
  {
    icon: <Plug />,
    title: "Seamless Integrations",
    text: "Connect your LMS with HRMS, CRM, single sign-on, video conferencing, and other business tools for a unified training ecosystem that fits your existing workflows.",
  },
  {
    icon: <ShieldCheck />,
    title: "Compliance Training Management",
    text: "Assign mandatory training, track certification deadlines, and maintain audit-ready records to keep your organization compliant with industry standards and regulations.",
  },
];

export default function LmsFeatureDrive() {
  return <FeatureDriveSection features={features} guide="lmsFeatureDrive" label="LMS features" />;
}

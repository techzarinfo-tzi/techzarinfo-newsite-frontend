import { FeatureStackSection } from "@/components/cmms/CmmsAppDevelopment";

const ASSETS = "/product/SMS/ai-powerd";

// The CMMS page's scroll-stacked feature cards (same cards, glows, bullets and stacking), with the SMS
// features and artwork. As on CMMS: the middle card mirrors (artwork left) and drops the outline.
// Image boxes from the SMS design, as fractions of the 1230 x 502 card: the first and last artworks
// run to the card's right edge, the middle one sits flush left.
const features = [
  {
    title: "Curriculum Management",
    text: "Easily design and organize courses with diverse and interactive content formats and assessment modules tailored to specific subjects, grades, or student groups.",
    points: [
      "Interactive course building interface",
      "Integration of multimedia elements",
      "Automated assessments",
      "Personalized course assignments",
    ],
    image: {
      src: `${ASSETS}/curriculam.svg`,
      width: 588,
      height: 485,
      alt: "Curriculum management screen with a course outline, chapter progress and lesson resources",
      // to the right edge, top 25, 588 wide
      box: "lg:right-0 lg:top-[5%] lg:w-[47.8%]",
    },
    outlined: true,
  },
  {
    title: "Student Management",
    text: "Manage Classrooms and monitor individual student progress and engagement in courses and assignments for efficient analysis, tracking, targeted support",
    points: ["Interactive dashboards", "Performance summaries", "Skill-based progress tracking", "Comparative analytics"],
    image: {
      src: `${ASSETS}/student.svg`,
      width: 566,
      height: 413,
      alt: "Student profile with attendance, upcoming assignments and subject performance over the term",
      // flush left, top 75, 566 wide
      box: "lg:left-0 lg:top-[15%] lg:w-[46%]",
    },
    reverse: true,
  },
  {
    title: "Collaborative learning",
    text: "Facilitate group projects, discussion forums, and peer learning opportunities for Collaborative Learning and enable smooth communication for effective engagement",
    points: ["Virtual classrooms", "Discussion boards", "Secure portal", "Peer collaboration spaces"],
    image: {
      src: `${ASSETS}/collabrative.svg`,
      width: 588,
      height: 451,
      alt: "Group project workspace with a class discussion, a video call and a shared task list",
      // to the right edge, top 48, 588 wide
      box: "lg:right-0 lg:top-[9.6%] lg:w-[47.8%]",
    },
    outlined: true,
  },
];

export default function SmsAiPowered() {
  return (
    <FeatureStackSection
      guide="smsAiPowered"
      title="AI-Powered Best School Management Software"
      text="Simplify school administration with smart automation, streamlined student data, and better academic decision-making."
      features={features}
    />
  );
}

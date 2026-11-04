import { TailorMadeSection } from "@/components/lms/LmsTailorMade";

// The LMS "Tailor-Made" section as used on the CMMS page (same cards, entrance, scroll swap and
// theme), with the SMS offerings: the first three grow out of the triangle as the section scrolls in,
// then, while it is pinned, rise away as the second three rise in. Each card uses a Lucide icon on the
// dark-blue tile, as in the design. Positions as on the CMMS page (1440px design): top left, right
// (just above the heading), and bottom left of centre.
const slots = [
  {
    place: "xl:left-[11.1%] xl:top-[11%]",
    cards: [
      {
        icon: "it",
        tile: true,
        title: "Student Information System",
        text: "Centralized student database management for easy access to student information and academic progress tracking",
      },
      {
        icon: "collaboration",
        tile: true,
        title: "Collaborative Learning Spaces",
        text: "Virtual classrooms, discussion forums, and group projects, fostering collaborative learning and interaction among students and instructors.",
      },
    ],
  },
  {
    place: "xl:right-[11.1%] xl:top-[24%]",
    cards: [
      {
        icon: "training",
        tile: true,
        title: "Interactive Learning Resources",
        text: "Engaging multimedia content, quizzes, and assessments to facilitate interactive learning and knowledge retention.",
      },
      {
        icon: "attendance",
        tile: true,
        title: "Attendance and Leave Management",
        text: "Streamlined attendance tracking and leave request management for efficient monitoring of student and staff attendance.",
      },
    ],
  },
  {
    // Tablet: the odd slot out spans the 2-column grid, centred at one column's width
    place: "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-10px)] lg:col-span-1 lg:w-auto xl:left-[28.6%] xl:top-[72%]",
    cards: [
      {
        icon: "finance",
        tile: true,
        title: "Class and Timetable",
        text: "Automated scheduling and timetable creation, simplifying class allocation and timetable management for seamless organization.",
      },
      {
        icon: "analytics",
        tile: true,
        title: "Progress Tracking and Analytics",
        text: "Real-time monitoring of student progress, performance analytics, and data-driven insights for personalized learning experiences.",
      },
    ],
  },
];

export default function SmsTailorMade() {
  return (
    <TailorMadeSection
      guide="smsTailorMade"
      title="Tailor-Made White Label Education Platform and E-learning App Development"
      titleWidth="max-w-[860px]"
      text="Simplify administration, improve communication, and deliver engaging learning experiences with scalable, customizable education software"
      slots={slots}
    />
  );
}

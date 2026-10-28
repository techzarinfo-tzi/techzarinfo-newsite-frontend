import { TailorMadeSection } from "@/components/lms/LmsTailorMade";

// The LMS "Tailor-Made" section (same cards, entrance, scroll swap and theme), with the CRM
// industries: the first three grow out of the triangle as the section scrolls in, then, while it is
// pinned, rise away as the second three rise in. Every card uses a Lucide icon on the dark-blue tile,
// as in the design.
// Positions from the 1440px design: top left, right (just above the heading), and bottom left of
// centre.
const slots = [
  {
    place: "xl:left-[13.2%] xl:top-[10%]",
    cards: [
      {
        icon: "it",
        tile: true,
        title: "Information Technology (IT)",
        text: "Use our CRM to personalize learning paths, track user engagement, and manage learner relationships.",
      },
      {
        icon: "healthcare",
        tile: true,
        title: "Healthcare",
        text: "Manage patient relationships, schedule follow-ups, and keep care teams connected with secure, centralized records.",
      },
    ],
  },
  {
    place: "xl:right-[9%] xl:top-[24.7%]",
    cards: [
      {
        icon: "training",
        tile: true,
        title: "Online Training",
        text: "Personalize learning, track engagement, manage learner relationships, and improve course retention with our CRM",
      },
      {
        icon: "realEstate",
        tile: true,
        title: "Real Estate",
        text: "Track property leads, automate follow-ups, and manage buyer and seller relationships from first enquiry to closing.",
      },
    ],
  },
  {
    // Tablet: the odd slot out spans the 2-column grid, centred at one column's width
    place: "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-10px)] lg:col-span-1 lg:w-auto xl:left-[30.6%] xl:top-[74.3%]",
    cards: [
      {
        icon: "finance",
        tile: true,
        title: "Finance and Banking",
        text: "Manage client portfolios, personalize financial services, streamline communication, and strengthen compliance with CRM.",
      },
      {
        icon: "retail",
        tile: true,
        title: "Retail & E-commerce",
        text: "Understand buying behaviour, run targeted campaigns, and turn one-time shoppers into loyal, repeat customers.",
      },
    ],
  },
];

export default function CrmIndustries() {
  return (
    <TailorMadeSection
      guide="crmIndustries"
      title="The Impact of Our TZI CRM Software on Various Industries"
      text="Our sales and lead management software helps businesses across industries simplify lead tracking, follow-ups, and customer management"
      slots={slots}
    />
  );
}

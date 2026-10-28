import { TailorMadeSection } from "@/components/lms/LmsTailorMade";

const LOGOS = "/product/CMMS/services";

// The LMS "Tailor-Made" section (same cards, entrance, scroll swap and theme), with the CMMS
// services: the first three grow out of the triangle as the section scrolls in, then, while it is
// pinned, rise away as the second three rise in. The first set uses the design's logos; the second
// uses matching Lucide icons on the same tile.
// Positions from the 1440px design: top left, right (just above the heading), and bottom left of
// centre.
const slots = [
  {
    place: "xl:left-[11.1%] xl:top-[11%]",
    cards: [
      {
        logo: `${LOGOS}/custom-cmms.svg`,
        title: "Custom CMMS Solutions",
        text: "Tailoring CMMS software to match your organization's distinct maintenance processes and unique requirements for optimal efficiency.",
      },
      {
        icon: "workOrders",
        tile: true,
        title: "Work Order Management",
        text: "Developing efficient work order management systems within the CMMS to streamline task assignments tracking, and completion for improved productivity.",
      },
    ],
  },
  {
    place: "xl:right-[11.1%] xl:top-[24%]",
    cards: [
      {
        logo: `${LOGOS}/asset-management.svg`,
        title: "Asset Management Integration",
        text: "Seamlessly integrating asset management features into the CMMS, ensuring comprehensive control and tracking of critical assets.",
      },
      {
        icon: "analytics",
        tile: true,
        title: "Data Analytics and Reporting",
        text: "Incorporating robust data analytics and reporting capabilities within the CMMS, enabling data-driven insights to optimize maintenance decisions and strategies.",
      },
    ],
  },
  {
    // Tablet: the odd slot out spans the 2-column grid, centred at one column's width
    place: "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-10px)] lg:col-span-1 lg:w-auto xl:left-[28.6%] xl:top-[72%]",
    cards: [
      {
        logo: `${LOGOS}/preventive-maintenance.svg`,
        title: "Preventive Maintenance",
        text: "Implementing preventive maintenance schedules and strategies within the CMMS to reduce downtime and enhance equipment longevity",
      },
      {
        icon: "mobile",
        tile: true,
        title: "Mobile CMMS Applications",
        text: "Creating mobile-friendly CMMS applications for on-the-go maintenance management, providing real-time updates and accessibility to field teams.",
      },
    ],
  },
];

export default function CmmsServices() {
  return (
    <TailorMadeSection
      guide="cmmsServices"
      title="Our CMMS Software Development Services"
      text="Our reputed CMMS software development services help your businesses to streamline maintenance, manage assets, and track work orders from one centralized platform. Here is the list of services we offer"
      slots={slots}
    />
  );
}

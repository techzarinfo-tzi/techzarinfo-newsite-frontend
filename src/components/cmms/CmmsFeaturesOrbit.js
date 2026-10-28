import { FeaturesOrbit } from "@/components/erp/ErpFeaturesOrbit";

// The ERP features orbit (same ring, disc, pills and scroll-boosted spin), with the CMMS features.
// Clockwise from the top left, at the design's six evenly spaced angles (0 = right, y down).
const features = [
  {
    icon: "inventory",
    title: "Spare Parts & Inventory",
    text: "Your business can monitor spare parts, stock levels, usage, and purchase requirements",
    angle: -120,
  },
  {
    icon: "technicians",
    title: "Technician Management",
    text: "Without any confusion, you can assign jobs, track technician activities, and monitor task completion",
    angle: -60,
  },
  {
    icon: "reports",
    title: "Reports & Analytics",
    text: "Analyze downtime, maintenance costs, work orders, asset performance, and team productivity",
    angle: 0,
  },
  {
    icon: "dashboard",
    title: "Dashboard & KPI Tracking",
    text: "View important maintenance metrics and operational performance in one centralized system",
    angle: 60,
  },
  {
    icon: "mobile",
    title: "Mobile CMMS Access",
    text: "Allow technicians to manage maintenance tasks, update work orders, and access asset information from mobile devices",
    angle: 120,
  },
  {
    icon: "alerts",
    title: "Real-Time Alerts & Notifications",
    text: "Send reminders for upcoming maintenance, overdue tasks, and equipment issues",
    angle: 180,
  },
];

export default function CmmsFeaturesOrbit() {
  return (
    <FeaturesOrbit
      guide="cmmsFeatures"
      title="Key Features We Integrate with Our Computerized Maintenance Management System"
      features={features}
    />
  );
}

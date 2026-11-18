import { siteConfig } from "@/config/site";

// Every public page, for search engines (/sitemap.xml). /demo-booked is left out: it is a
// Calendly redirect target marked noindex. Add new pages here as they are created.
const PAGES = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  // Services
  { path: "/web-development-company-in-chennai", priority: 0.9 },
  { path: "/artificial-intelligence", priority: 0.9 },
  { path: "/blockchain-app-development-services", priority: 0.9 },
  { path: "/cryptocurrency-exchange-development-company", priority: 0.9 },
  { path: "/ecommerce-website-development-company-in-india", priority: 0.9 },
  { path: "/smart-digital-banking-solution", priority: 0.9 },
  { path: "/digital-marketing-services", priority: 0.9 },
  { path: "/hire-a-developer", priority: 0.9 },
  // Products
  { path: "/corporate-learning-management-system", priority: 0.9 },
  { path: "/erp-software-development", priority: 0.9 },
  { path: "/custom-crm-solutions", priority: 0.9 },
  { path: "/cmms-application", priority: 0.9 },
  { path: "/school-management-system-software", priority: 0.9 },
  // Company
  { path: "/about", priority: 0.7 },
  { path: "/careers", priority: 0.7, changeFrequency: "weekly" },
  { path: "/contact-us", priority: 0.7 },
  { path: "/blogs", priority: 0.7, changeFrequency: "daily" },
];

export default function sitemap() {
  const lastModified = new Date();
  return PAGES.map(({ path, priority, changeFrequency = "monthly" }) => ({
    url: `${siteConfig.url}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}

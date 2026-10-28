export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Industries", href: "/industries" },
  { label: "Services", href: "/services", menu: "services" },
  { label: "Products", href: "/products", menu: "products" },
  { label: "Blogs", href: "/blogs" },
];

// Dropdown under "Services". Hrefs reuse the existing service pages and the
// URLs already published in the footer (src/config/footer.js).
export const servicesMenu = {
  title: "Services",
  tagline: "Custom development, Consulting and Marketing Services",
  groups: [
    {
      id: "blockchain",
      title: "Blockchain & Crypto",
      links: [
        { label: "Blockchain Development", href: "/blockchain-app-development-services" },
        { label: "Crypto Exchange Development", href: "/products/crypto-currency-exchange-development" },
      ],
    },
    {
      id: "software",
      title: "Software Development",
      links: [
        { label: "Website Development", href: "/services/web-application-development" },
        { label: "Mobile App Development", href: "/services/mobile-app-development" },
        { label: "E-commerce Development", href: "/ecommerce-website-development-company-in-india" },
      ],
    },
    {
      id: "ai",
      title: "AI & Digital Transformation",
      links: [
        { label: "Artificial Intelligence", href: "/services/artificial-intelligence" },
        { label: "Digital Banking Development", href: "/services/digital-banking" },
      ],
    },
    {
      id: "marketing",
      title: "Marketing Solution",
      links: [{ label: "Digital Marketing Services", href: "/services/digital-marketing-services" }],
    },
  ],
};

export const productsMenu = {
  title: "Products",
  tagline: "Ready made & Customizable Business Software Products",
  items: [
    { name: "LMS", description: "Learning Management System", href: "/corporate-learning-management-system" },
    { name: "ERP", description: "Enterprise Resource Planning", href: "/erp-software-development" },
    { name: "CRM", description: "Customer Relationship Management", href: "/custom-crm-solutions" },
    { name: "CMMS", description: "Computerized Maintenance Management", href: "/cmms-application" },
    { name: "SMS", description: "Student Management System", href: "/products/sms" },
    { name: "ZAAR", description: "Field Reporting Solution", href: "/products/field-report" },
  ],
};

export default navLinks;

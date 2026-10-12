const slug = (label) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const toLinks = (base, labels) => labels.map((label) => ({ label, href: `${base}/${slug(label)}` }));

export const footerColumns = [
  {
    id: "quick",
    title: "Quick Links",
    links: [
      { label: "Culture", href: "/culture" },
      { label: "Blogs", href: "/blogs" },
      { label: "Industries", href: "/industries" },
      { label: "Careers", href: "/careers" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    id: "services",
    title: "Services",
    links: toLinks("/services", [
      "Contract Staffing",
      "Mobile App Development",
      "Web Application Development",
      "Digital Marketing Services",
      "Robotics Process Automation",
      "Artificial Intelligence",
      "Internet Of Things",
      "Digital Banking",
      "Enterprises Software Solutions",
      "Engineering Business Automation",
    ]),
  },
  {
    id: "products",
    title: "Products & Services",
    links: toLinks("/products", [
      "FIELD REPORT",
      "LMS",
      "CMMS",
      "SMS",
      "SaaS App Development",
      "E-Com App Development",
      "Smart ERP Solutions",
      "Custom CRM Solutions",
      "Blockchain Development Services",
      "Crypto Currency Exchange Development",
    ]),
  },
];

export const footerContact = {
  phones: [
    { label: "UK", display: "+44-1223790170", tel: "+441223790170" },
    { label: "IND", display: "+91-9952885799", tel: "+919952885799" },
  ],
  emails: ["sales@techzarinfo.com", "career@techzarinfo.com"],
};

export const footerSocial = [
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/techzarinfo" },
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/techzarinfo" },
  { id: "x", label: "X", href: "https://x.com/techzarinfo" },
  { id: "youtube", label: "YouTube", href: "https://www.youtube.com/@techzarinfo" },
];

export const footerLegal = [
  { label: "Terms and Condition", href: "/terms-and-conditions" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

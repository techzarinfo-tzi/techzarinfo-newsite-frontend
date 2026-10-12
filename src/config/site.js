const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.techzarinfo.com";

export const siteConfig = {
  name: "TechZar",
  legalName: "TechZar",
  title: "TechZar | Technology Solutions & Digital Services",
  titleTemplate: "%s | TechZar",
  description:
    "TechZar delivers modern technology solutions and digital services to help businesses grow.",
  url: siteUrl,
  locale: "en_US",
  keywords: ["TechZar", "technology solutions", "digital services", "software development"],
  themeColor: "#0f172a",
  social: {
    twitter: "@techzarinfo",
    facebook: "",
    linkedin: "",
    instagram: "",
  },
  images: {
    ogImage: "/og-image.png",
    logo: "/logo.svg",
  },
};

export default siteConfig;

import { siteConfig } from "@/config/site";
import { footerContact, footerSocial } from "@/config/footer";

// Organization + WebSite structured data (schema.org JSON-LD) for search engines, rendered once in
// the root layout. Contacts and social profiles come from the footer config, so they stay in step
// with what the site shows; the address is the India head office (as on the Contact Us map).
const data = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: "Techzarinfo",
      alternateName: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}${siteConfig.images.logo}`,
      description: siteConfig.description,
      email: footerContact.emails[0],
      address: {
        "@type": "PostalAddress",
        streetAddress: "No: 34, Rakshan, Block-A, Sengalani Amman St, IIT Colony, Pallikaranai",
        addressLocality: "Chennai",
        postalCode: "600100",
        addressCountry: "IN",
      },
      contactPoint: footerContact.phones.map((p) => ({
        "@type": "ContactPoint",
        telephone: p.tel,
        contactType: "sales",
        areaServed: p.label === "IND" ? "IN" : p.label === "UK" ? "GB" : undefined,
      })),
      sameAs: footerSocial.map((s) => s.href),
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: "Techzarinfo",
      publisher: { "@id": `${siteConfig.url}/#organization` },
      inLanguage: "en",
    },
  ],
};

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output with "<" escaped, so the data can never close the script tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

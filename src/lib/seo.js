import { siteConfig } from "@/config/site";

// Page metadata with matching social cards. Next.js merges metadata shallowly, so a page that sets
// only title/description/canonical would otherwise inherit the root layout's Open Graph and
// Twitter cards, and every page would share with the home page's title and URL. This derives them
// from the page's own title, description and canonical path; anything the page sets in openGraph
// or twitter still wins. Relative URLs resolve against metadataBase (the site URL).
export function withSeo(meta) {
  const pageTitle = typeof meta.title === "string" ? meta.title : (meta.title?.absolute ?? siteConfig.title);
  // The browser title uses the layout's "%s | TechZar" template; the cards use the same full title
  const title = typeof meta.title === "string" ? siteConfig.titleTemplate.replace("%s", pageTitle) : pageTitle;
  const description = meta.description ?? siteConfig.description;
  const url = meta.alternates?.canonical;
  const image = { url: siteConfig.images.ogImage, width: 1200, height: 630, alt: siteConfig.name };

  return {
    ...meta,
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title,
      description,
      url,
      images: [image],
      ...meta.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.social.twitter,
      creator: siteConfig.social.twitter,
      title,
      description,
      images: [image.url],
      ...meta.twitter,
    },
  };
}

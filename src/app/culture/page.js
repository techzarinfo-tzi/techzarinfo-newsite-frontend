import CultureGallery from "@/components/culture/CultureGallery";
import { getCulturePhotos } from "@/lib/culture";
import { withSeo } from "@/lib/seo";

const path = "/culture";

export const metadata = withSeo({
  title: "Life at Techzarinfo | Our Culture",
  description:
    "A look inside Techzarinfo: our people, celebrations, events and everyday moments that shape our culture.",
  alternates: {
    canonical: path,
  },
});

// Photos are published from the admin panel (Culture Photos); the page re-reads them every minute.
export const revalidate = 60;

export default async function CulturePage() {
  const photos = await getCulturePhotos();
  return (
    <>
      <h1 className="sr-only">Life at Techzarinfo</h1>
      <CultureGallery photos={photos} />
    </>
  );
}

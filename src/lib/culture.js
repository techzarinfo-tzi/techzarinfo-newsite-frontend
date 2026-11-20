import { apiUrl } from "@/lib/blog";

// Culture page photos, managed in the admin panel (Culture Photos) and served by the website
// backend. Only published photos are returned, newest first. Cached for a minute, so a newly
// published photo shows up shortly after. An unreachable backend gives an empty gallery instead
// of failing the page.
export async function getCulturePhotos() {
  try {
    const res = await fetch(`${apiUrl}/get-culture`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data
      .filter((photo) => photo?.image)
      .map((photo) => ({
        id: photo._id,
        title: photo.title || "",
        src: `${apiUrl}/uploads/${encodeURIComponent(photo.image)}`,
      }));
  } catch {
    return [];
  }
}

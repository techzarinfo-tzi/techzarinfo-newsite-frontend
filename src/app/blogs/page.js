import BlogFeatured from "@/components/blogs/BlogFeatured";
import BlogGrid from "@/components/blogs/BlogGrid";
import { getPosts, gridPage, latestWindow } from "@/lib/blog";

const path = "/blogs";

export const metadata = {
  title: "Blogs",
  description:
    "Insights, guides and updates from TechZar on AI, web, mobile app, e-commerce and blockchain development.",
  alternates: {
    canonical: path,
  },
};

// ?category= and ?page= pick the grid page, so every page has its own link
export default async function BlogsPage({ searchParams }) {
  const { category, page } = await searchParams;
  const posts = await getPosts();
  // The newest post by publish date leads, and the carousel lists its 10-day window (newest first)
  const latest = latestWindow(posts);
  const featured = latest[0] ?? posts[0];

  return (
    <main className="bg-white px-4 pt-28 pb-20 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32 lg:pb-28">
      <div className="mx-auto max-w-7xl">
        <h1 className="sr-only">Blogs</h1>
        {featured ? (
          <>
            <BlogFeatured featured={featured} latest={latest} />
            <BlogGrid {...gridPage(posts, { category, page })} />
          </>
        ) : (
          <p className="py-24 text-center text-slate-500">No blogs have been published yet.</p>
        )}
      </div>
    </main>
  );
}

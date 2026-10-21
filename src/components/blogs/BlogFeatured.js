import FeaturedCard from "./FeaturedCard";
import LatestBlogs from "./LatestBlogs";


export default function BlogFeatured({ featured, latest }) {
  return (
    <section className="grid grid-cols-1 gap-7 sm:gap-8 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] lg:gap-10">
      {/* Opens on the newest post, then rotates through the same 10-day window as the list */}
      <FeaturedCard featured={featured} posts={latest} />

      <div className="flex flex-col">
        <h2 className="blog-rise text-lg font-bold text-[#0A50A5] sm:text-xl" style={{ "--rise-delay": "0.6s" }}>
          Latest Blogs
        </h2>
        {/* The newest post's 10-day window (see latestWindow), moving up one post at a time */}
        <LatestBlogs posts={latest} />
      </div>
    </section>
  );
}

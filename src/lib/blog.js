// Blog posts come from the website backend (../backend). Set NEXT_PUBLIC_API_URL in .env to its
// public address; images are loaded by the browser from its /uploads folder, so it must be public.
export const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

const POST_LIMIT = 100; // the backend's largest page
const MAX_PAGES = 50; // safety stop: up to 5,000 posts

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

// Only the fields the listing renders, so the client grid isn't sent each post's full body.
const toCard = (post) => ({
  id: post._id,
  title: post.title,
  slug: post.slug,
  excerpt: post.meta_description,
  // Some stored categories end in a stray line break, which would list e.g. "Digital Banking" twice
  type: (post.type || "").trim(),
  image: post.image ? `${apiUrl}/uploads/${encodeURIComponent(post.image)}` : "",
  date: post.createdAt ? dateFormat.format(new Date(post.createdAt)) : "",
  // Published time in ms. createdAt is set once on publish; updatedAt changes on every edit.
  publishedAt: post.createdAt ? Date.parse(post.createdAt) || 0 : 0,
});

// Every post, newest first, read from the backend's paged list (it has no total count, so pages
// are read until a short one). This uses /get-post/:limit/:page/all rather than
// /get-post/:limit&:page: on the live API the latter returns other pages' posts when requests
// overlap, and the cache refreshes all pages at once. Each page response is cached for 5 minutes.
// Duplicates are dropped in case a post is published between two page reads. An unreachable backend renders an empty
// (or partial) listing instead of failing the page.
export async function getPosts() {
  const posts = new Map();
  const readPage = async (page, live) => {
    const res = await fetch(
      `${apiUrl}/get-post/${POST_LIMIT}/${page}/all`,
      live ? { cache: "no-store" } : { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data : null;
  };
  // A page that is mostly posts already read is a bad copy (the live API once answered page 4 with
  // page 1, and the cache kept it), which would silently drop a whole page of posts: read it again
  // live. A small overlap is normal when a post is published between two reads.
  const isRepeat = (data) => data.filter((post) => posts.has(post._id)).length > data.length / 2;
  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      let data = await readPage(page, false);
      if (data && page > 1 && isRepeat(data)) data = await readPage(page, true);
      if (!data) break;
      data.forEach((post) => posts.has(post._id) || posts.set(post._id, toCard(post)));
      if (data.length < POST_LIMIT) break;
    }
  } catch {
    // Keep whatever was read before the failure
  }
  return [...posts.values()];
}

export const postHref = (post) => `/blogs/${post.slug}`;

// Latest Blogs covers the newest post's publish day and the 9 days before it, so the range follows
// the data rather than today's date.
export const LATEST_WINDOW_DAYS = 10;

// Posts in that window by publish date (createdAt, not updatedAt), newest first. Days are UTC
// calendar days, the same as the dates shown on the cards: newest on Oct 13 means Oct 4 to 13.
export function latestWindow(posts) {
  const dated = posts.filter((post) => post.publishedAt > 0);
  if (!dated.length) return [];
  const newest = Math.max(...dated.map((post) => post.publishedAt));
  const day = new Date(newest);
  const from = Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate() - (LATEST_WINDOW_DAYS - 1));
  return dated
    .filter((post) => post.publishedAt >= from && post.publishedAt <= newest)
    .sort((a, b) => b.publishedAt - a.publishedAt);
}

// The blog grid shows this many cards a page: whole rows at 1, 2 and 3 columns.
export const GRID_PAGE_SIZE = 12;

// One page of the grid for the given URL params. An unknown category falls back to all posts and
// the page number is kept within range, so a stale or hand-edited link still shows something.
export function gridPage(posts, { category, page } = {}) {
  const categories = [...new Set(posts.map((post) => post.type).filter(Boolean))].sort();
  const active = categories.includes(category) ? category : "";
  // Newest published first. Sorted here rather than trusting the API's order (newest database id),
  // which only matches the publish date while posts are never imported or back-dated. Ties fall
  // back to the id, so the order, and with it every page, is the same on every load.
  const matching = (active ? posts.filter((post) => post.type === active) : [...posts]).sort(
    (a, b) => b.publishedAt - a.publishedAt || (a.id < b.id ? 1 : a.id > b.id ? -1 : 0)
  );
  const totalPages = Math.max(1, Math.ceil(matching.length / GRID_PAGE_SIZE));
  const current = Math.min(Math.max(parseInt(page, 10) || 1, 1), totalPages);
  return {
    posts: matching.slice((current - 1) * GRID_PAGE_SIZE, current * GRID_PAGE_SIZE),
    categories,
    category: active,
    page: current,
    totalPages,
  };
}

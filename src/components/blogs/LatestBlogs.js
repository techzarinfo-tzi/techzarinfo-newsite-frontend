"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { postHref } from "@/lib/blog";

const VISIBLE = 4;
const STEP_EVERY_MS = 5000; // the list moves up one item this often
const SLIDE_MS = 1400; // matches the .latest-track transition in globals.css
const REFRESH_EVERY_MS = 5 * 60 * 1000; // re-reads posts from the backend (matches the fetch revalidate)

// Titles are stored lowercase; first-letter:uppercase shows them in sentence case.
function LatestItem({ post }) {
  return (
    <Link href={postHref(post)} className="flex h-full items-center gap-4">
      <span className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-[#e2f1ff] sm:size-24">
        {post.image && <Image src={post.image} alt="" fill unoptimized sizes="96px" className="object-cover" />}
      </span>
      <span className="min-w-0">
        <span className="line-clamp-2 text-sm font-bold leading-snug text-blue-950 first-letter:uppercase sm:text-base">
          {post.title}
        </span>
        {post.date && <span className="mt-2 block text-xs text-slate-500">{post.date}</span>}
      </span>
    </Link>
  );
}

// Vertical ticker: every few seconds the whole list moves up one slot. The top post slides out,
// and the next post in date order slides in at the bottom.
export default function LatestBlogs({ posts }) {
  const router = useRouter();
  // Starts from the server's list (newest first), so the first paint matches the HTML exactly
  const [items, setItems] = useState(() => posts.slice(0, VISIBLE).map((post) => ({ post, rise: "initial" })));
  const [incoming, setIncoming] = useState(null); // waits one slot below the visible list
  const [shifting, setShifting] = useState(false);
  const itemsRef = useRef(items);
  const postsRef = useRef(posts);
  const busyRef = useRef(false);
  const pausedRef = useRef(false);
  const readyRef = useRef(new Set());

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    postsRef.current = posts;
    // Fetch every recent thumbnail ahead of time; a post can only come in once its image is
    // loaded, so nothing slides in blank
    posts.forEach((post) => {
      if (readyRef.current.has(post.id)) return;
      if (!post.image) return readyRef.current.add(post.id);
      const img = new window.Image();
      img.onload = img.onerror = () => readyRef.current.add(post.id);
      img.src = post.image;
    });
  }, [posts]);

  // The incoming post is painted below the clip first; starting the slide two frames later
  // guarantees the browser has its start position, so it glides in instead of jumping
  useEffect(() => {
    if (!incoming) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setShifting(true));
    });
    const done = setTimeout(() => {
      // One commit: drop the top post, settle the incoming one in the last slot and turn the
      // transition off. Every post lands exactly where the slide left it, so there's no jump.
      const [first, ...rest] = itemsRef.current;
      const settled = rest.map((item) => ({ post: item.post, rise: null }));
      // A recycled post rises back in at the bottom now that it has fully left the top
      const next = [...settled, incoming.recycle ? { post: first.post, rise: "fill" } : { post: incoming.post, rise: null }];
      itemsRef.current = next;
      setItems(next);
      setIncoming(null);
      setShifting(false);
      busyRef.current = false;
    }, SLIDE_MS + 50);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(done);
    };
  }, [incoming]);

  useEffect(() => {
    const step = setInterval(() => {
      // Holds still while it's being read (hover/focus), mid-slide or in a background tab
      if (busyRef.current || pausedRef.current || document.hidden) return;
      // Already the newest post's 10-day window, newest first (see latestWindow)
      const pool = postsRef.current;
      const poolIds = new Set(pool.map((post) => post.id));
      const current = itemsRef.current;

      // Posts that dropped out of the window after a refresh leave first
      const kept = current.filter((item) => poolIds.has(item.post.id));
      if (kept.length !== current.length) {
        itemsRef.current = kept;
        setItems(kept);
        return;
      }

      // The next post in date order after the bottom one (wrapping round to the newest) that
      // isn't already showing
      const shownIds = new Set(current.map((item) => item.post.id));
      const after = pool.findIndex((post) => post.id === current.at(-1)?.post.id);
      const nextPost = [...pool.slice(after + 1), ...pool.slice(0, after + 1)].find(
        (post) => !shownIds.has(post.id) && readyRef.current.has(post.id)
      );

      if (nextPost && current.length < VISIBLE) {
        const next = [...current, { post: nextPost, rise: "fill" }];
        itemsRef.current = next;
        setItems(next);
        return;
      }
      // Every post in the window is already showing: the top one leaves first and only then
      // comes back in at the bottom, so it is never on screen twice
      if (!nextPost && current.length < 2) return;

      busyRef.current = true;
      setIncoming(nextPost ? { post: nextPost } : { recycle: true });
    }, STEP_EVERY_MS);
    const refresh = setInterval(() => router.refresh(), REFRESH_EVERY_MS);
    return () => {
      clearInterval(step);
      clearInterval(refresh);
    };
  }, [router]);

  if (!items.length) return null;

  return (
    <ul
      className="latest-track mt-4"
      style={{ "--rows": items.length }}
      data-shifting={shifting || undefined}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      onFocus={() => (pausedRef.current = true)}
      onBlur={() => (pausedRef.current = false)}
    >
      {/* The incoming post is part of the same keyed list, so its element carries straight on into
          the last slot after the slide (no remount, no image flash) */}
      {(incoming?.post ? [...items, { ...incoming, incoming: true }] : items).map((item, i) => (
        <li
          key={item.post.id}
          style={{ "--i": i }}
          data-incoming={item.incoming ? "" : undefined}
          aria-hidden={item.incoming || undefined}
        >
          {/* The page-load rise lives on this inner box: it animates translate too, and would
              otherwise hold the slot still during the slide */}
          <div
            className={item.rise ? "blog-rise h-full" : "h-full"}
            style={item.rise === "initial" ? { "--rise-delay": `${0.75 + i * 0.15}s` } : undefined}
          >
            <LatestItem post={item.post} />
          </div>
        </li>
      ))}
    </ul>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { postHref } from "@/lib/blog";

const ROTATE_EVERY_MS = 8000; // how long each post stays on the card
const FADE_MS = 1200; // matches .featured-fade-in in globals.css

// One full card face: image, gradient and text, so every field of a post changes together.
// Titles are stored lowercase; first-letter:uppercase shows them in sentence case.
function CardFace({ post, entry, leaving }) {
  // entry: "initial" plays the page-load rise; "swap" a shorter rise as the face fades in
  const textDelay = entry === "initial" ? 0.2 : 0.3;
  return (
    <>
      {post.image && (
        <Image
          src={post.image}
          alt={post.title}
          fill
          unoptimized
          preload={entry === "initial"}
          sizes="(min-width: 1024px) 64vw, 100vw"
          className="object-cover"
        />
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      {/* Rises in from below the card's bottom edge; the card clips it until it enters */}
      <div
        className={`${leaving ? "featured-text-out" : entry ? "blog-rise-in" : ""} absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-9`}
        style={entry ? { "--rise-delay": `${textDelay}s` } : undefined}
      >
        <h2 className="line-clamp-3 text-xl font-bold leading-snug text-white first-letter:uppercase sm:text-2xl lg:line-clamp-2 lg:text-[1.75rem]">
          {post.title}
        </h2>
        {post.excerpt && (
          <p
            className={`${entry && !leaving ? "blog-rise " : ""}mt-2 line-clamp-2 max-w-3xl text-sm leading-relaxed text-white/85 first-letter:uppercase sm:mt-3`}
            style={entry ? { "--rise-delay": `${textDelay + 0.25}s` } : undefined}
          >
            {post.excerpt}
          </p>
        )}
      </div>
    </>
  );
}

// Opens on the newest post (featured), then every few seconds crossfades to a random other post
// from the 10-day window (posts, already filtered and sorted by the parent).
export default function FeaturedCard({ featured, posts }) {
  const [current, setCurrent] = useState(featured);
  const [prev, setPrev] = useState(null); // the outgoing face, kept underneath while the new one fades in
  const [entry, setEntry] = useState("initial");
  const currentRef = useRef(featured);
  const postsRef = useRef(posts);
  const pausedRef = useRef(false);
  const readyRef = useRef(new Set());

  useEffect(() => {
    postsRef.current = posts;
    // Fetch each card image ahead of time; a post is only picked once its image has loaded, so
    // the card never fades to a blank face
    posts.forEach((post) => {
      if (readyRef.current.has(post.id)) return;
      if (!post.image) return readyRef.current.add(post.id);
      const img = new window.Image();
      img.onload = img.onerror = () => readyRef.current.add(post.id);
      img.src = post.image;
    });
  }, [posts]);

  useEffect(() => {
    const timers = new Set();
    const rotate = setInterval(() => {
      // Holds still while it's being read (hover/focus) or the tab is in the background
      if (pausedRef.current || document.hidden) return;
      const showing = currentRef.current;
      // Never the same post twice in a row; with fewer than two eligible posts nothing changes
      const choices = postsRef.current.filter((post) => post.id !== showing.id && readyRef.current.has(post.id));
      if (!choices.length) return;
      const next = choices[Math.floor(Math.random() * choices.length)];
      currentRef.current = next;
      setPrev(showing);
      setCurrent(next);
      setEntry("swap");
      // Drop the old face once the new one fully covers it
      const timer = setTimeout(() => {
        timers.delete(timer);
        setPrev((face) => (face?.id === showing.id ? null : face));
      }, FADE_MS + 100);
      timers.add(timer);
    }, ROTATE_EVERY_MS);
    return () => {
      clearInterval(rotate);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <Link
      href={postHref(current)}
      className="group relative isolate block aspect-[7/5] overflow-hidden rounded-2xl bg-[#e2f1ff] sm:aspect-[16/9] lg:aspect-[3/2]"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      onFocus={() => (pausedRef.current = true)}
      onBlur={() => (pausedRef.current = false)}
    >
      {prev && (
        <div key={`out-${prev.id}`} aria-hidden="true" className="absolute inset-0 bg-[#e2f1ff]">
          <CardFace post={prev} leaving />
        </div>
      )}
      {/* Keyed by post, so a new face mounts and plays its fade and text rise */}
      <div key={current.id} className={`absolute inset-0 bg-[#e2f1ff] ${entry === "swap" ? "featured-fade-in" : ""}`}>
        <CardFace post={current} entry={entry} />
      </div>
    </Link>
  );
}

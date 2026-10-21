"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { postHref } from "@/lib/blog";

const ALL = "all";

// The grid's page and category live in the URL (/blogs?category=ERP&page=2), so every page can be
// linked to and crawled. Changing either fetches only the new page of cards; nothing else reloads.
const gridHref = ({ category, page }) => {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/blogs?${query}` : "/blogs";
};

// Page buttons to show: always the first and last pages and the current one with its neighbours,
// with a gap ("…") wherever pages are skipped. At most 7 entries, so it fits on a phone.
function pageItems(page, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const start = Math.max(2, Math.min(page - 1, totalPages - 4));
  const end = Math.min(totalPages - 1, Math.max(page + 1, 5));
  const middle = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  return [1, ...(start > 2 ? ["gap-start"] : []), ...middle, ...(end < totalPages - 1 ? ["gap-end"] : []), totalPages];
}

// Frosted-glass card: a translucent white panel with a light blur over the section's soft blue
// backdrop, a hairline white border and a blue-tinted shadow that deepens as the card lifts on
// hover. Titles are stored lowercase; first-letter:uppercase shows them in sentence case.
function BlogCard({ post }) {
  const [imageFailed, setImageFailed] = useState(false);
  const meta = [post.type, post.date].filter(Boolean).join(" · ");
  return (
    <li>
      <Link
        href={postHref(post)}
        className="group flex h-full flex-col rounded-3xl border border-white/80 bg-white/55 p-2.5 shadow-[0_8px_30px_-12px_rgba(10,80,165,0.18)] ring-1 ring-[#0A50A5]/[0.06] backdrop-blur-md transition duration-300 ease-out hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_18px_40px_-14px_rgba(10,80,165,0.28)] focus-visible:ring-2 focus-visible:ring-[#0A50A5] focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      >
        {/* Fixed 16:9 frame, filled edge to edge (cover, centred) whatever the upload's shape, so every
            card lines up; fill sizes the image to 100% of the frame, which clips it to its corners */}
        <span className="relative block aspect-video overflow-hidden rounded-[1.125rem] bg-[#e2f1ff]">
          {post.image && !imageFailed ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              unoptimized
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              onError={() => setImageFailed(true)}
              className="object-cover object-center"
            />
          ) : (
            // Missing upload: a quiet placeholder keeps the card the same size
            <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-[#0A50A5]/30">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-12">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <circle cx="9" cy="10" r="2" />
                <path d="m21 16-5-5-9 9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </span>
        <span className="flex flex-1 flex-col px-2.5 pt-4 pb-3 sm:px-3">
          {meta && <span className="text-xs font-semibold tracking-wide text-[#0A50A5]">{meta}</span>}
          {/* Two-line minimums keep every card in a row the same height */}
          <h3 className="mt-2 line-clamp-2 min-h-[2lh] text-base font-bold leading-snug text-blue-950 first-letter:uppercase sm:text-[1.0625rem]">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-2 line-clamp-2 min-h-[2lh] text-sm leading-relaxed text-[#4A5E80] first-letter:uppercase">
              {post.excerpt}
            </p>
          )}
        </span>
      </Link>
    </li>
  );
}

const chevron = (direction) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="size-4">
    <path d={direction === "prev" ? "m12 5-5 5 5 5" : "m8 5 5 5-5 5"} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const stepClass =
  "inline-flex h-8 items-center gap-1 rounded-md bg-[#dcedfc] px-2.5 text-sm font-medium text-blue-950 sm:h-10 sm:px-4";

// Previous/Next are real links (crawlable, open in a new tab); on the last/first page they turn
// into inert labels.
function StepLink({ direction, page, totalPages, hrefFor, onNavigate }) {
  const target = direction === "prev" ? page - 1 : page + 1;
  const label = direction === "prev" ? "Previous" : "Next";
  const content = (
    <>
      {direction === "prev" && chevron("prev")}
      <span className="sr-only sm:not-sr-only">{label}</span>
      {direction === "next" && chevron("next")}
    </>
  );
  if (target < 1 || target > totalPages) {
    return (
      <span aria-disabled="true" className={`${stepClass} cursor-not-allowed opacity-40`}>
        {content}
      </span>
    );
  }
  return (
    <Link
      href={hrefFor(target)}
      scroll={false}
      onClick={(e) => onNavigate(e, target)}
      aria-label={`${label} page`}
      className={`${stepClass} hover:bg-[#c9e3fa] focus-visible:ring-2 focus-visible:ring-[#0A50A5] focus-visible:outline-none`}
    >
      {content}
    </Link>
  );
}

function Pagination({ page, totalPages, hrefFor, onNavigate }) {
  if (totalPages < 2) return null;
  const stepProps = { page, totalPages, hrefFor, onNavigate };
  return (
    <nav aria-label="Blog pages" className="mt-12 flex items-center justify-center gap-1.5 sm:mt-14 sm:gap-2">
      <StepLink direction="prev" {...stepProps} />
      <ol className="flex items-center gap-1 sm:gap-1.5">
        {pageItems(page, totalPages).map((item) =>
          typeof item === "string" ? (
            <li key={item} aria-hidden="true" className="w-5 text-center text-sm text-slate-400 sm:w-6">
              …
            </li>
          ) : (
            <li key={item}>
              {item === page ? (
                <span
                  aria-current="page"
                  className="inline-flex size-8 items-center justify-center rounded-md bg-[#0A50A5] text-sm font-semibold text-white sm:size-10"
                >
                  {item}
                </span>
              ) : (
                <Link
                  href={hrefFor(item)}
                  scroll={false}
                  onClick={(e) => onNavigate(e, item)}
                  aria-label={`Page ${item}`}
                  className="inline-flex size-8 items-center justify-center rounded-md text-sm font-medium text-blue-950 hover:bg-[#dcedfc] focus-visible:ring-2 focus-visible:ring-[#0A50A5] focus-visible:outline-none sm:size-10"
                >
                  {item}
                </Link>
              )}
            </li>
          )
        )}
      </ol>
      <StepLink direction="next" {...stepProps} />
    </nav>
  );
}

// posts is already the current page of cards; the server works it out from the URL (see gridPage).
export default function BlogGrid({ posts, categories, category, page, totalPages }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const sectionRef = useRef(null);
  const shownPage = useRef(page);

  const go = (href) => startTransition(() => router.push(href, { scroll: false }));

  // A new page brings the reader back to the top of the grid (the pagination sits below it)
  useEffect(() => {
    if (shownPage.current === page) return;
    shownPage.current = page;
    sectionRef.current?.scrollIntoView({ block: "start" });
  }, [page]);

  // Plain clicks go through the transition so the current cards stay up (dimmed) until the next
  // page arrives; modified clicks (new tab etc.) keep the browser's normal link behaviour.
  const onNavigate = (e, target) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    go(gridHref({ category, page: target }));
  };

  return (
    <section ref={sectionRef} className="relative isolate mt-12 scroll-mt-28 sm:mt-14 lg:scroll-mt-32">
      {/* Soft sky-blue haze (the site's hero blues) for the glass cards to frost over */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-10 bottom-0 -z-10"
        style={{
          background:
            "radial-gradient(40% 30% at 12% 18%, rgba(179, 216, 248, 0.45), transparent 70%), radial-gradient(38% 28% at 88% 52%, rgba(198, 231, 250, 0.55), transparent 70%), radial-gradient(45% 30% at 35% 92%, rgba(203, 230, 252, 0.45), transparent 70%)",
        }}
      />
      <div className="flex justify-end">
        <label className="relative inline-flex items-center">
          <span className="sr-only">Filter blogs by category</span>
          <select
            value={category || ALL}
            // A new category always starts again from page 1
            onChange={(e) => go(gridHref({ category: e.target.value === ALL ? "" : e.target.value, page: 1 }))}
            className="cursor-pointer appearance-none rounded-md bg-[#dcedfc] py-2 pr-10 pl-4 text-sm font-medium text-blue-950 outline-none focus-visible:ring-2 focus-visible:ring-[#0A50A5]"
          >
            <option value={ALL}>All Category</option>
            {categories.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 flex size-5 items-center justify-center rounded-full bg-white/80 text-blue-950"
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="size-3">
              <path d="m5 8 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </label>
      </div>

      <div aria-busy={pending} className={pending ? "opacity-60" : undefined}>
        {posts.length > 0 ? (
          <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:mt-8 lg:grid-cols-3 lg:gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </ul>
        ) : (
          <p className="mt-10 text-center text-sm text-slate-500">No blogs found in this category.</p>
        )}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        hrefFor={(target) => gridHref({ category, page: target })}
        onNavigate={onNavigate}
      />
    </section>
  );
}

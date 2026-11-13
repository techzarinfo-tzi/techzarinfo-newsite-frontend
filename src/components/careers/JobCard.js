"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { APPLY_SECTION_ID, applyFor } from "@/lib/careers";

const applyClass =
  "inline-flex min-w-[9.5rem] items-center justify-center rounded-full bg-[#0A50A5] px-8 py-3 text-sm font-medium text-white shadow-md transition-colors hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A50A5]";

function Tags({ tags }) {
  if (!tags.length) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Job details">
      {tags.map((tag, i) => (
        <li
          key={i}
          className="rounded-full border border-[#7fa8e6] bg-[#d6e6ff] px-3 py-0.5 text-xs font-medium text-[#0A50A5]"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

// One job opening. The summary is clamped to two lines; only when that actually cuts text off does
// an arrow appear, which opens the full description in a modal.
export default function JobCard({ job }) {
  const summaryRef = useRef(null);
  const dialogRef = useRef(null);
  const titleId = useId();
  const [clipped, setClipped] = useState(false);
  const [open, setOpen] = useState(false);

  // Re-measured whenever the card's width changes (rotation, resizing, fonts loading).
  useEffect(() => {
    const el = summaryRef.current;
    if (!el) return;
    const measure = () => setClipped(el.scrollHeight > el.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Open as a modal dialog (Escape, focus trapping and the backdrop come from the browser) and stop
  // the page behind it from scrolling while it is open.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    if (!dialog.open) dialog.showModal();
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
      if (dialog.open) dialog.close();
    };
  }, [open]);

  // "Apply Now" (card or modal): close the modal and hand the opening to the application form,
  // which selects it and scrolls itself into view. Without JS the link still jumps to the form.
  const apply = (e) => {
    e.preventDefault();
    if (dialogRef.current?.open) dialogRef.current.close();
    applyFor(job.id);
  };

  return (
    <article className="flex h-full flex-col items-start rounded-2xl border border-[#c9dcfb] bg-linear-to-b from-white to-[#eaf4ff] p-6 shadow-[0_10px_30px_rgba(10,80,165,0.08)] transition-shadow duration-300 hover:shadow-[0_14px_36px_rgba(10,80,165,0.14)] sm:p-7">
      <h3 className="text-[22px] font-semibold leading-tight text-[#002461] sm:text-[26px]">{job.title}</h3>

      {job.summary && (
        <div className="mt-3 flex w-full items-end gap-3">
          <p ref={summaryRef} className="line-clamp-2 max-w-[24em] text-base leading-snug text-[#002461]/70 sm:text-lg">
            {job.summary}
          </p>
          {clipped && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-label={`Read the full description for ${job.title}`}
              title="Read more"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-[#7fa8e6] bg-white text-[#0A50A5] transition-colors hover:bg-[#0A50A5] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A50A5]"
            >
              <ArrowUpRight className="size-4.5" strokeWidth={2.25} aria-hidden="true" />
            </button>
          )}
        </div>
      )}

      {job.tags.length > 0 && (
        <div className="mt-4">
          <Tags tags={job.tags} />
        </div>
      )}

      {/* Pushes the button to the card's bottom, so buttons line up across a row */}
      <div className="mt-auto pt-6">
        <a href={`#${APPLY_SECTION_ID}`} onClick={apply} aria-label={`Apply now for ${job.title}`} className={applyClass}>
          Apply Now
        </a>
      </div>

      {open && (
        <dialog
          ref={dialogRef}
          aria-labelledby={titleId}
          onClose={() => setOpen(false)}
          // A click on the backdrop lands on the dialog itself (its content fills the box)
          onClick={(e) => {
            if (e.target === e.currentTarget) e.currentTarget.close();
          }}
          className="job-dialog m-auto w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-[1.75rem] border border-[#c9dcfb] bg-white p-0 text-[#002461] shadow-[0_24px_60px_rgba(0,36,97,0.25)] backdrop:bg-[#002461]/35 backdrop:backdrop-blur-sm"
        >
          <div className="flex max-h-[min(85dvh,48rem)] flex-col">
            <header className="flex items-start justify-between gap-4 border-b border-[#0A50A5]/10 bg-linear-to-b from-[#eaf4ff] to-white px-6 pt-6 pb-5 sm:px-8 sm:pt-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0A50A5]">Current Opening</p>
                <h2 id={titleId} className="mt-1 text-[22px] font-semibold leading-tight sm:text-[26px]">
                  {job.title}
                </h2>
                {job.tags.length > 0 && (
                  <div className="mt-3">
                    <Tags tags={job.tags} />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label="Close"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-[#c9dcfb] bg-white text-[#002461] transition-colors hover:bg-[#0A50A5] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A50A5]"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </header>

            {/* Sanitized on the server (lib/careers.js): allowlisted tags only, no attributes but safe links */}
            <div
              className="job-description min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5 text-base leading-relaxed text-[#002461]/80 sm:px-8 sm:py-6"
              dangerouslySetInnerHTML={{ __html: job.html }}
            />

            <footer className="flex justify-end border-t border-[#0A50A5]/10 px-6 py-4 sm:px-8">
              <a href={`#${APPLY_SECTION_ID}`} onClick={apply} aria-label={`Apply now for ${job.title}`} className={applyClass}>
                Apply Now
              </a>
            </footer>
          </div>
        </dialog>
      )}
    </article>
  );
}

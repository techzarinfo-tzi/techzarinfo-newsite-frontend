"use client";

import { useLayoutEffect, useRef } from "react";

// Site-wide scroll reveal: the wrapped section fades in while rising into place once it enters the
// viewport (styles: [data-reveal] in globals.css, so every section shares one timing). Plays once
// per page view.
//
// It never hides content it cannot animate: the server render and a no-JS visit show everything,
// and so does a section already on screen (or scrolled past) when the page loads, so the hero and
// a restored scroll position never flash. Only sections still below the fold are hidden, before
// paint. Reduced motion skips it entirely. All instances share one IntersectionObserver.
//
// The wrapper only carries a transform while it animates, so sticky/fixed content inside the
// section behaves as before once it has settled.

let observer;
const pending = new Map();

function observe(el, show) {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        pending.get(entry.target)?.();
        pending.delete(entry.target);
        observer.unobserve(entry.target);
      }
    },
    // Fire a little after the top edge clears the bottom of the screen
    { rootMargin: "0px 0px -8% 0px" }
  );
  pending.set(el, show);
  observer.observe(el);
  return () => {
    pending.delete(el);
    observer.unobserve(el);
  };
}

export default function Reveal({ children, className }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.dataset.reveal = "hidden";
    const settle = (e) => {
      if (e.target === el && e.propertyName === "translate") delete el.dataset.reveal;
    };
    el.addEventListener("transitionend", settle);
    const stop = observe(el, () => {
      el.dataset.reveal = "shown";
    });
    return () => {
      stop();
      el.removeEventListener("transitionend", settle);
      delete el.dataset.reveal;
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

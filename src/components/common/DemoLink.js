"use client";

import { DEMO_RETURN_KEY, DEMO_URL } from "@/config/demo";

// The "Free Demo" booking flow. The button opens the Calendly booking page in the same tab; after a
// booking, Calendly redirects to /demo-booked (set once in the Calendly event's settings, see
// app/demo-booked), which sends the visitor back to the page they came from. That page is
// remembered here before leaving (sessionStorage), and also passed through Calendly as utm_content
// in case storage is unavailable.

// Used by HeroButton for href={DEMO_URL}. Takes the same props as an <a>.
export default function DemoLink({ onClick, children, ...props }) {
  return (
    <a
      href={DEMO_URL}
      onClick={(event) => {
        onClick?.(event);
        // Leave modified clicks (new tab / window) to the browser; there is nothing to return to
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        const from = window.location.pathname + window.location.search + window.location.hash;
        try {
          sessionStorage.setItem(DEMO_RETURN_KEY, from);
        } catch {
          // storage blocked: the utm_content copy below still carries it
        }
        const url = new URL(DEMO_URL);
        url.searchParams.set("utm_source", "website");
        url.searchParams.set("utm_content", from);
        window.location.assign(url.toString());
      }}
      {...props}
    >
      {children}
    </a>
  );
}

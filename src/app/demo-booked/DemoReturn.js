"use client";

import { useEffect } from "react";
import Link from "next/link";
import { DEMO_RETURN_KEY } from "@/config/demo";

// Only a path on this site is followed ("/..." but not "//host"), so the redirect can't be pointed
// anywhere else through the URL.
const safePath = (value) => (typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : null);

// The page the visitor booked from: remembered by DemoLink before leaving for Calendly, or, if the
// browser's storage was unavailable, the utm_content Calendly passes back. Falls back to the homepage.
function returnPath() {
  let stored = null;
  try {
    stored = sessionStorage.getItem(DEMO_RETURN_KEY);
    sessionStorage.removeItem(DEMO_RETURN_KEY);
  } catch {
    // storage blocked
  }
  const passed = new URLSearchParams(window.location.search).get("utm_content");
  return safePath(stored) ?? safePath(passed) ?? "/";
}

// A short confirmation while the browser heads back (replace, so Back doesn't land here again)
export default function DemoReturn() {
  useEffect(() => {
    window.location.replace(returnPath());
  }, []);

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-white px-4 pt-28 pb-16 text-center">
      <div>
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-[#002461] sm:text-[34px]">
          Your demo is booked!
        </h1>
        <p className="mt-3 text-base text-[#002461]/80 sm:text-lg">Taking you back to where you left off…</p>
        <Link href="/" className="mt-6 inline-block text-sm text-[#002461] underline underline-offset-4">
          Go to the homepage
        </Link>
      </div>
    </section>
  );
}

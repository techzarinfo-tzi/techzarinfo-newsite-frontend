"use client";

import { usePathname } from "next/navigation";

// Renders its children on every page except the given paths (exact matches), e.g. to leave a
// site-wide section out of a few pages from the root layout. Children can be server components.
export default function HiddenOn({ paths, children }) {
  const pathname = usePathname();
  return paths.includes(pathname) ? null : children;
}

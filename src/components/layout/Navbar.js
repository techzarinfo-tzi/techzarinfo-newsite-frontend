"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { navLinks } from "@/config/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4 lg:top-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-white/60 bg-white/45 px-4 py-2.5 shadow-lg shadow-blue-900/10 backdrop-blur-xl backdrop-saturate-150 lg:px-6 lg:py-3">
        <Logo />

        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#0A50A5] transition-colors hover:text-blue-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className="hidden shrink-0 rounded-full bg-blue-950 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-900 lg:inline-block"
        >
          Contact Us
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex shrink-0 items-center justify-center rounded-full p-2 text-blue-950 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="mx-auto mt-2 max-w-7xl rounded-3xl border border-white/60 bg-white/45 px-6 py-5 shadow-lg shadow-blue-900/10 backdrop-blur-xl backdrop-saturate-150 lg:hidden">
          <nav className="flex flex-col gap-4" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-[#0A50A5]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="mt-4 block rounded-full bg-blue-950 px-6 py-2.5 text-center text-sm font-semibold text-white shadow-md"
          >
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
}

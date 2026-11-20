"use client";

import { usePathname } from "next/navigation";

// The site-wide testimonials heading. The section lives in the root layout (one instance for every
// page), so a page that wants its own heading and intro is listed here by path; every other page
// keeps the default.
const DEFAULT = { title: "What our clients says about us" };

const PER_PAGE = {
  "/mobile-app-development-company": {
    title: "Satisfaction delivered by our services",
    text: "Discover our software development company's commitment to excellence. We provide a range of exceptional services tailored to meet your specific needs, delivering innovative solutions that empower your business",
  },
};

export default function TestimonialsHeading() {
  const { title, text } = PER_PAGE[usePathname()] ?? DEFAULT;
  return (
    <>
      <h2 className="text-center text-[26px] font-bold leading-[1.2] text-[#002148] sm:text-[32px] lg:text-[36px]">
        {title}
      </h2>
      {text && (
        <p className="mx-auto mt-3 max-w-[760px] text-center text-[15px] leading-normal text-[#002148] sm:text-base lg:text-lg">
          {text}
        </p>
      )}
    </>
  );
}

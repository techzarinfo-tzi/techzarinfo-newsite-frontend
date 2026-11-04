"use client";

// A link to the site-wide Contact Us section (ContactUsSection.js, #contact, in the root layout, so
// it is at the bottom of every page). Used by every "Start a Project" button, through HeroButton
// (href="#contact") or directly. Takes the same props as an <a>.
export default function ContactLink({ onClick, children, ...props }) {
  return (
    <a
      href="#contact"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) scrollToContact(event);
      }}
      {...props}
    >
      {children}
    </a>
  );
}

// Scrolls to the Contact Us section, stopping where that section is laid out to sit: just under the
// fixed navbar, by the room it reserves for it (its --cu-nav, 96px; 84px on phones), so its heading is
// never hidden. Smooth unless the visitor prefers reduced motion. Without the script, the plain
// #contact link still jumps there.
export function scrollToContact(event) {
  const contact = document.getElementById("contact");
  if (!contact) return;
  event.preventDefault();

  const nav = parseFloat(getComputedStyle(contact.querySelector(".cu-in") ?? contact).getPropertyValue("--cu-nav")) || 96;
  const top = contact.getBoundingClientRect().top + window.scrollY - nav;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}

import Link from "next/link";
import ContactLink from "@/components/common/ContactLink";
import DemoLink from "@/components/common/DemoLink";
import { DEMO_URL } from "@/config/demo";

// The hero call-to-action button, shared by every page hero. The page passes the content (label,
// href...); this file only owns the look.
// tone: the hero's button style. "product" is the product pages' square navy buttons (Blockchain,
// CMMS, CRM, e-commerce, ERP, LMS); "home" is the homepage's rounded buttons with a shadow.
// variant: "primary" (filled) or "secondary" (outline).
const tones = {
  product: {
    group: "mt-8 flex flex-wrap items-center justify-center gap-4 lg:mt-10 lg:justify-start lg:gap-6",
    primary:
      "rounded-[3px] border border-[#002461] bg-[#002461] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0a3480] lg:text-base",
    secondary:
      "rounded-[3px] border border-[#002461] px-5 py-2.5 text-sm font-medium text-[#002461] transition-colors hover:bg-[#002461]/5 lg:text-base",
  },
  home: {
    group: "mt-6 flex flex-wrap items-center justify-center gap-4 lg:justify-start",
    primary:
      "rounded-lg bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-900",
    secondary:
      "rounded-lg border border-blue-950 px-5 py-2.5 text-sm font-semibold text-blue-950 transition-colors hover:bg-blue-950/5",
  },
};

const join = (...classes) => classes.filter(Boolean).join(" ");

/**
 * One hero button: a link when given an href, otherwise a plain button (for onClick-only actions).
 * Any other props (aria-*, id...) pass through to the element.
 *
 * @param {object} props
 * @param {string} props.label Button text.
 * @param {string} [props.href] Where it goes; "#contact" smooth-scrolls to the Contact Us section, and
 *   DEMO_URL (config/demo.js) opens the demo booking and returns to this page afterwards. Leave out for
 *   a click-only button.
 * @param {"primary" | "secondary"} [props.variant="primary"] Filled or outline.
 * @param {"product" | "home"} [props.tone="product"] Which hero's button style.
 * @param {string} [props.className] Extra page-specific classes, added after the built-in ones.
 * @param {(event: MouseEvent) => void} [props.onClick] Optional click handler.
 * @param {string} [props.target] Link target, e.g. "_blank" (which also gets rel="noopener noreferrer").
 */
export default function HeroButton({
  label,
  href,
  variant = "primary",
  tone = "product",
  className,
  onClick,
  target,
  ...props
}) {
  const classes = join(tones[tone][variant], className);
  // "#contact": smooth-scroll to the Contact Us section at the bottom of the page
  if (href === "#contact") {
    return (
      <ContactLink onClick={onClick} className={classes} {...props}>
        {label}
      </ContactLink>
    );
  }
  // DEMO_URL: book a demo on Calendly, then come back to this page
  if (href === DEMO_URL) {
    return (
      <DemoLink onClick={onClick} className={classes} {...props}>
        {label}
      </DemoLink>
    );
  }
  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        onClick={onClick}
        className={classes}
        {...props}
      >
        {label}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes} {...props}>
      {label}
    </button>
  );
}

/**
 * The row the hero buttons sit in: centred on mobile, left-aligned from lg, with the tone's spacing.
 *
 * @param {object} props
 * @param {"product" | "home"} [props.tone="product"] Match the buttons' tone.
 * @param {string} [props.className] Extra classes (e.g. a hero's entrance animation).
 * @param {object} [props.style] Inline style (e.g. that animation's delay).
 * @param {import("react").ReactNode} props.children The HeroButton elements.
 */
export function HeroButtonGroup({ tone = "product", className, style, children }) {
  return (
    <div className={join(className, tones[tone].group)} style={style}>
      {children}
    </div>
  );
}

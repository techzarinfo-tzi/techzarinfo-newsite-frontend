import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { footerColumns, footerContact, footerSocial, footerLegal } from "@/config/footer";
import FooterAiGuide from "./FooterAiGuide";
import "./Footer.css";

// Site-wide footer (rendered from the root layout). From lg up it's laid out on the reference
// design's own 800-unit grid (see Footer.css), so every block keeps its exact position and size
// relative to the viewport width; below lg the same markup reflows into a stacked layout.

const socialIcons = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.6" />
      <circle cx="17.6" cy="6.4" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="2" y="2" width="20" height="20" rx="4" />
      <path d="M7.5 10.5v6.5M7.5 7v.01M11.5 17v-6.5M11.5 13.3c0-1.7 1.1-2.9 2.6-2.9s2.4 1 2.4 2.8V17" strokeLinecap="round" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z" />
    </svg>
  ),
};

function PhoneIcon() {
  return (
    <svg viewBox="3 3 18 18" fill="currentColor" aria-hidden="true">
      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 20 15" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="0.8" y="0.8" width="18.4" height="13.4" rx="1.4" />
      <path d="M1.2 1.4 10 8.2l8.8-6.8" strokeLinejoin="round" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer data-guide="footer" className="site-footer">
      {/* Animated backdrop: the clip is light on black, so it's screen-blended (black drops out,
          only the glow shows) at low strength behind everything. A plain <img> inside <picture>
          so reduced-motion visitors get a still frame (alt="" marks it decorative); lazy since the
          footer is below the fold. */}
      <picture className="ft-bg">
        <source media="(prefers-reduced-motion: reduce)" srcSet="/footer-bg-still.jpg" />
        <img src="/footer-bg.gif" alt="" loading="lazy" decoding="async" />
      </picture>
      <div className="ft">
        <Link href="/" className="ft-logo" aria-label={`${siteConfig.name} home`}>
          <Image src="/white-logo.png" alt={`${siteConfig.name} logo`} width={3126} height={626} />
        </Link>

        <div className="ft-contact">
          <h2 className="ft-heading">Contact Us</h2>
          <div className="ft-contact-row ft-contact-phone">
            <PhoneIcon />
            <ul>
              {footerContact.phones.map((p) => (
                <li key={p.tel}>
                  <a href={`tel:${p.tel}`}>
                    {p.label} : {p.display}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="ft-contact-row ft-contact-mail">
            <MailIcon />
            <ul>
              {footerContact.emails.map((email) => (
                <li key={email}>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul className="ft-social" aria-label="Social media">
          {footerSocial.map((s) => (
            <li key={s.id} className={`ft-social-${s.id}`}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                {socialIcons[s.id]}
              </a>
            </li>
          ))}
        </ul>

        {footerColumns.map((col) => (
          <nav key={col.id} className={`ft-panel ft-panel-${col.id}`} aria-label={col.title}>
            <h2 className="ft-heading">{col.title}</h2>
            <ul>
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <FooterAiGuide />

        <p className="ft-legal">
          {footerLegal.map((l, i) => (
            <span key={l.href}>
              {i > 0 && "|"}
              <Link href={l.href}>{l.label}</Link>
            </span>
          ))}
        </p>

        <svg className="ft-wordmark" viewBox="0 318 800 119" aria-hidden="true" focusable="false">
          <text x="-15" y="435">Techzarinfo</text>
          {/* Walking mascot. Lives in the wordmark's own coordinates so it stays on the letters at
              every width; each group's origin is the robot's feet. It walks along the lowercase
              letter tops and hops up onto the h, the i's dot and the f, which glow and puff a ring
              when it lands, with one somersault along the way (choreography in Footer.css). */}
          <defs>
            <clipPath id="ft-letters">
              <text x="-15" y="435">Techzarinfo</text>
            </clipPath>
          </defs>
          <g clipPath="url(#ft-letters)">
            {/* Slanted to the italic so each glow stays within its own letter */}
            <polygon className="ft-react ft-react-h" points="252,318 339,318 321,437 236,437" />
            <polygon className="ft-react ft-react-i" points="548,318 578,318 562,437 528,437" />
            <polygon className="ft-react ft-react-f" points="663,318 724,318 712,437 648,437" />
          </g>
          <ellipse className="ft-puff ft-puff-h" cx="266.5" cy="323" rx="9" ry="2.2" />
          <ellipse className="ft-puff ft-puff-i" cx="562" cy="324.5" rx="8" ry="2" />
          <ellipse className="ft-puff ft-puff-f" cx="712" cy="323" rx="9" ry="2.2" />
          <g className="ft-walker">
            <g className="ft-walker-y">
              <ellipse className="ft-walker-shadow" cx="0.6" cy="0.4" rx="8" ry="1.3" />
              <g className="ft-walker-lean">
                <g className="ft-walker-spin">
                  <g className="ft-walker-squash">
                    <image className="ft-walker-anim" href="/ai-walk.gif" x="-10.67" y="-45.49" width="20.93" height="46" />
                    <image className="ft-walker-still" href="/ai-walk-still.png" x="-10.67" y="-45.49" width="20.93" height="46" />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </footer>
  );
}

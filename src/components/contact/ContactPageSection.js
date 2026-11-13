import { footerContact, footerSocial } from "@/config/footer";
import { socialIcons } from "@/components/layout/Footer";
import WorldRouteMap from "./WorldRouteMap";
import ContactPageForm from "./ContactPageForm";
import "@/components/layout/ContactUsSection.css";
import "./ContactPage.css";

// The Contact Us page: heading, a white card with the interactive world map (and social links)
// beside the site's contact form, and the phone / email cards under it. Phones, email and social
// links come from the footer config, so they stay in step with the footer.

// The Contact Us page's UK line (the footer still lists its own UK number)
const UK_PHONE = { label: "UK", display: "+44-7587719203", tel: "+447587719203" };

// The page's other office lines, listed after India and the UK
const MORE_PHONES = [
  { label: "USA", display: "+1-7039525250", tel: "+17039525250" },
  { label: "MY", display: "+60-146634733", tel: "+60146634733" },
  { label: "AF", display: "+230-54773555", tel: "+23054773555" },
];

// India first, as in the design; the UK entry swapped for the page's UK line
const phones = [
  ...footerContact.phones
    .map((p) => (p.label === "UK" ? UK_PHONE : p))
    .sort((a, b) => (a.label === "IND" ? -1 : b.label === "IND" ? 1 : 0)),
  ...MORE_PHONES,
];
const salesEmail = footerContact.emails[0];

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8 9.8a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z" />
      <path d="M15 3.5a6 6 0 015.5 5.5M15 7a2.5 2.5 0 012 2" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="M3 6.5l9 6.5 9-6.5" />
    </svg>
  );
}

export default function ContactPageSection() {
  return (
    <section id="contact" data-guide="contact" className="cp" aria-labelledby="cp-title">
      <h1 id="cp-title" className="cp-title">
        Get in touch, let us know how we can help
      </h1>

      <div className="cp-card">
        <div className="cp-map-col">
          <WorldRouteMap className="cp-map" />
          <ul className="cp-social" aria-label="Techzarinfo on social media">
            {footerSocial.map((s) => (
              <li key={s.id}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  {socialIcons[s.id]}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="cp-form-col">
          <div className="cp-form">
            <ContactPageForm />
          </div>
        </div>
      </div>

      <div className="cp-reach">
        <div className="cp-chip">
          <span className="cp-chip-icon">
            <PhoneIcon />
          </span>
          <ul>
            {phones.map((p) => (
              <li key={p.label}>
                {p.label} : <a href={`tel:${p.tel}`}>{p.display}</a>
              </li>
            ))}
          </ul>
        </div>
        <a className="cp-chip" href={`mailto:${salesEmail}`}>
          <span className="cp-chip-icon">
            <MailIcon />
          </span>
          <span>{salesEmail}</span>
        </a>
      </div>
    </section>
  );
}

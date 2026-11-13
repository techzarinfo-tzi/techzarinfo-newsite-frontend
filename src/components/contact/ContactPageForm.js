"use client";

import { useRef, useState } from "react";
import ContactForm from "@/components/layout/ContactForm";

// The Contact page's form column: the site's contact form (ContactForm, posting to /store-data),
// swapped for the same thank-you note as the envelope section once sent.
export default function ContactPageForm() {
  const formRef = useRef(null);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="cp-thanks" role="status">
        <svg className="cu-check" viewBox="0 0 34 26" fill="none" stroke="currentColor" strokeWidth="3.4" aria-hidden="true">
          <path d="M2.5 13.5l9.5 9.5L31.5 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="cu-thanks-title">Thank you!</p>
        <p className="cu-thanks-text">
          Your message has been received.
          <br />
          We&rsquo;ll get back to you as soon as possible.
        </p>
        <button type="button" className="cu-again" onClick={() => setSent(false)}>
          Send another message
        </button>
      </div>
    );
  }

  return <ContactForm ref={formRef} idPrefix="cp" onSent={() => setSent(true)} />;
}

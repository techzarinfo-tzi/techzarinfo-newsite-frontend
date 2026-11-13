"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import ContactForm from "./ContactForm";
import "./ContactUsSection.css";

// Site-wide "How can we help you ?" section (rendered from the root layout, directly above the
// footer). A closed envelope opens as it scrolls into view and the enquiry form rises out of it
// as a letter; on a successful submit the letter sinks back in, the flap closes and a thank-you
// note appears (the reference Figma prototype "Desktop - 108"). All geometry is in design units
// (var(--u), see ContactUsSection.css) so the composition keeps its proportions at any width.
//
// data-state drives every transition: "static" (server render / reduced motion: the open form,
// nothing animated) -> "closed" (envelope shut, waiting below the fold) -> "open" -> "sent", and
// back to "closed" whenever the section leaves the screen, so each visit opens it afresh.

// The form itself (fields, validation, submit to /store-data) is ContactForm.js, shared with the
// Contact Us page.

// The backdrop's perspective floor grid, bowed slightly like the reference (rows sag towards the
// edges, columns lean out from a vanishing point far above). Built once, drawn in a 1440 x 1024 box.
const grid = (() => {
  const rows = [];
  for (let y = 1046, s = 56; y > 330 && rows.length < 40; y -= s, s *= 0.95) {
    const bow = 0.06 * (1100 - y);
    rows.push(`M-260 ${(y + bow).toFixed(1)}Q720 ${(y - bow).toFixed(1)} 1700 ${(y + bow).toFixed(1)}`);
  }
  const cols = [];
  for (let k = -13; k <= 13; k++) {
    const xb = 720 + 96 * k + 48;
    const xt = 720 + (xb - 720) * 0.74;
    const bulge = (xb - 720) * 0.05;
    cols.push(`M${xb.toFixed(1)} 1060Q${((xb + xt) / 2 + bulge).toFixed(1)} 700 ${xt.toFixed(1)} 330`);
  }
  return [...rows, ...cols].join("");
})();

// Envelope outline in its own 1000 x 480 box: rounded top and bottom corners
const ENVELOPE = "M0 26Q0 0 26 0H974Q1000 0 1000 26V454Q1000 480 974 480H26Q0 480 0 454z";

function Envelope() {
  return (
    <>
      {/* The whole envelope is drawn (1000 x 480, rounded corners) so it is never cropped.
          Inside lining, seen through the open mouth (fully hidden while the flaps are shut) */}
      <div className="cu-env cu-env-back" aria-hidden="true">
        <svg viewBox="0 0 1000 480" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cu-lining" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1170EE" />
              <stop offset="0.45" stopColor="#2F8CF8" />
              <stop offset="1" stopColor="#9CC7FA" />
            </linearGradient>
          </defs>
          <path d={ENVELOPE} fill="url(#cu-lining)" />
        </svg>
      </div>

      {/* Front pocket: bottom flap under the two side flaps, all with soft paper shading */}
      <div className="cu-env cu-env-front" aria-hidden="true">
        <svg viewBox="0 0 1000 480" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cu-side" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#F7F7F8" />
              <stop offset="0.75" stopColor="#F4F5F7" />
              <stop offset="1" stopColor="#ECEDF0" />
            </linearGradient>
            <linearGradient id="cu-bottom" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FBFBFC" />
              <stop offset="1" stopColor="#F3F4F6" />
            </linearGradient>
            <filter id="cu-shade-up" x="-10%" y="-20%" width="120%" height="140%">
              <feDropShadow dx="0" dy="-3" stdDeviation="7" floodColor="#0A2A6B" floodOpacity="0.14" />
            </filter>
            <filter id="cu-shade-side" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="5" dy="4" stdDeviation="8" floodColor="#0A2A6B" floodOpacity="0.13" />
            </filter>
            <clipPath id="cu-env-clip">
              <path d={ENVELOPE} />
            </clipPath>
          </defs>
          <g clipPath="url(#cu-env-clip)">
            {/* bottom flap rises from the bottom corners to its peak, behind the side flaps */}
            <path
              d="M0 480L459.1 268.8Q500 250 540.9 268.8L1000 480z"
              fill="url(#cu-bottom)"
              filter="url(#cu-shade-up)"
            />
            <g filter="url(#cu-shade-side)">
              <path d="M0 22Q0 2 16 13L358.5 280.4Q390 305 361.5 333.1L0 480z" fill="url(#cu-side)" />
            </g>
            <g filter="url(#cu-shade-side)" transform="translate(1000 0) scale(-1 1)">
              <path d="M0 22Q0 2 16 13L358.5 280.4Q390 305 361.5 333.1L0 480z" fill="url(#cu-side)" />
            </g>
          </g>
        </svg>
      </div>

      {/* Flap, open: its blue inner face standing above the envelope (behind the letter) */}
      <div className="cu-env-flap cu-flap-open" aria-hidden="true">
        <svg viewBox="0 -176 1000 176" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cu-flap-in" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1170EE" />
              <stop offset="1" stopColor="#2A8AF8" />
            </linearGradient>
          </defs>
          <path d="M2 0L234 -159Q252 -171 276 -171H724Q748 -171 766 -159L998 0z" fill="url(#cu-flap-in)" />
          <path
            d="M2 0L234 -159Q252 -171 276 -171H724Q748 -171 766 -159L998 0"
            fill="none"
            stroke="#0C55F8"
            strokeWidth="4"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Flap, closed: the white outer face folded down over the front */}
      <div className="cu-env-flap cu-flap-closed" aria-hidden="true">
        <svg viewBox="0 0 1000 480" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cu-flap-out" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ECEEF2" />
              <stop offset="0.55" stopColor="#F6F7F8" />
              <stop offset="1" stopColor="#FAFAFA" />
            </linearGradient>
            <filter id="cu-shade-down" x="-10%" y="-10%" width="120%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0A2A6B" floodOpacity="0.09" />
            </filter>
          </defs>
          {/* ends flat between the side-flap tips, like the reference */}
          <path d="M0 26Q0 0 26 0H974Q1000 0 1000 26L640 345Q500 353 360 345z" fill="url(#cu-flap-out)" filter="url(#cu-shade-down)" />
          <path d="M8 2H992" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        </svg>
        {/* Brand seal, centred on the closed envelope (this layer's box is the envelope) */}
        <Image src="/tzi.webp" alt="" width={54} height={35} unoptimized className="cu-seal" />
      </div>
    </>
  );
}

// The Contact Us page has this same form in its own layout, so the section stays off that page.
// (A separate component, so its observer is set up afresh whenever it comes back.)
export default function ContactUsSection() {
  const pathname = usePathname();
  if (pathname === "/contact-us") return null;
  return <ContactUsEnvelope />;
}

function ContactUsEnvelope() {
  const sectionRef = useRef(null);
  // reset() / clearError() of the form inside the letter
  const formRef = useRef(null);
  const [state, setState] = useState("static");

  // Latest state for the observer below (it is set up once)
  const stateRef = useRef(state);
  useLayoutEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Every visit starts from a shut envelope: once the section has left the screen completely, the
  // envelope shuts (instantly, out of sight; a sent message's thank-you note is cleared and the form
  // reset), and it opens again as soon as the section is back in view. Unsent form input is kept.
  // The section lives in the root layout, so this also covers moving between pages. Runs before
  // paint: a section that starts off-screen is shut before it is ever seen; one already on screen
  // stays open until it is left. With reduced motion there is no envelope animation: leaving only
  // clears a sent message, back to the open form.
  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const leave = () => {
      if (stateRef.current === "sent") formRef.current?.reset();
      formRef.current?.clearError();
      setState(still ? "static" : "closed");
    };
    if (!still && el.getBoundingClientRect().top >= window.innerHeight * 0.7) setState("closed");

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) leave();
        else if (entry.intersectionRatio >= 0.35 && stateRef.current === "closed") setState("open");
      },
      { threshold: [0, 0.35] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const sendAnother = () => {
    formRef.current?.reset();
    setState("open");
  };

  const formLive = state === "static" || state === "open";

  return (
    <section ref={sectionRef} id="contact" data-guide="contact" className="cu" aria-labelledby="cu-title">
      <div className="cu-in" data-state={state}>
        <svg className="cu-grid" viewBox="0 0 1440 1024" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
          <defs>
            <linearGradient id="cu-grid-fade" x1="0" y1="0" x2="0" y2="1024" gradientUnits="userSpaceOnUse">
              <stop offset="0.38" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.66" stopColor="#fff" stopOpacity="0.8" />
              <stop offset="1" stopColor="#fff" />
            </linearGradient>
            <mask id="cu-grid-mask">
              <rect x="-400" width="2240" height="1024" fill="url(#cu-grid-fade)" />
            </mask>
          </defs>
          <g mask="url(#cu-grid-mask)" fill="none" strokeLinecap="round">
            <path d={grid} stroke="#9CC2FF" strokeOpacity="0.35" strokeWidth="9" />
            <path d={grid} stroke="#C6DEFF" strokeOpacity="0.85" strokeWidth="2.6" />
          </g>
        </svg>

        <h2 id="cu-title" className="cu-title" inert={state === "sent"}>
          How can we help you ?
        </h2>
        <p className="cu-sub" inert={state === "sent"}>
          Have a project in mind? Share some details with us, and let&rsquo;s discuss how we can work together.
        </p>

        <div className="cu-stage">
          <div className="cu-glow" aria-hidden="true">
            <div className="cu-beam" />
            <div className="cu-halo" />
            <div className="cu-flash" />
          </div>

          <Envelope />

          {/* Clips the rising/sinking letter at the envelope bottom edge */}
          <div className="cu-letter-clip">
            <div className="cu-letter" inert={!formLive}>
              <ContactForm ref={formRef} live={formLive} onSent={() => setState("sent")} />
            </div>
          </div>
        </div>

        <div className="cu-thanks" inert={state !== "sent"} aria-live="polite">
          {state === "sent" && <span className="sr-only">Thank you! Your message has been received.</span>}
          <div aria-hidden={state !== "sent"}>
            <svg className="cu-check" viewBox="0 0 34 26" fill="none" stroke="currentColor" strokeWidth="3.4" aria-hidden="true">
              <path d="M2.5 13.5l9.5 9.5L31.5 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="cu-thanks-title">Thank you!</p>
            <p className="cu-thanks-text">
              Your message has been received.
              <br />
              We&rsquo;ll get back to you as soon as possible.
            </p>
            <button type="button" className="cu-again" onClick={sendAnother}>
              Send another message
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { servicesMenu } from "@/config/navigation";
import "./ContactUsSection.css";

// Site-wide "How can we help you ?" section (rendered from the root layout, directly above the
// footer). A closed envelope opens as it scrolls into view and the enquiry form rises out of it
// as a letter; on a successful submit the letter sinks back in, the flap closes and a thank-you
// note appears (the reference Figma prototype "Desktop - 108"). All geometry is in design units
// (var(--u), see ContactUsSection.css) so the composition keeps its proportions at any width.
//
// data-state drives every transition: "static" (server render / reduced motion: the open form,
// nothing animated) -> "closed" (envelope shut, waiting below the fold) -> "open" -> "sent".

const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

const countries = [
  { name: "India", dial: "+91" },
  { name: "United States", dial: "+1" },
  { name: "United Kingdom", dial: "+44" },
  { name: "United Arab Emirates", dial: "+971" },
  { name: "Saudi Arabia", dial: "+966" },
  { name: "Qatar", dial: "+974" },
  { name: "Oman", dial: "+968" },
  { name: "Kuwait", dial: "+965" },
  { name: "Bahrain", dial: "+973" },
  { name: "Singapore", dial: "+65" },
  { name: "Malaysia", dial: "+60" },
  { name: "Australia", dial: "+61" },
  { name: "Canada", dial: "+1" },
  { name: "Germany", dial: "+49" },
  { name: "France", dial: "+33" },
  { name: "Netherlands", dial: "+31" },
  { name: "South Africa", dial: "+27" },
  { name: "Nigeria", dial: "+234" },
  { name: "Kenya", dial: "+254" },
  { name: "Sri Lanka", dial: "+94" },
  { name: "Other", dial: "" },
];

const services = [...servicesMenu.groups.flatMap((g) => g.links.map((l) => l.label)), "Other"];

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

function Chevron() {
  return (
    <svg className="cu-chevron" viewBox="0 0 14 8" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M1 1l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DialFlag({ dial }) {
  if (dial !== "+91") {
    return (
      <svg className="cu-flag cu-flag-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18" />
      </svg>
    );
  }
  return (
    <svg className="cu-flag" viewBox="0 0 21 14" aria-hidden="true">
      <rect width="21" height="14" rx="1.5" fill="#fff" />
      <path d="M1.5 0h18A1.5 1.5 0 0 1 21 1.5v3.17H0V1.5A1.5 1.5 0 0 1 1.5 0z" fill="#FF9933" />
      <path d="M0 9.33h21v3.17A1.5 1.5 0 0 1 19.5 14h-18A1.5 1.5 0 0 1 0 12.5z" fill="#138808" />
      <circle cx="10.5" cy="7" r="1.7" fill="none" stroke="#000080" strokeWidth="0.6" />
    </svg>
  );
}

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

export default function ContactUsSection() {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const [state, setState] = useState("static");
  const [dial, setDial] = useState("+91");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Shut the envelope while it's still below the fold, then open it once it scrolls into view.
  // Runs before paint, so a section that's already on screen (or reduced motion) just stays open.
  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.7) return;

    setState("closed");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("open");
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onCountry = (e) => {
    const match = countries.find((c) => c.name === e.target.value);
    if (match?.dial) setDial(match.dial);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setSending(true);
    setError("");
    try {
      const res = await fetch(`${apiUrl}/store-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, phone: `${dial}${String(data.phone).replace(/\D/g, "")}` }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || body.status !== 1) {
        throw new Error(body.message || body.errors?.[0]?.msg || "We couldn't send your request, please try again later");
      }
      setState("sent");
    } catch (err) {
      setError(err instanceof TypeError ? "We couldn't send your request, please try again later" : err.message);
    } finally {
      setSending(false);
    }
  };

  const sendAnother = () => {
    formRef.current?.reset();
    setDial("+91");
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
              <form ref={formRef} className="cu-form" onSubmit={onSubmit}>
                {error && (
                  <p className="cu-error" role="alert">
                    {error}
                  </p>
                )}
                <div className="cu-field" style={{ "--i": 0 }}>
                  <label className="sr-only" htmlFor="cu-name">Name</label>
                  <input id="cu-name" name="name" className="cu-input" placeholder="Name" autoComplete="name" maxLength={100} required />
                </div>
                <div className="cu-field" style={{ "--i": 1 }}>
                  <label className="sr-only" htmlFor="cu-email">Email</label>
                  <input id="cu-email" name="email" type="email" className="cu-input" placeholder="Email" autoComplete="email" required />
                </div>
                <div className="cu-field" style={{ "--i": 2 }}>
                  <div className="cu-input cu-phone">
                    <span className="cu-dial" aria-hidden="true">
                      <DialFlag dial={dial} />
                      {dial}
                    </span>
                    <label className="sr-only" htmlFor="cu-phone">Phone number ({dial})</label>
                    <input
                      id="cu-phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      pattern="[0-9 \-]{5,}"
                      maxLength={15 - dial.length}
                      required
                    />
                  </div>
                </div>
                <div className="cu-field cu-row" style={{ "--i": 3 }}>
                  <div className="cu-select">
                    <label className="sr-only" htmlFor="cu-country">Country</label>
                    <select id="cu-country" name="country" className="cu-input" defaultValue="" onChange={onCountry} required>
                      <option value="" disabled>Country</option>
                      {countries.map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                    <Chevron />
                  </div>
                  <div className="cu-select">
                    <label className="sr-only" htmlFor="cu-service">Services</label>
                    <select id="cu-service" name="service" className="cu-input" defaultValue="" required>
                      <option value="" disabled>Services</option>
                      {services.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <Chevron />
                  </div>
                </div>
                <div className="cu-field" style={{ "--i": 4 }}>
                  <label className="sr-only" htmlFor="cu-message">Your message</label>
                  <textarea id="cu-message" name="message" className="cu-input cu-message" placeholder="Your message" maxLength={5000} required />
                </div>
                <div className="cu-field" style={{ "--i": 5 }}>
                  <button type="submit" className="cu-submit" disabled={sending}>
                    {sending ? "Sending…" : "Submit"}
                  </button>
                </div>
              </form>
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

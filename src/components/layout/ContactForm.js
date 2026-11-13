"use client";

import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { servicesMenu } from "@/config/navigation";
import GlassSelect from "@/components/common/GlassSelect";
import CountrySelect from "./CountrySelect";

// The website's contact enquiry form: name, email, phone (with the selected country's code),
// country, service and message, posted to the backend's /store-data (saved as a Contact enquiry
// and emailed to sales). Shared by the site-wide "How can we help you ?" section (inside its
// envelope letter) and the Contact Us page. Styled by ContactUsSection.css (.cu-* classes); the
// parent sets the size variables (--u, --ink, --field-bg, --field-line).
//
// `ref` exposes reset() (clear the form back to India) and clearError(). `live` false makes the
// form inert-friendly (closes the country list). `onSent` runs after a successful submit.

const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

// The phone field starts on India. The full country list (all flags + calling codes, see
// contactCountries.js) is loaded after mount, flags included, so until then the flag is a blank
// placeholder. The selected country is tracked rather than its dial code, since several countries
// share one (e.g. +1).
const defaultCountry = { code: "IN", name: "India", dial: "+91" };

const services = [...servicesMenu.groups.flatMap((g) => g.links.map((l) => l.label)), "Other"].map((label) => ({
  label,
}));
const serviceKey = (s) => s.label;
const serviceLabel = (s) => s.label;

function DialFlag({ country, countries }) {
  const Flag = (country.Flag ? country : countries.find((c) => c.code === country.code))?.Flag;
  return Flag ? <Flag className="cu-flag" aria-hidden="true" /> : <span className="cu-flag" aria-hidden="true" />;
}

export default function ContactForm({ ref, live = true, onSent, idPrefix = "cu", className = "" }) {
  const formRef = useRef(null);
  const [country, setCountry] = useState(defaultCountry);
  const { dial } = country;
  // The country picked in the Country field (none until chosen; the phone field still starts on India)
  const [picked, setPicked] = useState(null);
  const [service, setService] = useState(null);
  const [countries, setCountries] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    import("./contactCountries").then((m) => alive && setCountries(m.countries));
    return () => {
      alive = false;
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      reset() {
        formRef.current?.reset();
        setCountry(defaultCountry);
        setPicked(null);
        setService(null);
        setError("");
      },
      clearError() {
        setError("");
      },
    }),
    []
  );

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
      onSent?.();
    } catch (err) {
      setError(err instanceof TypeError ? "We couldn't send your request, please try again later" : err.message);
    } finally {
      setSending(false);
    }
  };

  const fid = (name) => `${idPrefix}-${name}`;

  return (
    <form ref={formRef} className={`cu-form ${className}`} onSubmit={onSubmit}>
      {error && (
        <p className="cu-error" role="alert">
          {error}
        </p>
      )}
      <div className="cu-field" style={{ "--i": 0 }}>
        <label className="sr-only" htmlFor={fid("name")}>Name</label>
        <input id={fid("name")} name="name" className="cu-input" placeholder="Name" autoComplete="name" maxLength={100} required />
      </div>
      <div className="cu-field" style={{ "--i": 1 }}>
        <label className="sr-only" htmlFor={fid("email")}>Email</label>
        <input id={fid("email")} name="email" type="email" className="cu-input" placeholder="Email" autoComplete="email" required />
      </div>
      <div className="cu-field" style={{ "--i": 2 }}>
        <div className="cu-input cu-phone">
          <span className="cu-dial" aria-hidden="true">
            <DialFlag country={country} countries={countries} />
            {dial}
          </span>
          <label className="sr-only" htmlFor={fid("phone")}>Phone number ({dial})</label>
          <input
            id={fid("phone")}
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
          <label className="sr-only" htmlFor={fid("country")}>Country</label>
          <CountrySelect
            id={fid("country")}
            name="country"
            countries={countries}
            value={picked}
            onChange={(c) => {
              setPicked(c);
              setCountry(c);
            }}
            disabled={!live}
            required
          />
        </div>
        <div className="cu-select">
          <label className="sr-only" htmlFor={fid("service")}>Services</label>
          <GlassSelect
            id={fid("service")}
            name="service"
            options={services}
            value={service}
            onChange={setService}
            getKey={serviceKey}
            getLabel={serviceLabel}
            placeholder="Services"
            invalidPlaceholder="Please select a service"
            searchable={false}
            listLabel="Services"
            minWidth={260}
            disabled={!live}
            required
          />
        </div>
      </div>
      <div className="cu-field" style={{ "--i": 4 }}>
        <label className="sr-only" htmlFor={fid("message")}>Your message</label>
        <textarea id={fid("message")} name="message" className="cu-input cu-message" placeholder="Your message" maxLength={5000} required />
      </div>
      <div className="cu-field" style={{ "--i": 5 }}>
        <button type="submit" className="cu-submit" disabled={sending}>
          {sending ? "Sending…" : "Submit"}
        </button>
      </div>
    </form>
  );
}

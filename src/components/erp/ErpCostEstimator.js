"use client";

import { useRef, useState } from "react";
import { Factory, HardHat, Hospital, House, LayoutGrid, ShoppingCart } from "lucide-react";

const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

// Icons from Lucide (lucide.dev), drawn in the site's colour via currentColor
const industryIcons = {
  Manufacturing: Factory,
  Construction: HardHat,
  "Retail & E-commerce": ShoppingCart,
  Healthcare: Hospital,
  "Real Estate": House,
  Other: LayoutGrid,
};

// The three questions, in order. Industry takes one answer; modules and features take one or more.
const QUESTIONS = [
  {
    key: "industry",
    title: "Choose Your Industry",
    multiple: false,
    options: ["Manufacturing", "Construction", "Retail & E-commerce", "Healthcare", "Real Estate", "Other"],
    error: "Please choose your industry",
  },
  {
    key: "modules",
    title: "Which Module Do You Want to Connect?",
    multiple: true,
    options: ["CRM", "HRMS", "Payroll", "Accounting & Finance", "Manufacturing", "Other"],
    error: "Please choose at least one module",
  },
  {
    key: "features",
    title: "What Features Want to Include in Your ERP?",
    multiple: true,
    options: [
      "AI Powered Intelligence",
      "Alerts & notifications",
      "Automated reports",
      "Task assignment",
      "Multi-location management",
      "Custom Features",
    ],
    error: "Please choose at least one feature",
  },
];

// Country codes for the phone field (India first, as in the design); picking one also fills in the
// Country field if it is still empty.
const COUNTRY_CODES = [
  { code: "+91", flag: "🇮🇳", country: "India" },
  { code: "+1", flag: "🇺🇸", country: "United States" },
  { code: "+44", flag: "🇬🇧", country: "United Kingdom" },
  { code: "+971", flag: "🇦🇪", country: "United Arab Emirates" },
  { code: "+966", flag: "🇸🇦", country: "Saudi Arabia" },
  { code: "+974", flag: "🇶🇦", country: "Qatar" },
  { code: "+965", flag: "🇰🇼", country: "Kuwait" },
  { code: "+968", flag: "🇴🇲", country: "Oman" },
  { code: "+973", flag: "🇧🇭", country: "Bahrain" },
  { code: "+65", flag: "🇸🇬", country: "Singapore" },
  { code: "+60", flag: "🇲🇾", country: "Malaysia" },
  { code: "+61", flag: "🇦🇺", country: "Australia" },
  { code: "+49", flag: "🇩🇪", country: "Germany" },
  { code: "+33", flag: "🇫🇷", country: "France" },
  { code: "+27", flag: "🇿🇦", country: "South Africa" },
  { code: "+234", flag: "🇳🇬", country: "Nigeria" },
  { code: "+254", flag: "🇰🇪", country: "Kenya" },
  { code: "+94", flag: "🇱🇰", country: "Sri Lanka" },
  { code: "+880", flag: "🇧🇩", country: "Bangladesh" },
  { code: "+977", flag: "🇳🇵", country: "Nepal" },
];

const newId = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : undefined);
const emptyContact = { name: "", email: "", phoneCode: "+91", phone: "", country: "" };

// Client-side checks matching the backend's rules (the backend checks again)
function checkContact(c) {
  const errors = {};
  if (!c.name.trim()) errors.name = "Name is required";
  if (!c.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email.trim())) errors.email = "Enter a valid email";
  const digits = c.phone.replace(/[\s-]/g, "");
  if (!digits) errors.phone = "Phone number is required";
  else if (!/^\d{6,15}$/.test(digits)) errors.phone = "Phone number must be 6 to 15 digits";
  if (!c.country.trim()) errors.country = "Country is required";
  return errors;
}

function Radio({ checked }) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-4 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors ${
        checked ? "border-[#2563eb]" : "border-[#a9bddc]"
      }`}
    >
      <span className={`size-2 rounded-full bg-[#2563eb] transition-transform duration-200 ${checked ? "scale-100" : "scale-0"}`} />
    </span>
  );
}

function OptionCard({ label, checked, onToggle, role, withIcon }) {
  const base = `group relative w-full rounded-[10px] border text-left transition-[background-color,border-color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb] ${
    checked
      ? "border-[#6f9cf2] bg-[#eef4ff] shadow-[0_6px_18px_-8px_rgba(37,99,235,0.45)]"
      : "border-[#c9d8ef] bg-white hover:border-[#9db9ea] hover:bg-[#f7faff]"
  }`;
  return (
    <button type="button" role={role} aria-checked={checked} onClick={onToggle} className={base}>
      {withIcon ? (
        <span className="flex min-h-[104px] flex-col justify-between gap-3 p-3.5 sm:min-h-[118px]">
          <span className="flex items-start justify-between">
            <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-lg bg-[#dce8ff] text-[#1f5fd0]">
              {(() => {
  const Icon = industryIcons[label];
  return <Icon aria-hidden="true" strokeWidth={1.7} className="size-5" />;
})()}
            </span>
            <Radio checked={checked} />
          </span>
          <span className="text-[14px] font-medium text-[#002461] sm:text-[15px]">{label}</span>
        </span>
      ) : (
        <span className="flex min-h-[64px] items-center gap-3 px-3.5 py-3 sm:min-h-[76px]">
          <Radio checked={checked} />
          <span className="text-[14px] font-medium leading-snug text-[#002461] sm:text-[15px]">{label}</span>
        </span>
      )}
    </button>
  );
}

const arrow = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-b from-[#3b82f6] to-[#1d5fe0] px-6 py-2.5 text-[15px] font-medium text-white shadow-[0_8px_18px_-8px_rgba(29,95,224,0.75)] transition-[filter,transform] hover:brightness-110 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60";

const fieldBase =
  "h-11 w-full rounded-md border bg-[#eef4ff] px-3.5 text-[15px] text-[#002461] outline-none transition placeholder:text-[#5d6f92] focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/15";

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-[13px] text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

// "What Would Your ERP Cost for Your Business?": three questions (industry, modules, features) and
// a contact form, one step at a time inside the white card, then a confirmation. The answers go to
// the backend's /erp-estimate endpoint, which stores them for the admin panel.
// submissionId is made once per filled-in form, so a double click or a retry is recognised by the
// backend as the same request rather than stored twice.
export default function ErpCostEstimator() {
  const [step, setStep] = useState(0); // 0-2: questions, 3: contact form, 4: done
  const [answers, setAnswers] = useState({ industry: "", modules: [], features: [] });
  const [contact, setContact] = useState(emptyContact);
  const [errors, setErrors] = useState({});
  const [stepError, setStepError] = useState("");
  const [formError, setFormError] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [submissionId, setSubmissionId] = useState(newId);
  const inFlight = useRef(false);

  const question = QUESTIONS[step];

  const toggle = (key, option, multiple) => {
    setStepError("");
    setAnswers((prev) => {
      if (!multiple) return { ...prev, [key]: option };
      const list = prev[key];
      return { ...prev, [key]: list.includes(option) ? list.filter((o) => o !== option) : [...list, option] };
    });
  };

  const answered = (q) => (q.multiple ? answers[q.key].length > 0 : Boolean(answers[q.key]));

  const next = () => {
    if (!answered(question)) return setStepError(question.error);
    setStepError("");
    setStep((s) => s + 1);
  };

  const back = () => {
    setStepError("");
    setFormError("");
    setStep((s) => Math.max(0, s - 1));
  };

  const setField = (field) => (e) => {
    const value = e.target.value;
    // Picking a country code fills in the country if it's still empty (and clears its error)
    const autoCountry =
      field === "phoneCode" && !contact.country.trim() ? COUNTRY_CODES.find((c) => c.code === value)?.country : null;
    setErrors((prev) => ({ ...prev, [field]: undefined, ...(autoCountry ? { country: undefined } : {}) }));
    setContact((prev) => ({ ...prev, [field]: value, ...(autoCountry ? { country: autoCountry } : {}) }));
  };

  const submit = async (e) => {
    e.preventDefault();
    // A ref, not the `sending` state: a fast double click lands before React re-renders
    if (inFlight.current) return;
    const found = checkContact(contact);
    setErrors(found);
    setFormError("");
    if (Object.keys(found).length) return;

    inFlight.current = true;
    setSending(true);
    try {
      const res = await fetch(`${apiUrl}/erp-estimate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId,
          ...answers,
          name: contact.name.trim(),
          email: contact.email.trim(),
          phoneCode: contact.phoneCode,
          phone: contact.phone.replace(/[\s-]/g, ""),
          country: contact.country.trim(),
          page: window.location.pathname,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (body.status === 1) {
        setResult({ duplicate: Boolean(body.data?.duplicate), name: contact.name.trim() });
        setStep(4);
        return;
      }
      // Field errors from the backend go next to their fields; anything else above the button
      const fieldErrors = {};
      (body.errors || []).forEach(({ path, msg }) => {
        if (path in emptyContact && !fieldErrors[path]) fieldErrors[path] = msg;
      });
      setErrors(fieldErrors);
      const other = (body.errors || []).find(({ path }) => !(path in emptyContact));
      if (other || !Object.keys(fieldErrors).length) {
        setFormError(other?.msg || body.message || "We couldn't send your request, please try again.");
      }
    } catch {
      setFormError("We couldn't reach our server. Please check your connection and try again.");
    } finally {
      inFlight.current = false;
      setSending(false);
    }
  };

  const startOver = () => {
    setAnswers({ industry: "", modules: [], features: [] });
    setContact(emptyContact);
    setErrors({});
    setResult(null);
    setSubmissionId(newId());
    setStep(0);
  };

  const invalid = (field) => (errors[field] ? "border-red-400" : "border-[#bcd0f1]");
  const describedBy = (field) => (errors[field] ? `est-${field}-error` : undefined);

  return (
    <section data-guide="erpEstimator" className="bg-[#e8f1fd] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[760px] text-center">
        <h2 className="mx-auto max-w-[560px] text-[28px] font-semibold leading-[1.25] tracking-tight text-balance text-[#002461] sm:text-[34px] lg:text-[40px]">
          What Would Your ERP Cost for Your Business?
        </h2>
        <p className="mx-auto mt-3 max-w-[600px] text-[15px] leading-normal text-[#002461] sm:text-base lg:text-[17px]">
          Tell us about your industry, integrations, features and AI requirements. We&apos;ll give you a
          personalized ERP cost estimate
        </p>
      </div>

      <div
        className={`mx-auto mt-10 rounded-[22px] bg-white shadow-[0_24px_60px_-30px_rgba(0,36,97,0.25)] transition-[max-width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:mt-12 ${
          step >= 3 ? "max-w-[640px]" : "max-w-[925px]"
        }`}
      >
        <div key={step} className="est-step px-5 py-7 sm:px-10 sm:py-10 lg:px-[78px] lg:py-[46px]">
          {step < 3 && (
            <>
              <div className="flex items-baseline justify-between gap-4">
                <h3 id="est-question" className="text-[22px] font-medium text-[#002461] sm:text-[26px]">
                  {question.title}
                </h3>
                <span className="shrink-0 text-sm text-[#5d6f92]">
                  {step + 1} / {QUESTIONS.length + 1}
                </span>
              </div>
              {question.multiple && <p className="mt-1 text-sm text-[#5d6f92]">Choose all that apply</p>}

              <div
                role={question.multiple ? "group" : "radiogroup"}
                aria-labelledby="est-question"
                className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-x-[clamp(14px,3vw,36px)] sm:gap-y-5"
              >
                {question.options.map((option) => (
                  <OptionCard
                    key={option}
                    label={option}
                    withIcon={question.key === "industry"}
                    role={question.multiple ? "checkbox" : "radio"}
                    checked={question.multiple ? answers[question.key].includes(option) : answers[question.key] === option}
                    onToggle={() => toggle(question.key, option, question.multiple)}
                  />
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between gap-4 sm:mt-7">
                {step > 0 ? (
                  <button type="button" onClick={back} className="text-sm font-medium text-[#2563eb] hover:underline">
                    ← Back
                  </button>
                ) : (
                  <span />
                )}
                <div className="flex items-center gap-4">
                  {stepError && (
                    <p className="text-[13px] text-red-600" role="alert">
                      {stepError}
                    </p>
                  )}
                  <button type="button" onClick={next} className={primaryBtn}>
                    Next {arrow}
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <form onSubmit={submit} noValidate className="mx-auto flex max-w-[428px] flex-col gap-3.5">
              <Field id="est-name" label="Name" error={errors.name}>
                <input
                  id="est-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Name"
                  maxLength={100}
                  value={contact.name}
                  onChange={setField("name")}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={describedBy("name")}
                  className={`${fieldBase} ${invalid("name")}`}
                />
              </Field>
              <Field id="est-email" label="Email" error={errors.email}>
                <input
                  id="est-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email"
                  maxLength={254}
                  value={contact.email}
                  onChange={setField("email")}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={describedBy("email")}
                  className={`${fieldBase} ${invalid("email")}`}
                />
              </Field>
              <Field id="est-phone" label="Phone number" error={errors.phone}>
                <div className={`flex h-11 overflow-hidden rounded-md border bg-[#eef4ff] transition focus-within:border-[#2563eb] focus-within:ring-4 focus-within:ring-[#2563eb]/15 ${invalid("phone")}`}>
                  <label htmlFor="est-code" className="sr-only">
                    Country code
                  </label>
                  <select
                    id="est-code"
                    value={contact.phoneCode}
                    onChange={setField("phoneCode")}
                    className="h-full shrink-0 bg-transparent pr-1 pl-3 text-[15px] text-[#002461] outline-none"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={`${c.code}-${c.country}`} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    id="est-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder="Phone number"
                    maxLength={20}
                    value={contact.phone}
                    onChange={setField("phone")}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={describedBy("phone")}
                    className="h-full min-w-0 flex-1 bg-transparent px-2 text-[15px] text-[#002461] outline-none placeholder:text-[#5d6f92]"
                  />
                </div>
              </Field>
              <Field id="est-country" label="Country" error={errors.country}>
                <input
                  id="est-country"
                  type="text"
                  autoComplete="country-name"
                  placeholder="Country"
                  maxLength={100}
                  value={contact.country}
                  onChange={setField("country")}
                  aria-invalid={Boolean(errors.country)}
                  aria-describedby={describedBy("country")}
                  className={`${fieldBase} ${invalid("country")}`}
                />
              </Field>

              {formError && (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700" role="alert">
                  {formError}
                </p>
              )}

              <button type="submit" disabled={sending} className={`${primaryBtn} mt-1 w-full`}>
                {sending ? "Sending…" : <>Calculate My ERP Cost {arrow}</>}
              </button>
              <button type="button" onClick={back} className="self-center text-sm font-medium text-[#2563eb] hover:underline">
                ← Back
              </button>
            </form>
          )}

          {step === 4 && result && (
            <div className="mx-auto max-w-[428px] text-center" role="status">
              <span aria-hidden="true" className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#dce8ff] text-[#1f5fd0]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="size-7">
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
              </span>
              <h3 className="mt-5 text-[22px] font-medium text-[#002461]">Thank you, {result.name}!</h3>
              <p className="mt-2 text-[15px] text-[#002461]/80">
                {result.duplicate
                  ? "We already have your request with these answers, so there's no need to send it again. Our team will be in touch shortly."
                  : "Your request has been received. Our team will prepare your personalized ERP cost estimate and contact you shortly."}
              </p>
              <dl className="mt-6 space-y-2 rounded-xl bg-[#f3f7ff] p-4 text-left text-sm">
                <div>
                  <dt className="text-[#5d6f92]">Industry</dt>
                  <dd className="font-medium text-[#002461]">{answers.industry}</dd>
                </div>
                <div>
                  <dt className="text-[#5d6f92]">Modules</dt>
                  <dd className="font-medium text-[#002461]">{answers.modules.join(", ")}</dd>
                </div>
                <div>
                  <dt className="text-[#5d6f92]">Features</dt>
                  <dd className="font-medium text-[#002461]">{answers.features.join(", ")}</dd>
                </div>
              </dl>
              <button type="button" onClick={startOver} className="mt-6 text-sm font-medium text-[#2563eb] hover:underline">
                Start a new estimate
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

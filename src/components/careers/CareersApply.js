"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, CloudUpload, FileText, X } from "lucide-react";
import GlassSelect from "@/components/common/GlassSelect";
import CountrySelect from "@/components/layout/CountrySelect";
import { apiUrl } from "@/lib/blog";
import { APPLY_EVENT, APPLY_SECTION_ID } from "@/lib/careers";

// Résumé rules; the backend checks the same (middleware/resumeUpload.js)
const MAX_MB = 10;
const RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"];
const ACCEPT = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

// "General application" for someone not applying to a listed opening
const GENERAL = "general";
const GENERAL_LABEL = "General Application";

const defaultCountry = { code: "IN", name: "India", dial: "+91" };

const fieldClass =
  "w-full rounded-lg bg-[#eef2fd] px-4 py-3.5 text-[15px] text-[#0b1f4d] placeholder:text-[#8a94b5] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#2c5ff2]/45 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-400";

const formatSize = (bytes) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

function resumeProblem(file) {
  const name = file.name.toLowerCase();
  if (!RESUME_EXTENSIONS.some((ext) => name.endsWith(ext))) return "Please upload a PDF, DOC or DOCX file.";
  if (file.size > MAX_MB * 1024 * 1024) return `Your resume must be ${MAX_MB} MB or smaller.`;
  if (file.size === 0) return "This file is empty.";
  return "";
}

function Label({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="mb-2.5 block text-[15px] font-medium text-[#0b1f4d]">
      {children} <span className="text-[#e11d48]" aria-hidden="true">*</span>
    </label>
  );
}

// "Join Our Team": the job application form. The positions are the openings posted in the admin
// panel; a job card's "Apply Now" selects its opening here. Submissions (with the résumé) go to the
// backend's /store-job-application, which saves them for the admin panel's Job Applications page.
export default function CareersApply({ openings }) {
  const uid = useId();
  const id = (name) => `${uid}-${name}`;
  const formRef = useRef(null);
  const sectionRef = useRef(null);
  const fileRef = useRef(null);

  const [position, setPosition] = useState("");
  const [country, setCountry] = useState(defaultCountry);
  const [countries, setCountries] = useState([]);
  const [resume, setResume] = useState(null);
  const [resumeError, setResumeError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  // Every country's flag and calling code; heavy, so loaded after mount (as in the Contact form)
  useEffect(() => {
    let live = true;
    import("@/components/layout/contactCountries").then((m) => live && setCountries(m.countries));
    return () => {
      live = false;
    };
  }, []);

  // "Apply Now" on a job card: select that opening and bring the form into view
  useEffect(() => {
    const onApply = (e) => {
      const jobId = e.detail?.jobId;
      if (openings.some((o) => o.id === jobId)) setPosition(jobId);
      setSent(false);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      sectionRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      // Focus once the scroll has settled, without jumping again
      setTimeout(() => formRef.current?.querySelector("input")?.focus({ preventScroll: true }), reduce ? 0 : 600);
    };
    window.addEventListener(APPLY_EVENT, onApply);
    return () => window.removeEventListener(APPLY_EVENT, onApply);
  }, [openings]);

  const pickFile = (file) => {
    if (!file) return;
    const problem = resumeProblem(file);
    setResumeError(problem);
    setResume(problem ? null : file);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeFile = () => {
    setResume(null);
    setResumeError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    if (!resume) {
      setResumeError("Please upload your resume.");
      fileRef.current?.focus();
      return;
    }

    const form = new FormData(e.currentTarget);
    const opening = openings.find((o) => o.id === position);
    const body = new FormData();
    body.append("fullName", String(form.get("fullName")).trim());
    body.append("email", String(form.get("email")).trim());
    body.append("phone", `${country.dial} ${String(form.get("phone")).replace(/[^\d]/g, "")}`);
    body.append("position", opening ? opening.title : GENERAL_LABEL);
    if (opening) body.append("careerId", opening.id);
    body.append("resume", resume);

    setSending(true);
    setError("");
    try {
      const res = await fetch(`${apiUrl}/store-job-application`, { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.status !== 1) {
        throw new Error(data.errors?.[0]?.msg || data.message || "We couldn't submit your application, please try again later.");
      }
      setSent(true);
      formRef.current?.reset();
      setPosition("");
      setCountry(defaultCountry);
      setResume(null);
    } catch (err) {
      setError(err instanceof TypeError ? "We couldn't submit your application, please try again later." : err.message);
    } finally {
      setSending(false);
    }
  };

  // The dropdowns are the site's glass select (the Contact form's), fed these option objects
  const positionOptions = [...openings, { id: GENERAL, title: GENERAL_LABEL }];
  const selectedPosition = positionOptions.find((o) => o.id === position) ?? null;
  // The country list carries each flag; until it loads, India is shown without one
  const selectedCountry = countries.find((c) => c.code === country.code) ?? country;

  return (
    <section
      ref={sectionRef}
      id={APPLY_SECTION_ID}
      data-guide="careersApply"
      aria-labelledby={id("title")}
      className="relative isolate scroll-mt-24 overflow-hidden bg-white px-4 pt-20 pb-20 sm:px-6 sm:pt-24 lg:px-8 lg:pt-32 lg:pb-28"
    >
      {/* Soft lavender-blue glow behind the form, fading to white */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 50% 55%, #e6ebff 0%, #eef2ff 40%, rgba(255,255,255,0) 75%)",
        }}
      />

      <div className="mx-auto max-w-7xl text-center">
        <h2
          id={id("title")}
          className="text-[32px] font-semibold leading-[1.15] tracking-tight text-[#0b1f4d] sm:text-[40px] lg:text-[clamp(44px,3.9vw,56px)]"
        >
          Join Our Team
        </h2>
        <p className="mx-auto mt-4 max-w-[37rem] text-base leading-relaxed text-[#2e3e6e] sm:text-[17px]">
          Interested in working with us? Tell us a little about yourself. We&rsquo;d love to know what you bring to the
          team.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-[44rem] rounded-2xl bg-white px-5 py-8 shadow-[0_20px_60px_rgba(43,79,180,0.08)] sm:px-10 sm:py-10 lg:mt-14 lg:px-12 lg:py-12">
        {sent ? (
          <div className="py-10 text-center" role="status">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#eef2fd] text-[#2c5ff2]">
              <svg viewBox="0 0 34 26" fill="none" stroke="currentColor" strokeWidth="3.4" className="h-6 w-7" aria-hidden="true">
                <path d="M2.5 13.5l9.5 9.5L31.5 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="mt-5 text-2xl font-semibold text-[#0b1f4d]">Thank you for applying!</p>
            <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-[#2e3e6e]">
              Your application has been received. Our team will review it and get back to you soon.
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-6 text-[15px] font-semibold text-[#2c5ff2] hover:underline"
            >
              Submit another application
            </button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={onSubmit} noValidate={false} className="space-y-7 text-left">
            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
                {error}
              </p>
            )}

            <div>
              <Label htmlFor={id("name")}>Full Name</Label>
              <input id={id("name")} name="fullName" className={fieldClass} placeholder="Enter your full name" autoComplete="name" maxLength={100} required />
            </div>

            <div>
              <Label htmlFor={id("email")}>Email Address</Label>
              <input id={id("email")} name="email" type="email" className={fieldClass} placeholder="you@example.com" autoComplete="email" maxLength={254} required />
            </div>

            <div>
              <Label htmlFor={id("phone")}>Phone Number</Label>
              <div className="flex gap-2.5">
                {/* Country code: the Contact form's glass country picker, showing flag + code */}
                <div className="relative w-[7.75rem] shrink-0 sm:w-[8.5rem]">
                  <label className="sr-only" htmlFor={id("country")}>Country code</label>
                  <CountrySelect
                    id={id("country")}
                    countries={countries}
                    value={selectedCountry}
                    onChange={setCountry}
                    compact
                    triggerClassName="cs-field"
                    disabled={sending}
                  />
                </div>
                <input
                  id={id("phone")}
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  pattern="[0-9 \-]{5,15}"
                  title="Digits only, 5 to 15"
                  maxLength={15}
                  required
                  className={`${fieldClass} min-w-0 flex-1`}
                />
              </div>
            </div>

            <div>
              <Label htmlFor={id("position")}>Position Applying For</Label>
              <div className="relative">
                <GlassSelect
                  id={id("position")}
                  name="position"
                  options={positionOptions}
                  value={selectedPosition}
                  onChange={(o) => setPosition(o.id)}
                  getKey={(o) => o.id}
                  getLabel={(o) => o.title}
                  placeholder="Select a position"
                  invalidPlaceholder="Please select a position"
                  // A search box only once the list is long enough to need one
                  searchable={positionOptions.length > 8}
                  searchLabel="Search positions"
                  searchPlaceholder="Search positions"
                  listLabel="Positions"
                  emptyText="No matching positions"
                  triggerClassName="cs-field"
                  minWidth={0}
                  required
                  disabled={sending}
                />
              </div>
            </div>

            <div>
              <Label htmlFor={id("resume")}>Resume</Label>
              {resume ? (
                <div className="flex items-center gap-3 rounded-lg bg-[#eef2fd] px-4 py-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white text-[#2c5ff2]">
                    <FileText className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-semibold text-[#0b1f4d]">{resume.name}</span>
                    <span className="text-[13px] text-[#6b7aa0]">{formatSize(resume.size)}</span>
                  </span>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="rounded-full p-2 text-[#5b6687] transition-colors hover:bg-white hover:text-[#0b1f4d]"
                    aria-label={`Remove ${resume.name}`}
                  >
                    <X className="size-4.5" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor={id("resume")}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    pickFile(e.dataTransfer.files?.[0]);
                  }}
                  className={`flex min-h-[10.5rem] cursor-pointer flex-col items-center justify-center rounded-lg px-4 py-8 text-center transition-colors ${
                    dragging ? "bg-[#e1e8fc] ring-2 ring-[#2c5ff2]/45" : "bg-[#eef2fd] hover:bg-[#e7ecfc]"
                  } ${resumeError ? "ring-2 ring-red-400" : ""} has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#2c5ff2]/45`}
                >
                  <span className="flex size-11 items-center justify-center rounded-lg bg-[#dfe6fb] text-[#2c5ff2]">
                    <CloudUpload className="size-5" aria-hidden="true" />
                  </span>
                  <span className="mt-3 text-[17px] font-semibold text-[#0b1f4d]">Upload Your Resume</span>
                  <span className="mt-1 text-[13px] text-[#6b7aa0]">PDF, DOC or DOCX &middot; Max {MAX_MB}MB</span>
                  <input
                    ref={fileRef}
                    id={id("resume")}
                    type="file"
                    accept={ACCEPT}
                    onChange={(e) => pickFile(e.target.files?.[0])}
                    aria-invalid={resumeError ? true : undefined}
                    aria-describedby={resumeError ? id("resume-error") : undefined}
                    className="sr-only"
                  />
                </label>
              )}
              {resumeError && (
                <p id={id("resume-error")} className="mt-2 text-sm text-red-700" role="alert">
                  {resumeError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={sending}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2c5ff2] px-6 py-3.5 text-[15px] font-medium text-white shadow-[0_8px_20px_rgba(44,95,242,0.25)] transition-colors hover:bg-[#1f4fd8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2c5ff2] disabled:cursor-wait disabled:opacity-75"
            >
              {sending ? "Submitting…" : "Submit Application"}
              {!sending && <ArrowUpRight className="size-4" aria-hidden="true" />}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

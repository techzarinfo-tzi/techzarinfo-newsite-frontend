import { apiUrl } from "./blog";

// Job openings come from the website backend (GET /get-careers), the same list the admin panel's
// "Job Openings" page edits. Each response is cached for a minute, so a job posted, edited or
// deleted in the admin panel shows on the Careers page within about a minute, without a rebuild.
export const CAREERS_REVALIDATE = 60;

// The careers inbox listed in the footer (src/config/footer.js) and the HR phone line, shown in the
// "Share Your Resume" banner.
export const CAREERS_EMAIL = "career@techzarinfo.com";
export const CAREERS_PHONE = "+91 9952885799";

// Fired on window by a job card's "Apply Now" with the opening's id; the application form below
// picks that position and scrolls into view.
export const APPLY_EVENT = "careers:apply";
export const APPLY_SECTION_ID = "join-our-team";

export function applyFor(jobId) {
  window.dispatchEvent(new CustomEvent(APPLY_EVENT, { detail: { jobId } }));
}

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

// The description is stored as a JSON-encoded HTML string ("\"<p>…</p>\""); older values are plain.
function decodeStored(stored) {
  if (typeof stored !== "string") return "";
  const text = stored.trim();
  if (text.startsWith('"') && text.endsWith('"')) {
    try {
      const value = JSON.parse(text);
      if (typeof value === "string") return value;
    } catch {
      // Not JSON: use as is
    }
  }
  return stored;
}

// Plain text of an HTML body, for the card's short summary. The result is rendered as text by
// React, never as HTML.
function htmlToText(html) {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) => {
      if (code[0] !== "#") return ENTITIES[code.toLowerCase()] ?? match;
      const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : match;
    })
    .replace(/\s+/g, " ")
    .trim();
}

// Tags kept in the full description shown in the job modal; everything else is dropped (its text
// stays). Attributes are all dropped too, except a safe href on links.
const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "s", "ul", "ol", "li",
  "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "a", "span",
]);
// Headings in a description sit under the modal's own title, so they are shifted down to h3/h4.
const HEADING_MAP = { h1: "h3", h2: "h3", h3: "h4", h4: "h4", h5: "h4", h6: "h4" };

const escapeAttr = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// Rebuilds the admin's description HTML from scratch: text is passed through with stray < and >
// escaped, and each tag is either re-emitted bare from the allowlist or removed. Since nothing of
// the original markup is copied over, no attribute, script or event handler can survive.
function sanitizeHtml(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|iframe|object|embed|template|noscript)\b[\s\S]*?<\/\1\s*>/gi, "")
    .split(/(<[^<>]*>)/)
    .map((part) => {
      if (!part.startsWith("<")) return part.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const match = part.match(/^<\s*(\/?)\s*([a-z][a-z0-9]*)\b([^>]*)>$/i);
      if (!match) return "";
      const [, slash, rawName, attrs] = match;
      let name = rawName.toLowerCase();
      if (!ALLOWED_TAGS.has(name)) return name === "div" ? (slash ? "" : " ") : "";
      name = HEADING_MAP[name] ?? name;
      if (name === "br") return "<br>";
      if (name === "a" && !slash) {
        const href = attrs.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
        const url = (href?.[1] ?? href?.[2] ?? href?.[3] ?? "").trim();
        return /^(https?:|mailto:|tel:)/i.test(url)
          ? `<a href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer nofollow">`
          : "<a>";
      }
      return `<${slash}${name}>`;
    })
    .join("")
    .trim();
}

// Only the fields a job card renders.
const toCard = (job) => ({
  id: job._id,
  title: (job.title || "").trim(),
  summary: htmlToText(decodeStored(job.message)),
  // The full description for the job modal, reduced to safe markup on the server
  html: sanitizeHtml(decodeStored(job.message)),
  tags: [job.experience, job.workMode, job.employmentType].map((tag) => (tag || "").trim()).filter(Boolean),
});

// Every opening, newest first (the backend's order). An unreachable backend renders the empty state
// instead of failing the page.
export async function getOpenings() {
  try {
    const res = await fetch(`${apiUrl}/get-careers`, { next: { revalidate: CAREERS_REVALIDATE } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.map(toCard).filter((job) => job.title) : [];
  } catch {
    return [];
  }
}

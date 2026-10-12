"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "./ChatWidget.css";

export const OPEN_CHAT_EVENT = "tzi:open-chat";

// Chat replies come from the separate AIChatbot service (../AIChatbot, next to this project).
// Set NEXT_PUBLIC_CHATBOT_API_URL in .env to its public address; it is baked in at build time.
// Unset (local dev), it targets port 4000 on whatever host served the page, so the chat also
// works when the site is opened by LAN IP from a phone (where "localhost" is the phone itself).
// Only called from the browser (effects and handlers), so `window` is always available.
const chatApiUrl = () =>
  (
    process.env.NEXT_PUBLIC_CHATBOT_API_URL ||
    `${window.location.protocol}//${window.location.hostname}:4000`
  ).replace(/\/$/, "") + "/api/chat";

// Matches the centred-dialog layout in ChatWidget.css; smaller screens get a full-screen modal.
const FLOATING_QUERY = "(min-width: 640px) and (min-height: 540px)";

const GREETING =
  "Hi! I'm the TZI assistant. Ask me anything about our services, AI solutions, or how we can help with your project.";

const SUGGESTIONS = [
  "What services do you offer?",
  "What AI solutions do you build?",
  "Can you build a mobile app for me?",
  "How do I start a project?",
];

// Renders the small Markdown subset the assistant is asked to use: paragraphs, "- " bullets,
// **bold** and [links](url). Only relative paths and http(s) URLs become links.
function Inline({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g);
  return parts.map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={i} className="font-semibold">{bold[1]}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link && /^(\/(?!\/)|https?:\/\/)/.test(link[2])) {
      const cls = "font-medium text-[#0B57B7] underline underline-offset-2 hover:text-[#002148]";
      return link[2].startsWith("/") ? (
        <Link key={i} href={link[2]} className={cls}>{link[1]}</Link>
      ) : (
        <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer" className={cls}>{link[1]}</a>
      );
    }
    return part;
  });
}

function RichText({ text }) {
  const blocks = [];
  for (const line of text.split("\n")) {
    const item = line.match(/^\s*[-*•]\s+(.*)/);
    const last = blocks[blocks.length - 1];
    if (item) {
      if (last?.type === "list") last.items.push(item[1]);
      else blocks.push({ type: "list", items: [item[1]] });
    } else if (line.trim()) {
      blocks.push({ type: "p", text: line });
    }
  }
  return blocks.map((b, i) =>
    b.type === "list" ? (
      <ul key={i} className="my-1.5 list-disc space-y-1 pl-5">
        {b.items.map((it, j) => <li key={j}><Inline text={it} /></li>)}
      </ul>
    ) : (
      <p key={i} className="my-1.5 first:mt-0 last:mb-0"><Inline text={b.text} /></p>
    )
  );
}

// Groups this chat's questions and answers when they're saved for the admin panel.
// crypto.randomUUID only exists on HTTPS (and localhost), so fall back to building one.
function newConversationId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const hex = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// Anonymous ID that stays in this browser (no login), so the server can apply the daily question
// limit and the admin panel can group one visitor's chats. Without storage it lasts for this page.
const VISITOR_KEY = "tzi-chat-visitor";
let memoryVisitorId;

function getVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = newConversationId();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    memoryVisitorId ??= newConversationId();
    return memoryVisitorId;
  }
}

// The allowance the server reports: { limit, remaining, resetAt } (resetAt only when none remain).
function quotaFromHeaders(res) {
  const limit = Number(res.headers.get("X-Chat-Limit"));
  const remaining = res.headers.get("X-Chat-Remaining");
  if (!limit || remaining === null) return null;
  return { limit, remaining: Number(remaining), resetAt: res.headers.get("X-Chat-Reset-At") };
}

const formatResetAt = (iso) =>
  new Date(iso).toLocaleString([], { weekday: "short", hour: "numeric", minute: "2-digit" });

const FOCUSABLE ='a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]); // { role: "user" | "assistant", content }
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [quota, setQuota] = useState(null); // { limit, remaining, resetAt } from the server
  const modalRef = useRef(null);
  const panelRef = useRef(null);
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const launcherRef = useRef(null);
  const abortRef = useRef(null);
  const conversationIdRef = useRef(null);

  const close = () => {
    setOpen(false);
    launcherRef.current?.focus();
  };

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, []);

  // While open: lock page scroll, and on small screens size the modal to the visual viewport
  // (the area above the on-screen keyboard).
  useEffect(() => {
    if (!open) return;
    const modal = modalRef.current;
    const vv = window.visualViewport;
    const floating = window.matchMedia(FLOATING_QUERY);
    const root = document.documentElement;
    root.classList.add("chat-lock");

    const update = (e) => {
      if (!floating.matches && vv) {
        modal.style.setProperty("--chat-vvh", `${vv.height}px`);
        modal.style.setProperty("--chat-vv-top", `${vv.offsetTop}px`);
      } else {
        modal.style.removeProperty("--chat-vvh");
        modal.style.removeProperty("--chat-vv-top");
      }
      // Keyboard opened or the window resized: keep the latest message in view.
      if (e?.type === "resize" && logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    };

    update();
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    floating.addEventListener("change", update);
    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      floating.removeEventListener("change", update);
      root.classList.remove("chat-lock");
    };
  }, [open]);

  // Grow the input with its content, up to its CSS max-height.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [input]);

  // Focus handling: move focus into the dialog, keep Tab inside it, close on Escape.
  useEffect(() => {
    document.body.classList.toggle("chat-open", open);
    if (!open) return;
    // With a mouse/trackpad, start in the input. On touch devices focus the dialog itself, so
    // screen readers announce it without the keyboard popping over the suggested questions.
    if (window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus();
    else panelRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const items = [...panelRef.current.querySelectorAll(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  // On opening, find out how many questions this visitor has left today.
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    fetch(`${chatApiUrl()}/quota?visitorId=${encodeURIComponent(getVisitorId())}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setQuota(data))
      .catch(() => {});
    return () => controller.abort();
  }, [open]);

  // Unlock the chat when the waiting time is over.
  const locked = quota?.remaining === 0 && Boolean(quota.resetAt);
  useEffect(() => {
    if (!locked) return;
    const wait = new Date(quota.resetAt).getTime() - Date.now();
    // setTimeout can't wait longer than ~24.8 days; the server re-checks anyway.
    const timer = setTimeout(() => setQuota(null), Math.min(Math.max(wait, 0), 2 ** 31 - 1));
    return () => clearTimeout(timer);
  }, [locked, quota]);

  const send = async (text) => {
    const question = text.trim();
    if (!question || busy || locked) return;
    const history = [...messages, { role: "user", content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    const setReply = (update) =>
      setMessages((prev) => {
        const next = prev.slice();
        const last = next[next.length - 1];
        next[next.length - 1] = { ...last, content: update(last.content) };
        return next;
      });

    const controller = new AbortController();
    abortRef.current = controller;
    conversationIdRef.current ??= newConversationId();
    try {
      const res = await fetch(chatApiUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Failed turns are kept on screen but never sent back to the model.
        body: JSON.stringify({
          visitorId: getVisitorId(),
          conversationId: conversationIdRef.current,
          messages: history.filter((m) => !m.error),
        }),
        signal: controller.signal,
      });
      const latestQuota = quotaFromHeaders(res);
      if (latestQuota) setQuota(latestQuota);
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setReply((c) => c + chunk);
      }
      setReply((c) => c || "Sorry, I couldn't find an answer to that. Could you rephrase, or [contact our team](/contact)?");
    } catch (err) {
      if (err.name === "AbortError") return;
      // fetch() throws a TypeError when the AI server can't be reached at all.
      const message =
        err instanceof TypeError
          ? "The assistant is offline right now. Please try again later, or [contact our team](/contact)."
          : err.message;
      setMessages((prev) => {
        const next = prev.slice();
        next[next.length - 1] = { role: "assistant", content: message, error: true };
        next[next.length - 2] = { ...next[next.length - 2], error: true };
        return next;
      });
    } finally {
      setBusy(false);
      if (abortRef.current === controller) abortRef.current = null;
      if (window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus();
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const last = messages[messages.length - 1];
  const thinking = busy && last?.role === "assistant" && !last.content;

  const bubble =
    "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-[1.55] break-words [overflow-wrap:anywhere] sm:max-w-[80%] sm:px-4 sm:text-[14.5px]";
  const assistantBubble =
    "rounded-tl-md border border-white/70 bg-white/70 text-[#002148] shadow-[0_4px_16px_-6px_rgba(0,33,72,0.18)]";

  return (
    <>
      <div
        ref={modalRef}
        className="chat-modal"
        hidden={!open}
        // Clicking the dimmed backdrop (not the dialog) closes the chat.
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div
          id="tzi-chat"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tzi-chat-title"
          tabIndex={-1}
          className="chat-panel"
        >
          <header className="chat-panel__header chat-glass-bar flex shrink-0 items-center gap-3 border-b border-white/60">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#0B57B7] to-[#002148] shadow-[0_6px_16px_-4px_rgba(11,87,183,0.55)] ring-2 ring-white/80">
              <Image src="/ai-guide.png" alt="" width={40} height={40} unoptimized className="h-9 w-9 object-contain" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="tzi-chat-title" className="truncate text-[16px] font-semibold leading-tight text-[#002148]">
                TZI Assistant
              </h2>
              <p className="truncate text-[12.5px] text-[#002148]/65">Ask about our services &amp; solutions</p>
            </div>
            <button
              type="button"
              onClick={close}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/50 text-[#002148] transition-colors hover:bg-white/80"
              aria-label="Close chat"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          <div
            ref={logRef}
            className="chat-panel__log min-h-0 flex-1 space-y-3 overflow-y-auto"
            aria-live="polite"
            onClick={(e) => {
              // The modal covers the page a link opens, so close it first.
              if (e.target.closest("a")) setOpen(false);
            }}
          >
            <div className={`${bubble} ${assistantBubble}`}>{GREETING}</div>

            {messages.length === 0 && !locked && (
              <div className="grid gap-2 pt-1 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="min-h-11 rounded-2xl border border-white/70 bg-white/45 px-4 py-2.5 text-left text-[14px] font-medium text-[#0B57B7] shadow-[0_4px_14px_-8px_rgba(0,33,72,0.3)] transition-colors hover:border-[#0B57B7]/40 hover:bg-white/75"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) =>
              m.role === "user" ? (
                <div
                  key={i}
                  className={`${bubble} ml-auto w-fit whitespace-pre-wrap rounded-tr-md bg-linear-to-br from-[#0B57B7] to-[#0a3f8a] text-white shadow-[0_6px_18px_-8px_rgba(11,87,183,0.7)]`}
                >
                  {m.content}
                </div>
              ) : m.content ? (
                <div
                  key={i}
                  className={`${bubble} ${m.error ? "rounded-tl-md border border-red-200/80 bg-red-50/85 text-red-800" : assistantBubble}`}
                >
                  <RichText text={m.content} />
                </div>
              ) : null
            )}

            {thinking && (
              <div className={`flex w-fit gap-1 rounded-2xl px-4 py-3.5 ${assistantBubble}`} aria-label="Assistant is typing">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="chat-dot h-2 w-2 rounded-full bg-[#0B57B7]/70" style={{ animationDelay: `${d * 0.15}s` }} />
                ))}
              </div>
            )}
          </div>

          <div className="chat-panel__footer chat-glass-bar shrink-0 border-t border-white/60">
            {locked ? (
              <p role="status" className="mt-3 rounded-2xl border border-amber-200/80 bg-amber-50/85 px-4 py-2.5 text-[13.5px] leading-snug text-amber-900">
                You&apos;ve used all {quota.limit} questions for today. You can chat again from{" "}
                <strong className="font-semibold">{formatResetAt(quota.resetAt)}</strong>.
              </p>
            ) : (
              quota && quota.remaining < quota.limit && (
                <p className="pt-2 text-center text-[12px] text-[#002148]/65" aria-live="polite">
                  {quota.remaining} of {quota.limit} questions left today
                </p>
              )
            )}
            <form onSubmit={onSubmit} className="flex items-end gap-2 pt-3">
              <label htmlFor="tzi-chat-input" className="sr-only">Your question</label>
              {/* 16px text: anything smaller makes iOS Safari zoom the page on focus. */}
              <textarea
                id="tzi-chat-input"
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={2000}
                disabled={locked}
                enterKeyHint="send"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={locked ? "Daily limit reached" : "Type your question…"}
                className="disabled:cursor-not-allowed disabled:opacity-60 max-h-32 min-h-11 min-w-0 flex-1 resize-none rounded-2xl border border-white/80 bg-white/70 px-4 py-2.5 text-[16px] leading-[1.4] text-[#002148] shadow-inner shadow-blue-900/5 outline-none placeholder:text-[#002148]/45 focus:border-[#0B57B7]/50 focus:bg-white/90 focus:ring-2 focus:ring-[#0B57B7]/20"
              />
              <button
                type="submit"
                disabled={busy || locked || !input.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#0B57B7] to-[#002148] text-white shadow-[0_6px_16px_-6px_rgba(11,87,183,0.8)] transition-opacity hover:opacity-90 disabled:opacity-35 disabled:shadow-none"
                aria-label="Send"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
            <p className="pt-2 text-center text-[11px] leading-snug text-[#002148]/55">
              AI answers can be imperfect. For specifics,{" "}
              <Link href="/contact" onClick={() => setOpen(false)} className="underline">
                contact our team
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="tzi-chat"
        aria-label="Chat with the TZI assistant"
        className="chat-launcher flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-[#0B57B7] to-[#002148] text-white shadow-lg shadow-blue-900/30 ring-4 ring-white/40 transition-transform hover:scale-105"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
          <path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z" />
          <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" />
        </svg>
      </button>
    </>
  );
}

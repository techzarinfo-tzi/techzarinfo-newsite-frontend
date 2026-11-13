"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "@/components/layout/CountrySelect.css";

// The site's frosted-glass dropdown, first built as the Contact Us form's country picker
// (CountrySelect, now a thin wrapper around this). A trigger field showing the chosen option, and
// a list (combobox + listbox pattern, optionally searchable) rendered into <body> and positioned
// against the trigger, flipping above it when there is more room there. Styles: CountrySelect.css.
//
// A visually hidden input carries the value into the form (name/required), so the form's own
// validation and FormData keep working; an empty submit marks the field and focuses it.
//
// The trigger takes the form's field class: "cu-input" (default) sizes it like the Contact form's
// fields; "cs-field" is the same glass field sized in px for use anywhere else.

const GAP = 8;
const EDGE = 12;
const MAX_H = 360;

export const fold = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const defaultFilter = (option, q, getLabel) => fold(getLabel(option)).includes(q);

function Chevron() {
  return (
    <svg className="cs-chevron" viewBox="0 0 14 8" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M1 1l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function GlassSelect({
  id,
  name,
  options,
  value,
  onChange,
  getKey,
  getLabel,
  // Hover tooltip on the field (defaults to the label)
  getTitle = getLabel,
  renderValue = (option) => <span className="cs-name">{getLabel(option)}</span>,
  renderOption = (option) => <span className="cs-name">{getLabel(option)}</span>,
  filter = defaultFilter,
  placeholder,
  invalidPlaceholder = placeholder,
  searchable = true,
  searchLabel = "Search",
  searchPlaceholder = "Search",
  listLabel,
  emptyText = "No matches",
  loadingText = "Loading…",
  triggerClassName = "cu-input",
  minWidth = 300,
  required,
  disabled,
}) {
  const listId = useId();
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState("bottom");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [invalid, setInvalid] = useState(false);

  const valueKey = value ? getKey(value) : null;

  // The form going away (envelope closing, message sent) closes the list too
  const [wasDisabled, setWasDisabled] = useState(disabled);
  if (disabled !== wasDisabled) {
    setWasDisabled(disabled);
    if (disabled) setOpen(false);
  }

  // A value set from outside (e.g. a job card's "Apply Now") clears the "please select" state
  const [prevKey, setPrevKey] = useState(valueKey);
  if (valueKey !== prevKey) {
    setPrevKey(valueKey);
    if (valueKey) setInvalid(false);
  }

  const results = useMemo(() => {
    const q = fold(query.trim());
    if (!q) return options;
    return options.filter((o) => filter(o, q, getLabel));
  }, [options, query, filter, getLabel]);

  const show = (seed = "") => {
    if (disabled) return;
    const q = searchable ? seed : "";
    setMounted(true);
    setQuery(q);
    const i = q ? 0 : options.findIndex((o) => getKey(o) === valueKey);
    setActive(Math.max(i, 0));
    setOpen(true);
  };

  const hide = (refocus) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };

  const choose = (option) => {
    if (!option) return;
    onChange(option);
    setInvalid(false);
    hide(true);
  };

  // Keep the panel against the trigger while open (scrolling, resizing, the on-screen keyboard)
  useLayoutEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    let frame = 0;
    const place = () => {
      frame = 0;
      const r = trigger.getBoundingClientRect();
      const vv = window.visualViewport;
      const viewTop = vv ? vv.offsetTop : 0;
      const viewBottom = viewTop + (vv ? vv.height : window.innerHeight);
      const vw = document.documentElement.clientWidth;
      const width = Math.min(Math.max(r.width, minWidth), vw - 2 * EDGE);
      const below = viewBottom - r.bottom - GAP - EDGE;
      const above = r.top - viewTop - GAP - EDGE;
      const up = below < 280 && above > below;
      panel.style.left = `${Math.min(Math.max(r.left, EDGE), vw - EDGE - width)}px`;
      panel.style.width = `${width}px`;
      panel.style.maxHeight = `${Math.max(180, Math.min(MAX_H, up ? above : below))}px`;
      panel.style.top = up ? "auto" : `${r.bottom + GAP}px`;
      panel.style.bottom = up ? `${window.innerHeight - r.top + GAP}px` : "auto";
      setSide(up ? "top" : "bottom");
    };
    const queue = () => {
      frame ||= requestAnimationFrame(place);
    };
    place();
    window.addEventListener("scroll", queue, { capture: true, passive: true });
    window.addEventListener("resize", queue);
    window.visualViewport?.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue, { capture: true });
      window.removeEventListener("resize", queue);
      window.visualViewport?.removeEventListener("resize", queue);
    };
  }, [open, minWidth]);

  // On open: focus the search field (a fine pointer or keyboard; on touch screens that would pop
  // the keyboard over the list, so the panel takes focus instead) and bring the selection into view
  useEffect(() => {
    if (!open) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    ((fine && searchRef.current) || panelRef.current)?.focus({ preventScroll: true });
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "center" });

    const outside = (e) => {
      if (!panelRef.current?.contains(e.target) && !triggerRef.current?.contains(e.target)) hide(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const onTriggerKey = (e) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      show();
    } else if (searchable && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // Typing on the closed field starts a search
      e.preventDefault();
      show(e.key);
    }
  };

  const onPanelKey = (e) => {
    const last = results.length - 1;
    if (e.key === "ArrowDown") setActive((i) => Math.min(i + 1, last));
    else if (e.key === "ArrowUp") setActive((i) => Math.max(i - 1, 0));
    else if (e.key === "Home" && e.target !== searchRef.current) setActive(0);
    else if (e.key === "End" && e.target !== searchRef.current) setActive(last);
    else if (e.key === "PageDown") setActive((i) => Math.min(i + 8, last));
    else if (e.key === "PageUp") setActive((i) => Math.max(i - 8, 0));
    else if (e.key === "Enter" || (e.key === " " && e.target !== searchRef.current)) choose(results[active]);
    else if (e.key === "Escape") hide(true);
    else if (e.key === "Tab") return hide(false);
    else return;
    e.preventDefault();
  };

  const onInvalid = (e) => {
    e.preventDefault();
    setInvalid(true);
    // Only take focus when this is the first field the browser would report
    if (e.target.form?.querySelector(":invalid") === e.target) triggerRef.current?.focus();
  };

  const optionId = (i) => `${listId}-o${i}`;
  const activeId = results[active] ? optionId(active) : undefined;

  return (
    <>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className={`${triggerClassName} cs-trigger`}
        data-open={open || undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={mounted ? listId : undefined}
        data-invalid={invalid || undefined}
        title={value ? getTitle(value) : undefined}
        onClick={() => (open ? hide(false) : show())}
        onKeyDown={onTriggerKey}
      >
        {value ? (
          <span className="cs-value">{renderValue(value)}</span>
        ) : (
          <span className="cs-placeholder">{invalid ? invalidPlaceholder : placeholder}</span>
        )}
        <Chevron />
      </button>
      <input
        className="cs-proxy"
        name={name}
        value={value ? getLabel(value) : ""}
        required={required}
        tabIndex={-1}
        aria-hidden="true"
        onChange={() => {}}
        onInvalid={onInvalid}
      />

      {mounted &&
        createPortal(
          <div
            ref={panelRef}
            className="cs-panel"
            data-open={open || undefined}
            data-side={side}
            tabIndex={-1}
            inert={!open}
            onKeyDown={onPanelKey}
          >
            {searchable && (
              <div className="cs-search">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <circle cx="8.75" cy="8.75" r="5.75" />
                  <path d="M13 13l4 4" strokeLinecap="round" />
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  role="combobox"
                  aria-label={searchLabel}
                  aria-expanded={open}
                  aria-controls={listId}
                  aria-autocomplete="list"
                  aria-activedescendant={activeId}
                  placeholder={searchPlaceholder}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="go"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0);
                  }}
                />
                {query && (
                  <button
                    type="button"
                    className="cs-clear"
                    aria-label="Clear search"
                    onClick={() => {
                      setQuery("");
                      searchRef.current?.focus();
                    }}
                  >
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <circle cx="8" cy="8" r="8" fill="currentColor" />
                      <path d="M5.5 5.5l5 5m0-5l-5 5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            <ul
              ref={listRef}
              id={listId}
              role="listbox"
              aria-label={listLabel}
              aria-activedescendant={searchable ? undefined : activeId}
              className="cs-list"
              data-plain={searchable ? undefined : true}
            >
              {results.map((option, i) => {
                const selected = getKey(option) === valueKey;
                return (
                  <li
                    key={getKey(option)}
                    id={optionId(i)}
                    role="option"
                    aria-selected={selected}
                    data-active={i === active || undefined}
                    className="cs-option"
                    onPointerMove={() => i !== active && setActive(i)}
                    onClick={() => choose(option)}
                  >
                    {renderOption(option)}
                    <svg className="cs-check" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M1.5 6.5l4 4 9-9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </li>
                );
              })}
            </ul>
            {results.length === 0 && (
              <p className="cs-empty" role="status">
                {options.length ? emptyText : loadingText}
              </p>
            )}
          </div>,
          document.body
        )}
    </>
  );
}

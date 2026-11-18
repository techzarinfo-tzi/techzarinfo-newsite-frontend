"use client";

import { useEffect, useState } from "react";

// The full country list (every flag + calling code, contactCountries.js) for a form's phone and
// country pickers. It is a large chunk (~340 KB, libphonenumber and the flag set), and the contact
// form sits at the foot of every page, so it is fetched only when needed: once the form comes
// within about a screen of the viewport, or the moment someone presses or tabs into it, whichever
// is first. Until then the list is empty (the pickers show their India default, flag blank).
export function useCountries(ref) {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let alive = true;
    let started = false;
    const load = () => {
      if (started) return;
      started = true;
      cleanup();
      import("./contactCountries").then((m) => alive && setCountries(m.countries));
    };
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && load(), { rootMargin: "100% 0px" });
    io.observe(el);
    el.addEventListener("pointerdown", load);
    el.addEventListener("focusin", load);
    function cleanup() {
      io.disconnect();
      el.removeEventListener("pointerdown", load);
      el.removeEventListener("focusin", load);
    }
    return () => {
      alive = false;
      cleanup();
    };
  }, [ref]);

  return countries;
}

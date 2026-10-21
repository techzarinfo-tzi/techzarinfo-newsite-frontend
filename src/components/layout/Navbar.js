"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { navLinks, productsMenu, servicesMenu } from "@/config/navigation";
import {
  clearDissolveMask,
  getDissolve,
  playDissolve,
  prefersReducedMotion,
  prepareDissolve,
  reformDissolve,
} from "@/lib/dissolve";

// Mega menus keyed by the `menu` field in navLinks; desktop card width per menu.
const MENUS = {
  services: { data: servicesMenu, width: "w-[min(64rem,100%)]" },
  products: { data: productsMenu, width: "w-[min(54rem,100%)]" },
};

// Grace period after the mouse leaves a trigger or its menu before the menu
// closes, long enough to cross the gap between them or brush past an edge.
const HOVER_CLOSE_DELAY = 250;
// Dwell on the other trigger before hover swaps one open menu for the other.
const HOVER_SWITCH_DELAY = 150;

function MenuHeader({ data, compact }) {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0A50A5]">{data.title}</p>
      <p className={`mt-1 font-semibold text-[#002461] ${compact ? "text-sm" : "text-lg"}`}>{data.tagline}</p>
    </>
  );
}

// Body of a mega menu. `compact` is the touch layout inside the mobile menu.
function MenuBody({ menu, idPrefix, compact, pathname, onSelect }) {
  if (menu === "products") {
    return (
      <ul className={compact ? "grid gap-1 sm:grid-cols-2" : "grid grid-cols-3 gap-x-6 gap-y-2"}>
        {productsMenu.items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onSelect}
              aria-current={pathname === item.href ? "page" : undefined}
              className={`mega-link mega-link-stack ${compact ? "mega-link-touch" : ""}`}
            >
              <span className="font-semibold">{item.name}</span>
              <span className="mega-link-desc">{item.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={compact ? "grid gap-4 sm:grid-cols-2" : "grid grid-cols-4 gap-x-8 gap-y-6 "}>
      {servicesMenu.groups.map((group) => (
        <section key={group.id} aria-labelledby={`${idPrefix}-${group.id}`}>
          <h3
            id={`${idPrefix}-${group.id}`}
            className={`text-sm font-semibold text-[#002461] ${compact ? "mb-1" : "mb-2"}`}
          >
            {group.title} 
          </h3>
          <ul className={compact ? undefined : "space-y-0.5"}>
            {group.links.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onSelect}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`mega-link ${compact ? "mega-link-touch" : ""}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  // Only one desktop mega menu is open at a time: "services" | "products" | null.
  const [openMenu, setOpenMenu] = useState(null);
  // Only one mobile accordion section is expanded at a time.
  const [mobileSection, setMobileSection] = useState(null);
  const [prevPathname, setPrevPathname] = useState(pathname);
  // Menus crumbling away after being closed, keyed by menu key or "mobile". A
  // closing menu stays rendered and visible until its dissolve has finished.
  const [dissolving, setDissolving] = useState({});
  // Path of the menu item just picked; its route change mustn't close a menu opened since.
  const [pickedPath, setPickedPath] = useState(null);

  const headerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const dustRef = useRef(null);
  const barRef = useRef(null);
  const triggerRefs = useRef({});
  const panelRefs = useRef({});
  const cardRefs = useRef({});
  // slot -> token of the dissolve currently playing for it.
  const runsRef = useRef({});
  // Pending hover-out close, and the open menu as of the last commit (timers
  // fire outside render, so they can't trust a captured openMenu).
  const hoverCloseRef = useRef(null);
  const hoverSwitchRef = useRef(null);
  const openMenuRef = useRef(openMenu);
  // How the last press on a trigger was made: "mouse" | "touch" | "pen".
  const pressTypeRef = useRef(null);

  const baseId = useId();
  const panelId = (menu) => `${baseId}-${menu}`;
  const mobileId = (menu) => `${baseId}-m-${menu}`;

  // Marks a menu as closing; an effect below crumbles it into dust.
  const startClosing = useCallback((slot) => {
    setDissolving((current) => (current[slot] ? current : { ...current, [slot]: true }));
  }, []);

  // Closes a desktop menu (crumbling it into dust) if it is the one open.
  const closeDesktop = useCallback(
    (menu) => {
      if (openMenuRef.current !== menu) return;
      openMenuRef.current = null;
      startClosing(menu);
      setOpenMenu((current) => (current === menu ? null : current));
    },
    [startClosing]
  );

  const closeMobile = useCallback(() => {
    startClosing("mobile");
    setIsOpen(false);
  }, [startClosing]);

  // Close every menu when the route changes. A route reached by picking a menu
  // item already closed its menu, so leave alone anything opened while it loaded.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setPickedPath(null);
    if (pathname !== pickedPath) {
      if (openMenu) startClosing(openMenu);
      if (isOpen) startClosing("mobile");
      setIsOpen(false);
      setOpenMenu(null);
      // Collapsing the accordion mid-dissolve would squash the crumbling menu.
      if (!isOpen) setMobileSection(null);
    }
  }

  useLayoutEffect(() => {
    openMenuRef.current = openMenu;
  }, [openMenu]);

  useEffect(
    () => () => {
      clearTimeout(hoverCloseRef.current);
      clearTimeout(hoverSwitchRef.current);
    },
    []
  );

  // Desktop mega menu: outside click/touch and Escape.
  useEffect(() => {
    if (!openMenu) return;
    const trigger = triggerRefs.current[openMenu];
    const panel = panelRefs.current[openMenu];

    const onPointerDown = (e) => {
      if (panel?.contains(e.target)) return;
      // Pressing any trigger is handled by its own click (which may switch menus).
      if (Object.values(triggerRefs.current).some((t) => t?.contains(e.target))) return;
      closeDesktop(openMenu);
    };
    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      const active = document.activeElement;
      if (active === trigger || panel?.contains(active)) trigger?.focus();
      closeDesktop(openMenu);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu, closeDesktop]);

  // Mobile menu: outside click/touch and Escape.
  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e) => {
      if (!headerRef.current?.contains(e.target)) closeMobile();
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeMobile();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeMobile]);

  // Centre the open dropdown under its nav item, clamped inside the header.
  useLayoutEffect(() => {
    if (!openMenu) return;

    const align = () => {
      const trigger = triggerRefs.current[openMenu];
      const panel = panelRefs.current[openMenu];
      const card = cardRefs.current[openMenu];
      if (!trigger || !panel || !card) return;
      const t = trigger.getBoundingClientRect();
      const p = panel.getBoundingClientRect();
      const ideal = t.left + t.width / 2 - card.offsetWidth / 2 - p.left;
      card.style.marginLeft = `${Math.max(0, Math.min(ideal, p.width - card.offsetWidth))}px`;
    };

    align();
    window.addEventListener("resize", align);
    return () => window.removeEventListener("resize", align);
  }, [openMenu]);

  // Build the dissolve frames while a menu is open, so a close starts at once.
  useEffect(() => {
    const card = openMenu && cardRefs.current[openMenu];
    if (card) prepareDissolve(openMenu, card.offsetWidth, card.offsetHeight);
  }, [openMenu]);

  useEffect(() => {
    if (!isOpen) return;
    // Measure once the menu (or a section of its accordion) has finished expanding.
    const timer = setTimeout(() => {
      const menu = mobileMenuRef.current;
      if (menu) prepareDissolve("mobile", menu.offsetWidth, menu.offsetHeight);
    }, 320);
    return () => clearTimeout(timer);
  }, [isOpen, mobileSection]);

  // Plays the dissolve for each menu that started closing. The menu stays
  // shown (data-open / mounted) until its dissolve has run to the end; if the
  // frames aren't built yet it waits for them rather than vanishing.
  useEffect(() => {
    Object.keys(dissolving).forEach((slot) => {
      if (runsRef.current[slot]) return;
      const token = {};
      runsRef.current[slot] = token;
      const isCurrent = () => runsRef.current[slot] === token;
      const done = () => {
        if (!isCurrent()) return;
        delete runsRef.current[slot];
        setDissolving(({ [slot]: _, ...rest }) => rest);
      };

      const el = slotElement(slot);
      const ready =
        !el || prefersReducedMotion()
          ? Promise.resolve(null)
          : Promise.resolve(getDissolve(slot) ?? prepareDissolve(slot, el.offsetWidth, el.offsetHeight));
      ready.then((assets) => {
        if (!isCurrent()) return;
        // No frames (reduced motion, or they failed to build): the CSS fade takes over.
        if (!assets) return done();
        return playDissolve({ el, canvas: dustRef.current, assets }).then(done);
      });
    });
  }, [dissolving]);

  function slotElement(slot) {
    return slot === "mobile" ? mobileMenuRef.current : cardRefs.current[slot];
  }

  // An item was picked: close its menu. Navigation itself is left to the Link.
  const selectItem = (slot, e) => {
    // Opening in a new tab/window keeps the user here, so keep the menu open too.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const path = e.currentTarget.getAttribute("href")?.split(/[?#]/)[0];
    if (path && path !== pathname) setPickedPath(path);
    if (slot === "mobile") closeMobile();
    else closeDesktop(slot);
  };

  // Reopening a menu that is still crumbling: stop the dissolve and let the
  // menu gather itself back together from where it got to.
  const stopDissolve = (slot) => {
    delete runsRef.current[slot];
    reformDissolve(slotElement(slot));
    setDissolving(({ [slot]: _, ...rest }) => rest);
  };

  // Clicks landing on a dissolving menu are swallowed here, so a repeated
  // click neither re-triggers its link nor falls through to the page below.
  const blockWhileDissolving = (slot) => (e) => {
    if (!dissolving[slot]) return;
    e.preventDefault();
    e.stopPropagation();
  };

  // Opens a desktop menu; the one open before it crumbles away as it would on
  // any other close. A menu still crumbling re-forms instead of snapping back.
  const openDesktop = (menu) => {
    if (openMenuRef.current === menu) return;
    if (openMenuRef.current) closeDesktop(openMenuRef.current);
    // Safe whatever state the menu is in (and from a timer's stale render):
    // re-forms it if crumbling, else just drops a finished dissolve's mask.
    stopDissolve(menu);
    openMenuRef.current = menu;
    setOpenMenu(menu);
  };

  const cancelHoverClose = () => {
    clearTimeout(hoverCloseRef.current);
    hoverCloseRef.current = null;
  };

  const cancelHoverSwitch = () => {
    clearTimeout(hoverSwitchRef.current);
    hoverSwitchRef.current = null;
  };

  // Mouse only: touch and pen keep tap-to-toggle, and keyboard keeps Enter/Space.
  const hoverOpen = (menu) => (e) => {
    if (e.pointerType !== "mouse") return;
    cancelHoverClose();
    cancelHoverSwitch();
    // Switching from the other open menu waits for the pointer to settle, so
    // cutting across this trigger on the way to the open menu doesn't swap them.
    if (openMenuRef.current && openMenuRef.current !== menu) {
      hoverSwitchRef.current = setTimeout(() => {
        hoverSwitchRef.current = null;
        openDesktop(menu);
      }, HOVER_SWITCH_DELAY);
    } else {
      openDesktop(menu);
    }
  };

  const hoverStay = (e) => {
    if (e.pointerType === "mouse") cancelHoverClose();
  };

  // Leaving a trigger or menu closes whichever menu is open, unless the
  // pointer reaches a trigger or the open menu within the grace period.
  const hoverLeave = (e) => {
    if (e.pointerType !== "mouse") return;
    cancelHoverClose();
    cancelHoverSwitch();
    hoverCloseRef.current = setTimeout(() => {
      hoverCloseRef.current = null;
      if (openMenuRef.current) closeDesktop(openMenuRef.current);
    }, HOVER_CLOSE_DELAY);
  };

  const toggleMenu = (menu) => {
    cancelHoverClose();
    // With a mouse the menu is already open from hovering; a click on its
    // trigger shouldn't close it again under the pointer.
    const byMouse = pressTypeRef.current === "mouse";
    pressTypeRef.current = null;
    if (openMenuRef.current === menu) {
      if (!byMouse) closeDesktop(menu);
    } else {
      openDesktop(menu);
    }
  };

  const panelLinks = (menu) => Array.from(panelRefs.current[menu]?.querySelectorAll("a[href]") ?? []);

  // Panels sit outside the bar in the DOM (nested backdrop-filters don't blur
  // the page), so keep the Tab order flowing trigger -> panel -> next item.
  const focusAfterTrigger = (menu) => {
    const focusables = Array.from(barRef.current?.querySelectorAll("a[href], button") ?? []);
    focusables[focusables.indexOf(triggerRefs.current[menu]) + 1]?.focus();
  };

  const handleTriggerKeyDown = (menu) => (e) => {
    if (e.key === "Tab" && !e.shiftKey && openMenu === menu) {
      e.preventDefault();
      panelLinks(menu)[0]?.focus();
    }
  };

  const handlePanelKeyDown = (menu) => (e) => {
    if (e.key !== "Tab") return;
    const links = panelLinks(menu);
    if (e.shiftKey && document.activeElement === links[0]) {
      e.preventDefault();
      triggerRefs.current[menu]?.focus();
    } else if (!e.shiftKey && document.activeElement === links[links.length - 1]) {
      e.preventDefault();
      if (openMenu === menu) closeDesktop(menu);
      focusAfterTrigger(menu);
    }
  };

  const handlePanelBlur = (menu) => (e) => {
    const next = e.relatedTarget;
    if (!next || panelRefs.current[menu]?.contains(next) || next === triggerRefs.current[menu]) return;
    if (openMenu === menu) closeDesktop(menu);
  };

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-4 z-50 px-4 lg:top-6 lg:px-8">
      <div
        ref={barRef}
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-white/60 bg-white/45 px-4 py-2.5 shadow-lg shadow-blue-900/10 backdrop-blur-xl backdrop-saturate-150 lg:px-6 lg:py-3"
      >
        <Logo />

        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Primary"
        >
          {navLinks.map((link) =>
            link.menu ? (
              <button
                key={link.href}
                ref={(el) => {
                  triggerRefs.current[link.menu] = el;
                }}
                type="button"
                onPointerEnter={hoverOpen(link.menu)}
                onPointerLeave={hoverLeave}
                onPointerDown={(e) => {
                  pressTypeRef.current = e.pointerType;
                }}
                onClick={() => toggleMenu(link.menu)}
                onKeyDown={handleTriggerKeyDown(link.menu)}
                aria-expanded={openMenu === link.menu}
                aria-controls={panelId(link.menu)}
                className={`text-sm font-medium transition-colors hover:text-blue-900 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A50A5] ${
                  openMenu === link.menu ? "text-blue-900" : "text-[#0A50A5]"
                }`}
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#0A50A5] transition-colors hover:text-blue-900"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <Link
          href="/contact"
          className="hidden shrink-0 rounded-full bg-blue-950 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-900 lg:inline-block"
        >
          Contact Us
        </Link>

        <button
          type="button"
          onClick={() => {
            if (dissolving.mobile) {
              stopDissolve("mobile");
              setIsOpen(true);
            } else if (isOpen) {
              closeMobile();
            } else {
              clearDissolveMask(mobileMenuRef.current);
              setIsOpen(true);
            }
          }}
          className="inline-flex shrink-0 items-center justify-center rounded-full p-2 text-blue-950 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Desktop mega menus */}
      {Object.entries(MENUS).map(([menu, { data, width }]) => (
        <div
          key={menu}
          ref={(el) => {
            panelRefs.current[menu] = el;
          }}
          id={panelId(menu)}
          data-open={openMenu === menu || Boolean(dissolving[menu])}
          style={dissolving[menu] ? { pointerEvents: "none" } : undefined}
          onKeyDown={handlePanelKeyDown(menu)}
          onBlur={handlePanelBlur(menu)}
          className="mega-menu absolute inset-x-8 top-full hidden pt-3 lg:block"
        >
          <nav
            ref={(el) => {
              cardRefs.current[menu] = el;
            }}
            // The panel ignores the pointer while dissolving; the card still catches it.
            style={dissolving[menu] ? { pointerEvents: "auto" } : undefined}
            onClickCapture={blockWhileDissolving(menu)}
            onPointerEnter={(e) => {
              if (openMenu === menu) hoverStay(e);
            }}
            onPointerLeave={hoverLeave}
            aria-label={data.title}
            className={`mega-card ${width} rounded-[1.75rem] p-6 xl:p-8`}
          >
            <div className="border-b border-[#0A50A5]/10 pb-5">
              <MenuHeader data={data} />
            </div>
            <div className="mt-6">
              <MenuBody
                menu={menu}
                idPrefix={panelId(menu)}
                pathname={pathname}
                onSelect={(e) => selectItem(menu, e)}
              />
            </div>
          </nav>
        </div>
      ))}

      {(isOpen || dissolving.mobile) && (
        <div
          ref={mobileMenuRef}
          onClickCapture={blockWhileDissolving("mobile")}
          className="mx-auto mt-2 max-h-[calc(100dvh-6rem)] max-w-7xl overflow-y-auto overscroll-contain rounded-3xl border border-white/60 bg-white/45 px-6 py-5 shadow-lg shadow-blue-900/10 backdrop-blur-xl backdrop-saturate-150 lg:hidden">
          {/* Only the contents go inert while dissolving: the menu itself keeps
              catching taps so they can't land on the page underneath. */}
          <nav className="flex flex-col gap-4" aria-label="Mobile" inert={dissolving.mobile}>
            {navLinks.map((link) =>
              link.menu ? (
                <div key={link.href}>
                  <button
                    type="button"
                    onClick={() => setMobileSection((open) => (open === link.menu ? null : link.menu))}
                    aria-expanded={mobileSection === link.menu}
                    aria-controls={mobileId(link.menu)}
                    className="block w-full text-left text-base font-medium text-[#0A50A5] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A50A5]"
                  >
                    {link.label}
                  </button>

                  <div
                    id={mobileId(link.menu)}
                    data-open={mobileSection === link.menu}
                    inert={mobileSection !== link.menu}
                    className="nav-collapse"
                  >
                    <div>
                      <div className="mt-3 rounded-2xl border border-white/70 bg-white/55 p-4">
                        <MenuHeader data={MENUS[link.menu].data} compact />
                        <div className="mt-4 border-t border-[#0A50A5]/10 pt-4">
                          <MenuBody
                            menu={link.menu}
                            idPrefix={mobileId(link.menu)}
                            compact
                            pathname={pathname}
                            onSelect={(e) => selectItem("mobile", e)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => selectItem("mobile", e)}
                  className="text-base font-medium text-[#0A50A5]"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
          <Link
            href="/contact"
            onClick={(e) => selectItem("mobile", e)}
            inert={dissolving.mobile}
            className="mt-4 block rounded-full bg-blue-950 px-6 py-2.5 text-center text-sm font-semibold text-white shadow-md"
          >
            Contact Us
          </Link>
        </div>
      )}

      <canvas
        ref={dustRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 h-full w-full"
        style={{ display: "none" }}
      />
    </header>
  );
}

"use client";

import { useEffect, useRef } from "react";

export default function LensZoom({ src, zoom = 2.2, children }) {
  const boxRef = useRef(null);
  const lensRef = useRef(null);

  useEffect(() => {
    const box = boxRef.current;
    const lens = lensRef.current;
    if (!box || !lens) return;

    const pos = { x: 0, y: 0 }; // where the lens is drawn
    const target = { x: 0, y: 0 }; // where the pointer is
    let size = 0;
    let open = false;
    let raf = 0;

    const draw = () => {
      const w = box.offsetWidth;
      const h = box.offsetHeight;
      lens.style.transform = `translate3d(${(pos.x - size / 2).toFixed(1)}px, ${(pos.y - size / 2).toFixed(1)}px, 0)`;
      lens.style.backgroundSize = `${w * zoom}px ${h * zoom}px`;
      lens.style.backgroundPosition = `${(size / 2 - pos.x * zoom).toFixed(1)}px ${(size / 2 - pos.y * zoom).toFixed(1)}px`;
    };

    const tick = () => {
      raf = 0;
      pos.x += (target.x - pos.x) * 0.35;
      pos.y += (target.y - pos.y) * 0.35;
      draw();
      if (Math.abs(target.x - pos.x) > 0.2 || Math.abs(target.y - pos.y) > 0.2) raf = requestAnimationFrame(tick);
    };

    const aim = (e) => {
      const r = box.getBoundingClientRect();
      target.x = Math.min(r.width, Math.max(0, e.clientX - r.left));
      target.y = Math.min(r.height, Math.max(0, e.clientY - r.top));
    };

    const show = (e) => {
      size = Math.round(box.offsetWidth * 0.62); // ~87px on a 141px card, ~79px on mobile
      lens.style.width = lens.style.height = `${size}px`;
      aim(e);
      pos.x = target.x; // appear right under the pointer, no glide-in from a stale spot
      pos.y = target.y;
      draw();
      open = true;
      lens.dataset.open = "true";
    };

    const hide = () => {
      open = false;
      lens.dataset.open = "false";
    };

    const onEnter = (e) => {
      if (e.pointerType !== "touch") show(e);
    };
    const onMove = (e) => {
      if (!open || e.pointerType === "touch") return;
      aim(e);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = (e) => {
      if (e.pointerType !== "touch") hide();
    };
    const onDown = (e) => {
      if (e.pointerType !== "touch") return;
      if (open) hide();
      else show(e);
    };
    // A tap anywhere else closes an open touch lens.
    const onDocDown = (e) => {
      if (open && e.pointerType === "touch" && !box.contains(e.target)) hide();
    };

    box.addEventListener("pointerenter", onEnter);
    box.addEventListener("pointermove", onMove);
    box.addEventListener("pointerleave", onLeave);
    box.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerdown", onDocDown);

    return () => {
      cancelAnimationFrame(raf);
      box.removeEventListener("pointerenter", onEnter);
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerleave", onLeave);
      box.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerdown", onDocDown);
    };
  }, [zoom]);

  return (
    <div ref={boxRef} className="relative w-full cursor-zoom-in touch-manipulation select-none">
      {children}
      <div
        ref={lensRef}
        aria-hidden="true"
        data-open="false"
        className="pointer-events-none absolute top-0 left-0 z-20 scale-75 rounded-full border-2 border-white bg-white bg-no-repeat opacity-0 shadow-[0_0_0_1px_#b5cfff,0_12px_28px_-6px_rgba(0,36,97,0.35)] transition-[opacity,scale] duration-200 ease-out will-change-transform data-[open=true]:scale-100 data-[open=true]:opacity-100"
        style={{ backgroundImage: `url("${src}")` }}
      />
    </div>
  );
}

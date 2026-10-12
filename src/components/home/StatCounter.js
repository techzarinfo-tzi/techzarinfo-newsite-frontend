  "use client";

import { useEffect, useRef, useState } from "react";

function parseStat(value) {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) {
    return { hasNumber: false, target: 0, suffix: value };
  }
  return { hasNumber: true, target: parseInt(match[1], 10), suffix: match[2] };
}

export default function StatCounter({ value, start, duration = 1500 }) {
  const { hasNumber, target, suffix } = parseStat(value);
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!start || !hasNumber || hasAnimated.current) return;
    hasAnimated.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(target);
      return;
    }

    let frameId;
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [start, hasNumber, target, duration]);

  const finalText = hasNumber ? `${target}${suffix}` : suffix;

  if (!hasNumber) {
    return (
      <span className="inline-block" style={{ minWidth: `${finalText.length}ch` }}>
        {suffix}
      </span>
    );
  }

  return (
    <span
      className="inline-block tabular-nums"
      style={{ minWidth: `${finalText.length}ch` }}
    >
      {count}
      {suffix}
    </span>
  );
}

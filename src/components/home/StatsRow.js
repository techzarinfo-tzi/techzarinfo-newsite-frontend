"use client";

import { useEffect, useRef, useState } from "react";
import StatCounter from "./StatCounter";

export default function StatsRow({ stats }) {
  const [visible, setVisible] = useState(false);
  const rowRef = useRef(null);

  useEffect(() => {
    if (visible) return;
    const node = rowRef.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const alreadyVisible = rect.top < viewportHeight && rect.bottom > 0;

    if (alreadyVisible) {
      setVisible(true);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div
      ref={rowRef}
      className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-6 border-t border-slate-200 pt-6 lg:flex-nowrap lg:justify-start lg:gap-x-6"
    >
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={
            index === 0
              ? "text-center lg:text-left"
              : "text-center lg:border-l lg:border-slate-200 lg:pl-6 lg:text-left"
          }
        >
          <div className="text-xl font-extrabold whitespace-nowrap text-blue-950 lg:text-xl">
            <StatCounter value={stat.value} start={visible} />
          </div>
          <div className="mt-1 text-xs font-medium text-slate-500">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

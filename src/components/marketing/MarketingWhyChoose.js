"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MousePointerClick, Sparkles, ThumbsUp } from "lucide-react";

// Orbit geometry, as shares of the square stage, measured from the design: the outer ring is 86% of
// the stage across, the inner one 73% of that, and the TZI disc ~40% of the outer ring.
const OUTER = 43; // radius, % of the stage
const INNER = 31.4;

const PHOTOS = "/service/digital-marketing/why-choose";

// Badges riding each ring: angle (deg, clockwise from 3 o'clock) and kind. Avatars and icon bubbles as
// in the design: top-left, top-right, bottom-left and bottom-right portraits.
const outerBadges = [
  { angle: 209.5, kind: "avatar", photo: `${PHOTOS}/person-1.png` },
  { angle: 331, kind: "avatar", photo: `${PHOTOS}/person2.png` },
  { angle: 180, kind: "icon", Icon: MousePointerClick },
  { angle: 140.6, kind: "avatar", photo: `${PHOTOS}/person-4.png` },
  { angle: 37.7, kind: "avatar", photo: `${PHOTOS}/person-3.png` },
];
const innerBadges = [{ angle: 252, kind: "icon", Icon: ThumbsUp }];

// True once the section has scrolled a little way into view (one-off)
function useRevealed(ref) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return shown;
}

// One badge on a ring. Three layers so every animation owns its own property: the anchor sits on the
// ring point (zero size), the upright layer counter-rotates against the ring's spin so the badge never
// tilts, and the badge itself is centred on the point and pops in.
function Badge({ radius, angle, kind, Icon, photo, delay, still }) {
  const rad = (angle * Math.PI) / 180;
  return (
    <div
      className="absolute size-0"
      style={{ left: `${50 + radius * Math.cos(rad)}%`, top: `${50 + radius * Math.sin(rad)}%` }}
    >
      <div className={`absolute size-0 ${still ? "" : "mk-why-upright"}`}>
        <span
          className={`mk-why-pop absolute -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-white ${
            kind === "avatar"
              ? "size-[13cqw] border-[0.7cqw] shadow-[0_6px_18px_rgba(0,36,97,0.18)]"
              : "flex size-[10.5cqw] items-center justify-center border-[0.8cqw] bg-[#3b86f7] text-white shadow-[0_6px_18px_rgba(59,134,247,0.4)]"
          }`}
          style={{ "--d": `${delay}s` }}
        >
          {kind === "icon" ? (
            <Icon aria-hidden="true" className="size-[4.6cqw]" strokeWidth={2.2} />
          ) : (
            <Image src={photo} alt="" width={61} height={61} unoptimized className="size-full object-cover" />
          )}
        </span>
      </div>
    </div>
  );
}

// A ring of badges that slowly turns about the stage centre (the inner ring turns the other way)
function Ring({ badges, radius, reverse, from, spin }) {
  return (
    <div
      className={`mk-why-spin absolute inset-0 ${reverse ? "mk-why-spin-rev" : ""}`}
      style={{ "--spin": `${spin}s` }}
    >
      {badges.map((badge, i) => (
        <Badge key={badge.angle} radius={radius} delay={from + i * 0.12} {...badge} />
      ))}
    </div>
  );
}

// "Why Choose Us?": the TZI mark at the centre of two thin orbit rings, with client avatars and
// marketing icons riding the rings, beside the copy. Desktop: orbit left, copy right. Below lg the copy
// comes first and the orbit sits centred under it. As the section scrolls into view the rings draw
// in, the badges pop on one by one and the copy rises; then the rings keep turning slowly (badges stay
// upright) and the logo floats. All sizes inside the orbit are in container units, so it scales as a
// whole. Animations live in globals.css (.mk-why-*); with reduced motion everything simply shows.
export default function MarketingWhyChoose() {
  const ref = useRef(null);
  const shown = useRevealed(ref);

  return (
    <section
      ref={ref}
      data-guide="marketingWhyChoose"
      className={`mk-why overflow-hidden bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-16 ${shown ? "is-shown" : ""}`}
    >
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-[minmax(0,44fr)_minmax(0,56fr)] lg:gap-[clamp(2rem,4vw,4rem)]">
        <div className="text-center lg:order-2 lg:pr-[clamp(0rem,3vw,3rem)] lg:text-left">
          <h2 className="mk-why-rise text-[28px] font-semibold leading-[1.25] tracking-tight text-[#002461] sm:text-[34px] lg:text-[40px]">
            Why Choose Us?
          </h2>
          <p
            className="mk-why-rise mx-auto mt-4 max-w-[660px] text-base leading-[1.75] text-[#002461] sm:text-lg lg:mx-0 lg:mt-6 lg:text-[clamp(17px,1.4vw,20px)]"
            style={{ "--d": "0.12s" }}
          >
            Techzarinfo is a digital marketing company in Chennai offering SEO, Google Ads, social media
            marketing, landing page optimization and campaign management services to help businesses
            increase visibility, attract qualified enquiries and convert more traffic into customers.
          </p>
        </div>

        <div className="@container relative mx-auto aspect-square w-[min(88vw,400px)] sm:w-[440px] lg:order-1 lg:w-[clamp(380px,33vw,470px)]">
          {/* The two thin rings */}
          <span
            aria-hidden="true"
            className="mk-why-ring absolute inset-[7%] rounded-full border border-[#b5cbe6]"
          />
          <span
            aria-hidden="true"
            className="mk-why-ring absolute inset-[18.6%] rounded-full border border-[#b5cbe6]"
            style={{ "--d": "0.1s" }}
          />

          {/* Centre disc with the TZI mark */}
          <div className="mk-why-ring absolute inset-[32.8%]" style={{ "--d": "0.2s" }}>
            <div className="mk-why-float flex size-full items-center justify-center rounded-full bg-[radial-gradient(circle_at_50%_35%,#ffffff_0%,#eaf2fd_55%,#d3e3f8_100%)] shadow-[0_18px_40px_rgba(59,134,247,0.18)]">
              <Image src="/tzi.webp" alt="Techzarinfo" width={262} height={170} className="h-auto w-[56%]" />
            </div>
          </div>

          <Ring badges={outerBadges} radius={OUTER} from={0.35} spin={90} />
          <Ring badges={innerBadges} radius={INNER} from={0.55} spin={60} reverse />

          {/* Sparkle badge resting on the disc's lower-right edge (turns with neither ring) */}
          <Badge radius={17.8} angle={45} kind="icon" Icon={Sparkles} delay={0.95} still />
        </div>
      </div>
    </section>
  );
}

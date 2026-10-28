import TestimonialVideo from "./TestimonialVideo";

// Site-wide section (rendered from the root layout, like Navbar) — appears under every page,
// not just the homepage. The three video cards play real client videos; each already carries its
// own captions (and name), so the card only adds a play button.
// Emily's and Roland's clips are 720p web encodes of the supplied 1080p files
// (public/*_9x16_captioned.mp4), at a fraction of the size; Abdul's is used as supplied.
const videos = {
  emily: {
    src: "/testimonial/emily.mp4",
    poster: "/testimonial/emily-poster.webp",
    width: 1080,
    height: 1920,
    label: "Emily Strotman's client testimonial video",
  },
  abdul: {
    src: "/Abdul_Testimonial_Clean_Captioned_v2.mp4",
    poster: "/testimonial/abdul-poster.webp",
    width: 464,
    height: 832,
    label: "Abdul's client testimonial video",
  },
  roland: {
    src: "/testimonial/roland.mp4",
    poster: "/testimonial/roland-poster.webp",
    width: 1080,
    height: 1920,
    label: "Roland's client testimonial video",
  },
};

const testimonial = {
  name: "Adam smith",
  role: "Co-Founder",
  quote:
    "Very polite customer service, extremely reliable, will answer your calls day and night, and will do the best to work with you and satisfy your needs.",
};

function Stars() {
  return (
    <div className="mt-[10px] flex gap-0.5 text-amber-400" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.771l-7.416 3.642 1.48-8.279L0 9.306l8.332-1.151z" />
        </svg>
      ))}
    </div>
  );
}

// A generic placeholder avatar (no real headshot was supplied for the small quote-card
// avatars) — cropping the testimonial graphic above into a 36px circle would just show an
// arbitrary fragment of it, so this uses a plain person icon in the section's own palette.
function Avatar({ size }) {
  return (
    <span className={`relative flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#AFC9F2] text-white`}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[65%] w-[65%]">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4.42 3.58-8 8-8s8 3.58 8 8v.5a.5.5 0 0 1-.5.5h-15a.5.5 0 0 1-.5-.5z" />
      </svg>
    </span>
  );
}

function QuoteCard() {
  return (
    <div className="flex flex-col justify-between gap-5 rounded-2xl bg-[#D6E8FF] p-5 sm:p-6">
      <div>
        <Stars />
        <p className="mt-3 text-[14px] leading-[1.6] text-[#002148]/75 sm:text-[15px]">
          {testimonial.quote}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Avatar size="h-9 w-9" />
        <div>
          <p className="text-[14px] font-semibold text-[#002148]">{testimonial.name}</p>
          <p className="text-[12px] text-[#6B7AA8]">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}

// Three independent columns (not a shared-row grid) — each column stacks its own two cards at
// their natural heights, which is why the quote card and video card swap order per column
// rather than being forced into equal-height rows, matching the source design.
const columns = [
  ["quote", "emily"],
  ["abdul", "quote"],
  ["quote", "roland"],
];

function Column({ order }) {
  return (
    <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
      {order.map((kind) =>
        kind === "quote" ? <QuoteCard key={kind} /> : <TestimonialVideo key={kind} {...videos[kind]} />
      )}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section data-guide="testimonials" className="bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-[26px] font-bold leading-[1.2] text-[#002148] sm:text-[32px] lg:text-[36px]">
          What our clients says about us
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 lg:mt-12 lg:gap-6">
          {columns.map((order, i) => (
            <Column key={i} order={order} />
          ))}
        </div>
      </div>
    </section>
  );
}

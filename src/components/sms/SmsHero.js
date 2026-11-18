import ProductHero from "@/components/common/ProductHero";

// The SMS page hero, on the shared product hero (common/ProductHero.js). Per the SMS design
// (1440px): the copy starts ~16vw down, the artwork ~8vw down at 46.2vw wide (its own white margin
// included), flush with the right edge.
export default function SmsHero() {
  return (
    <ProductHero
      guide="smsHero"
      lines={["School Management System", "for Modern Education"]}
      description="Simplify school operations, automate daily tasks, and keep your entire school connected with one smart platform."
      buttons={[
        { label: "Get a Free Quote", href: "/contact-us" },
        { label: "Book a Free Consultation", href: "/contact-us", variant: "secondary" },
      ]}
      image={{
        src: "/product/SMS/hero/SMS-hero.webp",
        alt: "School management dashboard showing student, teacher and class totals, weekly attendance and recent activity",
        width: 658,
        height: 701,
      }}
      artClassName="ml-auto w-[min(92%,600px)] lg:absolute lg:top-[clamp(90px,7.9vw,120px)] lg:right-0 lg:ml-0 lg:w-[46.2vw]"
    />
  );
}

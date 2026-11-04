import { IndustriesSection } from "@/components/lms/LmsIndustries";

// The LMS page's industry flip cards (same cards, hover/tap flip and blue reverse side), with the
// digital marketing industries. As in the design, the seven cards sit in one row of small square
// cards on desktop; rows wrap and stay centred below that (two per row on phones, three on large
// phones, four on tablets).
// TODO(content): the reverse-side summaries are drafts; replace with approved copy when available.
const industries = [
  {
    name: "Healthcare",
    lines: ["Healthcare"],
    image: "health.png",
    back: "Reach patients searching for care and grow appointments.",
  },
  {
    name: "E-Commerce",
    lines: ["E-Commerce"],
    image: "E-commerce.png",
    back: "Drive store traffic, sales and repeat buyers with ads and SEO.",
  },
  {
    name: "Retail",
    lines: ["Retail"],
    image: "retail.png",
    back: "Bring local shoppers in store and online with targeted campaigns.",
  },
  {
    name: "Fashion and Apparel",
    lines: ["Fashion and", "Apparel"],
    image: "fashion.png",
    back: "Build a brand people follow with social, ads and creative content.",
  },
  {
    name: "Food and Beverage",
    lines: ["Food and", "Beverage"],
    image: "food.png",
    back: "Fill tables and orders with local SEO and social campaigns.",
  },
  {
    name: "LifeStyle",
    lines: ["LifeStyle"],
    image: "lifestyle.png",
    back: "Grow an engaged audience and turn followers into customers.",
  },
  {
    name: "Home Appliances and Furniture",
    lines: ["Home", "Appliances and", "Furniture"],
    image: "home.png",
    back: "Reach buyers while they research and turn interest into enquiries.",
  },
];

export default function MarketingIndustries() {
  return (
    <IndustriesSection
      guide="marketingIndustries"
      title="Marketing Solutions for Every Industry"
      text="Digital marketing strategies tailored for different business models, industries and growth stages."
      assets="/service/digital-marketing/industry/"
      industries={industries}
      listClass="mx-auto mt-10 flex max-w-[1000px] flex-wrap justify-center gap-x-5 gap-y-8 sm:gap-x-6 lg:mt-14 lg:gap-x-[18px] [&>li]:w-[calc(50%-10px)] sm:[&>li]:w-[calc((100%-48px)/3)] md:[&>li]:w-[calc((100%-72px)/4)] lg:[&>li]:w-[calc((100%-108px)/7)]"
      aspect="aspect-square"
      backText="text-[12px] leading-[1.4] text-white lg:text-[11px] lg:leading-[1.35] xl:text-[12px]"
    />
  );
}

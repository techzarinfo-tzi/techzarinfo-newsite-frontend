import Image from "next/image";

const ICONS = "/product/CMMS/why-choose";

// Reading order: left column top to bottom, then the right column (the design's two columns).
const reasons = [
  {
    icon: "customized-solutions.svg",
    title: "Customized Solutions",
    text: "We understand your unique requirements and offer fully customized solutions",
  },
  {
    icon: "scalability.svg",
    title: "Scalability and Future-Ready Design",
    text: "Our CMMS software grows with your business and supports changing operational demands",
  },
  {
    icon: "client-success.svg",
    title: "Client Success Stories",
    text: "We ensure client satisfaction through reliable support and continuous improvements",
  },
  {
    icon: "cost-effective.svg",
    title: "Cost-Effective Solutions",
    text: "Our CMMS solutions offer flexible pricing to fit your budget and business needs",
  },
];

// Layout from the 1440px design: content starts 133px in (1174px wide). A left-aligned heading and
// intro (776px), then the four reasons in two columns (429px and 402px, the second starting 543px
// in), 72px between rows. Each reason: an 80px tile (20px radius, #deeafd) holding the design's 40px
// gradient icon, 21px from a title (~18px medium) and a short line (#4a566a).
// Tablet: two even columns. Phone: one column.
export default function CmmsWhyChoose() {
  return (
    <section data-guide="cmmsWhyChoose" className="bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1174px]">
        <div className="max-w-[776px]">
          <h2 className="max-w-[560px] text-[28px] font-semibold leading-[1.25] tracking-tight text-balance text-[#002461] sm:text-[34px] lg:text-[40px]">
            Why Choose TZI for CMMS App Development
          </h2>
          <p className="mt-2 text-[15px] leading-normal text-[#002461] sm:text-base lg:text-xl">
            Choose Techzarinfo&apos;s expertise for CMMS software development: We Craft tailored solutions
            to elevate maintenance efficiency, reduce downtime, and drive operational excellence for your
            business
          </p>
        </div>

        <ul className="mt-12 grid grid-flow-row gap-y-10 sm:grid-cols-2 sm:grid-rows-2 sm:grid-flow-col sm:gap-x-8 lg:mt-20 lg:grid-cols-[429px_402px] lg:gap-x-[114px] lg:gap-y-[72px]">
          {reasons.map(({ icon, title, text }) => (
            <li key={title} className="flex items-center gap-[21px]">
              <span aria-hidden="true" className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-[#deeafd] lg:size-20 lg:rounded-[20px]">
                <Image src={`${ICONS}/${icon}`} alt="" width={40} height={40} className="size-8 lg:size-10" />
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-medium leading-snug text-[#002461] lg:text-[18px]">{title}</h3>
                <p className="mt-1.5 max-w-[340px] text-[13px] leading-normal text-[#4a566a] lg:text-xs">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

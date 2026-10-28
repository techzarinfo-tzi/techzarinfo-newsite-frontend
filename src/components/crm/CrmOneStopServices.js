"use client";

import { useRef } from "react";
import Image from "next/image";
import { useInView } from "@/components/lms/LmsWhichFits";

const ASSETS = "/product/CRM/one-stop";


const services = [
  {
    title: "Custom CRM Development",
    text: "Our tailored solutions to meet the unique needs of your businesses. Custom CRM development ensures that the software matches with specific workflows, customer interaction processes, and integration with other business tools.",
    image: {
      src: `${ASSETS}/custom-crm.svg`,
      width: 290,
      height: 290,
      alt: "Custom CRM dashboard with total sales, earnings and sales analytics",
    },
  },
  {
    title: "Mobile CRM Development",
    text: "Our mobile app development team can build CRM solutions that are mobile-friendly or specifically designed as mobile apps. This is crucial for sales teams and customer service representatives who need access to CRM data on the go.",
    image: {
      src: `${ASSETS}/mobile-app-crm.svg`,
      width: 313,
      height: 312,
      alt: "Hand holding a phone running a mobile CRM app with notes, tasks and reminders",
    },
  },
  {
    title: "Enterprise CRM Software",
    text: "Our robust CRM platforms are designed to meet the complex needs of large enterprises. These systems support large datasets, offer advanced customization, and integrate with various enterprise applications to optimize customer management at scale.",
    image: {
      src: `${ASSETS}/Enterprice.svg`,
      width: 313,
      height: 312,
      alt: "Laptop showing an enterprise CRM dashboard for wind power generation",
    },
  },
  {
    title: "CRM Integration Services",
    text: "We have an expert team to integrate CRM systems with existing software like marketing platforms, ERP systems, or third-party tools. This ensures seamless data flow across platforms, improving operational efficiency and customer experience.",
    image: {
      src: `${ASSETS}/crm-integraion.svg`,
      width: 313,
      height: 312,
      alt: "Laptop showing an enterprise CRM dashboard for wind power generation",
    },
  },
  {
    title: "CRM Migration & Upgrades",
    text: "TZI is best at migrating from your old CRM system to a new one, or upgrading an existing CRM to newer versions with more features. This process helps businesses keep up with technological advancements and stay competitive in managing customer relationships.",
    image: {
      src: `${ASSETS}/nigration.svg`,
      width: 313,
      height: 312,
      alt: "Laptop showing an upgraded CRM analytics dashboard with sales charts and a world map",
    },
  },
  {
    title: "Startup CRM Software",
    text: "Techzarinfo's CRM solutions are designed for the specific needs of startups, offering scalability, cost-efficiency, and easy-to-use interfaces. These CRMs help startups manage customer relationships while growing their businesses.",
    image: {
      src: `${ASSETS}/start-up-crm.svg`,
      width: 313,
      height: 312,
      alt: "Laptop on a desk showing a startup CRM subscription dashboard",
    },
  },
];

export default function CrmOneStopServices() {
  return (
    <section
      data-guide="crmOneStop"
      className="relative overflow-hidden bg-white px-4 pt-12 pb-12 sm:px-6 sm:pt-14 lg:px-8 lg:pt-[84px] lg:pb-14"
    >
      <noscript>
        <style>{`.crm-os { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>

      {/* Soft blue haze down the left and right edges, on white */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 30% 35% at 0% 35%, #c4d7fa 0%, transparent 75%), radial-gradient(ellipse 30% 30% at 100% 60%, #c9dbfa 0%, transparent 75%), radial-gradient(ellipse 25% 25% at 100% 12%, #e2ecfc 0%, transparent 75%)",
        }}
      />

      <div className="relative">
        <h2 className="mx-auto max-w-[14em] text-center text-[32px] font-semibold leading-[1.25] tracking-tight text-[#002461] text-balance sm:text-[34px] lg:text-[40px]">
          One-Stop CRM Software Development Services
        </h2>
        <p className="mx-auto mt-3 max-w-[560px] text-center text-[15px] leading-normal text-[#4b5563] sm:text-base lg:text-lg">
          Every business manages customers differently, which is why a one-size-fits-all CRM may not
          deliver the results you expect.
        </p>

        <ul className="mx-auto mt-10 flex max-w-[1026px] flex-col gap-5 sm:mt-12 lg:mt-[88px] lg:gap-9">
          {services.map((service, i) => (
            <ServiceCard key={service.title} {...service} reverse={i % 2 === 1} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ServiceCard({ title, text, image, reverse }) {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <li
      ref={ref}
      data-inview={inView}
      className={`crm-os flex flex-col gap-5 rounded-xl bg-[#e3f2fd] p-3 sm:items-center sm:gap-6 sm:p-2.5 lg:gap-6 lg:p-3 ${
        reverse ? "sm:flex-row-reverse" : "sm:flex-row"
      }`}
    >
      <div className="relative mx-auto aspect-square w-full max-w-[313px] shrink-0 overflow-hidden rounded-lg bg-white sm:mx-0 sm:w-[220px] md:w-[260px] lg:w-[313px]">
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(max-width: 640px) 313px, (max-width: 1024px) 260px, 313px"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>

      <div className={`px-2 pb-3 sm:py-4 sm:pb-4 ${reverse ? "sm:pl-3 lg:pl-[18px]" : "sm:pr-4 lg:pr-[18px]"}`}>
        <h3 className="text-[22px] font-bold leading-tight tracking-tight text-[#002461] md:text-[26px] lg:text-[32px]">
          {title}
        </h3>
        <p className="mt-3 text-[15px] leading-[1.6] text-[#002461]/80 sm:text-base md:text-lg lg:mt-6 lg:text-[24px] lg:leading-[1.375]">
          {text}
        </p>
      </div>
    </li>
  );
}

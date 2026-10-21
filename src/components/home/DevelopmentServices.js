import ServiceSequence from "./ServiceSequence";

const services = [
  {
    image: "/home/service/web-application.webp",
    title: "Web Application",
    content:
      "Get ready to create smarter, faster, and scalable digital solutions with our web application development services tailored to your business.",
  },
  {
    image: "/home/service/mobile-application%20(2).webp",
    title: "Mobile Application",
    content:
      "Turn your ideas into engaging & high-performance mobile app development that is built around your business goals.",
  },
  {
    image: "/home/service/blockchain.webp",
    title: "Blockchain Product Development",
    content:
      "We can power your next digital breakthrough with our blockchain development solutions. From decentralized ecosystems to Defi Products etc.",
  },
];

export default function DevelopmentServices() {
  return (
    <section data-guide="devServices" className="overflow-x-clip py-8 sm:py-12 lg:py-16">
      {/* Title travels with the card stack inside the same pinned, viewport-centred block —
          see ServiceSequence — instead of scrolling away while the cards stay behind.*/}
      <ServiceSequence
        services={services}
        title={
          <h2 className="mx-auto max-w-[900px] text-center text-[26px] font-bold leading-[1.2] text-[#002148] sm:text-[36px] lg:text-[50px]">
            Your Next Big Thing Starts Here See{" "}
            <br className="hidden lg:block" />
            Our Development Services
          </h2>
        }
      />
    </section>
  );
}

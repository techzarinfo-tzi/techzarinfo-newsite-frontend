import RocketLink from "./RocketLink";

export default function Welcome() {
  return (
    <section data-guide="welcome" data-guide-ref="parent" className="flight-prev bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[22px] font-medium leading-[1.3] text-[#002148] sm:text-[32px] lg:text-[48px]">
          Welcome to our actionable access to a host of TZI
          <br className="hidden lg:block" /> Solutions for Web, Mobility,{" "}
          <span className="text-[#002148]">
            IoT, AI, Managed Services
            <br className="hidden lg:block" /> and other{" "}
            <RocketLink />{" "}
            digitally transforming technologies.
          </span>
        </p>
      </div>
    </section>
  );
}

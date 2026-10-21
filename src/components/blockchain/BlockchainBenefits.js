import Image from "next/image";

const DIR = "/service/blockchain/blockchain-application";

// Each card: small category label, title, description, and a 3D icon. `span` is the card's share of
// the 12-column desktop row; `w`/`h` are the icon's natural size, so it keeps its own proportions.
const benefits = [
  {
    label: "Fraud Prevention",
    title: "Enhanced Security & Fraud Prevention",
    text: "Our AI-powered blockchain solutions provide real-time fraud detection and advanced security protection for safer digital transactions.",
    icon: "shild.png",
    w: 170,
    h: 170,
    span: "lg:col-span-7",
  },
  {
    label: "Automation",
    title: "Intelligent Process Automation",
    text: "Automate your business transactions, workflows, and data management to improve operational efficiency using our AI-powered blockchain development services.",
    icon: "star.png",
    w: 182,
    h: 182,
    span: "lg:col-span-5",
  },
  {
    label: "Customer Experience",
    title: "Better Customer Experience",
    text: "The blockchain applications which use AI provide users with customized experiences and intelligent assistance while delivering smooth online services.",
    icon: "customer.png",
    w: 202,
    h: 201,
    span: "lg:col-span-5",
  },
  {
    label: "Data Transparency",
    title: "Improved Data Transparency & Accuracy",
    text: "The combination of blockchain with AI creates a trustworthy data management system which provides both secure access and transparent operations.",
    icon: "transpracy.png",
    w: 239,
    h: 205,
    span: "lg:col-span-7",
  },
  {
    label: "Decision Making",
    title: "Smarter Business Decision-Making",
    text: "The AI-powered blockchain analytics system delivers essential business insights which enable organizations to make quicker and more intelligent choices.",
    icon: "brain.png",
    w: 244,
    h: 201,
    span: "lg:col-span-7",
  },
  {
    label: "Digital Solution",
    title: "Scalable & Future-Ready Digital Solutions",
    text: "Our blockchain applications which use AI technology provide businesses with digital transformation solutions that maintain operational flexibility while supporting future business growth.",
    icon: "rocket.png",
    w: 227,
    h: 201,
    span: "lg:col-span-5",
  },
];

// Bento grid from the 1440px design: centred navy heading on white, then a pale blue band holding a
// 1240px grid of six cards in three rows that alternate wide/narrow (7/5, 5/7, 7/5 of 12 columns).
// Each card has its label top-left, title and copy at the bottom, and the icon centred on the right.
// Icons are drawn at a shared fraction of their natural size (--icon-unit = px per natural px), so
// their relative sizes match the design. Two equal columns on tablet, one column on mobile.
// Desktop fits one screen: the section is 100svh tall (min-h-fit lets it grow rather than clip if a
// screen is too short for the copy), the band takes what the heading leaves and the three rows share
// it. The top padding clears the floating navbar. Heading, spacing, title and icon sizes are fluid
// with the viewport height (clamp on svh), reaching the full design values on screens ~960px tall.
export default function BlockchainBenefits() {
  return (
    <section data-guide="bcBenefits" className="bg-white lg:flex lg:h-svh lg:min-h-fit lg:flex-col">
      <div className="px-4 pt-14 pb-8 text-center sm:px-6 sm:pt-[88px] sm:pb-6 lg:px-8 lg:pt-[92px] lg:pb-[clamp(12px,2svh,28px)]">
        <h2 className="mx-auto max-w-[820px] text-[32px] font-semibold leading-[1.25] tracking-tight text-[#002461] sm:text-[34px] lg:text-[clamp(30px,4.4svh,44px)] lg:leading-[1.2]">
          Smart Business Benefits of AI-Powered <br className="hidden sm:block" />
          Blockchain Applications
        </h2>
      </div>

      <div className="bg-linear-to-b from-[#eef6fe] to-[#f3f8fe] px-4 py-8 sm:px-6 sm:py-5 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:px-8 lg:pt-[clamp(10px,1.8svh,28px)] lg:pb-[clamp(14px,2.4svh,56px)]">
        <ul className="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-3 [--icon-unit:0.42px] sm:grid-cols-2 sm:gap-4 sm:[--icon-unit:0.44px] lg:flex-1 lg:grid-cols-12 lg:grid-rows-[repeat(3,minmax(min-content,1fr))] lg:gap-[clamp(10px,1.5svh,18px)] lg:[--icon-unit:clamp(0.34px,calc(0.42px+0.0008*(100svh-768px)),0.62px)]">
          {benefits.map(({ label, title, text, icon, w, h, span }) => (
            <li
              key={title}
              className={`flex items-center gap-4 rounded-xl border border-white/70 bg-[#dceafb] p-5 shadow-[0_2px_10px_rgba(35,94,190,0.06)] sm:p-4 lg:gap-[clamp(14px,2svh,24px)] lg:rounded-[14px] lg:py-[clamp(12px,1.7svh,24px)] lg:pr-[clamp(20px,2.6svh,48px)] lg:pl-[clamp(20px,2.4svh,24px)] ${span}`}
            >
              <div className="flex min-w-0 flex-1 flex-col self-stretch">
                <p className="text-[11px] font-medium leading-none text-[#4f6f9f] lg:text-xs">{label}</p>
                <h3 className="mt-6 text-[17px] font-bold leading-[1.3] text-[#0c2f6e] sm:mt-auto sm:pt-5 lg:pt-[clamp(8px,1.3svh,24px)] lg:text-[clamp(17px,2.15svh,19px)]">
                  {title}
                </h3>
                <p className="mt-2 max-w-[540px] text-[13px] leading-[1.5] text-[#4a5f82] lg:mt-[clamp(4px,0.9svh,8px)] lg:text-[clamp(13px,1.5svh,13.5px)] lg:leading-[1.45]">
                  {text}
                </p>
              </div>
              <Image
                src={`${DIR}/${icon}`}
                alt=""
                width={w}
                height={h}
                className="h-auto shrink-0"
                style={{ width: `calc(${w} * var(--icon-unit))` }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

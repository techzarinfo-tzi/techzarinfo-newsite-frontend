import {
  CircleDollarSign,
  Coins,
  Database,
  Expand,
  Gauge,
  GitBranch,
  MapPin,
  ShieldCheck,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

/// Icons from Lucide (lucide.dev), drawn in the site's colour via currentColor
const icons = {
  cost: Coins,
  efficiency: Gauge,
  local: MapPin,
  roi: TrendingUp,
  scale: Expand,
  security: ShieldCheck,
  // CRM page
  relationships: Users,
  workflow: GitBranch,
  sales: CircleDollarSign,
  data: Database,
  retention: UserCheck,
  target: Target,
};

// In the design's reading order: left column, right column, row by row
const erpBenefits = [
  { icon: "cost", title: "Cost-Effective Solutions", text: "High-quality ERP development at competitive prices" },
  { icon: "efficiency", title: "Enhanced Efficiency", text: "Automate repetitive tasks to boost productivity and reduce errors" },
  { icon: "local", title: "Localized Expertise", text: "Deep understanding of regional business needs" },
  { icon: "roi", title: "Faster ROI", text: "Achieve operational excellence and quicker returns on investment" },
  { icon: "scale", title: "Scalability", text: "ERP systems designed to grow with your business" },
  { icon: "security", title: "Data Security & Compliance", text: "Ensure your business data stays protected with your ERP systems" },
];

// Layout from the 1440px design: centred heading and subtitle over a 2-column grid of six frosted
// cards (~470px each, ~42px apart, rows ~54px apart, ~980px wide in all). Behind it, the glowing
// horizon: the top of a circle ~103vw across, peaking just under the heading (~197px down at 1440)
// with a bright blue rim and a pale haze inside, fading out towards the section bottom.
// Tablet: same two columns, narrower. Phone: one column.
// Shared by other pages: title, children (the subtitle), benefits (icon names from `icons` above) and
// guide default to the ERP page's own content, so that page passes nothing.
export default function ErpBenefits({
  title = (
    <>
      {/* The design's line break from tablets up; phones balance the lines themselves */}
      Key Benefits of Using Our ERP <br className="hidden md:block" />
      Development Services
    </>
  ),
  children = (
    <>
      By using our ERP development services, your business can reach new heights in its industry
      while gaining significant benefits such as streamlined operations, and smarter{" "}
      <span className="whitespace-nowrap">decision-making.</span>
    </>
  ),
  benefits = erpBenefits,
  guide = "erpBenefits",
}) {
  return (
    <section data-guide={guide} className="relative overflow-hidden bg-white px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-[104px] lg:pb-[110px]">
      {/* The glowing horizon: three parallel arcs (the tops of three equal circles stacked ~40px
          apart at 1440), each breathing on its own slow loop (.benefit-arc in globals.css) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 [--arc-gap:clamp(26px,2.8vw,40px)] [--arc-top:clamp(150px,13.7vw,197px)]">
        {/* Top: a soft, wide glow band */}
        <div
          className="benefit-arc absolute top-[calc(var(--arc-top)-var(--arc-gap))] left-1/2 aspect-square w-[max(103vw,900px)] -translate-x-1/2 rounded-full border border-[rgba(150,192,255,0.45)] shadow-[0_0_36px_14px_rgba(130,180,255,0.32)]"
          style={{ "--arc-shrink": 0.972, "--arc-move": "8px", "--arc-dur": "11s", "--arc-delay": "-4s" }}
        />
        {/* Middle: the bright rim, with the pale haze inside */}
        <div
          className="benefit-arc absolute top-(--arc-top) left-1/2 aspect-square w-[max(103vw,900px)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(232,242,255,0.2)_70%,rgba(214,232,255,0.75)_94%,#cfe3ff_98%,#ffffff_100%)] shadow-[0_0_0_2px_rgba(255,255,255,0.9),0_0_18px_6px_rgba(110,170,255,0.75),0_0_90px_30px_rgba(120,175,255,0.45)]"
          style={{ "--arc-shrink": 0.975, "--arc-move": "6px", "--arc-dur": "9s", "--arc-delay": "0s" }}
        />
        {/* Bottom: a thin, faint line */}
        <div
          className="benefit-arc absolute top-[calc(var(--arc-top)+var(--arc-gap))] left-1/2 aspect-square w-[max(103vw,900px)] -translate-x-1/2 rounded-full border-[1.5px] border-white/90 shadow-[0_0_10px_2px_rgba(110,170,255,0.45)]"
          style={{ "--arc-shrink": 0.955, "--arc-move": "14px", "--arc-dur": "13s", "--arc-delay": "-7s" }}
        />
        {/* Fade the horizon out towards the bottom */}
        <div className="absolute inset-x-0 bottom-0 h-[38%] bg-linear-to-b from-transparent to-white" />
      </div>

      <div className="relative mx-auto max-w-[860px] text-center">
        <h2 className="mx-auto max-w-[620px] text-[28px] font-semibold leading-[1.25] tracking-tight text-balance text-[#002461] sm:text-[34px] md:max-w-none lg:text-[40px]">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-[845px] text-[15px] leading-normal text-[#002461] sm:text-base lg:max-w-[790px] lg:text-[19px] lg:leading-[1.3]">
          {children}
        </p>
      </div>

      <ul className="relative mx-auto mt-12 grid max-w-[984px] grid-cols-1 gap-4 sm:mt-14 md:grid-cols-2 md:gap-x-[clamp(20px,2.9vw,42px)] md:gap-y-[clamp(24px,3.75vw,54px)] lg:mt-[72px]">
        {benefits.map((benefit) => (
          <li
            key={benefit.title}
            className="flex items-center gap-5 rounded-[14px] border border-[#cfe0f6] bg-white/65 p-4 shadow-[0_10px_30px_-18px_rgba(0,60,160,0.35)] backdrop-blur-sm sm:p-[14px] lg:gap-6"
          >
            <span
              aria-hidden="true"
              className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-b from-[#0d43ae] to-[#082b75] text-white shadow-[0_8px_18px_-8px_rgba(8,43,117,0.7)] lg:size-[70px]"
            >
              {(() => {
  const Icon = icons[benefit.icon];
  return <Icon aria-hidden="true" strokeWidth={1.8} className="size-6 lg:size-7" />;
})()}
            </span>
            <div>
              <h3 className="text-[17px] font-medium leading-snug text-[#002461] lg:text-[19px]">{benefit.title}</h3>
              <p className="mt-1 max-w-[365px] text-[13px] leading-snug text-[#002461]/75">{benefit.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

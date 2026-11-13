// Careers banner: a rounded sky-blue card with the title centred in it. It sits in the same page
// frame as the Blogs page (max-w-7xl, the same side and top padding under the fixed navbar), uses
// the product heroes' sky-blue wash and heading colour (#002461), and rises in with the site's
// blog-rise animation.
export default function CareersHero() {
  return (
    <section id="careers" data-guide="careersHero" className="bg-white px-4 pt-28 sm:px-6 lg:px-8 lg:pt-32">
      <div className="relative isolate mx-auto flex min-h-[clamp(9rem,24vw,22rem)] max-w-7xl items-center justify-center overflow-hidden rounded-2xl bg-[#e2f1ff] px-6 py-10">
        {/* Sky-blue wash: brighter haze top-left, softening to near white on the right */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 45% 70% at 30% 0%, #b3d8f8 0%, transparent 70%), radial-gradient(ellipse 40% 90% at 0% 60%, #c6e7fa 0%, transparent 75%), linear-gradient(90deg, #cbe6fc 0%, #e2f1ff 50%, #f3f9ff 100%)",
          }}
        />
        {/* Soft diagonal light streaks on the right */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 -z-10 w-1/3"
          style={{
            background:
              "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.45) 18%, transparent 30%, transparent 55%, rgba(255,255,255,0.35) 68%, transparent 80%)",
          }}
        />

        <h1 className="blog-rise text-center text-[28px] text-balance font-medium leading-[1.2] tracking-tight text-[#002461] sm:text-[36px] lg:text-[clamp(40px,3.35vw,52px)]">
          Build Your Career With Us
        </h1>
      </div>
    </section>
  );
}

import Image from "next/image";

// About Us hero: a wide office photo in a rounded frame over the product heroes' sky-blue wash
// (fading to white), with the two-line heading and intro centred under it. The heading and intro
// rise in with the site's blog-rise animation, as on the Careers hero.
//
// Photo: public/about/about-hero.webp.png (1097 x 498); next/image serves it as AVIF/WebP.
export default function AboutHero() {
  return (
    <section id="about" data-guide="aboutHero" className="relative overflow-hidden bg-white px-4 pt-28 pb-16 sm:px-6 sm:pt-32 lg:px-8 lg:pt-[clamp(8.5rem,13vw,12.5rem)] lg:pb-24">
      {/* Sky-blue wash: brighter haze up top, softening to white by the photo's lower edge */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[min(78%,52rem)]"
        style={{
          background:
            "radial-gradient(ellipse 45% 55% at 30% 0%, #c6e3fb 0%, transparent 70%), radial-gradient(ellipse 50% 70% at 100% 20%, #d4ecfc 0%, transparent 72%), linear-gradient(180deg, #dcedfd 0%, #e9f4fe 45%, #f6fbff 80%, #ffffff 100%)",
        }}
      />

      <div className="relative mx-auto max-w-[69rem]">
        <div className="overflow-hidden rounded-xl shadow-[0_24px_60px_-28px_rgba(0,36,97,0.35)] sm:rounded-2xl">
          <Image
            src="/about/about-hero.webp.png"
            alt="The Techzarinfo team at work in a bright open-plan office"
            width={1097}
            height={498}
            preload
            sizes="(min-width: 1140px) 1104px, calc(100vw - 2rem)"
            className="aspect-[20/9] h-auto w-full object-cover"
          />
        </div>

        <div className="mx-auto mt-10 max-w-3xl text-center sm:mt-12 lg:mt-14">
          <h1
            className="blog-rise text-[30px] font-medium leading-[1.2] tracking-tight text-[#1b2f6e] sm:text-[40px] lg:text-[clamp(40px,3.5vw,50px)]"
            style={{ "--rise-delay": "0.1s" }}
          >
            <span className="block text-[#3060ae]">Technology with</span>
            <span className="block">
              Purpose.<span className="text-[#3a63b2]">Progress</span> with People
            </span>
          </h1>
          <p
            className="blog-rise mx-auto mt-4 max-w-[42rem] text-[15px] leading-snug text-[#1d2f63] sm:text-[17px] lg:text-[clamp(17px,1.3vw,19px)]"
            style={{ "--rise-delay": "0.3s" }}
          >
            We are a team of curious, committed minds building future-ready digital solutions that solve complex
            business challenges. By combining technical expertise with a deep understanding of our clients&rsquo;
            goals, we turn technology into meaningful business progress.
          </p>
        </div>
      </div>
    </section>
  );
}

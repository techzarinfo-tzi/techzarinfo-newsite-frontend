import Image from "next/image";
import HeroButton, { HeroButtonGroup } from "@/components/common/HeroButton";

// The product hero system (as on the CRM and SMS pages): sky-blue wash, copy on the left from the
// site's 10.35vw edge, the artwork on the right, running slightly past the bottom into the white
// fade. Below lg the copy is centred above the artwork. Pages pass only their content:
//
// - guide: the AI Guide step (data-guide) for this hero
// - lines: the heading, one entry per line; each line is kept whole and the size scales with the
//   screen so the longer line always fits its column (and clear of the artwork on desktop)
// - description: the paragraph under the heading
// - buttons: [{ label, href, variant }] for HeroButton
// - image: { src, alt, width, height, unoptimized }
// - artClassName: where the artwork sits and how wide it is (per design)
// - art: optional composed artwork (a React node) used in place of the single image
export default function ProductHero({ guide, lines, description, buttons, image, art, artClassName, descriptionClassName = "lg:max-w-[620px]" }) {
  return (
    <section
      data-guide={guide}
      className="relative overflow-hidden bg-[#e2f1ff] lg:min-h-[clamp(560px,54.3vw,820px)]"
    >
      {/* Sky-blue wash: brighter haze up top, softening to white at the bottom edge */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 40% at 35% 0%, #b3d8f8 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 0% 40%, #c6e7fa 0%, transparent 75%), linear-gradient(180deg, #cbe6fc 0%, #e2f1ff 55%, #ebf5fe 85%, #ffffff 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col gap-10 pt-28 sm:pt-32 lg:min-h-[clamp(560px,54.3vw,820px)] lg:pt-[clamp(140px,16vw,240px)]">
        <div className="px-4 text-center sm:px-6 lg:w-[50vw] lg:pl-[clamp(2rem,10.35vw,11rem)] lg:pr-0 lg:text-left">
          <h1 className="mx-auto w-full text-[clamp(20px,7vw,32px)] font-medium leading-[1.2] tracking-tight text-[#002461] sm:text-[40px] lg:mx-0 lg:text-[clamp(28px,3.2vw,52px)]">
            {lines.map((line, i) => (
              <span key={i}>
                {i > 0 && " "}
                <span className="block whitespace-nowrap">{line}</span>
              </span>
            ))}
          </h1>
          <p className={`mx-auto mt-4 max-w-xl text-base leading-snug text-[#002461] sm:text-lg lg:mx-0 lg:text-[clamp(16px,1.25vw,19px)] ${descriptionClassName}`}>
            {description}
          </p>

          <HeroButtonGroup>
            {buttons.map((b) => (
              <HeroButton key={b.label} label={b.label} href={b.href} variant={b.variant} />
            ))}
          </HeroButtonGroup>
        </div>

        <div className={artClassName}>
          {art ?? (
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              preload
              unoptimized={image.unoptimized}
              sizes={image.unoptimized ? undefined : "(min-width: 1024px) 48vw, 92vw"}
              className="h-auto w-full"
            />
          )}
        </div>
      </div>

      {/* White fade so the artwork blends into the next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-linear-to-b from-transparent to-white"
      />
    </section>
  );
}

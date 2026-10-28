import Image from "next/image";

export default function HeroGraphic() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md sm:max-w-lg lg:max-w-none">
      <Image
        src="/home/homepage-hero.webp"
        alt=""
        fill
        priority
        sizes="(min-width: 1280px) 730px, (min-width: 1024px) 58vw, (min-width: 640px) 512px, 448px"
        className="animate-spin-slow object-contain"
      />
    </div>
  );
}

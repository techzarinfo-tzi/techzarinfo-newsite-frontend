import Image from "next/image";

export default function HeroGraphic() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md sm:max-w-lg lg:max-w-none">
      <Image
        src="/home/homepage-hero.svg"
        alt=""
        fill
        priority
        className="animate-spin-slow object-contain"
      />
    </div>
  );
}

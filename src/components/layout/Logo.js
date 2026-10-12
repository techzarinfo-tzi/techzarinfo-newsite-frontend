import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Logo() {
  return (
    <Link
      href="/"
      className="block shrink-0"
      aria-label={`${siteConfig.name} home`}
    >
      <Image
        src={siteConfig.images.logo}
        alt={`${siteConfig.name} logo`}
        width={206}
        height={41}
        priority
        className="h-9 w-auto lg:h-10"
      />
    </Link>
  );
}

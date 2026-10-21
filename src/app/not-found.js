import Image from "next/image";
import Link from "next/link";
import { Bebas_Neue } from "next/font/google";

// Only the 404 page uses it, so it isn't preloaded site-wide; "block" keeps the headline from
// flashing in a fallback font while it loads.
const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"], preload: false, display: "block" });

export const metadata = {
  title: "Page not found",
  robots: { index: false },
};

// Static 404 design. Every size and position is in --nf-u (1% of the design
// frame's width, see .nf in globals.css) so the composition keeps its
// proportions at any viewport. The layers (copy, digits, character) are
// separate elements so they can be animated independently later.
export default function NotFound() {
  return (
    <section className="nf">
      <div className="nf-copy">
        <h1 className={`nf-title ${bebasNeue.className}`}>
          The developer is typing...
          <span className="sr-only"> Error 404: page not found.</span>
        </h1>
        <p className="nf-text">
          Just kidding. They have no idea where <br className="hidden sm:inline" />
          the page went either.
        </p>
        <Link href="/" className="nf-button">
          Try Another Universe
        </Link>
      </div>

      <div className="nf-stage" aria-hidden="true">
        <span className={`nf-digits ${bebasNeue.className}`}>404</span>
        <Image
          src="/404.webp"
          alt=""
          width={644}
          height={610}
          preload
          unoptimized
          className="nf-character"
        />
      </div>
    </section>
  );
}

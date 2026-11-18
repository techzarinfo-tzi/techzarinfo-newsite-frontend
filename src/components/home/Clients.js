import Image from "next/image";

const base = "/home/clients/";

const rowOne = [
  "2bfound 1.webp",
  "Businessside 1.webp",
  "Netafim 1.webp",
  "Netwo 1.webp",
  "Zeverin 1.webp",
  "c32 1.webp",
];

const rowTwo = [
  "goverment.webp",
  "icecream 1.webp",
  "lisrc 1.webp",
  "maxmoney 1.webp",
  "norinco 1.webp",
  "obeikan 1.webp",
  "skillbil-logo 2.webp",
];

function altFor(file) {
  return file.replace(/\.(svg|webp)$/, "").replace(/\s+\d+$/, "");
}

function MarqueeRow({ files, reverse = false, duration }) {
  // Each group holds the set twice so it always spans wide viewports; the
  // track holds two identical groups and shifts by exactly one group (-50%).
  const group = (hidden) => (
    <ul
      className="marquee-group"
      aria-hidden={hidden || undefined}
    >
      {[0, 1].flatMap((copy) =>
        files.map((file) => (
          <li key={`${copy}-${file}`} className="marquee-item">
            <Image
              src={encodeURI(`${base}${file}`)}
              alt={hidden || copy ? "" : altFor(file)}
              width={180}
              height={72}
              unoptimized
              className="h-full w-full object-contain"
            />
          </li>
        )),
      )}
    </ul>
  );

  return (
    <div className="marquee">
      <div
        className={`marquee-track ${reverse ? "marquee-reverse" : ""}`}
        style={{ "--marquee-duration": duration }}
      >
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}

export default function Clients() {
  return (
    <section data-guide="clients" className="bg-white py-14 sm:py-16 lg:py-20">
   
      <div className="mt-2 flex flex-col gap-6 sm:mt-10 sm:gap-8">
        <MarqueeRow files={rowOne} duration="45s" />
        <MarqueeRow files={rowTwo} reverse duration="55s" />
      </div>
    </section>
  );
}

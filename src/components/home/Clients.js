import Image from "next/image";

const base = "/home/clients/";

const rowOne = [
  "2bfound 1.svg",
  "Businessside 1.svg",
  "Netafim 1.svg",
  "Netwo 1.svg",
  "Zeverin 1.svg",
  "c32 1.svg",
];

const rowTwo = [
  "goverment.webp",
  "icecream 1.svg",
  "lisrc 1.svg",
  "maxmoney 1.svg",
  "norinco 1.svg",
  "obeikan 1.svg",
  "skillbil-logo 2.svg",
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

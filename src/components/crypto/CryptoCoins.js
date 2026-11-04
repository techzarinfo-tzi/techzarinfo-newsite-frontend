import Image from "next/image";

const DIR = "/service/crypto/hero/layers";

// The hero artwork ("crypto coin 1.svg", a 440 x 562 frame around one 1086 x 1448 PNG) split into
// one layer per coin tile, each cut out at its original spot. Positions are in the PNG's pixels;
// FRAME is the part of the PNG the SVG shows, so the layers line up exactly with the original.
// Where a tile was hidden behind the one in front (Tether's top-left corner under Ethereum,
// Bitcoin's top-right under Tether), its layer has that corner filled in, so nothing opens up
// while the front coin spins.
const FRAME = { x: 139.54, y: 185.04, w: 889.83, h: 1136.56 };

// Back to front, as stacked in the design. float/spin: delays that keep the coins out of step
// (the spins are 2.5s apart in a 7.5s cycle, so one coin turns at a time, top to bottom).
const coins = [
  { name: "bitcoin", x: 182, y: 807, w: 633, h: 489, float: "-1.1s", spin: "5.4s" },
  { name: "tether", x: 423, y: 523, w: 585, h: 440, float: "-2.3s", spin: "2.9s" },
  { name: "eth", x: 169, y: 216, w: 556, h: 439, float: "0s", spin: "0.4s" },
];

const pct = (v, total) => `${((v / total) * 100).toFixed(3)}%`;

// The coins bob gently and, one after another, spin a full turn like a flicked coin (globals.css
// .crypto-coin-*). CSS only, so it costs no JavaScript; with reduced motion they stay still and
// the artwork looks exactly like the original image.
export default function CryptoCoins({ className = "" }) {
  return (
    <div
      role="img"
      aria-label="Ethereum, Tether and Bitcoin coins"
      className={`relative aspect-440/562 ${className}`}
    >
      {coins.map((c) => (
        <div
          key={c.name}
          className="crypto-coin-float absolute"
          style={{
            left: pct(c.x - FRAME.x, FRAME.w),
            top: pct(c.y - FRAME.y, FRAME.h),
            width: pct(c.w, FRAME.w),
            "--float-delay": c.float,
          }}
        >
          <Image
            src={`${DIR}/coin-${c.name}.webp`}
            alt=""
            width={c.w}
            height={c.h}
            preload
            sizes="(min-width: 1024px) 22vw, 50vw"
            draggable={false}
            className="crypto-coin-spin h-auto w-full select-none"
            style={{ "--spin-delay": c.spin }}
          />
        </div>
      ))}
    </div>
  );
}

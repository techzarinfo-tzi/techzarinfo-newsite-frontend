import { FeatureStackSection } from "@/components/cmms/CmmsAppDevelopment";

const ASSETS = "/service/mobile-app/2-section";

// The CMMS page's stacked feature cards (FeatureStackSection), with this page's four app types.
// Per the 1228x467 design card: copy and a "Read more" button instead of star points, no outline,
// artwork alternating left/right and running off the card's bottom edge (the supplied artwork is
// pre-cropped there). 2-ios.png is the phone artwork taken out of the supplied 2.svg, which is a
// full card mockup (background, glows and text included).
// Copy columns: from x 78 (6.35%) when the art is on the right; from ~45% to 3.4% short of the right
// edge when it is on the left.
const COPY_LEFT = "lg:w-[57%] lg:pl-[6.35%]";
const COPY_RIGHT = "lg:w-[54.6%] lg:pr-[3.4%]";

const features = [
  {
    title: "Android Application Development",
    text: "Mobile app development is integral to the modern business landscape, revolutionizing how businesses engage with their customers. As a premier mobile app development company in Chennai, TZI specializes in creating bespoke Android applications tailored to your business needs.",
    link: { label: "Read more", href: "/contact-us" },
    image: {
      src: `${ASSETS}/1%20(2).svg`,
      width: 405,
      height: 447,
      alt: "An events app on an Android phone beside a 3D Android robot",
      // left 85, flush with the bottom, 405 wide
      box: "lg:left-[6.9%] lg:bottom-0 lg:w-[33%]",
    },
    reverse: true,
    copyBox: COPY_RIGHT,
  },
  {
    title: "IOS Application Development",
    text: "As a leading mobile app development agency in Chennai, TZI delivers a comprehensive range of professional and in-demand iOS application development services. Our team of dedicated developers, with vast industry-specific experience, employs an agile approach to design and deliver high-end solutions.",
    link: { label: "Read more", href: "/contact-us" },
    image: {
      src: `${ASSETS}/2-ios.png`,
      width: 396,
      height: 520,
      alt: "A weather app on an iPhone beside a 3D silver Apple logo",
      // left 710, top 24, 396 wide (the card clips its bottom)
      box: "lg:left-[57.8%] lg:top-[5.1%] lg:w-[32.25%]",
    },
    copyBox: COPY_LEFT,
  },
  {
    title: "Hybrid Application Development",
    text: "In today's fast-paced digital world, businesses are increasingly leaning toward hybrid applications that work seamlessly across multiple platforms. As a trusted mobile application development company in Chennai, TZI leverages the power of frameworks like Flutter and React Native to build cross-platform apps that combine functionality with cost efficiency.",
    link: { label: "Read more", href: "/contact-us" },
    image: {
      src: `${ASSETS}/3.svg`,
      width: 383,
      height: 447,
      alt: "A project dashboard app on a phone beside 3D Flutter and React logos",
      // left 85, flush with the bottom, 383 wide
      box: "lg:left-[6.9%] lg:bottom-0 lg:w-[31.2%]",
    },
    reverse: true,
    copyBox: COPY_RIGHT,
  },
  {
    title: "Blockchain App Development",
    text: "Enhance your mobile solutions with the power of blockchain. Techzarinfo provides its clients advanced Blockchain App Development Services which enable them to create secure mobile solutions with transparent and efficient operations.",
    link: { label: "Read more", href: "/blockchain-app-development-services" },
    image: {
      src: `${ASSETS}/4.svg`,
      width: 498,
      height: 427,
      alt: "A crypto wallet app on a phone beside 3D blue puzzle pieces",
      // 20 in from the right, flush with the bottom, 498 wide
      box: "lg:right-[1.6%] lg:bottom-0 lg:w-[40.55%]",
    },
    copyBox: COPY_LEFT,
  },
];

export default function MobileAppServices() {
  return (
    <FeatureStackSection
      guide="mobileServices"
     
      features={features}
      cardHeightClass="lg:h-[clamp(400px,32.4vw,467px)]"
    />
  );
}

import EcommerceIndustries from "@/components/ecommerce/EcommerceIndustries";

const ASSETS = "/service/mobile-app/tailord";

// The E-commerce page's industry cards (same tiles, lens zoom and captions), with six mobile app
// industries. The cards are 640 x 776 webps (as on the E-commerce page) rendered from the supplied
// SVGs in the same folder: 1 (2).svg IoT, 2.svg E-commerce, 3.svg Entertainment (supplied as the
// round icon only, so set on the same card frame), 5.svg Lifestyle, 6.svg Healthcare, 4.svg Business
// (4-6 had their caption baked in below the card; that strip is cropped off, the caption is text).
const industries = [
  { src: `${ASSETS}/iot.webp`, label: ["IOT"] },
  { src: `${ASSETS}/ecommerce.webp`, label: ["E commerce"] },
  { src: `${ASSETS}/entertainment.webp`, label: ["Entertainment"] },
  { src: `${ASSETS}/lifestyle.webp`, label: ["Lifestyle"] },
  { src: `${ASSETS}/healthcare.webp`, label: ["Healthcare"] },
  { src: `${ASSETS}/business.webp`, label: ["Business"] },
];

export default function MobileIndustries() {
  return (
    <EcommerceIndustries
      guide="mobileIndustries"
      title="Tailored Mobile App Solutions For Diverse Industries"
      titleWidth="lg:max-w-[720px]"
      text="At TZI we have a team of experienced mobile app developers in who are well-versed in the latest technologies and trends in the mobile app development industry"
      items={industries}
      listWidth="lg:max-w-[1230px]"
    />
  );
}

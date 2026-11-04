import { FeatureStackSection } from "@/components/cmms/CmmsAppDevelopment";

const ASSETS = "/service/digital-marketing/grow-line";

// The CMMS page's scroll-stacked feature cards (same cards, glows, bullets and stacking), with the
// digital marketing services and artwork. Four cards alternating as in the design: artwork left
// (mirrored, no outline) on SEO and Meta Ads, artwork right (outlined) on Google Ads and Social Media.
// Each artwork is a 628 x 647 dashboard panel, set ~36% of the card wide, inset from its side and
// vertically centred so it fits the 502px card height.
const features = [
  {
    title: "Search Engine Optimization (SEO)",
    text: "As a digital marketing agency in Chennai, we help businesses improve search visibility, rank for high-intent keywords and build long-term organic lead flow through SEO strategies designed for growth.",
    points: ["Rank for high-intent keywords", "Improve local search visibility", "Build long-term organic lead flow"],
    image: {
      src: `${ASSETS}/seo.png`,
      width: 628,
      height: 647,
      alt: "SEO dashboard with clicks, impressions, CTR, an organic traffic chart and keyword rankings",
      box: "lg:left-[4%] lg:top-1/2 lg:w-[36%] lg:-translate-y-1/2",
    },
    reverse: true,
  },
  {
    title: "Google Ads",
    text: "Our digital marketing services in Chennai include search-focused Google Ads campaigns built to generate qualified enquiries, reduce wasted spend and improve return on ad spend.",
    points: [
      "Lead-focused Google Ads campaigns",
      "Better targeting, messaging and landing page alignment",
      "Ongoing ROI optimization for businesses",
    ],
    image: {
      src: `${ASSETS}/google-ads.png`,
      width: 628,
      height: 647,
      alt: "Google Ads dashboard with clicks, conversions, cost per click, campaign results and spend overview",
      box: "lg:right-[4%] lg:top-1/2 lg:w-[36%] lg:-translate-y-1/2",
    },
    outlined: true,
  },
  {
    title: "Meta Ads",
    text: "We run Facebook and Instagram campaigns that help businesses stay visible, retarget the right audience and generate enquiries through performance-focused Meta Ads.",
    points: ["Reach, retargeting and lead generation", "Sharper audience targeting", "Creative + performance optimization"],
    image: {
      src: `${ASSETS}/mneta-ads.png`,
      width: 628,
      height: 647,
      alt: "Meta Ads dashboard with reach, link clicks, conversions, campaign performance and spend overview",
      box: "lg:left-[4%] lg:top-1/2 lg:w-[36%] lg:-translate-y-1/2",
    },
    reverse: true,
  },
  {
    title: "Social Media Marketing",
    text: "We help businesses build a stronger online presence with social media strategies focused on visibility, brand trust and consistent digital growth.",
    points: ["Content strategy for business growth", "Consistent brand visibility", "Creative support for engagement"],
    image: {
      src: `${ASSETS}/social-media.png`,
      width: 628,
      height: 647,
      alt: "Social media dashboard with reach, platform performance, engagement rate, posts and new followers",
      box: "lg:right-[4%] lg:top-1/2 lg:w-[36%] lg:-translate-y-1/2",
    },
    outlined: true,
  },
];

export default function MarketingGrowOnline() {
  return (
    <FeatureStackSection
      guide="marketingGrowOnline"
      title="Everything You Need to Grow Online"
      text="From SEO and Google Ads to social media marketing, our digital marketing services in Chennai are designed to help businesses attract the right audience, generate enquiries and grow with clarity."
      features={features}
    />
  );
}

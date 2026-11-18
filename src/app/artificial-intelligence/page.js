import AiHero from "@/components/ai/AiHero";
import AiHeroStage from "@/components/ai/AiHeroStage";
import AiIntro from "@/components/ai/AiIntro";
import AiOneStop from "@/components/ai/AiOneStop";
import AiIsland from "@/components/ai/AiIsland";
import AiIndustries from "@/components/ai/AiIndustries";
import AiApproach from "@/components/ai/AiApproach";
import AiJourney from "@/components/ai/AiJourney";
import AiHire from "@/components/ai/AiHire";
import AiFeatures from "@/components/ai/AiFeatures";
import AiTools from "@/components/ai/AiTools";
import { withSeo } from "@/lib/seo";

const path = "/artificial-intelligence";

export const metadata = withSeo({
  title: "Artificial Intelligence Development Services",
  description:
    "Techzarinfo builds artificial intelligence solutions, from intelligent applications and AI agents to automation, that help businesses work smarter.",
  alternates: {
    canonical: path,
  },
});

// The hero stays pinned while the intro rises over it (AiHeroStage drives the hand-over), so these
// two are not wrapped in RevealEach: its entrance transforms would fight the sticky pin.
export default function ArtificialIntelligencePage() {
  return (
    <>
      <AiHeroStage hero={<AiHero />}>
        <AiIntro />
      </AiHeroStage>
      {/* Scroll-driven films (pinned stages), also kept out of RevealEach */}
      <AiOneStop />
      <AiIsland />
      <AiIndustries />
      <AiApproach />
      <AiJourney />
      <AiHire />
      <AiFeatures />
      <AiTools />
    </>
  );
}

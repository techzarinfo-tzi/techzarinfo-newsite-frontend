import AboutHero from "@/components/about/AboutHero";
import AboutMissionVision from "@/components/about/AboutMissionVision";
import AboutBuiltAround from "@/components/about/AboutBuiltAround";
import AboutCeoMessage from "@/components/about/AboutCeoMessage";
import RevealEach from "@/components/common/RevealEach";

const path = "/about";

export const metadata = {
  title: "About Us",
  description:
    "We are a team of curious, committed minds building future-ready digital solutions that solve complex business challenges and turn technology into meaningful business progress.",
  alternates: {
    canonical: path,
  },
};

export default function AboutPage() {
  return (
    <RevealEach>
      <AboutHero />
      <AboutMissionVision />
      <AboutBuiltAround />
      <AboutCeoMessage />
    </RevealEach>
  );
}

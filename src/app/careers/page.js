import CareersHero from "@/components/careers/CareersHero";
import CareersOpenings from "@/components/careers/CareersOpenings";
import CareersShareResume from "@/components/careers/CareersShareResume";
import CareersApply from "@/components/careers/CareersApply";
import RevealEach from "@/components/common/RevealEach";
import { getOpenings } from "@/lib/careers";

const path = "/careers";

export const metadata = {
  title: "Careers",
  description:
    "Build your career with TechZar. Explore opportunities to work on AI, web, mobile, e-commerce and blockchain projects with a team that helps you grow.",
  alternates: {
    canonical: path,
  },
};

// Openings are read from the backend and re-read at most once a minute (see lib/careers.js), so
// jobs posted or edited in the admin panel appear here without a redeploy.
export default async function CareersPage() {
  const openings = await getOpenings();

  return (
    <RevealEach>
      <CareersHero />
      <CareersOpenings openings={openings} />
      <CareersShareResume />
      {/* Only ids and titles go to the client form, not every description */}
      <CareersApply openings={openings.map(({ id, title }) => ({ id, title }))} />
    </RevealEach>
  );
}

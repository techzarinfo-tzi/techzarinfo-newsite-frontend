import Hero from "@/components/home/Hero";
import Clients from "@/components/home/Clients";
import Welcome from "@/components/home/Welcome";
import FlightStage from "@/components/home/FlightStage";
import AiSolutions from "@/components/home/AiSolutions";
import Services from "@/components/home/Services";
import DevelopmentServices from "@/components/home/DevelopmentServices";
import Solutions from "@/components/home/Solutions";
import TziIntro from "@/components/home/TziIntro";

export default function Home() {
  return (
    <>
      <Hero />
      <Clients />
      <FlightStage>
        <Welcome />
        <div className="flight-spacer" aria-hidden="true" />
        <Services />
      </FlightStage>
      <AiSolutions />
      <TziIntro />
      <DevelopmentServices />
      <Solutions />
    </>
  );
}

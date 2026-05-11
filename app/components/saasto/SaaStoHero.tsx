import { AnimatedHeroSection } from "./AnimatedHeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { FeaturesShowcaseSection } from "./FeaturesShowcaseSection";
import { SaaStoNavbar } from "./SaaStoNavbar";
import { StatsSection } from "./StatsSection";

export function SaaStoHero() {
  return (
    <div className="flex flex-col bg-white text-[#1a1a2e]">
      <SaaStoNavbar />

      <AnimatedHeroSection />
      <StatsSection />
      <FeaturesSection />
      <FeaturesShowcaseSection />
    </div>
  );
}

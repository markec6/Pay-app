import { AnimatedHeroSection } from "./AnimatedHeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { FeaturesShowcaseSection } from "./FeaturesShowcaseSection";
import { HappyUsersSection } from "./HappyUsersSection";
import { PlatformSection } from "./PlatformSection";
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
      <PlatformSection />
      <HappyUsersSection />
    </div>
  );
}

import { AnimatedHeroSection } from "./AnimatedHeroSection";
import { SaaStoNavbar } from "./SaaStoNavbar";

export function SaaStoHero() {
  return (
    <div className="flex flex-col bg-white text-[#1a1a2e]">
      <SaaStoNavbar />

      <AnimatedHeroSection />
    </div>
  );
}

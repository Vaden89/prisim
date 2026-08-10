import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/landing/sections/hero";
import { PoweredBySection } from "@/components/landing/sections/powered-by";
import { IntegrationsSection } from "@/components/landing/sections/integrations";
import { ProblemSection } from "@/components/landing/sections/problem";
import { HowPrisimWorksSection } from "@/components/landing/sections/how-prisim-works";
import { FeaturesSection } from "@/components/landing/sections/features";
import { Footer } from "@/components/landing/sections/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="w-full flex flex-col items-center justify-center">
        <HeroSection />
        <PoweredBySection />
        <IntegrationsSection />
        <ProblemSection />
        <HowPrisimWorksSection />
        <FeaturesSection />
        <Footer />
      </main>
    </>
  );
}

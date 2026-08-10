import { EnrichAnimation } from "./enrich-animation";
import { ScanAnimation } from "./scan-animation";

interface HowItWorksAnimationProps {
  activeIndex: number;
}

export function HowItWorksAnimation({ activeIndex }: HowItWorksAnimationProps) {
  return (
    <div className="relative flex w-full items-center justify-center overflow-hidden bg-[#EEEEF1] lg:border-l-[0.7px] lg:border-b-[0.7px] border-light-gray/50 h-[450px] lg:h-175.5 z-1">
      {activeIndex === 1 && <EnrichAnimation />}
      {activeIndex === 3 && <ScanAnimation />}
      {activeIndex === 2 && <EnrichAnimation />}
    </div>
  );
}

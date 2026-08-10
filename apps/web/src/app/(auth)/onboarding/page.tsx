"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { onboardingSteps } from "@/data/onboarding";
import { CreateWorkspaceForm } from "@/components/workspace/forms/create-workspace-form";

export default function OnboardingPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  function handleNext(orgId: string) {
    if (activeStep === onboardingSteps.length - 1) {
      router.replace(`/dashboard/${orgId}`);
      return;
    }
    setActiveStep(activeStep + 1);
  }

  return (
    <main className="w-full h-dvh flex flex-col items-center justify-center">
      <div className="min-w-109 flex flex-col gap-10 items-center text-center bg-tertiary border-border-gray border rounded-xl px-4 sm:px-8 py-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold leading-[120%] tracking-[-4%]">
            {onboardingSteps[activeStep]?.title}
          </h1>
          <p className="w-85 tracking-[-4%] leading-[120%] text-dark-gray-500">
            {onboardingSteps[activeStep]?.description}
          </p>
        </div>
        {activeStep === 0 && <CreateWorkspaceForm onSuccess={handleNext} />}
        <StepIndicator activeStep={activeStep} />
      </div>
    </main>
  );
}

function StepIndicator({ activeStep }: { activeStep: number }) {
  return (
    <div className="-mt-3 flex gap-2">
      {onboardingSteps.map((step, index) => (
        <div
          key={index}
          className={`flex-1 w-2 h-2 ${index === activeStep ? "bg-primary" : "bg-border-gray"} rounded-full`}
        ></div>
      ))}
    </div>
  );
}

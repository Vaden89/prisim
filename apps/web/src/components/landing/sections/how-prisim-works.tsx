"use client";
import gsap from "gsap";
import { cn } from "@repo/ui";
import { useEffect, useRef, useState } from "react";

export function HowPrisimWorksSection() {
  return (
    <>
      <div
        id="how-it-works"
        className="scroll-mt-28 lg:scroll-mt-36 w-full px-4 lg:px-24 bg-foreground text-background"
      >
        <section className="min-h-[50vh] border-x-[0.7px] border-light-gray/50">
          <div className="lg:pt-36 pt-16 p-4 lg:p-8 border-b border-light-gray/50">
            <h2 className="text-3xl lg:text-5xl max-w-2xl leading-[120%] tracking-[-4%]">
              How Prism maps your code in seconds.
            </h2>
          </div>
          <Content />
        </section>
      </div>
      <div className="w-full lg:px-24 px-4 h-24 bg-foreground border-t-[0.7px] border-light-gray/50">
        <div className="border-x-[0.7px] border-light-gray/50 h-full" />
      </div>
    </>
  );
}

function Content() {
  const [activeIndex, setActiveIndex] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!intervalRef.current) {
            intervalRef.current = setInterval(() => {
              setActiveIndex((prev) => (prev % 3) + 1);
            }, 5000);
          }
        } else if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      });
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !indicatorRef.current) return;

    const stepWidth = containerRef.current.clientWidth / 3;
    const width = activeIndex * stepWidth;

    gsap.to(indicatorRef.current, {
      width,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [activeIndex]);

  return (
    <div
      ref={containerRef}
      className="w-full grid grid-cols-1 lg:grid-cols-2 relative"
    >
      <div ref={indicatorRef} className="absolute w-1/3 h-0.5 bg-primary" />
      <div className="flex flex-col">
        <ExplainerCard
          index={1}
          title="Submit"
          isActive={activeIndex === 1}
          onClick={() => setActiveIndex(1)}
          label="Write like you normally do."
          description="Create tickets in a Trello-style board using simple text, screenshots, or Figma links. No technical jargon required."
        />
        <ExplainerCard
          index={2}
          title="REASON"
          isActive={activeIndex === 2}
          onClick={() => setActiveIndex(2)}
          label="Prism indexes your repository."
          description="On every merge, Prism uses syntax tree analysis and vector code embeddings to build a live map of your architecture, functions, and dependencies."
        />
        <ExplainerCard
          index={3}
          title="ENRICH"
          isActive={activeIndex === 3}
          onClick={() => setActiveIndex(3)}
          label="Instant blast-radius mapping."
          description=" Before a developer opens the ticket, Prism identifies every cascading file, API, or database table affected generating actionable sub-tasks automatically."
        />
      </div>
      <div className="w-full h-90 lg:h-150 bg-[#E1E1E7] border-l-[0.7px] border-light-gray/50"></div>
    </div>
  );
}

interface ExplainerCardProps {
  index: number;
  title: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  description: string;
}

function ExplainerCard({
  index,
  title,
  description,
  label,
  isActive,
  onClick,
}: ExplainerCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "lg:p-8 p-4 border-b-[0.7px] border-light-gray/50 h-20 lg:h-25.5 overflow-hidden transition-all ease-in duration-300 cursor-pointer",
        isActive && "h-72 lg:h-92.5",
      )}
    >
      <div
        className={cn(
          "text-2xl lg:text-[32px] uppercase flex items-center gap-8 [&_span]:leading-[120%] [&_span]:tracking-[-4%] mb-24 lg:mb-40",
          !isActive && "text-light-gray",
        )}
      >
        <span>{String(index).padStart(2, "0")}. </span>
        <span>{title}</span>
      </div>

      <div className="flex flex-col gap-2 lg:gap-0">
        <span className="text-2xl lg:text-[32px] leading-[120%] tracking-[-4%]">
          {label}
        </span>
        <span className="lg:text-xl text-light-gray leading-[120%] tracking-[-4%]">
          {description}
        </span>
      </div>
    </div>
  );
}

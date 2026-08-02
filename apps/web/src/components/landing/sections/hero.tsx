"use client";
import { useGSAP } from "@gsap/react";
import { Button } from "@repo/ui";
import gsap from "gsap";
import Link from "next/link";
import { useRef } from "react";

export function HeroSection() {
  const container = useRef(null);
  useGSAP(
    () => {
      gsap.fromTo(
        ".test",
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.5,
          delay: 0.5,
        },
      );
    },
    { scope: container },
  );

  return (
    <div className="w-full px-4 lg:px-24">
      <section
        ref={container}
        className="w-full min-h-96 lg:min-h-150 border-x-[0.7px] border-outline-gray flex flex-col items-center justify-center text-center px-4 lg:p-10 main-bg"
      >
        <h1 className="test opacity-0 max-w-206 font-semibold text-4xl lg:text-[80px] leading-[120%] tracking-[-4%]">
          Turn simple requests into full-stack clarity.
        </h1>
        <p className="test opacity-0 max-w-3xl font-normal text-sm lg:text-lg text-dark-gray mb-5">
          Non-technical teams write the request. Prism reads your codebase, maps
          the cascading impact, and builds the technical sub-tasks
          automatically.
        </p>
        <Link href="/register">
          <Button variant="primary" className="test opacity-0 rounded-full">
            Get Started
          </Button>
        </Link>
      </section>
    </div>
  );
}

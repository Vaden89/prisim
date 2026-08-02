import Image from "next/image";

export function FeaturesSection() {
  return (
    <>
      <div
        id="features"
        className="scroll-mt-28 lg:scroll-mt-36 w-full px-4 lg:px-24 border-b-[0.7px] border-light-gray/50"
      >
        <div className="w-full border-x-[0.7px] border-light-gray/50 lg:px-8 px-4 pt-36 pb-6 lg:pb-12">
          <h2 className="lg:text-5xl text-[32px] max-w-209 leading-[120%] tracking-[-4%] ">
            Built for total clarity at every level of your stack
          </h2>
        </div>
      </div>
      <div className="w-full lg:px-24 px-4">
        <section className="w-full border-x-[0.7px] border-light-gray/50 grid grid-cols-1 lg:grid-cols-2">
          <div className="flex flex-col items-center gap-5 lg:p-8 p-4">
            <div>
              <h3 className="text-2xl lg:text-[32px] tracking-[-4%]">
                Zero technical friction
              </h3>
              <p className="text-dark-gray lg:text-2xl tracking-[-4%]">
                Non-technical teams create tasks on a simple Kanban board, while
                developers get clear, high-density views.
              </p>
            </div>
            <Image
              width={461}
              height={454}
              alt="ascii art"
              src="/icons/ascii-art-1.svg"
              className="ascii-interactive"
            />
          </div>
          <div className="lg:border-l-[0.7px] border-t-[0.7px] lg:border-t-0 border-light-gray/50 flex flex-col items-center gap-5 p-4 lg:p-8">
            <div>
              <h3 className="text-2xl lg:text-[32px] tracking-[-4%]">
                Deep codebase awareness.
              </h3>
              <p className="text-dark-gray lg:text-2xl tracking-[-4%]">
                Syntax trees and vector embeddings map your true architecture on
                every commit—no keyword guessing.
              </p>
            </div>
            <Image
              width={461}
              height={454}
              alt="ascii art"
              src="/icons/ascii-art-2.svg"
              className="ascii-interactive"
            />
          </div>
          <div className="border-t-[0.7px] border-light-gray/50 lg:col-span-2 flex flex-col lg:flex-row items-center justify-between gap-2.5 p-4 lg:p-8">
            <div>
              <h3 className="text-2xl lg:text-[32px] tracking-[-4%]">
                Automated blast-radius mapping.{" "}
              </h3>
              <p className="text-dark-gray max-w-xl lg:text-2xl tracking-[-4%]">
                Prism automatically traces affected APIs, database schemas, and
                dependencies to generate sub-tasks before work begins.
              </p>
            </div>
            <Image
              width={461}
              height={454}
              alt="ascii art"
              src="/icons/ascii-art-3.svg"
            />
          </div>
        </section>
      </div>
    </>
  );
}

export function ProblemSection() {
  return (
    <div className="w-full px-4 lg:px-24 border-b border-outline-gray">
      <section className="w-full border-x-[0.7px] border-outline-gray flex flex-col gap-2 lg:gap-4 p-4 lg:p-8 pt-16 lg:pt-36">
        <h2 className="text-2xl lg:text-5xl leading-[120%] lg:max-w-4xl">
          Bridge the gap between feature requests and code execution with a
          single impact-analysis engine.
        </h2>
        <p className="text-dark-gray leading-[120%] tracking[-4%] lg:text-xl lg:max-w-4xl">
          Stop guessing what a single ticket might break across your system.
          Bringing non-technical ideas into production shouldn&apos;t mean
          wrestling with vague descriptions, untangling hidden code
          dependencies, or dealing with unexpected downtime.
        </p>
      </section>
    </div>
  );
}

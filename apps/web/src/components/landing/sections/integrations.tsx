const integrations = [
  {
    label: "GitHub",
    icon: "/icons/github.svg",
    color: "#ffffff",
  },
  {
    label: "GitLab",
    icon: "/icons/gitlab.svg",
    color: "#fc6d26",
  },
  {
    label: "BitBucket",
    icon: "/icons/bitbucket.svg",
    color: "#2684ff",
  },
];

export function IntegrationsSection() {
  return (
    <div className="w-full border-b-[0.7px] border-outline-gray/50 text-outline-gray tracking-[-1%] lg:h-18.5 grid grid-cols-2 lg:grid-cols-4">
      <div className="flex items-center justify-center border-b-[0.7px] border-outline-gray/50 ">
        <span>INTEGRATES WITH:</span>
      </div>
      {integrations.map((item, index) => {
        return (
          <div
            key={index}
            style={{ "--brand": item.color } as React.CSSProperties}
            className="group border-l-[0.7px] border-outline-gray/50 flex items-center justify-center gap-2 text-dark-gray hover:text-[var(--brand)] transition-colors border-b-[0.7px] lg:border-b-0 py-3 "
          >
            <span
              role="img"
              aria-label={item.label}
              className="w-6 h-6 bg-dark-gray group-hover:bg-[var(--brand)] transition-colors"
              style={{
                maskImage: `url(${item.icon})`,
                WebkitMaskImage: `url(${item.icon})`,
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskPosition: "center",
                WebkitMaskPosition: "center",
                maskSize: "contain",
                WebkitMaskSize: "contain",
              }}
            />
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

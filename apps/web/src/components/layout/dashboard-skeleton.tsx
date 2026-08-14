import Image from "next/image";

function Bar({ className }: { className?: string }) {
  return (
    <div className={`rounded-md bg-outline-gray-200 animate-pulse ${className}`} />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="w-full h-dvh flex">
      <aside className="w-75 h-full flex flex-col justify-between">
        <div>
          <div className="w-full flex items-center h-16 border-b-[0.7px] border-outline-gray/50 p-2">
            <Image src="/images/logo.svg" alt="" width={100} height={100} />
          </div>

          <div className="flex flex-col gap-2 mt-2.5 p-2">
            <Bar className="h-9 w-full" />

            <div className="flex flex-col gap-2 mt-2 px-2">
              <Bar className="h-3 w-16" />
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <Bar className="h-4 w-32" />
                  <Bar className="h-4 w-6" />
                </div>
              ))}
            </div>

            <Bar className="h-9 w-full mt-2" />
          </div>
        </div>

        <div className="px-2 my-4">
          <Bar className="h-10 w-full rounded-full" />
        </div>
      </aside>

      <div className="bg-tertiary w-full h-full flex flex-col">
        <header className="w-full h-16 flex justify-between items-center gap-4 p-2 border-b-[0.7px] border-outline-gray/50">
          <Bar className="h-4 w-56" />
          <div className="flex items-center gap-4">
            <Bar className="h-10 w-10 rounded-full" />
            <div className="w-px h-10 bg-outline-gray" />
            <Bar className="h-10 w-28" />
          </div>
        </header>

        <div className="flex-1 w-full min-h-0 overflow-y-auto p-6">
          <div className="flex flex-col gap-3">
            <Bar className="h-8 w-64" />
            {Array.from({ length: 6 }).map((_, idx) => (
              <Bar key={idx} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

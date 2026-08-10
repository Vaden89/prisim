"use client";
import Image from "next/image";
import { api } from "@repo/convex/api";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Select, SelectItem } from "@repo/ui";
import { Spinner } from "@/components/common/spinner";

export default function DashboardPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>("");
  const organizations = useQuery(api.org_functions.getOrganizations);

  useEffect(() => {
    if (!organizations) return;

    if (organizations.length === 1) {
      router.replace(`/dashboard/${organizations[0]!._id}`);
      return;
    }

    if (organizations.length === 0) {
      router.replace("/onboarding");
      return;
    }

    setSelected(organizations[0]!._id);
  }, [organizations, router]);

  if (!organizations || organizations.length <= 1) {
    return (
      <div className="w-full h-dvh flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full h-dvh flex flex-col items-center justify-center p-5">
      <div className="w-full md:w-1/2 lg:w-1/3 px-4 sm:px-8 py-6 bg-tertiary border border-border-gray rounded-xl text-center">
        <div className="flex flex-col gap-4 mb-6">
          <Image
            width={40}
            height={40}
            loading="eager"
            alt="Prisim Logo"
            className="mx-auto"
            src="/images/logo-2.svg"
          />
          <span className="text-2xl text-center font-semibold">
            Select Workspace
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <Select
            onValueChange={setSelected}
            placeholder="Choose a workspace"
            value={organizations?.find((v) => v._id === selected)?.name ?? ""}
          >
            {organizations.map((org) => (
              <SelectItem key={org._id} value={org._id}>
                {org.name}
              </SelectItem>
            ))}
          </Select>
          <Button
            className="w-full rounded-full"
            disabled={!selected}
            onClick={() => router.push(`/dashboard/${selected}`)}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

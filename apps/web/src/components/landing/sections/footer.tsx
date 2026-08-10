import { Button } from "@repo/ui";
import { Copyright } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <>
      <footer className="w-full lg:px-24 px-4 border-y-[0.7px] border-light-gray/50">
        <div className="hold w-full border-x-[0.7px] border-light-gray/50 lg:p-16 p-4 lg:pb-8 pt-32 lg:pt-60">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 lg:gap-10">
            <span className="md:max-w-md lg:max-w-xl leading-[120%] text-center sm:text-left text-3xl lg:text-[64px] tracking-[-4%]">
              AI that understands your code where it lives.
            </span>
            <Link href="/register">
              <Button variant="primary" className="rounded-full">
                Get Started
              </Button>
            </Link>
          </div>
          <div className="w-full flex items-center justify-between lg:mt-12 mt-8 text-xs">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
              <div className="flex items-center gap-1">
                <span>Prisim</span>
                <Copyright size={14} />
                <span>2026 </span>
              </div>
              <span>All Rights Reserved </span>
            </div>
            <div className="flex flex-col items-center lg:flex-row gap-2 lg:gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
      <div className="w-full lg:px-24 px-4">
        <div className="h-14 border-x-[0.7px] border-light-gray/50" />
      </div>
    </>
  );
}

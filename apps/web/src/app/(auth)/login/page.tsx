import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "@/components/auth/forms/login-form";
import { InviteInfoBanner } from "@/components/auth/invite-info-banner";

export default function LoginPage() {
  return (
    <div className="w-full h-dvh flex flex-col items-center justify-center p-5 relative">
      <InviteInfoBanner />
      <div className="w-full sm:w-1/2 xl:w-1/3 px-4 sm:px-8 py-6 bg-tertiary border border-border-gray rounded-xl text-center">
        <div className="flex flex-col gap-4 mb-4">
          <Link href="/">
            <Image
              width={40}
              height={40}
              loading="eager"
              alt="Prisim Logo"
              src="/images/logo-2.svg"
              className="mx-auto"
            />
          </Link>
          <span className="text-2xl text-center font-semibold">
            Welcome back
          </span>
        </div>
        <LoginForm />
        <p className="text-[13px] mt-2 text-center text-light-gray">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

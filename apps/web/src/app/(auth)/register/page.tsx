import Image from "next/image";
import { RegisterForm } from "@/components/auth/forms/register-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="w-full h-dvh flex flex-col items-center justify-center p-5">
      <div className="w-full sm:w-1/2 xl:w-1/3 px-4 sm:px-8 py-6 bg-tertiary border border-border-gray rounded-xl text-center">
        <div className="flex flex-col gap-4 mb-4">
          <Image
            width={40}
            height={40}
            loading="eager"
            alt="Prisim Logo"
            src="/images/logo-2.svg"
            className="mx-auto"
          />
          <span className="text-2xl text-center font-semibold">
            Create your Workspace
          </span>
        </div>
        <RegisterForm />
        <p className="text-[13px] mt-2 text-center text-light-gray">
          Already have an account?{" "}
          <Link href="/login" className="font-medium underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

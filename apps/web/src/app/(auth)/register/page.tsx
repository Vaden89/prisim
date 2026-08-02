import Image from "next/image";
import { RegisterForm } from "../../../components/auth/forms/register-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="w-full h-dvh grid grid-cols-1 p-4">
      <div className="w-full flex flex-col items-center justify-center space-y-8">
        <Image
          src="/images/logo.svg"
          width={105}
          height={40}
          alt="Prisim Logo"
        />
        <span className="text-2xl text-center lg:text-4xl font-semibold">
          Create your free account
        </span>
        <RegisterForm />
        <p className="text-[13px] text-center text-light-gray">
          Already have an account?{" "}
          <Link href="/login" className="font-medium underline">
            Login here
          </Link>
        </p>
      </div>
      {/*<div className=""></div>*/}
    </div>
  );
}

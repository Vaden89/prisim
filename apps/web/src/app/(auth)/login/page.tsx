import Image from "next/image";
import { LoginForm } from "../../../components/auth/forms/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="w-full p-4 h-dvh grid grid-cols-1">
      <div className="w-full flex flex-col items-center justify-center space-y-8">
        <Link href="/">
          <Image
            src="/images/logo.svg"
            width={105}
            height={40}
            alt="Prisim Logo"
          />
        </Link>
        <span className="text-3xl text-center lg:text-4xl font-semibold">
          Welcome back
        </span>
        <LoginForm />
      </div>
      {/*<div className=""></div>*/}
    </div>
  );
}

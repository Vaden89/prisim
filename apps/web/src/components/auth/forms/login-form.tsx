"use client";
import { Button, FormField } from "@repo/ui";
import { useActionState } from "react";
import { loginAction } from "../../../actions/auth";

export function LoginForm() {
  const initialState = {
    inputs: {
      email: "",
      password: "",
    },
    error: "",
    message: "",
  };

  const [state, action, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="lg:w-1/3 space-y-3">
      <Button
        variant="ghost"
        className="w-full text-foreground rounded-full border border-light-gray/50 py-3 hover:bg-light-gray/10 flex"
      >
        <span
          role="img"
          aria-label="Github"
          className="w-5 h-5 mr-3 bg-white"
          style={{
            maskImage: `url(/icons/github.svg)`,
            WebkitMaskImage: `url(/icons/github.svg)`,
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            maskSize: "contain",
            WebkitMaskSize: "contain",
          }}
        />
        Continue with Github
      </Button>
      <div className="w-full flex items-center gap-4 text-xs text-light-gray my-8">
        <div className="w-full h-[0.5px] bg-light-gray/50" />
        <span>or</span>
        <div className="w-full h-[0.5px] bg-light-gray/50" />
      </div>

      <FormField name="email" placeholder="Enter email address" type="email" />
      <FormField name="password" placeholder="Enter password" type="password" />
      <Button
        loading={isPending}
        variant="secondary"
        type="submit"
        className="w-full rounded-full"
      >
        Login
      </Button>
      <p className="text-[11px] text-center text-light-gray">
        By continuing, you agree to Prisim&apos;s{" "}
        <span className="font-medium underline">Terms of Service</span> and{" "}
        <span className="font-medium underline">Privacy Policy</span>.
      </p>
    </form>
  );
}

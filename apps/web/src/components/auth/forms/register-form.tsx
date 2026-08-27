"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, FormField } from "@repo/ui";
import { authClient } from "@/lib/auth-client";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const firstname = String(formData.get("firstname") ?? "");
    const lastname = String(formData.get("lastname") ?? "");

    const { error } = await authClient.signUp.email({
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      name: `${firstname} ${lastname}`.trim(),
    });

    if (error) {
      setIsPending(false);
      setError(error.message ?? "Unable to create account. Please try again.");
      return;
    }

    const inviteToken = localStorage.getItem("invite-token");
    if (inviteToken) {
      localStorage.removeItem("invite-token");
      router.push(`/invite/${inviteToken}`);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <GithubButton />
      <div className="w-full flex items-center gap-4 text-xs text-light-gray my-2">
        <div className="w-full h-px bg-light-gray/50" />
        <span>or</span>
        <div className="w-full h-px bg-light-gray/50" />
      </div>
      <div className="flex items-center gap-3">
        <FormField
          type="text"
          name="firstname"
          placeholder="Enter first name"
        />
        <FormField name="lastname" placeholder="Enter last name" type="text" />
      </div>
      <FormField name="email" placeholder="Enter email address" type="email" />
      <FormField name="password" placeholder="Enter password" type="password" />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button
        loading={isPending}
        variant="secondary"
        type="submit"
        className="w-full rounded-full"
      >
        Register
      </Button>
      <p className="text-[11px] text-center text-light-gray">
        By continuing, you agree to Prisim&apos;s{" "}
        <span className="font-medium underline">Terms of Service</span> and{" "}
        <span className="font-medium underline">Privacy Policy</span>.
      </p>
    </form>
  );
}

function GithubButton() {
  return (
    <Button
      type="button"
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
  );
}

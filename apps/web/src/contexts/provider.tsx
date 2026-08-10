import { CSSProperties, ReactNode } from "react";
import { Toaster } from "sonner";
import { LenisProvider } from "./lenis-provider";
import { ConvexProvider } from "./convex-provider";

export const Provider = ({ children }: { children: ReactNode }) => {
  return (
    <ConvexProvider>
      <LenisProvider>{children}</LenisProvider>
      <Toaster
        theme="dark"
        position="top-center"
        style={
          {
            "--normal-bg": "var(--tertiary)",
            "--normal-text": "var(--foreground)",
            "--normal-border": "var(--border-gray)",
            "--border-radius": "12px",
          } as CSSProperties
        }
      />
    </ConvexProvider>
  );
};

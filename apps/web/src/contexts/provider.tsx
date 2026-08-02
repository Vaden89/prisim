import { ReactNode } from "react";
import { LenisProvider } from "./lenis-provider";

export const Provider = ({ children }: { children: ReactNode }) => {
  return <LenisProvider>{children}</LenisProvider>;
};

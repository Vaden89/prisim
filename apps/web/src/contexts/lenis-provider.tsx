import "lenis/dist/lenis.css";
import { ReactNode } from "react";
import ReactLenis from "lenis/react";

export const LenisProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ReactLenis root options={{ smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
};

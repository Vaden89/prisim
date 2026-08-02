import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Provider } from "../contexts/provider";

const suisseIntl = localFont({
  src: [
    {
      path: "../../public/fonts/suisse-intl/SuisseIntl-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/suisse-intl/SuisseIntl-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/suisse-intl/SuisseIntl-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/suisse-intl/SuisseIntl-SemiBold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/suisse-intl/SuisseIntl-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prism",
  description:
    "Bridge the gap between product vision and code reality. Prism brings codebase context into ticket creation—preventing unexpected regressions, mapping blast radius, and automating technical task breakdowns before a single line of code is written.",
};

gsap.registerPlugin(useGSAP);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={suisseIntl.variable}>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}

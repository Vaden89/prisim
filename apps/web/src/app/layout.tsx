import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://localhost:3000";
const siteName = "Prism";
const siteTitle = "Prism - Bridge the gap between vision and implementation";
const siteDescription =
  "Bridge the gap between product vision and code reality. Prism brings codebase context into ticket creation preventing unexpected regressions, mapping blast radius, and automating technical task breakdowns before a single line of code is written.";
const keywords = [
  "Prism",
  "Prisim",
  "Jira",
  "Codebase",
  "Ticket",
  "AI agents",
  "task management",
  "task breakdown",
];

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: keywords,
  authors: [
    {
      name: "Isaac Shosanya",
      url: "https://vaden.is-a.dev",
    },
  ],
  publisher: "Isaac Shosanya",
  creator: "Isaac Shosanya",
  referrer: "origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName,
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    site: "@vadenisisaac",
    creator: "@vadenisisaac",
    title: siteTitle,
    description: siteDescription,
  },
  alternates: {
    canonical: baseUrl,
  },
  category: "technology",
};

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

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

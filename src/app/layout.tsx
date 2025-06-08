import "~/styles/globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { auth } from "~/server/auth";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "PrepMate - AI-Powered Resume Builder",
  description:
    "Transform your career with AI-enhanced resumes using the proven XYZ formula. Choose from stunning templates and share your professional story online.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body className="bg-white text-slate-950 antialiased dark:bg-slate-950 dark:text-slate-50">
        <Providers session={session}>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

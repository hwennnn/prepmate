"use client";

import dynamic from "next/dynamic";
import OnboardingLoading from "../loading";

// Dynamically import the client component with no SSR
const OnboardingPageClient = dynamic(() => import("./OnboardingPageClient"), {
  ssr: false,
  loading: () => <OnboardingLoading />,
});

export function OnboardingClientWrapper() {
  return <OnboardingPageClient />;
}

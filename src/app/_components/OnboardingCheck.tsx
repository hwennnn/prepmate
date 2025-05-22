"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { api } from "~/trpc/react";

interface OnboardingCheckProps {
  reverse?: boolean; // If true, redirect completed users away from onboarding page
  children?: React.ReactNode;
}

export function OnboardingCheck({
  reverse = false,
  children,
}: OnboardingCheckProps) {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { data: onboardingStatus, isLoading } =
    api.onboarding.getOnboardingStatus.useQuery(undefined, {
      // Refetch when window regains focus to catch status changes
      refetchOnWindowFocus: true,
      // Ensure we don't use stale data
      staleTime: 0,
    });

  useEffect(() => {
    if (!isLoading && onboardingStatus && !isRedirecting) {
      if (reverse) {
        // For onboarding page: redirect completed users to dashboard
        if (onboardingStatus.hasCompletedOnboarding) {
          setIsRedirecting(true);
          router.push("/dashboard");
        }
      } else {
        // For other pages: redirect incomplete users to onboarding
        if (!onboardingStatus.hasCompletedOnboarding) {
          setIsRedirecting(true);
          router.push("/onboarding");
        }
      }
    }
  }, [isLoading, onboardingStatus, router, reverse, isRedirecting]);

  // Show loading state while checking status or redirecting
  if (isLoading || isRedirecting) {
    const loadingText = isRedirecting ? "Redirecting..." : "Loading...";
    return <LoadingSpinner fullScreen text={loadingText} size="lg" />;
  }

  // For reverse mode (onboarding page), only render children if user hasn't completed onboarding
  if (reverse) {
    if (onboardingStatus?.hasCompletedOnboarding) {
      // User has completed onboarding but redirect hasn't happened yet
      return (
        <LoadingSpinner
          fullScreen
          text="Redirecting to dashboard..."
          size="lg"
        />
      );
    }
    // User hasn't completed onboarding, show the onboarding form
    return <>{children}</>;
  }

  // For normal mode (other pages), only render children if user has completed onboarding
  if (onboardingStatus && !onboardingStatus.hasCompletedOnboarding) {
    // User hasn't completed onboarding but redirect hasn't happened yet
    return (
      <LoadingSpinner
        fullScreen
        text="Redirecting to onboarding..."
        size="lg"
      />
    );
  }

  return <>{children}</>;
}

import { redirect } from "next/navigation";
import { getSession } from "~/lib/dal";
import { api } from "~/trpc/server";
interface OnboardingCheckProps {
  reverse?: boolean; // If true, redirect completed users away from onboarding page
  children?: React.ReactNode;
}

export async function OnboardingCheck({
  reverse = false,
  children,
}: OnboardingCheckProps) {
  // Verify session using DAL - this is cached and optimized
  const session = await getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  // Get onboarding status from server
  const onboardingStatus = await api.onboarding.getOnboardingStatus();

  if (reverse) {
    // For onboarding page: redirect completed users to dashboard
    if (onboardingStatus.hasCompletedOnboarding) {
      redirect("/dashboard");
    }
    // User hasn't completed onboarding, show the onboarding form
    return <>{children}</>;
  } else {
    // For other pages: redirect incomplete users to onboarding
    if (!onboardingStatus.hasCompletedOnboarding) {
      redirect("/onboarding");
    }
    // User has completed onboarding, show the protected content
    return <>{children}</>;
  }
}

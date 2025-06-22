"use client";

import { useRouter } from "next/navigation";
import { ErrorMessage } from "~/components/error-message";
import { Header } from "~/components/layout";
import { api } from "~/trpc/react";
import { OnboardingForm } from "../../_components/onboarding/OnboardingForm";

export function OnboardingPageClient() {
  const utils = api.useUtils();
  const router = useRouter();

  const completeOnboardingMutation =
    api.onboarding.completeOnboarding.useMutation({
      onSuccess: async () => {
        await utils.onboarding.getOnboardingStatus.invalidate();
        router.push("/dashboard");
      },
      onError: (error) => {
        console.error("Failed to complete onboarding:", error);
      },
    });

  const handleOnboardingComplete = async () => {
    try {
      await completeOnboardingMutation.mutateAsync();
    } catch {
      // Error is already handled in onError
    }
  };

  // render error component if error
  if (completeOnboardingMutation.error) {
    return (
      <ErrorMessage
        error={completeOnboardingMutation.error}
        title="Error completing onboarding!"
        description={completeOnboardingMutation.error.message}
        showHomeButton={true}
        showTechnicalDetails={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <Header variant="blurred" showSignOutButton disabledLogoNavigation />

      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white">
            Welcome to PrepMate! 🎉
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Let&apos;s set up your profile to create amazing resumes and
            portfolios. This information will be used to populate your documents
            automatically.
          </p>
        </div>

        <OnboardingForm onComplete={handleOnboardingComplete} />
      </div>
    </div>
  );
}

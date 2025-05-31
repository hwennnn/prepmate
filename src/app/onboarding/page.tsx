"use client";

import { ThemeToggle } from "~/components/theme-toggle";
import { Logo } from "~/components/ui/logo";
import { api } from "~/trpc/react";
import { OnboardingForm } from "../_components/onboarding/OnboardingForm";

export default function OnboardingPage() {
  const utils = api.useUtils();

  const completeOnboardingMutation =
    api.onboarding.completeOnboarding.useMutation({
      onSuccess: async () => {
        // Invalidate the onboarding status query to trigger OnboardingCheck redirect
        await utils.onboarding.getOnboardingStatus.invalidate();
      },
      onError: (error) => {
        console.error("Failed to complete onboarding:", error);
        // setIsCompleting(false);
      },
    });

  const handleOnboardingComplete = async () => {
    // setIsCompleting(true);
    try {
      await completeOnboardingMutation.mutateAsync();
      // Don't set loading to false here - let OnboardingCheck handle the redirect
    } catch (error) {
      // Error is already handled in onError
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-2">
            <Logo size="md" variant="rounded-lg" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
              PrepMate
            </span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

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

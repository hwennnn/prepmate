"use client";

import { useRouter } from "next/navigation";
import { ThemeToggle } from "~/components/theme-toggle";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { Logo } from "~/components/ui/logo";
import { api } from "~/trpc/react";

import { useMemo } from "react";
import { OnboardingForm } from "~/app/_components/onboarding/OnboardingForm";

import { ErrorMessage } from "~/components/error-message";
import { convertProfileToOnboardingForm } from "~/lib/profile";

export function EditProfilePageClient() {
  const router = useRouter();
  const utils = api.useUtils();

  // Fetch existing profile data
  const {
    data: profileData,
    isLoading,
    error,
  } = api.onboarding.getProfile.useQuery();

  const handleEditComplete = async () => {
    await utils.onboarding.getProfile.invalidate();
    router.push("/profile");
  };

  const initialData = useMemo(
    () => convertProfileToOnboardingForm(profileData),
    [profileData],
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen size="lg" />;
  }

  if (error) {
    return (
      <ErrorMessage
        error={error}
        title="Error Loading Profile"
        description={error.message}
        showHomeButton={true}
        showTechnicalDetails={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
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
            Edit Your Profile ✏️
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Update your professional information to keep your profile current.
          </p>
        </div>

        <OnboardingForm
          initialData={initialData}
          onComplete={handleEditComplete}
        />
      </div>
    </div>
  );
}

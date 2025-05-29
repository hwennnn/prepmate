"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { api } from "~/trpc/react";
import { OnboardingCheck } from "../_components/OnboardingCheck";
import { SignedInOnly } from "../_components/SignedInOnly";
import { EducationCard } from "./components/EducationCard";
import { ExperienceCard } from "./components/ExperienceCard";
import { PersonalInfoCard } from "./components/PersonalInfoCard";
import { ProfileNavigation } from "./components/ProfileNavigation";
import { ProjectsCard } from "./components/ProjectsCard";
import { SkillsCard } from "./components/SkillsCard";

export default function ProfilePage() {
  const {
    data: profile,
    isLoading,
    error,
  } = api.onboarding.getProfile.useQuery();

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading profile..." size="lg" />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400">
                Failed to load profile: {error.message}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-slate-600 dark:text-slate-400">
                No profile found. Please complete your onboarding first.
              </p>
              <Button asChild className="mt-4">
                <Link href="/onboarding">Complete Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SignedInOnly>
      <OnboardingCheck />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <ProfileNavigation />

        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Personal Information Sidebar */}
            <div className="lg:col-span-1">
              <PersonalInfoCard profile={profile} />
              {profile.skills && <SkillsCard skills={profile.skills} />}
            </div>

            {/* Main Content */}
            <div className="space-y-8 lg:col-span-2">
              <ExperienceCard experience={profile.experience ?? []} />
              <EducationCard education={profile.education ?? []} />
              <ProjectsCard projects={profile.projects ?? []} />
            </div>
          </div>
        </div>
      </div>
    </SignedInOnly>
  );
}

"use client";

import { EducationCard } from "~/app/profile/_components/EducationCard";
import { ExperienceCard } from "~/app/profile/_components/ExperienceCard";
import { PersonalInfoCard } from "~/app/profile/_components/PersonalInfoCard";
import { ProfileNavigation } from "~/app/profile/_components/ProfileNavigation";
import { ProjectsCard } from "~/app/profile/_components/ProjectsCard";
import { SkillsCard } from "~/app/profile/_components/SkillsCard";

import { LoadingSpinner } from "~/components/ui/loading-spinner";

import { api } from "~/trpc/react";
import { ErrorMessage } from "~/components/error-message";

export function ProfilePageClient() {
  const {
    data: profile,
    isFetching,
    error,
    refetch,
  } = api.onboarding.getProfile.useQuery(undefined, {
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleRetry = () => {
    void refetch();
  };

  if (isFetching) {
    return <LoadingSpinner fullScreen text="Loading profile..." size="lg" />;
  }

  if (error || !profile) {
    return (
      <ErrorMessage
        error={error}
        title="Failed to Load Profile"
        description={
          error?.message ??
          "We couldn't load your profile information. This might be because your profile hasn't been set up yet or there was a network issue."
        }
        retry={handleRetry}
        showHomeButton={true}
        showTechnicalDetails={true}
      />
    );
  }

  return (
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
  );
}

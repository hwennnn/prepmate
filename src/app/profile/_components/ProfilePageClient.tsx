"use client";

import { EducationCard } from "~/app/profile/_components/EducationCard";
import { ExperienceCard } from "~/app/profile/_components/ExperienceCard";
import { PersonalInfoCard } from "~/app/profile/_components/PersonalInfoCard";
import { ProfileHeader } from "~/app/profile/_components/ProfileHeader";
import { ProfileManagementCard } from "~/app/profile/_components/ProfileManagementCard";
import { ProjectsCard } from "~/app/profile/_components/ProjectsCard";
import { SkillsCard } from "~/app/profile/_components/SkillsCard";

import { LoadingSpinner } from "~/components/ui/loading-spinner";

import { useState } from "react";
import { ErrorMessage } from "~/components/error-message";
import { api } from "~/trpc/react";

export function ProfilePageClient() {
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null,
  );

  const {
    data: profiles,
    isFetching: profilesLoading,
    error: profilesError,
    refetch: refetchProfiles,
  } = api.profile.getProfiles.useQuery(undefined, {
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Get the profile to show details for (selected or default)
  const profileToShow = selectedProfileId
    ? profiles?.find((p) => p.id === selectedProfileId)
    : (profiles?.find((p) => p.isDefault) ?? profiles?.[0]);

  const handleRetry = () => {
    void refetchProfiles();
  };

  if (profilesLoading) {
    return <LoadingSpinner fullScreen text="Loading profiles..." size="lg" />;
  }

  if (profilesError ?? !profiles ?? profiles.length === 0) {
    return (
      <ErrorMessage
        error={profilesError}
        title="Failed to Load Profiles"
        description={
          profilesError?.message ??
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
      <ProfileHeader
        selectedProfileId={selectedProfileId ?? profileToShow?.id ?? null}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Sidebar - Profile Management */}
          <div className="space-y-6 lg:col-span-1">
            <ProfileManagementCard
              onProfileSelect={setSelectedProfileId}
              selectedProfileId={selectedProfileId ?? profileToShow?.id ?? null}
            />

            {profileToShow && (
              <>
                <PersonalInfoCard profile={profileToShow} />
                {profileToShow.skills && (
                  <SkillsCard skills={profileToShow.skills} />
                )}
              </>
            )}
          </div>

          {/* Main Content - Profile Details */}
          <div className="space-y-8 lg:col-span-2">
            {profileToShow ? (
              <>
                <div className="mb-6">
                  <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
                    {profileToShow.profileName}
                    {profileToShow.isDefault && (
                      <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Default
                      </span>
                    )}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    {profileToShow.firstName} {profileToShow.lastName} •{" "}
                    {profileToShow.email}
                  </p>
                </div>

                <ExperienceCard experience={profileToShow.experience ?? []} />
                <EducationCard education={profileToShow.education ?? []} />
                <ProjectsCard projects={profileToShow.projects ?? []} />
              </>
            ) : (
              <div className="py-12 text-center">
                <p className="text-slate-600 dark:text-slate-400">
                  Select a profile to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import type { TRPCClientErrorLike } from "@trpc/react-query";
import { AlertCircle, RefreshCw, User } from "lucide-react";
import Link from "next/link";
import { EducationCard } from "~/app/profile/_components/EducationCard";
import { ExperienceCard } from "~/app/profile/_components/ExperienceCard";
import { PersonalInfoCard } from "~/app/profile/_components/PersonalInfoCard";
import { ProfileNavigation } from "~/app/profile/_components/ProfileNavigation";
import { ProjectsCard } from "~/app/profile/_components/ProjectsCard";
import { SkillsCard } from "~/app/profile/_components/SkillsCard";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import type { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <ProfileNavigation />

      {isFetching ? (
        <LoadingSpinner fullScreen text="Loading profile..." size="lg" />
      ) : !profile ? (
        <ProfileError error={error} handleRetry={handleRetry} />
      ) : (
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
      )}
    </div>
  );
}

const ProfileError = ({
  error,
  handleRetry,
}: {
  error: TRPCClientErrorLike<AppRouter> | null;
  handleRetry: () => void;
}) => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/20">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl text-slate-900 dark:text-white">
            Failed to Load Profile
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            {error?.message ??
              "We couldn't load your profile information. This might be because your profile hasn't been set up yet or there was a network issue."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <Button onClick={handleRetry} className="w-full" variant="default">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/onboarding">
                <User className="mr-2 h-4 w-4" />
                Complete Profile Setup
              </Link>
            </Button>

            <Button asChild variant="ghost" className="w-full">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <strong>Technical details:</strong> {error.message}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

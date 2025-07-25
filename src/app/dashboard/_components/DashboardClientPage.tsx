"use client";

import { BarChart3, FileText, Settings, User } from "lucide-react";
import { FeatureCard, StatsCard } from "~/components/dashboard";
import { ErrorMessage } from "~/components/error-message";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { api } from "~/trpc/react";

export function DashboardClientPage() {
  const {
    data: profile,
    isFetching,
    error,
    refetch,
  } = api.onboarding.getProfile.useQuery(undefined, {
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Get profile analytics
  const { data: analytics, isLoading } =
    api.resume.getDashBoardAnalytics.useQuery(
      { profileId: profile?.id ?? "" },
      { enabled: !!profile?.id },
    );

  const handleRetry = () => {
    void refetch();
  };

  if (isFetching) {
    return <LoadingSpinner fullScreen text="Loading dashboard..." size="lg" />;
  }

  if (error || !profile) {
    return (
      <ErrorMessage
        error={error}
        title="Failed to Load Dashboard"
        description={
          error?.message ??
          "We couldn't load your dashboard information. This might be because your profile hasn't been set up yet or there was a network issue."
        }
        retry={handleRetry}
        showHomeButton={true}
        showTechnicalDetails={true}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white">
          Welcome back, {profile.firstName}! 👋
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Here&apos;s what you can do with PrepMate.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          title="Resume Builder"
          description="Create professional resumes with AI-powered optimization and beautiful templates."
          icon={FileText}
          iconColor="text-blue-600"
          href="/resume/list"
          buttonText="Build Resume"
          buttonVariant="default"
        />

        <FeatureCard
          title="Profile Management"
          description="View and edit your professional information, experience, and skills."
          icon={User}
          iconColor="text-green-600"
          href="/profile"
          buttonText="View Profile"
          buttonVariant="outline"
        />

        <FeatureCard
          title="Analytics"
          description="Track your resume views, downloads, and application success rates."
          icon={BarChart3}
          iconColor="text-purple-600"
          buttonText="Coming Soon"
          isComingSoon={true}
        />

        <FeatureCard
          title="Mock Interviews"
          description="Practice with AI-powered mock interviews tailored to your target roles."
          icon={Settings}
          iconColor="text-orange-600"
          buttonText="Coming Soon"
          isComingSoon={true}
        />

        <FeatureCard
          title="Job Matching"
          description="Get personalized job recommendations based on your profile and preferences."
          icon={Settings}
          iconColor="text-red-600"
          buttonText="Coming Soon"
          isComingSoon={true}
        />

        <FeatureCard
          title="Application Tracker"
          description="Keep track of your job applications and follow up efficiently."
          icon={Settings}
          iconColor="text-indigo-600"
          buttonText="Coming Soon"
          isComingSoon={true}
        />
      </div>

      {/* Quick Stats */}
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
          Quick Overview
        </h2>
        {isLoading && !analytics ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <LoadingSpinner text="Loading resume..." />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-4">
            <StatsCard
              value={1}
              label="Profile Complete"
              valueColor="text-blue-600"
            />

            <StatsCard
              value={analytics?.numberOfResumes ?? 0}
              label="Resumes Created"
              valueColor="text-green-600"
            />

            <StatsCard
              value={analytics?.totalViews ?? 0}
              label="Total Views"
              valueColor="text-purple-600"
            />

            <StatsCard
              value={0}
              label="Applications"
              valueColor="text-orange-600"
            />
          </div>
        )}
      </div>
    </div>
  );
}

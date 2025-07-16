"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { ResumeCard } from "./ResumeCard";
import { EmptyState } from "./EmptyState";
import { convertResumesToList } from "~/lib/profile";

import { Plus } from "lucide-react";
import { ErrorMessage } from "~/components/error-message";
import { Header } from "~/components/layout";
import { Button } from "~/components/ui/button";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { Toaster } from "react-hot-toast";

export function ResumeListClient() {
  const {
    data: resumesData,
    isLoading,
    error,
  } = api.resume.getResumes.useQuery();

  const resumes = convertResumesToList(resumesData);

  if (isLoading) {
    return (
      <LoadingSpinner fullScreen text="Loading your resumes..." size="lg" />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        error={error}
        title="Failed to Load Resumes"
        description="We couldn't load your saved resumes. Please try again."
        showHomeButton={true}
        showTechnicalDetails={true}
      />
    );
  }

  if (!resumes) {
    return <EmptyState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <Header
        variant="blurred"
        showDashboardLink
        showProfileLink
        showSignOutButton
        isAuthenticated
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              My Resumes
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Manage your saved resumes and create new ones
            </p>
          </div>
          <Link href="/resume/templates">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Resume
            </Button>
          </Link>
        </div>

        {/* Resume Grid */}
        {resumes.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}

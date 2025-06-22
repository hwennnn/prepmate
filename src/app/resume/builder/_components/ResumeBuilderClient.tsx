"use client";

import { Download, Save } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { OnboardingFormData } from "~/app/_components/onboarding/types";
import { ErrorMessage } from "~/components/error-message";
import { Header } from "~/components/layout";
import { Button } from "~/components/ui/button";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { convertToFormData } from "~/lib/profile";
import { api } from "~/trpc/react";
import { ResumeForm } from "./ResumeForm";
import { ResumePreview } from "./ResumePreview";

const validTemplates = ["classic", "creative", "modern"];

export function ResumeBuilderClient() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  const [formData, setFormData] = useState<OnboardingFormData | null>(null);

  // Fetch user profile to pre-populate form
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = api.onboarding.getProfile.useQuery();

  // Stabilize the setFormData callback
  const handleFormDataChange = useCallback((data: OnboardingFormData) => {
    setFormData(data);
  }, []);

  useEffect(() => {
    if (profile) {
      const initialData = convertToFormData(profile);
      if (initialData) {
        setFormData(initialData);
      }
    }
  }, [profile]);

  if (profileLoading) {
    return (
      <LoadingSpinner fullScreen text="Loading your profile..." size="lg" />
    );
  }

  if (profileError || !formData) {
    return (
      <ErrorMessage
        error={profileError}
        title="Failed to Load Profile"
        description="We couldn't load your profile data. Please try again."
        showHomeButton={true}
        showTechnicalDetails={true}
      />
    );
  }

  if (!templateId || !validTemplates.includes(templateId)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <ErrorMessage
          title="No Template Selected"
          description="Please go back and select a template first."
          error={new Error("No template selected")}
          showHomeButton={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <Header
        variant="blurred"
        showDashboardLink
        showProfileLink
        isAuthenticated
      />

      {/* Main Content - Split Layout with integrated title */}
      <div className="container mx-auto px-4 py-8">
        {/* Title and Actions integrated into main content */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Resume Builder
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Build your professional resume with live preview
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(100vh-240px)] gap-8">
          {/* Left Panel - Form */}
          <div className="w-1/2 overflow-auto rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            {formData && (
              <ResumeForm
                initialData={formData}
                onChange={handleFormDataChange}
              />
            )}
          </div>

          {/* Right Panel - Live Preview */}
          <div className="w-1/2 overflow-auto rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Live Preview
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your changes will appear here in real-time
              </p>
            </div>

            {formData && (
              <ResumePreview formData={formData} templateId={templateId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

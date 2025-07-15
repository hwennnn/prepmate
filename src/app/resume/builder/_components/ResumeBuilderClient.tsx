"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { convertToFormData } from "~/lib/profile";
import { notifyToaster as notify } from "~/lib/notification";
import { api } from "~/trpc/react";
import { ResumeForm } from "./ResumeForm";
import { ResumePreview } from "./ResumePreview";

import { Download, Save } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { ErrorMessage } from "~/components/error-message";
import { Header } from "~/components/layout";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { TemplateSwitcher } from "~/components/template-switcher";
import type { OnboardingFormData } from "~/app/_components/onboarding/types";

export function ResumeBuilderClient() {
  const searchParams = useSearchParams();
  const params = useParams();
  const templateId = searchParams.get("template");
  const resumeId = (params.id as string) || undefined; // From resume/builder/[id]
  const [formData, setFormData] = useState<OnboardingFormData | null>(null);

  /*
   * Since Resume Builder is used for creation and edit
   * requires a way to monitor if editing or creation mode
   */
  const isEditMode = !!resumeId; // Boolean(resumeId);

  // ============================= API Calls ============================
  // Fetch user profile to pre-populate form
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = api.onboarding.getProfile.useQuery();

  // Fetch existing resume data if editing
  const {
    data: existingResume,
    isLoading: resumeLoading,
    error: resumeError,
  } = api.resume.getResume.useQuery(
    { resumeId: resumeId! },
    {
      enabled: !!resumeId,
      retry: (failureCount, error) => {
        // Don't retry if resume not found
        return failureCount < 3 && !error.message.includes("not found");
      },
    },
  );

  // Prioritize the templateId to follow parameters
  // When new resume, we follow templateId from params
  // When editing resume, we follow saved templateId in resume data
  const effectiveTemplateId = templateId ?? existingResume?.templateId;

  // ======================== Toaster Notification Function ====================

  // ============================= Resume save functionality ======================
  const saveResume = api.resume.saveResume.useMutation();
  const utils = api.useUtils();

  const handleSaveResume = useCallback(async () => {
    // Do nothing if there is no formdata or no templateid
    if (!formData || !effectiveTemplateId) return;

    try {
      const result = await saveResume.mutateAsync({
        formData,
        templateId: effectiveTemplateId,
        resumeId: resumeId ?? undefined,
      });

      // Notification
      notify(
        true,
        isEditMode
          ? "Resume Updated Successfully!"
          : "Resume Saved Successfully!",
        2500,
      );

      // If this is create (no resumeId yet)
      // Add delay to show notification before redirect to edit mode with new ID
      if (!resumeId && result?.id) {
        // redirect to edit mode with resume id and template parameter
        const redirectUrl = `/resume/builder/${result.id}?template=${effectiveTemplateId}`;

        // Delay redirect to show toast notification
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1500); // 1.5 second delay to show toast
        return;
      }

      // Invalidate queries to mark getResume and getResumes cache entry as stale
      // since data has been changed/updated
      // forces re-render for updated resume data
      await utils.resume.getResume.invalidate();
      await utils.resume.getResumes.invalidate();
    } catch (error) {
      console.error("Save failed: ", error);
      notify(false, "Error saving resume!", 2500);
    }
  }, [formData, saveResume, isEditMode, effectiveTemplateId, resumeId, utils]);

  // ============================= PDF Export functionality ========================
  const exportPDF = api.resume.exportLivePDF.useMutation();

  const handleDownloadPDF = useCallback(async () => {
    // Do nothing if there is no form data or templateId
    if (!formData || !effectiveTemplateId) return;

    try {
      const result = await exportPDF.mutateAsync({
        formData,
        templateId: effectiveTemplateId,
      });

      // Convert base64 to downloadable file
      const pdfBlob = new Blob(
        [Uint8Array.from(atob(result.pdf), (c) => c.charCodeAt(0))],
        { type: "application/pdf" },
      );

      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download failed:", error);
      // Add toast notification here
    }
  }, [formData, effectiveTemplateId, exportPDF]);

  // =========================== State Management ============================

  // Stabilize the setFormData callback
  const handleFormDataChange = useCallback((data: OnboardingFormData) => {
    setFormData(data);
  }, []);

  useEffect(() => {
    // If editing, use existing resume data, otherwise use profile
    if (isEditMode && existingResume) {
      // Transform resume data to match profile structure for convertToFormData
      const resumeAsProfileData = {
        ...existingResume.profile,
        education: existingResume.education.map((edu) => ({
          ...edu,
          profileId: existingResume.profile.id,
        })),
        experience: existingResume.experience.map((exp) => ({
          ...exp,
          profileId: existingResume.profile.id,
        })),
        projects: existingResume.projects.map((proj) => ({
          ...proj,
          profileId: existingResume.profile.id,
        })),
        skills: existingResume.skills
          ? {
              ...existingResume.skills,
              profileId: existingResume.profile.id,
              languages: existingResume.skills.languages ?? null,
              frameworks: existingResume.skills.frameworks ?? null,
            }
          : null,
      };

      const resumeFormData = convertToFormData(resumeAsProfileData);
      if (resumeFormData) {
        setFormData(resumeFormData);
      }
    } else if (profile) {
      const initialData = convertToFormData(profile);
      if (initialData) {
        setFormData(initialData);
      }
    }
  }, [profile, existingResume, isEditMode]);

  // Sync URL Template
  useEffect(() => {
    if (isEditMode && existingResume?.templateId && !templateId) {
      // Update the current url to include the template parameter
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("template", existingResume.templateId);
      // Do not reload/re-render page for optimizaation (when switching templates)
      // back button will go back to previous page instead of allowing re-save
      // updates only
      window.history.replaceState({}, "", currentUrl.toString());
    }
  });

  if (profileLoading || (resumeId && resumeLoading)) {
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

  // Handle resume error separately to prevent blocking entire page ^
  if (isEditMode && resumeId && resumeError) {
    return (
      <ErrorMessage
        error={resumeError}
        title="Failed to Load Resume Data"
        description="We couldn't load your resume data. Please try again."
        showHomeButton={true}
        showTechnicalDetails={true}
      />
    );
  }

  if (!effectiveTemplateId) {
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
        showSignOutButton
        isAuthenticated
      />

      {/* Main Content - Split Layout with integrated title */}
      <div className="container mx-auto px-4 py-8">
        {/* Title and Actions integrated into main content */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {isEditMode ? "Edit Resume" : "Create Resume"}
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              {isEditMode
                ? "Update your professional resume with live preview"
                : "Build your professional resume with live preview"}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/** Template switching */}
            {templateId && <TemplateSwitcher currentTemplateId={templateId} />}

            {/** TODO: Handle save */}
            <Button
              onClick={handleSaveResume}
              disabled={
                !formData || !effectiveTemplateId || saveResume.isPending
              }
              variant="outline"
              size="sm"
            >
              <Save className="mr-2 h-4 w-4" />
              {saveResume.isPending
                ? "Saving ..."
                : isEditMode
                  ? "Update"
                  : "Save Draft"}
            </Button>

            {/** Handle Export */}
            <Button
              onClick={handleDownloadPDF}
              disabled={!formData || !templateId || exportPDF.isPending}
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" />
              {exportPDF.isPending ? "Generating..." : "Download PDF"}
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
              <ResumePreview
                formData={formData}
                templateId={effectiveTemplateId}
              />
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { convertResumeToBuilderForm } from "~/lib/profile";
import { notifyToaster as notify } from "~/lib/notification";
import { api } from "~/trpc/react";
import { ResumeForm } from "./ResumeForm";
import { ResumePreview } from "./ResumePreview";

import { Download, Save, Globe, Lock } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { ErrorMessage } from "~/components/error-message";
import { Header } from "~/components/layout";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { TemplateSwitcher } from "~/components/template-switcher";
import { usePublicToggle } from "~/hooks/use-public-toggle";
import type { OnboardingFormData } from "~/app/_components/onboarding/types";

export function ResumeBuilderClient() {
  const searchParams = useSearchParams();
  const params = useParams();
  const templateId = searchParams.get("template");
  const resumeId = params.id as string; // Always expect resumeId from route
  const [formData, setFormData] = useState<OnboardingFormData | null>(null);
  const [resumeName, setResumeName] = useState<string>("");

  // ============================= API Calls ============================
  // Fetch resume data for editing
  const {
    data: resumeData,
    isLoading: resumeLoading,
    error: resumeError,
  } = api.resume.getResume.useQuery(
    { resumeId },
    {
      retry: (failureCount, error) => {
        // Don't retry if resume not found
        return failureCount < 3 && !error.message.includes("not found");
      },
    },
  );
  // Prioritize the templateId to follow parameters
  // When new resume, we follow templateId from params
  // When editing resume, we follow saved templateId in resume data
  const effectiveTemplateId = templateId ?? resumeData?.templateId;

  // ============================= Public Toggle Functionality ======================
  const publicToggle = usePublicToggle({
    resumeId,
    initialIsPublic: resumeData?.isPublic ?? false,
    currentIsPublic: resumeData?.isPublic,
    onSuccess: () => {
      // Invalidate resume data to reflect changes
      utils.resume.getResume.invalidate({ resumeId }).catch(console.error);
    },
  });

  // ======================== Toaster Notification Function ====================

  // ============================= Resume save functionality ======================
  const saveResume = api.resume.saveResume.useMutation();
  const utils = api.useUtils();

  const handleSaveResume = useCallback(async () => {
    // Do nothing if there is no formdata or no templateid
    if (!formData || !effectiveTemplateId || !resumeName) return;

    try {
      await saveResume.mutateAsync({
        formData: formData,
        templateId: effectiveTemplateId,
        resumeName: resumeName,
        personalDetails: formData.personalDetails,
        resumeId: resumeId,
      });

      // Notification
      notify(true, "Resume Updated Successfully!", 2500);

      // Invalidate queries to mark getResume and getResumes cache entry as stale
      // since data has been changed/updated
      // forces re-render for updated resume data
      await utils.resume.getResume.invalidate();
      await utils.resume.getResumes.invalidate();
    } catch (error) {
      console.error("Save failed: ", error);
      notify(false, "Error saving resume!", 2500);
    }
  }, [formData, resumeName, saveResume, effectiveTemplateId, resumeId, utils]);

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

      notify(true, "PDF download started.", 1500);
    } catch (error) {
      console.error("PDF download failed:", error);
      // Add toast notification here
      notify(false, "PDF download failed.", 2500);
    }
  }, [formData, effectiveTemplateId, exportPDF]);

  // =========================== State Management ============================

  // Stabilize the setFormData callback
  const handleFormDataChange = useCallback((data: OnboardingFormData) => {
    setFormData(data);
  }, []);

  // Initialize form data from resume data
  useEffect(() => {
    if (resumeData) {
      const convertedData = convertResumeToBuilderForm(resumeData);
      if (convertedData) {
        setFormData({
          personalDetails: convertedData.personalDetails,
          education: convertedData.education,
          experience: convertedData.experience,
          projects: convertedData.projects,
          skills: convertedData.skills,
        });
        setResumeName(convertedData.resumeName);
      }
    }
  }, [resumeData]);

  // Sync URL Template
  useEffect(() => {
    if (resumeData?.templateId && !templateId) {
      // Update the current url to include the template parameter
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("template", resumeData.templateId);
      // Do not reload/re-render page for optimization (when switching templates)
      // back button will go back to previous page instead of allowing re-save
      // updates only
      window.history.replaceState({}, "", currentUrl.toString());
    }
  }, [resumeData?.templateId, templateId]);

  if (resumeLoading) {
    return (
      <LoadingSpinner fullScreen text="Loading your resume..." size="lg" />
    );
  }

  if (resumeError) {
    return (
      <ErrorMessage
        error={resumeError}
        title="Failed to Load Resume"
        description="We couldn't load your resume data. Please try again."
        showHomeButton={true}
        showTechnicalDetails={true}
      />
    );
  }

  if (!formData) {
    return (
      <LoadingSpinner fullScreen text="Preparing resume data..." size="lg" />
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
              Edit Resume
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Update your professional resume with live preview
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/** Template switching */}
            {templateId && <TemplateSwitcher currentTemplateId={templateId} />}

            {/** Public/Private Toggle */}
            <div className="flex items-center space-x-2 rounded-md border border-slate-200 px-3 py-1 dark:border-slate-800">
              <Checkbox
                id="public-toggle"
                checked={publicToggle.isPublic}
                onCheckedChange={(_checked) => {
                  if (!publicToggle.isToggling) {
                    publicToggle.toggle().catch(console.error);
                  }
                }}
                disabled={publicToggle.isToggling}
              />
              <div className="flex items-center gap-1">
                {publicToggle.isPublic ? (
                  <Globe className="h-3 w-3 text-green-600" />
                ) : (
                  <Lock className="h-3 w-3 text-gray-400" />
                )}
                <label
                  htmlFor="public-toggle"
                  className="cursor-pointer text-sm text-slate-600 dark:text-slate-400"
                >
                  {publicToggle.isPublic ? "Public" : "Private"}
                  {publicToggle.isToggling && " (updating...)"}
                </label>
              </div>
            </div>

            {/** Handle save */}
            <Button
              onClick={handleSaveResume}
              disabled={
                !formData ||
                !effectiveTemplateId ||
                !resumeName ||
                saveResume.isPending
              }
              variant="outline"
              size="sm"
            >
              <Save className="mr-2 h-4 w-4" />
              {saveResume.isPending ? "Saving..." : "Update"}
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
            {/* Resume Name Input */}
            <div className="mb-6">
              <Label
                htmlFor="resumeName"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Resume Name
              </Label>
              <Input
                id="resumeName"
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                placeholder="Enter resume name"
                className="mt-1"
              />
            </div>

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

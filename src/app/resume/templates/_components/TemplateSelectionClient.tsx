"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ErrorMessage } from "~/components/error-message";
import { Header } from "~/components/layout";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { notifyToaster } from "~/lib/notification";
import { api } from "~/trpc/react";

export function TemplateSelectionClient() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null,
  );
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const {
    data: templates,
    error: templateError,
    isLoading: templatesLoading,
  } = api.resume.getTemplates.useQuery();

  const {
    data: profiles,
    error: profilesError,
    isLoading: profilesLoading,
  } = api.profile.getProfiles.useQuery();

  const createResume = api.resume.createResume.useMutation();

  // Auto-select default profile if none selected
  if (!selectedProfileId && profiles && profiles.length > 0) {
    const defaultProfile = profiles.find((p) => p.isDefault) ?? profiles[0];
    setSelectedProfileId(defaultProfile?.id ?? null);
  }

  const handleProceed = async () => {
    if (!selectedTemplateId) {
      notifyToaster(false, "Please select a template", 2000);
      return;
    }

    if (!selectedProfileId) {
      notifyToaster(false, "Please select a profile", 2000);
      return;
    }

    setIsCreating(true);
    try {
      const result = await createResume.mutateAsync({
        templateId: selectedTemplateId,
        profileId: selectedProfileId,
      });

      if (result.success) {
        notifyToaster(true, "Resume created! Redirecting to editor...", 2000);

        // Redirect to builder with the new resume ID
        router.push(
          `/resume/builder/${result.resumeId}?template=${result.templateId}`,
        );
      }
    } catch (error) {
      console.error("Failed to create resume:", error);
      notifyToaster(false, "Failed to create resume. Please try again.", 3000);
    } finally {
      setIsCreating(false);
    }
  };

  const selectedProfile = profiles?.find((p) => p.id === selectedProfileId);

  if (templatesLoading || profilesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <Header
          variant="blurred"
          showDashboardLink
          showSignOutButton
          isAuthenticated
        />
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner
            fullScreen
            text="Loading templates and profiles..."
            size="lg"
          />
        </div>
      </div>
    );
  }

  if (templateError || profilesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <Header
          variant="blurred"
          showDashboardLink
          showSignOutButton
          isAuthenticated
        />
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage
            error={templateError ?? profilesError}
            title="Failed to Load Templates or Profiles"
            description="Please try again or contact support if the problem persists."
            showTechnicalDetails={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <Header
        variant="blurred"
        showDashboardLink
        showSignOutButton
        isAuthenticated
      />

      <div className="container mx-auto px-4 py-4">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
            Create New Resume
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-600 dark:text-slate-300">
            Choose a template and select which profile to use for your resume
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Selection - Smaller Column */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                Step 1: Choose Profile
                <Badge variant="secondary" className="text-xs">
                  {profiles?.length ?? 0}
                </Badge>
              </CardTitle>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Select which profile to use
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              {!profiles || profiles.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
                    No profiles found. Please create a profile first.
                  </p>
                  <Button asChild size="sm">
                    <a href="/profile">Go to Profile</a>
                  </Button>
                </div>
              ) : (
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {profiles.map((profile) => (
                    <div
                      key={profile.id}
                      className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                        selectedProfileId === profile.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                          : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
                      }`}
                      onClick={() => setSelectedProfileId(profile.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate text-sm font-medium text-slate-900 dark:text-white">
                              {profile.profileName}
                            </h3>
                            {profile.isDefault && (
                              <Badge variant="default" className="text-xs">
                                Default
                              </Badge>
                            )}
                          </div>
                          <p className="truncate text-xs text-slate-600 dark:text-slate-400">
                            {profile.firstName} {profile.lastName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-500">
                            {profile.experience?.length ?? 0} exp •{" "}
                            {profile.education?.length ?? 0} edu
                          </p>
                        </div>
                        <div
                          className={`h-3 w-3 flex-shrink-0 rounded-full border-2 ${
                            selectedProfileId === profile.id
                              ? "border-blue-500 bg-blue-500"
                              : "border-slate-300 dark:border-slate-600"
                          }`}
                        >
                          {selectedProfileId === profile.id && (
                            <div className="h-full w-full scale-50 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Template Selection - Larger Column */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Step 2: Choose Template</CardTitle>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Pick a design that best suits your industry and style
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              {!templates || templates.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-slate-600 dark:text-slate-400">
                    No templates available
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`group cursor-pointer rounded-lg border p-3 transition-all hover:shadow-md ${
                        selectedTemplateId === template.id
                          ? "border-blue-500 bg-blue-50 shadow-md dark:bg-blue-950/30"
                          : "border-slate-200 dark:border-slate-700"
                      }`}
                      onClick={() => setSelectedTemplateId(template.id)}
                    >
                      <div className="mb-2 aspect-[3/4] overflow-hidden rounded-md border border-slate-200 dark:border-slate-700">
                        <Image
                          src={`/template-previews/${template.id}.png`}
                          alt={`${template.name} template preview`}
                          width={360}
                          height={480}
                          quality={100}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {template.name}
                      </h3>
                      <p className="line-clamp-2 text-xs text-slate-600 dark:text-slate-400">
                        {template.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Proceed Button - Compact */}
        <div className="mt-6 flex justify-center">
          <Card className="w-full max-w-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-white">
                    Ready to Create?
                  </h3>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {selectedProfile && (
                      <span className="mr-3">
                        Profile: <strong>{selectedProfile.profileName}</strong>
                      </span>
                    )}
                    {selectedTemplateId && (
                      <span>
                        Template:{" "}
                        <strong>
                          {
                            templates?.find((t) => t.id === selectedTemplateId)
                              ?.name
                          }
                        </strong>
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleProceed}
                  disabled={
                    !selectedTemplateId || !selectedProfileId || isCreating
                  }
                  className="ml-4"
                  size="sm"
                >
                  {isCreating ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Resume
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

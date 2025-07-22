"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";
import { notifyToaster } from "~/lib/notification";
import { Header } from "~/components/layout";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { TemplatePreview } from "~/app/resume/templates/_components/TemplatePreview";
import { ErrorMessage } from "~/components/error-message";
import { LoadingSpinner } from "~/components/ui/loading-spinner";

export function TemplateSelectionClient() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const {
    data: templates,
    error: templateError,
    isLoading: templatesLoading,
  } = api.resume.getTemplates.useQuery();

  const createResume = api.resume.createMinimalResume.useMutation();

  const handleProceed = async () => {
    if (!selectedTemplateId) return;

    setIsCreating(true);
    try {
      const result = await createResume.mutateAsync({
        templateId: selectedTemplateId,
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

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Header
        variant="blurred"
        showDashboardLink
        showProfileLink
        showSignOutButton
        isAuthenticated
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white">
            Choose Your Resume Template 📄
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Select a professional template that best represents your style and
            industry.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          {templatesLoading ? (
            <div className="flex min-h-[400px] items-center justify-center py-16">
              <LoadingSpinner text="Loading templates..." size="lg" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {templates && !templateError ? (
                templates.map((template) => (
                  <Card
                    key={template.id}
                    className={`flex h-full cursor-pointer flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                      selectedTemplateId === template.id
                        ? "scale-[1.02] shadow-xl ring-2 ring-blue-500"
                        : "hover:shadow-lg"
                    }`}
                    onClick={() => setSelectedTemplateId(template.id)}
                  >
                    <CardHeader className="flex h-24 flex-shrink-0 items-center">
                      <div className="flex w-full items-center justify-between">
                        <CardTitle className="text-lg">
                          {template.name}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-grow flex-col justify-between space-y-4">
                      <div className="space-y-4">
                        {/* Template Preview */}
                        <TemplatePreview templateId={template.id} />
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {template.description}
                        </p>
                      </div>

                      <Button
                        variant={
                          selectedTemplateId === template.id
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className="mt-auto w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTemplateId(template.id);
                        }}
                      >
                        {selectedTemplateId === template.id
                          ? "Selected"
                          : "Select"}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="mx-auto max-w-4xl">
                  <ErrorMessage
                    error={templateError}
                    title={"No templates found."}
                    description={templateError?.message}
                    showHomeButton={true}
                  />
                </div>
              )}
            </div>
          )}

          {/* Proceed Button */}
          <div className="mt-8 text-center">
            <Button
              onClick={handleProceed}
              disabled={!selectedTemplateId || isCreating}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              {isCreating ? "Creating Resume..." : "Continue with Template"}
              {!isCreating && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

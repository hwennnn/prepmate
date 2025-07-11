"use client";

//import { useMemo } from "react";
import type { OnboardingFormData } from "~/app/_components/onboarding/types";
//import { ClassicTemplate, CreativeTemplate, ModernTemplate } from "./templates";
//import UniversalTemplate from "./templates/UniversalTemplate";
import { useLivePreview } from "~/hooks/use-live-preview";

import { RefreshCw } from "lucide-react";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { Button } from "~/components/ui/button";
import { ErrorMessage } from "~/components/error-message";

interface ResumePreviewProps {
  formData: OnboardingFormData;
  templateId: string;
}

export function ResumePreview({ formData, templateId }: ResumePreviewProps) {
  const { isLoading, error, svgContent, isInitialized, refresh } =
    useLivePreview({ formData, templateId, enabled: true });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="min-h-[11in] w-full overflow-hidden bg-white shadow-lg print:min-h-0 print:shadow-none">
        {!isInitialized ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <LoadingSpinner text=" Initializing live preview..." />
          </div>
        ) : error ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 p-8">
            <Button onClick={refresh} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
            <ErrorMessage
              title="Preview Error!"
              description={error}
              error={new Error(error)}
              showHomeButton={false}
            />
          </div>
        ) : (
          <div className="relative">
            {!isLoading && svgContent ? (
              <div className="w-full overflow-auto bg-white shadow-sm">
                <div
                  className="min-w-full bg-white"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              </div>
            ) : !isLoading && isInitialized ? (
              <ErrorMessage
                title="Here Error!"
                description="Something went wrong with loading svg content"
                error={
                  new Error("Something went wrong with loading svg content")
                }
                showHomeButton={false}
              />
            ) : (
              <div className="flex min-h-[400px] items-center justify-center">
                <LoadingSpinner text=" Compiling live preview..." />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

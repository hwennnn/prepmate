"use client";

import type { OnboardingFormData } from "~/app/_components/onboarding/types";
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
            {!isLoading && svgContent && svgContent.length > 0 ? (
              <div className="w-full space-y-4 bg-white shadow-sm">
                {svgContent.map((pageContent, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden border bg-white shadow-sm"
                  >
                    {/* A4 aspect ratio container (1:1.414) */}
                    <div
                      className="w-full"
                      style={{ aspectRatio: "1 / 1.414" }}
                    >
                      <div
                        className="h-full w-full bg-white [&>svg]:h-full [&>svg]:w-full [&>svg]:object-contain"
                        dangerouslySetInnerHTML={{ __html: pageContent }}
                      />
                    </div>
                  </div>
                ))}
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

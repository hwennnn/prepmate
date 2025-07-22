"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { Button } from "~/components/ui/button";
import { ErrorMessage } from "~/components/error-message";
import { Download, Eye, Lock } from "lucide-react";
import Link from "next/link";
import { TypstResumeRenderer } from "~/lib/typst-renderer";
import type { RouterOutputs } from "~/trpc/react";

interface PublicResumeViewProps {
  resume: RouterOutputs["resume"]["getPublicResume"]["resume"];
  viewCount: number;
  slug: string;
  isPrivatePreview: boolean;
}

export function PublicResumeView({
  resume,
  viewCount,
  slug,
  isPrivatePreview,
}: PublicResumeViewProps) {
  const [svgPages, setSvgPages] = useState<string[]>([]);

  const {
    data: svgBuffer,
    isLoading: isLoadingSVG,
    error: svgError,
  } = api.resume.getPublicResumeSVG.useQuery(
    { slug: slug, resumeId: resume.id },
    { enabled: !!slug, retry: false },
  );

  const downloadPDF = api.resume.downloadPublicResumePDF.useMutation();

  // Process SVG data when it loads
  useEffect(() => {
    if (svgBuffer) {
      const pages = TypstResumeRenderer.splitSVGByPages(svgBuffer);
      pages.pop();
      setSvgPages(pages);
    }
  }, [svgBuffer]);

  const handleDownloadPDF = async () => {
    try {
      const result = await downloadPDF.mutateAsync({ slug });

      // Create blob from base64 data
      const byteCharacters = atob(result.pdf);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download PDF:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* Private Preview Banner */}
        {isPrivatePreview && (
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex items-center justify-center gap-2 text-yellow-800">
              <Lock className="h-5 w-5" />
              <span className="font-medium">Private Preview</span>
            </div>
            <p className="mt-1 text-center text-sm text-yellow-700">
              This resume is private. Only you can see this preview. Toggle it
              to public to share with others.
            </p>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {resume.firstName} {resume.lastName}&apos;s Resume
          </h1>
          {isPrivatePreview && (
            <p className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-600">
              <Eye className="h-4 w-4" />
              {viewCount} view{viewCount !== 1 ? "s" : ""}
            </p>
          )}
          <div className="mt-4">
            <Button onClick={handleDownloadPDF} className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Resume Content */}
        <div className="mx-auto max-w-2xl">
          <div className="min-h-[11in] w-full overflow-hidden bg-white shadow-lg">
            {isLoadingSVG ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <LoadingSpinner text="Loading resume..." />
              </div>
            ) : svgError ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 p-8">
                <ErrorMessage
                  title="Resume Loading Error"
                  description={svgError.message ?? "Failed to load Resume!"}
                  error={
                    new Error(svgError.message ?? "Failed to load Resume!")
                  }
                  showHomeButton={false}
                />
              </div>
            ) : svgPages.length > 0 ? (
              <div className="w-full space-y-4 bg-white shadow-sm">
                {svgPages.map((pageContent, index) => (
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
            ) : (
              <div className="flex min-h-[400px] items-center justify-center">
                <ErrorMessage
                  title="Resume Not Available"
                  description="The resume content could not be loaded."
                  error={new Error("No resume content available")}
                  showHomeButton={false}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Powered by{" "}
            <Link
              href="/"
              className="text-blue-600 underline hover:text-blue-800"
            >
              PrepMate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

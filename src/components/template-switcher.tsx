"use client";
import type { Template } from "@prisma/client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";

import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { ErrorMessage } from "~/components/error-message";
import { api } from "~/trpc/react";

interface TemplateSwitcherProps {
  currentTemplateId: string;
}

export function TemplateSwitcher({ currentTemplateId }: TemplateSwitcherProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Fetch available templates
  const {
    data: templates,
    isLoading,
    error,
  } = api.resume.getTemplates.useQuery();

  const handleTemplateChange = (newTemplateId: string) => {
    // Update URL with new template
    const params = new URLSearchParams(searchParams.toString());
    params.set("template", newTemplateId);
    router.push(`/resume/builder?${params.toString()}`);
    setIsOpen(false);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading profile..." size="lg" />;
  }

  if (error || !templates) {
    return (
      <ErrorMessage
        error={error}
        title="Failed to Load Templates"
        description={
          error?.message ??
          "We couldn't load templates. This might be because there was a network issue."
        }
        showHomeButton={true}
        showTechnicalDetails={true}
      />
    );
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="capitalize"
      >
        Template: {currentTemplateId}
        <svg
          className="ml-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 z-10 mt-1 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="py-1">
            {templates?.map((template: Template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateChange(template.id)}
                className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                  template.id === currentTemplateId
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700"
                }`}
              >
                <div className="font-medium capitalize">{template.name}</div>
                <div className="text-xs text-gray-500">
                  {template.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

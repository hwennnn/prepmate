"use client";

import { useMemo } from "react";
import type { OnboardingFormData } from "~/app/_components/onboarding/types";
//import { ClassicTemplate, CreativeTemplate, ModernTemplate } from "./templates";
import UniversalTemplate from "./templates/UniversalTemplate";

interface ResumePreviewProps {
  formData: OnboardingFormData;
  templateId: string;
}

export function ResumePreview({ formData, templateId }: ResumePreviewProps) {
  const previewContent = useMemo(() => {
    return <UniversalTemplate data={formData} templateId={templateId} />;
    /*
    if (templateId === "modern") {
      return <ModernTemplate data={formData} />;
    } else if (templateId === "classic") {
      return <ClassicTemplate data={formData} />;
    } else if (templateId === "creative") {
      return <CreativeTemplate data={formData} />;
    }
    return <ModernTemplate data={formData} />;
    */
  }, [formData, templateId]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="min-h-[11in] w-full overflow-hidden bg-white shadow-lg print:min-h-0 print:shadow-none">
        {previewContent}
      </div>
    </div>
  );
}

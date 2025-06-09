import { CheckCircle } from "lucide-react";
import { useMemo } from "react";
import type { UseFormWatch } from "react-hook-form";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import type { OnboardingFormData } from "./types";

interface Step {
  id: string;
  label: string;
  description: string;
}

interface ProgressBarProps {
  steps: Step[];
  currentStepIndex: number;
  watch: UseFormWatch<OnboardingFormData>;
}

export function ProgressBar({
  steps,
  currentStepIndex,
  watch,
}: ProgressBarProps) {
  const data = watch();

  const completedSteps = useMemo(() => {
    const completed: string[] = [];

    // Personal Details - check if required fields are filled
    if (
      data.personalDetails?.firstName &&
      data.personalDetails?.lastName &&
      data.personalDetails?.email
    ) {
      completed.push("personal");
    }

    // Education - optional section, mark as complete if any education is added
    if (data.education && data.education.length > 0) {
      // Check if at least one education entry has required fields
      const hasValidEducation = data.education.some(
        (edu) => edu.institution && edu.degree,
      );
      if (hasValidEducation) {
        completed.push("education");
      }
    }

    // Experience - optional section, mark as complete if any experience is added
    if (data.experience && data.experience.length > 0) {
      // Check if at least one experience entry has required fields
      const hasValidExperience = data.experience.some(
        (exp) => exp.company && exp.jobTitle && exp.location,
      );
      if (hasValidExperience) {
        completed.push("experience");
      }
    }

    // Projects - optional section, mark as complete if any project is added
    if (data.projects && data.projects.length > 0) {
      // Check if at least one project entry has required fields
      const hasValidProject = data.projects.some(
        (project) => project.name && project.description,
      );
      if (hasValidProject) {
        completed.push("projects");
      }
    }

    // Skills - optional section, mark as complete if any skills are added
    if (data.skills && (data.skills.languages || data.skills.frameworks)) {
      completed.push("skills");
    }

    return completed;
  }, [data]);

  return (
    <Card className="border-slate-200 bg-white/50 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/50">
      <CardContent className="p-4 sm:pt-6">
        <div className="mb-4 flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
            Profile Setup
          </h2>
          <Badge variant="outline" className="self-start text-xs sm:text-sm">
            Step {currentStepIndex + 1} of {steps.length}
          </Badge>
        </div>

        {/* Mobile Layout - Current Step Only */}
        <div className="block sm:hidden">
          <div className="flex flex-col items-center space-y-3">
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all",
                completedSteps.includes(steps[currentStepIndex]?.id ?? "")
                  ? "border-green-500 bg-green-500 text-white"
                  : "border-blue-500 bg-blue-500 text-white",
              )}
            >
              {completedSteps.includes(steps[currentStepIndex]?.id ?? "") ? (
                <CheckCircle className="h-8 w-8" />
              ) : (
                <span className="text-xl font-bold">
                  {currentStepIndex + 1}
                </span>
              )}
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-slate-900 dark:text-white">
                {steps[currentStepIndex]?.label}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {steps[currentStepIndex]?.description}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex sm:items-center sm:space-x-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                    completedSteps.includes(step.id)
                      ? "border-green-500 bg-green-500 text-white"
                      : currentStepIndex === index
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-slate-300 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
                  )}
                >
                  {completedSteps.includes(step.id) ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={cn(
                      "text-sm font-medium",
                      completedSteps.includes(step.id) ||
                        currentStepIndex === index
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-500 dark:text-slate-400",
                    )}
                  >
                    {step.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {step.description}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-4 h-0.5 w-16 transition-all",
                    completedSteps.includes(step.id) &&
                      completedSteps.includes(steps[index + 1]!.id)
                      ? "bg-green-500"
                      : "bg-slate-300 dark:bg-slate-700",
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

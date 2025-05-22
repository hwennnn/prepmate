import { CheckCircle } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface Step {
  id: string;
  label: string;
  description: string;
}

interface ProgressBarProps {
  steps: Step[];
  currentStepIndex: number;
  completedSteps: string[];
}

export function ProgressBar({
  steps,
  currentStepIndex,
  completedSteps,
}: ProgressBarProps) {
  return (
    <Card className="border-slate-200 bg-white/50 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/50">
      <CardContent className="pt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Profile Setup
          </h2>
          <Badge variant="outline" className="text-sm">
            Step {currentStepIndex + 1} of {steps.length}
          </Badge>
        </div>

        <div className="flex items-center space-x-4">
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

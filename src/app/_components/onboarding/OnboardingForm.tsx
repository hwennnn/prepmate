"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList } from "~/components/ui/tabs";
import { api } from "~/trpc/react";
import { EducationForm } from "./EducationForm";
import { ExperienceForm } from "./ExperienceForm";
import { PersonalDetailsForm } from "./PersonalDetailsForm";
import { ProgressBar } from "./ProgressBar";
import { ProjectsForm } from "./ProjectsForm";
import { SkillsForm } from "./SkillsForm";
import { completeProfileSchema, type FormData } from "./types";

interface OnboardingFormProps {
  onComplete: () => void;
}

const steps = [
  { id: "personal", label: "Personal", description: "Basic information" },
  { id: "education", label: "Education", description: "Academic background" },
  { id: "experience", label: "Experience", description: "Work history" },
  { id: "projects", label: "Projects", description: "Personal projects" },
  { id: "skills", label: "Skills", description: "Technical skills" },
];

export function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(completeProfileSchema),
    mode: "onChange",
    defaultValues: {
      personalDetails: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        website: "",
        linkedinUrl: "",
        githubUrl: "",
      },
      education: [],
      experience: [],
      projects: [],
      skills: {
        languages: "",
        frameworks: "",
      },
    },
  });

  // Check if personal details are completed
  const personalDetails = watch("personalDetails");
  const isPersonalCompleted =
    personalDetails.firstName &&
    personalDetails.lastName &&
    personalDetails.email;

  // Update completed steps based on form data
  useEffect(() => {
    const newCompletedSteps: string[] = [];

    if (isPersonalCompleted) {
      newCompletedSteps.push("personal");
    }

    setCompletedSteps(newCompletedSteps);
  }, [isPersonalCompleted]);

  const currentStepIndex = steps.findIndex((step) => step.id === activeTab);
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const saveProfileMutation = api.onboarding.saveProfile.useMutation({
    onSuccess: () => {
      onComplete();
    },
    onError: (error) => {
      console.error("Failed to save profile:", error);
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await saveProfileMutation.mutateAsync(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    // Validate current step before proceeding
    let isValid = false;

    switch (activeTab) {
      case "personal":
        isValid = await trigger("personalDetails");
        break;
      default:
        isValid = true;
    }

    if (isValid && currentStepIndex < steps.length - 1) {
      setActiveTab(steps[currentStepIndex + 1]!.id);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setActiveTab(steps[currentStepIndex - 1]!.id);
    }
  };

  // Prevent tab changes from submitting the form
  const handleTabChange = (_: string) => {
    // Only allow tab changes through navigation buttons, not direct tab clicks
    return;
  };

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <ProgressBar
        steps={steps}
        currentStepIndex={currentStepIndex}
        completedSteps={completedSteps}
      />

      {/* Form Content */}
      <div className="space-y-6">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="hidden" />

          <TabsContent value="personal" className="space-y-4">
            <PersonalDetailsForm register={register} errors={errors} />
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            <EducationForm
              register={register}
              control={control}
              watch={watch}
              setValue={setValue}
            />
          </TabsContent>

          <TabsContent value="experience" className="space-y-4">
            <ExperienceForm
              register={register}
              control={control}
              watch={watch}
              setValue={setValue}
            />
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <ProjectsForm register={register} control={control} />
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <SkillsForm register={register} />
          </TabsContent>
        </Tabs>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstStep}
            className="min-w-[120px]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-3">
            {!isLastStep ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={activeTab === "personal" && !isPersonalCompleted}
                className="min-w-[120px]"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    "Complete Setup"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

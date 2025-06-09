"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

interface EditProfileFormProps {
  initialData?: FormData;
  onComplete: () => void;
}

const steps = [
  { id: "personal", label: "Personal", description: "Basic information" },
  { id: "education", label: "Education", description: "Academic background" },
  { id: "experience", label: "Experience", description: "Work history" },
  { id: "projects", label: "Projects", description: "Personal projects" },
  { id: "skills", label: "Skills", description: "Technical skills" },
];

export function EditProfileForm({
  initialData,
  onComplete,
}: EditProfileFormProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(completeProfileSchema),
    mode: "onChange",
    defaultValues: initialData ?? {
      personalDetails: {
        firstName: "",
        lastName: "",
        email: "",
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

  const currentStepIndex = steps.findIndex((step) => step.id === activeTab);
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const updateProfileMutation = api.onboarding.saveProfile.useMutation({
    onSuccess: () => {
      onComplete();
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await updateProfileMutation.mutateAsync(data);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    let isValid = false;

    switch (activeTab) {
      case "personal":
        isValid = await trigger("personalDetails");
        break;
      case "education":
        const education = getValues("education");
        const isEducationFilled = education && education.length > 0;
        if (isEducationFilled) {
          isValid = await trigger("education");
        } else {
          isValid = true;
        }
        break;
      case "experience":
        const experience = getValues("experience");
        const isExperienceFilled = experience && experience.length > 0;
        if (isExperienceFilled) {
          isValid = await trigger("experience");
        } else {
          isValid = true;
        }
        break;
      case "projects":
        const projects = getValues("projects");
        const isProjectsFilled = projects && projects.length > 0;
        if (isProjectsFilled) {
          isValid = await trigger("projects");
        } else {
          isValid = true;
        }
        break;
      case "skills":
        const skills = getValues("skills");
        const isSkillsFilled =
          skills && (skills.languages ?? skills.frameworks);
        if (isSkillsFilled) {
          isValid = await trigger("skills");
        } else {
          isValid = true;
        }
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

  const handleTabChange = (_: string) => {
    return;
  };

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <ProgressBar
        steps={steps}
        currentStepIndex={currentStepIndex}
        watch={watch}
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
              errors={errors}
            />
          </TabsContent>

          <TabsContent value="experience" className="space-y-4">
            <ExperienceForm
              register={register}
              control={control}
              watch={watch}
              setValue={setValue}
              errors={errors}
            />
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <ProjectsForm
              register={register}
              control={control}
              watch={watch}
              setValue={setValue}
              errors={errors}
            />
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <SkillsForm register={register} errors={errors} />
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
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/profile")}
              className="min-w-[120px]"
            >
              Cancel
            </Button>
            {!isLastStep ? (
              <Button
                type="button"
                onClick={handleNext}
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
                    "Save Changes"
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

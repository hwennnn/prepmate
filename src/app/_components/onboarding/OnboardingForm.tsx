"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
import { ResumeUpload } from "./ResumeUpload";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResumeUpload, setShowResumeUpload] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    trigger,
    getValues,
    clearErrors,
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
      case "education":
        const education = getValues("education");
        const isEducationFilled = education && education.length > 0;
        if (isEducationFilled) {
          isValid = await trigger("education");
        } else {
          isValid = true; // Education is optional
        }
        break;
      case "experience":
        const experience = getValues("experience");
        const isExperienceFilled = experience && experience.length > 0;
        if (isExperienceFilled) {
          isValid = await trigger("experience");
        } else {
          isValid = true; // Experience is optional
        }
        break;
      case "projects":
        const projects = getValues("projects");
        const isProjectsFilled = projects && projects.length > 0;
        if (isProjectsFilled) {
          isValid = await trigger("projects");
        } else {
          isValid = true; // Projects is optional
        }
        break;
      case "skills":
        const skills = getValues("skills");
        const isSkillsFilled =
          skills && (skills.languages ?? skills.frameworks);
        if (isSkillsFilled) {
          isValid = await trigger("skills");
        } else {
          isValid = true; // Skills is optional
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

  // Prevent tab changes from submitting the form
  const handleTabChange = (_: string) => {
    // Only allow tab changes through navigation buttons, not direct tab clicks
    return;
  };

  // Handle resume data parsing
  const handleResumeDataParsed = (parsedData: Partial<FormData>) => {
    // Fill in personal details
    if (parsedData.personalDetails) {
      const personalDetails = parsedData.personalDetails;
      if (personalDetails.firstName)
        setValue("personalDetails.firstName", personalDetails.firstName);
      if (personalDetails.lastName)
        setValue("personalDetails.lastName", personalDetails.lastName);
      if (personalDetails.email)
        setValue("personalDetails.email", personalDetails.email);
      if (personalDetails.phoneNumber)
        setValue("personalDetails.phoneNumber", personalDetails.phoneNumber);
      if (personalDetails.website)
        setValue("personalDetails.website", personalDetails.website);
      if (personalDetails.linkedinUrl)
        setValue("personalDetails.linkedinUrl", personalDetails.linkedinUrl);
      if (personalDetails.githubUrl)
        setValue("personalDetails.githubUrl", personalDetails.githubUrl);
    }

    // Fill in education
    if (parsedData.education && parsedData.education.length > 0) {
      const educationWithDates = parsedData.education.map((edu) => ({
        ...edu,
        startDate: edu.startDate
          ? new Date(edu.startDate)
          : (undefined as unknown as Date),
        endDate: edu.endDate
          ? new Date(edu.endDate)
          : (undefined as unknown as Date),
      }));
      setValue("education", educationWithDates);
    }

    // Fill in experience
    if (parsedData.experience && parsedData.experience.length > 0) {
      const experienceWithDates = parsedData.experience.map((exp) => ({
        ...exp,
        startDate: exp.startDate
          ? new Date(exp.startDate)
          : (undefined as unknown as Date),
        endDate: exp.endDate
          ? new Date(exp.endDate)
          : (undefined as unknown as Date),
      }));
      setValue("experience", experienceWithDates);
    }

    // Fill in projects
    if (parsedData.projects && parsedData.projects.length > 0) {
      setValue("projects", parsedData.projects);
    }

    // Fill in skills
    if (parsedData.skills) {
      const skills = parsedData.skills;
      if (skills.languages) setValue("skills.languages", skills.languages);
      if (skills.frameworks) setValue("skills.frameworks", skills.frameworks);
    }

    setShowResumeUpload(false);
    clearErrors();
  };

  return (
    <div className="space-y-8">
      {/* Resume Upload */}
      {showResumeUpload && (
        <ResumeUpload
          onDataParsed={handleResumeDataParsed}
          onClose={() => setShowResumeUpload(false)}
        />
      )}

      {/* Progress Bar */}
      <ProgressBar
        steps={steps}
        currentStepIndex={currentStepIndex}
        watch={watch}
      />

      {/* Resume Upload Toggle */}
      {!showResumeUpload && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowResumeUpload(true)}
            className="text-sm"
          >
            Upload Different Resume
          </Button>
        </div>
      )}

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

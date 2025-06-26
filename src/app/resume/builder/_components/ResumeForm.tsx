"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, Code, FolderOpen, GraduationCap, User } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { EducationForm } from "~/app/_components/onboarding/EducationForm";
import { ExperienceForm } from "~/app/_components/onboarding/ExperienceForm";
import { PersonalDetailsForm } from "~/app/_components/onboarding/PersonalDetailsForm";
import { ProjectsForm } from "~/app/_components/onboarding/ProjectsForm";
import { SkillsForm } from "~/app/_components/onboarding/SkillsForm";
import {
  completeProfileSchema,
  type OnboardingFormData,
} from "~/app/_components/onboarding/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

interface ResumeFormProps {
  initialData: OnboardingFormData;
  onChange: (data: OnboardingFormData) => void;
}

export function ResumeForm({ initialData, onChange }: ResumeFormProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const lastUpdateRef = useRef<string>("");

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(completeProfileSchema),
    mode: "onChange",
    defaultValues: initialData,
  });

  // Watch all form data for real-time updates
  const formData = watch();

  // Stabilized onChange callback with debouncing
  const debouncedOnChange = useCallback(
    (data: OnboardingFormData) => {
      const currentDataString = JSON.stringify(data);

      // Only update if data actually changed
      if (currentDataString !== lastUpdateRef.current) {
        lastUpdateRef.current = currentDataString;

        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Debounce the update to prevent rapid-fire changes
        timeoutRef.current = setTimeout(() => {
          onChange(data);
        }, 100);
      }
    },
    [onChange],
  );

  // Update parent component when form data changes
  useEffect(() => {
    debouncedOnChange(formData);
  }, [formData, debouncedOnChange]);

  // Reset form when initialData changes, but prevent recursion
  useEffect(() => {
    const initialDataString = JSON.stringify(initialData);
    const currentDataString = JSON.stringify(formData);

    // Only reset if the data is actually different
    if (initialDataString !== currentDataString) {
      reset(initialData);
    }
  }, [initialData, formData, reset]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="personal" className="w-full">
        {/* Enhanced TabsList with better visibility */}
        <TabsList className="grid h-12 w-full grid-cols-5 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          <TabsTrigger
            value="personal"
            className="flex h-10 items-center gap-2 px-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-900"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Personal</span>
          </TabsTrigger>
          <TabsTrigger
            value="education"
            className="flex h-10 items-center gap-2 px-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-900"
          >
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Education</span>
          </TabsTrigger>
          <TabsTrigger
            value="experience"
            className="flex h-10 items-center gap-2 px-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-900"
          >
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Experience</span>
          </TabsTrigger>
          <TabsTrigger
            value="projects"
            className="flex h-10 items-center gap-2 px-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-900"
          >
            <FolderOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Projects</span>
          </TabsTrigger>
          <TabsTrigger
            value="skills"
            className="flex h-10 items-center gap-2 px-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-900"
          >
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Skills</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <PersonalDetailsForm register={register} errors={errors} />
        </TabsContent>

        <TabsContent value="education" className="mt-6">
          <EducationForm
            register={register}
            control={control}
            watch={watch}
            setValue={setValue}
            errors={errors}
          />
        </TabsContent>

        <TabsContent value="experience" className="mt-6">
          <ExperienceForm
            register={register}
            control={control}
            watch={watch}
            setValue={setValue}
            errors={errors}
          />
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <ProjectsForm
            register={register}
            control={control}
            watch={watch}
            setValue={setValue}
            errors={errors}
          />
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <SkillsForm register={register} errors={errors} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

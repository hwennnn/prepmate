"use client";

import { useRouter } from "next/navigation";
import { ThemeToggle } from "~/components/theme-toggle";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { Logo } from "~/components/ui/logo";
import { api } from "~/trpc/react";

import type { Education, Experience, Project } from "@prisma/client";
import { useMemo } from "react";
import { OnboardingForm } from "~/app/_components/onboarding/OnboardingForm";

export function EditProfilePageClient() {
  const router = useRouter();
  const utils = api.useUtils();

  // Fetch existing profile data
  const {
    data: profileData,
    isLoading,
    error,
  } = api.onboarding.getProfile.useQuery();

  const handleEditComplete = async () => {
    await utils.onboarding.getProfile.invalidate();
    router.push("/profile");
  };

  const initialData = useMemo(() => {
    if (!profileData) return undefined;

    return {
      personalDetails: {
        firstName: profileData.firstName ?? "",
        lastName: profileData.lastName ?? "",
        email: profileData.email ?? "",
        phoneNumber: profileData.phoneNumber ?? "",
        website: profileData.website ?? undefined,
        linkedinUrl: profileData.linkedinUrl ?? undefined,
        githubUrl: profileData.githubUrl ?? undefined,
      },
      education:
        profileData.education?.map((edu: Education) => ({
          institution: edu.institution,
          degree: edu.degree,
          isAttending: edu.isAttending,
          startDate: edu.startDate
            ? new Date(edu.startDate)
            : (undefined as unknown as Date),
          endDate: edu.endDate
            ? new Date(edu.endDate)
            : (undefined as unknown as Date),
          gpa: edu.gpa ?? undefined,
          awards: edu.awards ?? undefined,
          coursework: edu.coursework ?? undefined,
        })) ?? [],
      experience:
        profileData.experience?.map((exp: Experience) => ({
          company: exp.company,
          jobTitle: exp.jobTitle,
          location: exp.location,
          isCurrentJob: exp.isCurrentJob,
          startDate: exp.startDate
            ? new Date(exp.startDate)
            : (undefined as unknown as Date),
          endDate: exp.endDate
            ? new Date(exp.endDate)
            : (undefined as unknown as Date),
          achievements: exp.achievements ?? [],
          technologies: exp.technologies ?? undefined,
        })) ?? [],
      projects:
        profileData.projects?.map((proj: Project) => ({
          name: proj.name,
          description: proj.description,
          url: proj.url ?? undefined,
          achievements: proj.achievements ?? [],
          technologies: proj.technologies ?? undefined,
        })) ?? [],
      skills: {
        languages: profileData.skills?.languages ?? undefined,
        frameworks: profileData.skills?.frameworks ?? undefined,
      },
    };
  }, [profileData]);

  if (isLoading) {
    return <LoadingSpinner fullScreen size="lg" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">
              Error Loading Profile
            </h1>
            <p className="mt-2 text-slate-600">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-2">
            <Logo size="md" variant="rounded-lg" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
              PrepMate
            </span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white">
            Edit Your Profile ✏️
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Update your professional information to keep your profile current.
          </p>
        </div>

        <OnboardingForm
          initialData={initialData}
          onComplete={handleEditComplete}
        />
      </div>
    </div>
  );
}

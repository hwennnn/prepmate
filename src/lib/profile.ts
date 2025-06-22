import type { Education, Experience, Project } from "@prisma/client";
import type { OnboardingFormData } from "~/app/_components/onboarding/types";
import type { GetProfileData } from "~/server/api/routers/types";

export const convertToFormData = (
  profileData: GetProfileData | null | undefined,
): OnboardingFormData | undefined => {
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
};

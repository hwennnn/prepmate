import type { Education, Experience, Project } from "@prisma/client";
import type {
  OnboardingFormData,
  Resume,
  ResumeFormData,
} from "~/app/_components/onboarding/types";
import type {
  GetProfileData,
  GetResumeData,
  GetResumesData,
} from "~/server/api/routers/types";

export const convertProfileToOnboardingForm = (
  profileData: GetProfileData | null | undefined,
): OnboardingFormData | undefined => {
  if (!profileData) return undefined;

  return {
    profileId: profileData.id,
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

export const formatDataForTypst = (formData: OnboardingFormData) => {
  const formatDate = (date: Date | undefined) => {
    if (!date) return undefined;
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toISOString().split("T")[0]; // "2018-08-15T00:00:00.000Z" -> "2018-08-15"
  };

  // Filter out incomplete entries to prevent compilation errors
  const validExperience = formData.experience?.filter(
    (exp) => exp.company && exp.jobTitle && exp.startDate,
  );

  const validEducation = formData.education?.filter(
    (edu) => edu.institution && edu.degree && edu.startDate && edu.endDate,
  );

  const validProjects = formData.projects?.filter(
    (proj) => proj.name && proj.description,
  );

  // Reconstruct form data
  return {
    ...formData,
    education: validEducation?.map((edu) => ({
      ...edu,
      startDate: formatDate(edu.startDate),
      endDate: formatDate(edu.endDate),
    })),
    experience: validExperience?.map((exp) => ({
      ...exp,
      startDate: formatDate(exp.startDate),
      endDate: exp.endDate ? formatDate(exp.endDate) : undefined,
    })),
    projects: validProjects,
  };
};

export const convertResumeToDisplayForm = (
  resumeData: GetResumeData | null | undefined,
): ResumeFormData | undefined => {
  if (!resumeData) return undefined;

  return {
    ...resumeData,
    // Convert null to undefined for optional personal fields
    phoneNumber: resumeData.phoneNumber ?? undefined,
    website: resumeData.website ?? undefined,
    linkedinUrl: resumeData.linkedinUrl ?? undefined,
    githubUrl: resumeData.githubUrl ?? undefined,

    // Convert education relation
    education:
      resumeData.education?.map((edu) => ({
        ...edu,
        gpa: edu.gpa ?? undefined,
        awards: edu.awards ?? undefined,
        coursework: edu.coursework ?? undefined,
      })) ?? [],

    // Convert experience relation
    experience:
      resumeData.experience?.map((exp) => ({
        ...exp,
        endDate: exp.endDate ?? undefined,
        technologies: exp.technologies ?? undefined,
      })) ?? [],

    // Convert projects relation
    projects:
      resumeData.projects?.map((proj) => ({
        ...proj,
        url: proj.url ?? undefined,
        technologies: proj.technologies ?? undefined,
      })) ?? [],

    // Convert skills relation
    skills: resumeData.skills
      ? {
          ...resumeData.skills,
          languages: resumeData.skills.languages ?? undefined,
          frameworks: resumeData.skills.frameworks ?? undefined,
        }
      : undefined,
  };
};

export const convertResumesToList = (
  resumesData: GetResumesData | null | undefined,
): Resume[] => {
  if (!resumesData) return [];

  return resumesData.map((resume) => ({
    ...resume,
    // Convert null to undefined for optional personal fields
    phoneNumber: resume.phoneNumber ?? undefined,
    website: resume.website ?? undefined,
    linkedinUrl: resume.linkedinUrl ?? undefined,
    githubUrl: resume.githubUrl ?? undefined,
  }));
};

// Helper function to convert resume data to ResumeBuilderFormData
export const convertResumeToBuilderForm = (
  resumeData: GetResumeData | null | undefined,
):
  | (OnboardingFormData & { resumeName: string; templateId: string })
  | undefined => {
  if (!resumeData) return undefined;

  const converted = convertResumeToDisplayForm(resumeData);
  if (!converted) return undefined;

  return {
    personalDetails: {
      firstName: converted.firstName,
      lastName: converted.lastName,
      email: converted.email,
      phoneNumber: converted.phoneNumber ?? "",
      website: converted.website ?? "",
      linkedinUrl: converted.linkedinUrl ?? "",
      githubUrl: converted.githubUrl ?? "",
    },
    education: converted.education,
    experience: converted.experience,
    projects: converted.projects,
    skills: converted.skills,
    resumeName: converted.resumeName,
    templateId: converted.templateId,
  };
};

// Helper function to convert profile data to ResumeBuilderFormData with default resume name
export const convertProfileToBuilderForm = (
  profileData: GetProfileData | null | undefined,
  templateId?: string,
):
  | (OnboardingFormData & { resumeName: string; templateId?: string })
  | undefined => {
  if (!profileData) return undefined;

  const converted = convertProfileToOnboardingForm(profileData);
  if (!converted) return undefined;

  return {
    ...converted,
    resumeName: `${profileData.firstName} ${profileData.lastName}'s Resume`,
    templateId: templateId,
  };
};

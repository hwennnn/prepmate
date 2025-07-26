import { type onboardingRouter } from "./onboarding";
import { type resumeRouter } from "./resume";

// Profile types for multi-profile system
export type ProfileWithRelations = {
  id: string;
  userId: string;
  profileName: string;
  isDefault: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  website: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    isAttending: boolean;
    startDate: Date;
    endDate: Date;
    gpa: string | null;
    awards: string | null;
    coursework: string | null;
  }>;
  experience: Array<{
    id: string;
    company: string;
    jobTitle: string;
    location: string;
    isCurrentJob: boolean;
    startDate: Date;
    endDate: Date | null;
    achievements: string[];
    technologies: string | null;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    url: string | null;
    achievements: string[];
    technologies: string | null;
  }>;
  skills: {
    id: string;
    languages: string | null;
    frameworks: string | null;
  } | null;
};

export type GetProfileData = Awaited<
  ReturnType<typeof onboardingRouter.getProfile>
>;

export type GetResumeData = Awaited<ReturnType<typeof resumeRouter.getResume>>;

export type GetResumesData = Awaited<
  ReturnType<typeof resumeRouter.getResumes>
>;

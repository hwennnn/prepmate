import { type onboardingRouter } from "./onboarding";
import { type resumeRouter } from "./resume";

export type GetProfileData = Awaited<
  ReturnType<typeof onboardingRouter.getProfile>
>;

export type GetResumeData = Awaited<ReturnType<typeof resumeRouter.getResume>>;

export type GetResumesData = Awaited<
  ReturnType<typeof resumeRouter.getResumes>
>;

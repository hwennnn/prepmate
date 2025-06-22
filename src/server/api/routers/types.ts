import { type onboardingRouter } from "./onboarding";

export type GetProfileData = Awaited<
  ReturnType<typeof onboardingRouter.getProfile>
>;

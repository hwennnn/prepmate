import { OnboardingCheck } from "~/app/_components/OnboardingCheck";
import { ResumeListClient } from "./_components/ResumeListClient";

export default function ResumeListPage() {
  return (
    <OnboardingCheck>
      <ResumeListClient />
    </OnboardingCheck>
  );
}

export const metadata = {
  title: "My Resumes | PrepMate",
  description: "View and manage your saved resumes.",
};

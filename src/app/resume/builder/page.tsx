import { OnboardingCheck } from "~/app/_components/OnboardingCheck";
import { ResumeBuilderClient } from "~/app/resume/builder/_components/ResumeBuilderClient";

export default function ResumeBuilderPage() {
  return (
    <OnboardingCheck>
      <ResumeBuilderClient />
    </OnboardingCheck>
  );
}

export const metadata = {
  title: "Create Resume | PrepMate",
  description: "Create your professional resume with live preview.",
};

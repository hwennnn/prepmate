import { OnboardingCheck } from "~/app/_components/OnboardingCheck";
import { ResumeBuilderClient } from "~/app/resume/builder/_components/ResumeBuilderClient";

export default function EditResumePage() {
  return (
    <OnboardingCheck>
      <ResumeBuilderClient />
    </OnboardingCheck>
  );
}

export const metadata = {
  title: "Edit Resume | PrepMate",
  description: "Edit your professional resume with live preview.",
};

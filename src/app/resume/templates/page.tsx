import { TemplateSelectionClient } from "~/app/resume/templates/_components/TemplateSelectionClient";
import { OnboardingCheck } from "~/app/_components/OnboardingCheck";

export default function TemplatesPage() {
  return (
    <OnboardingCheck>
      <TemplateSelectionClient />
    </OnboardingCheck>
  );
}

export const metadata = {
  title: "Resume Templates | PrepMate",
  description: "Choose a professional resume template to get started.",
};

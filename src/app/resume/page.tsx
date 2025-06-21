import { TemplateSelectionClient } from "~/app/resume/_components/TemplateSelectionClient";
import { OnboardingCheck } from "../_components/OnboardingCheck";

export default function ResumePage() {
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

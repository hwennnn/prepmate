import { OnboardingCheck } from "~/app/_components/OnboardingCheck";
import { OnboardingPageClient } from "./_components/OnboardingPageClient";

export default function OnboardingPage() {
  return (
    <OnboardingCheck reverse>
      <OnboardingPageClient />
    </OnboardingCheck>
  );
}

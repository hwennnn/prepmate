import { OnboardingCheck } from "~/app/_components/OnboardingCheck";
import { OnboardingClientWrapper } from "./_components/OnboardingClientWrapper";

export default function OnboardingPage() {
  return (
    <OnboardingCheck reverse>
      <OnboardingClientWrapper />
    </OnboardingCheck>
  );
}

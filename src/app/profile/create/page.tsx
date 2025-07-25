import { OnboardingCheck } from "~/app/_components/OnboardingCheck";
import { CreateProfilePageClient } from "~/app/profile/create/_components/CreateProfilePageClient";

export default function CreateProfilePage() {
  return (
    <OnboardingCheck>
      <CreateProfilePageClient />
    </OnboardingCheck>
  );
}

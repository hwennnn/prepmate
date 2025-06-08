import { OnboardingCheck } from "~/app/_components/OnboardingCheck";
import { EditProfilePageClient } from "./_components/EditProfilePageClient";

export default function EditProfilePage() {
  return (
    <OnboardingCheck>
      <EditProfilePageClient />
      {/* <OnboardingForm onComplete={() => {}} /> */}
    </OnboardingCheck>
  );
}

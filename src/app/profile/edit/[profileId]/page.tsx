import { OnboardingCheck } from "~/app/_components/OnboardingCheck";
import { EditSpecificProfilePageClient } from "~/app/profile/edit/[profileId]/_components/EditSpecificProfilePageClient";

export default function EditSpecificProfilePage() {
  return (
    <OnboardingCheck>
      <EditSpecificProfilePageClient />
    </OnboardingCheck>
  );
}

import { ProfilePageClient } from "~/app/profile/_components/ProfilePageClient";
import { OnboardingCheck } from "../_components/OnboardingCheck";

export default async function ProfilePage() {

  return (
    <OnboardingCheck>
        <ProfilePageClient />
    </OnboardingCheck>
  );
}

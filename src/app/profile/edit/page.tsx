import { OnboardingCheck } from "~/app/_components/OnboardingCheck";
//import EditProfileForm from "./EditProfileForm";
import { EditProfilePageClient } from "~/app/profile/edit/_components/EditProfilePageClient";

export default function EditProfilePage() {
  return (
    <OnboardingCheck>
      <EditProfilePageClient />
      {/* <OnboardingForm onComplete={() => {}} /> */}
    </OnboardingCheck>
  );
}

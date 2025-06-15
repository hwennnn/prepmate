import { OnboardingCheck } from "~/app/_components/OnboardingCheck";
import { EditProfilePageClient } from "~/app/profile/edit/_components/EditProfilePageClient";
import { ErrorBoundary } from "~/components/ErrorBoundary";

export default function EditProfilePage() {
  return (
    <OnboardingCheck>
      <ErrorBoundary>
        <EditProfilePageClient />
      </ErrorBoundary>
    </OnboardingCheck>
  );
}

import { ProfilePageClient } from "~/app/profile/_components/ProfilePageClient";
import { OnboardingCheck } from "../_components/OnboardingCheck";
import { ErrorBoundary } from "~/components/ErrorBoundary";

export default async function ProfilePage() {
  //const profilePageClientErrorTitle = "Failed to Load Profile";
  //const profilePageClientErrorMessage = "We couldn't load your profile information. This might be because your profile hasn't been set up yet or there was a network issue.";

  return (
    <OnboardingCheck>
      <ErrorBoundary
      //title={profilePageClientErrorTitle}
      //description={profilePageClientErrorMessage}
      >
        <ProfilePageClient />
      </ErrorBoundary>
    </OnboardingCheck>
  );
}

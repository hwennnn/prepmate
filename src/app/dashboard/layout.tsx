import { OnboardingCheck } from "~/app/_components/OnboardingCheck";
import { SignedInOnly } from "~/app/_components/SignedInOnly";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SignedInOnly>
      <OnboardingCheck />
      {children}
    </SignedInOnly>
  );
}

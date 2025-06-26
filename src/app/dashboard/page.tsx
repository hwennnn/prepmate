import { type Metadata } from "next";
import { OnboardingCheck } from "~/app/_components/OnboardingCheck";
import { DashboardClientPage } from "~/app/dashboard/_components/DashboardClientPage";
import { Header } from "~/components/layout";

export const metadata: Metadata = {
  title: "Dashboard - PrepMate",
  description: "Manage your resumes and track your job search progress.",
};

export default function DashboardPage() {
  return (
    <OnboardingCheck>
      <Header
        variant="blurred"
        showProfileLink
        showSignOutButton
        isAuthenticated
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <DashboardClientPage />
      </div>
    </OnboardingCheck>
  );
}

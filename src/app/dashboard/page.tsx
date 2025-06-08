import { User } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { OnboardingCheck } from "~/app/_components/OnboardingCheck";
import { DashboardClientPage } from "~/app/dashboard/_components/DashboardClientPage";
import { ThemeToggle } from "~/components/theme-toggle";
import { Button } from "~/components/ui/button";
import { Logo } from "~/components/ui/logo";
import { signOut } from "~/server/auth";

export const metadata: Metadata = {
  title: "Dashboard - PrepMate",
  description: "Manage your resumes and track your job search progress.",
};

export default function DashboardPage() {
  return (
    <OnboardingCheck>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        {/* Navigation */}
        <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
          <div className="container mx-auto flex items-center justify-between px-4 py-4">
            <div className="flex items-center space-x-2">
              <Logo size="md" variant="rounded-lg" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                PrepMate
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="ghost" size="sm" asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <Button variant="outline" size="sm" type="submit">
                    Sign Out
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </nav>

        <DashboardClientPage />
      </div>
    </OnboardingCheck>
  );
}

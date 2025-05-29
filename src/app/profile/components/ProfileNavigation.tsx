import { signOut } from "next-auth/react";
import Link from "next/link";
import { ThemeToggle } from "~/components/theme-toggle";
import { Button } from "~/components/ui/button";
import { Logo } from "~/components/ui/logo";

export function ProfileNavigation() {
  return (
    <>
      {/* Navigation - Consistent with Dashboard */}
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
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <div className="flex items-center space-x-2">
              <form
                action={async () => {
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

      {/* Page Title Section */}
      <div className="border-b border-slate-100 bg-white/50 dark:border-slate-800 dark:bg-slate-950/50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            My Profile
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            View and manage your professional profile
          </p>
        </div>
      </div>
    </>
  );
}

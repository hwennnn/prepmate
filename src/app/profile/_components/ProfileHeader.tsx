"use client";

import { Edit } from "lucide-react";
import Link from "next/link";
import { Header } from "~/components/layout";
import { Button } from "~/components/ui/button";

export function ProfileHeader() {
  return (
    <>
      <Header
        variant="blurred"
        showDashboardLink
        showSignOutButton
        isAuthenticated
      />

      {/* Page Title Section */}
      <div className="border-b border-slate-100 bg-white/50 dark:border-slate-800 dark:bg-slate-950/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                My Profile
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                View and manage your professional profile
              </p>
            </div>
            <Button asChild>
              <Link href="/profile/edit">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

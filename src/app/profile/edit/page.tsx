"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { OnboardingCheck } from "~/app/_components/OnboardingCheck";
import { SignedInOnly } from "~/app/_components/SignedInOnly";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { LoadingSpinner } from "~/components/ui/loading-spinner";

export default function EditProfilePage() {
  const router = useRouter();

  useEffect(() => {
    // For now, redirect to onboarding form which already has edit functionality
    const timer = setTimeout(() => {
      router.push("/onboarding");
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SignedInOnly>
      {/* TODO: add extra config here to bypass the onboarding check */}
      <OnboardingCheck />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                <p className="mb-4 text-slate-600 dark:text-slate-400">
                  Redirecting to the profile editor...
                </p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" asChild>
                    <Link href="/profile">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Profile
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/onboarding">Edit Now</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SignedInOnly>
  );
}

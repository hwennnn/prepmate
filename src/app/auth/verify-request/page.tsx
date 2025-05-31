import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { SignedOutOnly } from "~/app/_components/SignedOutOnly";
import { ThemeToggle } from "~/components/theme-toggle";
import { Button } from "~/components/ui/button";
import { Logo } from "~/components/ui/logo";
import { getAuthErrorMessage } from "~/lib/auth-errors";

export const metadata: Metadata = {
  title: "Check Your Email - PrepMate",
  description: "A sign in link has been sent to your email address.",
};

export default async function VerifyRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; error?: string }>;
}) {
  const params = await searchParams;
  const email = params.email;
  const error = params.error;

  // Get user-friendly error message if there's an error
  const errorMessage = error ? getAuthErrorMessage(error) : null;

  return (
    <SignedOutOnly>
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 dark:bg-black">
        {/* Geometric background pattern - only visible in dark mode */}
        <div className="absolute inset-0 hidden dark:block dark:bg-black">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:4rem_4rem]" />
        </div>

        {/* Navigation */}
        <div className="absolute top-6 right-6 left-6 z-20 flex items-center justify-between">
          <Link
            href="/auth/signin"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Sign In</span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-md text-center">
          {/* Logo */}
          <div className="mb-12">
            <Logo size="lg" className="mx-auto mb-6 h-16 w-16 rounded-2xl" />
          </div>

          {/* Title */}
          <h1 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white">
            {errorMessage ? "Email Error" : "Check your email"}
          </h1>

          {/* Error Display */}
          {errorMessage && (
            <div className="mb-8 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-left text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Card */}
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:border-zinc-700 dark:bg-zinc-900/90">
            {errorMessage ? (
              /* Error State */
              <div className="space-y-4">
                <p className="text-slate-800 dark:text-zinc-200">
                  There was a problem sending the email{email && " to "}
                  {email && (
                    <span className="font-medium text-slate-900 dark:text-white">
                      {email}
                    </span>
                  )}
                  .
                </p>
                <p className="text-sm text-slate-600 dark:text-zinc-300">
                  Please try signing in again or contact support if the problem
                  persists.
                </p>
              </div>
            ) : (
              /* Success State */
              <div className="space-y-4">
                <p className="text-slate-800 dark:text-zinc-200">
                  A sign in link has been sent to{" "}
                  {email && (
                    <span className="font-medium text-slate-900 dark:text-white">
                      {email}
                    </span>
                  )}
                  {!email && "your email address"}.
                </p>
                <p className="text-sm text-slate-600 dark:text-zinc-300">
                  Click the link in the email to sign in to your account. The
                  link will expire in 24 hours.
                </p>

                {/* Success indicator */}
                <div className="flex items-center justify-center gap-2 rounded-lg bg-green-50 px-4 py-3 dark:bg-green-950/20">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-300">
                    Email sent successfully
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Help text / Actions */}
          {errorMessage ? (
            <div className="mt-8 space-y-4">
              <Button asChild className="w-full">
                <Link href="/auth/signin">Try Again</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          ) : (
            <p className="mt-8 text-sm text-slate-600 dark:text-zinc-300">
              Can&apos;t find the email? Check your spam folder.
            </p>
          )}
        </div>
      </main>
    </SignedOutOnly>
  );
}

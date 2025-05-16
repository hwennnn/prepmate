import { ArrowLeft } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "~/components/theme-toggle";
import { Logo } from "~/components/ui/logo";

export const metadata: Metadata = {
  title: "Check Your Email - PrepMate",
  description: "A sign in link has been sent to your email address.",
};

export default async function VerifyRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;
  const email = params.email;

  return (
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
          Check your email
        </h1>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:border-zinc-700 dark:bg-zinc-900/90">
          {/* Description */}
          <p className="mb-4 text-slate-800 dark:text-zinc-200">
            A sign in link has been sent to{" "}
            {email && (
              <span className="font-medium text-slate-900 dark:text-white">
                {email}
              </span>
            )}
            {!email && "your email address"}.
          </p>

          <p className="text-sm text-slate-600 dark:text-zinc-300">
            Click the link in the email to sign in to your account. The link
            will expire in 24 hours.
          </p>
        </div>

        {/* Help text */}
        <p className="mt-8 text-sm text-slate-600 dark:text-zinc-300">
          Can&apos;t find the email? Check your spam folder.
        </p>
      </div>
    </main>
  );
}

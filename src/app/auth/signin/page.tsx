import { ArrowLeft } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignInForm } from "~/components/auth/signin-form";
import { ThemeToggle } from "~/components/theme-toggle";
import { Logo } from "~/components/ui/logo";
import { auth } from "~/server/auth";

export const metadata: Metadata = {
  title: "Sign In - PrepMate",
  description: "Sign in to your PrepMate account to build your perfect resume.",
};

export default async function SignInPage() {
  const session = await auth();

  // Redirect if already signed in
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 dark:bg-black">
      {/* Geometric background pattern - only visible in dark mode */}
      <div className="absolute inset-0 hidden dark:block dark:bg-black">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:4rem_4rem]" />
      </div>

      {/* Navigation */}
      <div className="absolute top-6 right-6 left-6 z-20 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Logo size="lg" className="mb-6 h-16 w-16 rounded-2xl" />
          <h1 className="mb-2 text-4xl font-bold text-slate-900 dark:text-white">
            Continue with PrepMate
          </h1>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80">
          <SignInForm />
        </div>
      </div>
    </main>
  );
}

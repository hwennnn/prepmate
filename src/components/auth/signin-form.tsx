"use client";

import { AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { getAuthErrorMessage, handleSignInResult } from "~/lib/auth-errors";

export const AuthLoadingSpinner = () => (
  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
);

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Check for authentication errors in URL params
  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError) {
      setError(getAuthErrorMessage(urlError));
    }
  }, [searchParams]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setError(null);
    setIsLoading("email");
    try {
      // For email signin, we want to redirect to verify-request page
      await signIn("email", {
        email,
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(null);
    }
  };

  const handleProviderSignIn = async (providerId: string) => {
    setError(null);
    setIsLoading(providerId);
    try {
      // For OAuth providers, we want to handle errors inline
      const result = await signIn(providerId, {
        callbackUrl: "/dashboard",
        redirect: false,
      });

      const errorMessage = handleSignInResult(result, providerId);
      if (errorMessage) {
        setError(errorMessage);
        setIsLoading(null);
      }
    } catch (error) {
      console.error(`${providerId} sign-in error:`, error);
      setError(
        `An error occurred with ${providerId} sign-in. Please try again.`,
      );
      setIsLoading(null);
    }
  };

  const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );

  const DiscordIcon = () => (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );

  const GitHubIcon = () => (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Email Form */}
      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <div>
          <Label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-slate-900 dark:text-white"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
            className="h-12 w-full rounded-lg border-slate-300 bg-white px-4 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-12 w-full rounded-lg bg-slate-900 font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-gray-100"
          disabled={isLoading !== null || !email}
        >
          {isLoading === "email" ? (
            <LoadingSpinner size="sm" className="border-current" />
          ) : (
            "Continue"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-300 dark:border-zinc-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 tracking-wide text-slate-500 uppercase dark:bg-zinc-900 dark:text-zinc-400">
            OR
          </span>
        </div>
      </div>

      {/* OAuth Providers */}
      <div className="space-y-3">
        <Button
          variant="outline"
          size="lg"
          className="h-12 w-full rounded-lg border-slate-300 bg-white text-slate-900 transition-colors hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
          onClick={() => handleProviderSignIn("google")}
          disabled={isLoading !== null}
        >
          {isLoading === "google" ? <AuthLoadingSpinner /> : <GoogleIcon />}
          <span className="ml-3">Continue with Google</span>
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="h-12 w-full rounded-lg border-slate-300 bg-white text-slate-900 transition-colors hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
          onClick={() => handleProviderSignIn("discord")}
          disabled={isLoading !== null}
        >
          {isLoading === "discord" ? <AuthLoadingSpinner /> : <DiscordIcon />}
          <span className="ml-3">Continue with Discord</span>
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="h-12 w-full rounded-lg border-slate-300 bg-white text-slate-900 transition-colors hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
          onClick={() => handleProviderSignIn("github")}
          disabled={isLoading !== null}
        >
          {isLoading === "github" ? <AuthLoadingSpinner /> : <GitHubIcon />}
          <span className="ml-3">Continue with GitHub</span>
        </Button>
      </div>
    </div>
  );
}

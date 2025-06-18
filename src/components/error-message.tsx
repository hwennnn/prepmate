"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "~/components/ui/card";

import {
  normalizeErrorMessage,
  getErrorCode,
  getErrorDigest,
  isDevelopment,
} from "~/lib/error-utils";

export interface ErrorUIProps {
  title?: string;
  description?: string;
  retry?: () => void;
  showHomeButton?: boolean;
  showTechnicalDetails?: boolean;
}

export interface ErrorMessageProps extends ErrorUIProps {
  error: unknown;
}

export function ErrorMessage({
  error,
  title,
  description,
  retry,
  showHomeButton = true,
  showTechnicalDetails = true,
}: ErrorMessageProps) {
  const errorMessage = normalizeErrorMessage(error);
  const errorCode = getErrorCode(error);
  const errorDigest = getErrorDigest(error);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/20">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl text-slate-900 dark:text-white">
            {title}
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            {description ?? errorMessage}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            {retry && (
              <Button onClick={retry} className="w-full" variant="default">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}

            {showHomeButton && (
              <Button asChild variant="ghost" className="w-full">
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            )}
          </div>

          {isDevelopment() && showTechnicalDetails && (
            <div className="mt-4 space-y-2">
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  <strong>Error:</strong> {errorMessage}
                </p>
                {errorCode && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    <strong>Code:</strong> {errorCode}
                  </p>
                )}
                {errorDigest && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    <strong>Digest:</strong> {errorDigest}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

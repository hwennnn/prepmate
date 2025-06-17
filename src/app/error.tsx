"use client";

import { useEffect } from "react";
import { ErrorMessage } from "~/components/error-message";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error for monitoring/debugging
    console.error(error, "Page Error Boundary");
  }, [error]);

  return (
    <ErrorMessage
      error={error}
      title="Oops! Something went wrong"
      description="We encountered an error while loading this page."
      retry={reset}
      showHomeButton={true}
      showTechnicalDetails={true}
    />
  );
}

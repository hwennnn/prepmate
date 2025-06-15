"use client";

// This is a reserved file name that nextjs will use to handle app-wide crashes
// @see https://nextjs.org/docs/13/app/building-your-application/routing/error-handling

import { useEffect } from "react";
import { ErrorMessage } from "~/components/ErrorMessage";

// re-using components from home page
import { Providers } from './providers';
import { Geist } from 'next/font/google';
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  // Monitor for state change in error (automatically called by NextJS)
  useEffect(() => {
    console.error("Global error called! Trace: ", error);
  }, [error]);

  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body className="bg-white text-slate-950 antialiased dark:bg-slate-950 dark:text-slate-50">
        <Providers>
					<ErrorMessage
						error={error}
						title="Something went wrong!"
						description="A critical error occurred."
						retry={reset}
					/>
				</Providers>
      </body>
    </html>
  );
}

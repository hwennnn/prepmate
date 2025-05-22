"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingSpinner } from "~/components/ui/loading-spinner";

interface SignedInOnlyProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Client-side authentication wrapper component.
 * Protects client components by redirecting unauthenticated users.
 *
 * For server components, use direct auth() check with redirect() instead:
 *
 * ```tsx
 * import { auth } from "~/server/auth";
 * import { redirect } from "next/navigation";
 *
 * export default async function Page() {
 *   const session = await auth();
 *   if (!session?.user) {
 *     redirect("/auth/signin");
 *   }
 *   // ... rest of component
 * }
 * ```
 */
export function SignedInOnly({
  children,
  redirectTo = "/auth/signin",
}: SignedInOnlyProps) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(redirectTo);
    }
  }, [status, router, redirectTo]);

  // Show loading while checking authentication
  if (status === "loading") {
    return <LoadingSpinner fullScreen text="Loading..." size="lg" />;
  }

  // Don't render anything while redirecting unauthenticated users
  if (status === "unauthenticated") {
    return null;
  }

  // Render children only when authenticated
  return <>{children}</>;
}

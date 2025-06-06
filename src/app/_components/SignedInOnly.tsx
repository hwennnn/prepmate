import { redirect } from "next/navigation";
import { getSession } from "~/lib/dal";

interface SignedInOnlyProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Server-side authentication wrapper component.
 * Protects server components by redirecting unauthenticated users.
 *
 * For direct server component auth, use this pattern instead:
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
export async function SignedInOnly({
  children,
  redirectTo = "/auth/signin",
}: SignedInOnlyProps) {
  const session = await getSession();

  // Redirect if NOT signed in
  if (!session) {
    redirect(redirectTo);
  }

  // Render children only when authenticated
  return <>{children}</>;
}

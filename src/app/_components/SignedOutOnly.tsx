import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

interface SignedOutOnlyProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Server-side authentication wrapper component.
 * Protects auth pages by redirecting authenticated users away.
 * Use this for sign-in, sign-up, verify-request pages, etc.
 *
 * For direct server component auth, use this pattern instead:
 *
 * ```tsx
 * import { auth } from "~/server/auth";
 * import { redirect } from "next/navigation";
 *
 * export default async function AuthPage() {
 *   const session = await auth();
 *   if (session?.user) {
 *     redirect("/dashboard");
 *   }
 *   // ... rest of component
 * }
 * ```
 */
export async function SignedOutOnly({
  children,
  redirectTo = "/dashboard",
}: SignedOutOnlyProps) {
  const session = await auth();

  // Redirect if already signed in
  if (session?.user) {
    redirect(redirectTo);
  }

  // Render children only when NOT authenticated
  return <>{children}</>;
}

/**
 * Authentication error handling utilities
 */

export type AuthError = string;

/**
 * Converts NextAuth error codes to user-friendly messages
 */
export function getAuthErrorMessage(error: string): string {
  switch (error) {
    case "OAuthAccountNotLinked":
      return "This email is already registered with a different sign-in method. Please use the same method you used before.";
    case "OAuthSignin":
      return "There was an error signing in with the OAuth provider.";
    case "OAuthCallback":
      return "There was an error in the OAuth callback.";
    case "OAuthCreateAccount":
      return "Could not create OAuth account.";
    case "EmailCreateAccount":
      return "Could not create account with email.";
    case "Callback":
      return "There was an error in the callback URL.";
    case "OAuthCallbackError":
      return "OAuth callback error occurred.";
    case "EmailSignin":
      return "Could not send email. Please try again.";
    case "CredentialsSignin":
      return "Invalid credentials provided.";
    case "SessionRequired":
      return "Please sign in to access this page.";
    default:
      return "An error occurred during sign in. Please try again.";
  }
}

/**
 * Handles signin result and returns appropriate error message
 */
export function handleSignInResult(
  result: { error?: string } | undefined,
  provider?: string,
): string | null {
  if (!result?.error) return null;

  if (provider) {
    return `Failed to sign in with ${provider}. Please try again.`;
  }

  return "An unexpected error occurred. Please try again.";
}

/**
 * Custom hook for handling authentication errors from URL params
 */
export function useAuthError(searchParams: URLSearchParams): string | null {
  const urlError = searchParams.get("error");
  return urlError ? getAuthErrorMessage(urlError) : null;
}

import "server-only";

import { cache } from "react";
import { auth } from "~/server/auth";

/**
 * Verify the user's session and return session data
 * Uses React's cache to memoize the result during a render pass
 */
export const getSession = cache(async () => {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return {
    isAuth: true,
    userId: session.user.id,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    },
  };
});

/**
 * Get the current user data with session verification
 * Returns null if not authenticated (for non-critical operations)
 */
export const getCurrentUser = cache(async () => {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };
});

/**
 * Check if user is authenticated without redirecting
 * Useful for conditional rendering
 */
export const isAuthenticated = cache(async () => {
  const session = await auth();
  return !!session?.user;
});

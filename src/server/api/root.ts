import { onboardingRouter } from "~/server/api/routers/onboarding";
import { resumeRouter } from "~/server/api/routers/resume";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  onboarding: onboardingRouter,
  resume: resumeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * // Add your router calls here when you have routers
 */
export const createCaller = createCallerFactory(appRouter);

import { TRPCError } from "@trpc/server";

export function normalizeErrorMessage(error: unknown): string {
  if (error instanceof Error || error instanceof TRPCError)
    return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred.";
}

export function getErrorCode(error: unknown): string | undefined {
  if (error instanceof TRPCError) {
    return error.code;
  }

  if (error && typeof error === "object" && "code" in error) {
    return String(error.code);
  }

  return undefined;
}

export function getErrorDigest(error: unknown): string | undefined {
  if (error && typeof error === "object" && "digest" in error) {
    return String(error.digest);
  }

  return undefined;
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

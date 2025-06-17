//import { redirect } from "next/navigation";
//import type { TRPC_ERROR_CODES_BY_KEY } from "@trpc/server/rpc";
import { TRPCError } from "@trpc/server";
//import { TRPCClientError } from "@trpc/client";
//import type { AppRouter } from "~/server/api/root";

export function normalizeErrorMessage(error: unknown): string {
  if (error instanceof Error || error instanceof TRPCError) return error.message;
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

//export type ErrorCode = keyof typeof TRPC_ERROR_CODES_BY_KEY;
/*
const ERROR_MESSAGES: Record<ErrorCode, { title: string, message: string, http_code: number }> = {
	BAD_REQUEST: {
    title: "Invalid Request",
    message: "The request contains invalid data. Please check your input.",
		http_code: 400,
  },
  UNAUTHORIZED: {
    title: "Authentication Required",
    message: "Please sign in to access this resource.",
		http_code: 401,
  },
  FORBIDDEN: {
    title: "Access Denied", 
    message: "You don\"t have permission to perform this action.",
		http_code: 403,
  },
  NOT_FOUND: {
    title: "Not Found",
    message: "The requested resource could not be found.",
		http_code: 404,
  },
	METHOD_NOT_SUPPORTED: {
    title: "Method Not Supported",
    message: "This operation is not supported.",
		http_code: 405,
  },
  TIMEOUT: {
    title: "Request Timeout",
    message: "The request took too long to process. Please try again.",
		http_code: 408,
  },
  CONFLICT: {
    title: "Conflict",
    message: "This action conflicts with existing data.",
		http_code: 409,
  },
  PRECONDITION_FAILED: {
    title: "Precondition Failed",
    message: "Required conditions were not met.",
		http_code: 412,
  },
  PAYLOAD_TOO_LARGE: {
    title: "File Too Large",
    message: "The uploaded file is too large.",
		http_code: 413,
  },
	UNSUPPORTED_MEDIA_TYPE: {
		title: "Incompatible File Type",
		message: "The uploaded file is of the wrong format.",
		http_code: 415,
	},
  UNPROCESSABLE_CONTENT: {
    title: "Invalid Data",
    message: "The provided data cannot be processed.",
		http_code: 422
  },
  TOO_MANY_REQUESTS: {
    title: "Too Many Requests",
    message: "Please wait a moment before trying again.",
		http_code: 429,
  },
  CLIENT_CLOSED_REQUEST: {
    title: "Request Cancelled",
    message: "The request was cancelled.",
		http_code: 499,
  },
  INTERNAL_SERVER_ERROR: {
    title: "Server Error",
    message: "An unexpected server error occurred. Please try again.",
		http_code: 500,
  },
	NOT_IMPLEMENTED: {
		title: "Unrecognized Request",
		message: "The request is not recognized.",
		http_code: 501,
	},
	BAD_GATEWAY: {
		title: "Invalid Response",
		message: "Gateway received an invalid response.",
		http_code: 502,
	},
	SERVICE_UNAVAILABLE: {
		title: "Server Overloaded",
		message: "Server unable to handle request.",
		http_code: 503,
	},
	GATEWAY_TIMEOUT: {
		title: "Response Timeout",
		message: "Gateway response timed out.",
		http_code: 504,
	},
	PARSE_ERROR: {
		title: "Parse Error",
		message: "Parse Error",
		http_code: 0,
	}
}

export function redirectToErrorPage(
	errorCode: ErrorCode,
	returnUrl?: string
) : never {
	const params = new URLSearchParams({
		code: errorCode,
		...(returnUrl && { returnUrl }),
	});

	redirect(`error?${params.toString()}`);
}

export function handleTRPCError(error: unknown, returnUrl?: string) : never {
  console.error('tRPC error:', error); // Log full error server-side
  
  let errorCode: ErrorCode = 'INTERNAL_SERVER_ERROR';
  
  if (error instanceof TRPCError) {
    errorCode = error.code;
  }
  
  redirectToErrorPage(errorCode, returnUrl);
}

export function getErrorInfo(errorCode: ErrorCode) {
  return ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
}

//
export function throwTRPCError(
  code: ErrorCode, 
  message?: string,
  cause?: unknown
): never {
  throw new TRPCError({
    code,
    message: message ?? ERROR_MESSAGES[code].message,
    cause,
  });
}
*/
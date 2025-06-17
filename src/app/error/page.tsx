"use client";

//Global Error Page for server action errors

import { useSearchParams, useRouter } from "next/navigation";
import { ErrorMessage } from "~/components/ErrorMessage";
import { type ErrorCode, getErrorInfo } from "~/lib/error-utils";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const errorCode =
    (searchParams.get("code") as ErrorCode) ?? "INTERNAL_SERVER_ERROR";
  const returnUrl = searchParams.get("returnUrl");

  const { title, message } = getErrorInfo(errorCode);
  const error = new Error(message);

  const handleRetry = () => {
    if (returnUrl) {
      router.push(returnUrl);
    } else {
      router.back();
    }
  };

  return (
    <ErrorMessage
      error={error}
      title={title}
      description={message}
      retry={handleRetry}
    />
  );
}

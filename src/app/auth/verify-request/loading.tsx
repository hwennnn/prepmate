import { LoadingSpinner } from "~/components/ui/loading-spinner";

export default function VerifyRequestLoading() {
  return (
    <LoadingSpinner fullScreen text="Checking authentication..." size="lg" />
  );
}

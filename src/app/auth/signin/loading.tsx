import { LoadingSpinner } from "~/components/ui/loading-spinner";

export default function SignInLoading() {
  return (
    <LoadingSpinner fullScreen text="Checking authentication..." size="lg" />
  );
}

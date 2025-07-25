import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { notifyToaster } from "~/lib/notification";

interface UsePublicToggleProps {
  resumeId: string;
  initialIsPublic: boolean;
  currentIsPublic?: boolean;
  onSuccess?: (result: {
    success: boolean;
    isPublic: boolean;
    slug: string | null;
  }) => void;
}

export function usePublicToggle({
  resumeId,
  initialIsPublic,
  currentIsPublic,
  onSuccess,
}: UsePublicToggleProps) {
  // States to manage: state of checkbox, toggling change state
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [isToggling, setIsToggling] = useState(false);

  // Sync internal state with external state when it changes
  useEffect(() => {
    if (currentIsPublic !== undefined && !isToggling) {
      const timeoutId = setTimeout(() => {
        setIsPublic(currentIsPublic);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [currentIsPublic, isToggling]);

  const toggleMutation = api.resume.togglePublic.useMutation({
    onSuccess: (res) => {
      setIsPublic(res.isPublic);
      if (res.isPublic && res.slug) {
        notifyToaster(
          true,
          `Resume is now public! Share at: ${window.location.origin}/r/${res.slug}`,
          5000,
        );
      } else {
        notifyToaster(true, "Resume is now private!", 3000);
      }
      onSuccess?.(res);
    },
    onError: (error) => {
      notifyToaster(
        false,
        error.message || "Failed to update resume status",
        4000,
      );
    },
    onSettled: () => {
      setIsToggling(false);
    },
  });

  const toggle = async () => {
    setIsToggling(true);
    await toggleMutation.mutateAsync({
      resumeId,
      isPublic: isPublic,
    });
  };

  return {
    isPublic,
    isToggling,
    toggle,
    error: toggleMutation.error,
  };
}

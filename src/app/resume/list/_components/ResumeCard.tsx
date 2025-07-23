"use client";

import { api } from "~/trpc/react";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Resume } from "~/app/_components/onboarding/types";
import { notifyToaster } from "~/lib/notification";

import { Edit, Eye, Trash2, Globe, Lock } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { usePublicToggle } from "~/hooks/use-public-toggle";
import { TemplatePreview } from "../../templates/_components/TemplatePreview";

export interface ResumeCardProps {
  resume: Resume;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const deleteResume = api.resume.deleteResume.useMutation();
  const utils = api.useUtils();

  const router = useRouter();

  const [isCopied, setCopied] = useState(false);

  // Manage state of analytics data
  const [publicData, setPublicData] = useState<{
    isPublic: boolean;
    slug: string | null; // Match backend return type
    viewCount: number;
  } | null>(null);

  const { data: analyticsData } = api.resume.getPublicResumeAnalytics.useQuery(
    { resumeId: resume.id },
    { enabled: !!resume.id },
  );

  // Update local state when analytics data changes
  useEffect(() => {
    if (analyticsData) {
      setPublicData({
        isPublic: analyticsData.isPublic,
        slug: analyticsData.slug,
        viewCount: analyticsData.viewCount,
      });
    }
  }, [analyticsData]);

  // Public toggle functionality
  const publicToggle = usePublicToggle({
    resumeId: resume.id,
    initialIsPublic: publicData?.isPublic ?? false,
    currentIsPublic: publicData?.isPublic, // Sync with loaded data
    onSuccess: (result) => {
      // Update local state
      setPublicData((prev) =>
        prev
          ? {
              ...prev,
              isPublic: result.isPublic,
              slug: result.slug,
            }
          : {
              isPublic: result.isPublic,
              slug: result.slug,
              viewCount: 0,
            },
      );

      utils.resume.getPublicResumeAnalytics
        .invalidate({ resumeId: resume.id })
        .catch(console.error);
    },
  });

  const handleEdit = () => {
    router.push(`/resume/builder/${resume.id}`);
  };

  const handleView = () => {
    if (publicData?.slug) {
      // Navigate to resume slug link
      router.push(`/r/${publicData.slug}`);
    } else {
      notifyToaster(false, "No public URL available for this resume", 2500);
    }
  };

  const handleShare = async () => {
    if (publicData?.slug) {
      await navigator.clipboard.writeText(
        `${window.location.origin}/r/${publicData.slug}`,
      );
      setCopied(true);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCopied(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [isCopied]);

  const handleDelete = useCallback(async () => {
    if (!resume.id) return;

    try {
      const result = await deleteResume.mutateAsync({
        resumeId: resume.id,
      });

      if (result.success && result.deletedId === resume.id) {
        // Invalidate and refetch the resumes list
        await utils.resume.getResumes.invalidate();
        notifyToaster(true, "Deleted resume successfully!", 2500);
      }
    } catch (error) {
      console.error("Failed to delete resume:", error);
      notifyToaster(false, "Failed to delete resume!", 2500);
    }
  }, [resume.id, deleteResume, utils]);

  return (
    <Card className="group transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex w-full items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {resume.resumeName}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {resume.template.name} Template
            </p>
          </div>
          <Button
            onClick={handleShare}
            size="sm"
            className="px3 onclick:bg-green h-6 rounded-xl text-xs"
          >
            {!isCopied ? "Share" : "Copied to clipboard!"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {/* Preview Thumbnail placeholder for now */}
        <div className="mb-3 aspect-[3/4] rounded-lg">
          <TemplatePreview templateId={resume.template.id} />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>ID: {resume.id.slice(0, 8)}...</span>
          {publicData && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {publicData.isPublic ? (
                  <Globe className="h-3 w-3 text-green-600" />
                ) : (
                  <Lock className="h-3 w-3 text-gray-400" />
                )}
                <span>{publicData.isPublic ? "Public" : "Private"}</span>
              </div>
              {publicData.isPublic && (
                <span>Views: {publicData.viewCount} views</span>
              )}
            </div>
          )}
        </div>

        {publicData && (
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`public-toggle-${resume.id}`}
                checked={publicToggle.isPublic}
                onCheckedChange={(_checked) => {
                  if (!publicToggle.isToggling) {
                    publicToggle.toggle().catch(console.error);
                  }
                }}
                disabled={publicToggle.isToggling}
              />
              <label
                htmlFor={`public-toggle-${resume.id}`}
                className="flex cursor-pointer items-center gap-1 text-sm text-slate-600 dark:text-slate-400"
              >
                {publicToggle.isPublic ? (
                  <Globe className="h-3 w-3 text-green-600" />
                ) : (
                  <Lock className="h-3 w-3 text-gray-400" />
                )}
                {publicToggle.isPublic ? "Public" : "Private"}
                {publicToggle.isToggling && " (updating...)"}
              </label>
            </div>
            {publicData.isPublic && publicData.slug && (
              <span className="max-w-24 truncate text-xs text-blue-600 dark:text-blue-400">
                /r/{publicData.slug}
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleView}
            disabled={!publicData?.slug}
            className="flex-1"
            title={
              publicData?.slug
                ? `View at /r/${publicData.slug}`
                : "No public URL available"
            }
          >
            <Eye className="mr-1 h-3 w-3" />
            {publicData?.isPublic ? "View" : "Preview"}
          </Button>
          <Button size="sm" onClick={handleEdit} className="flex-1">
            <Edit className="mr-1 h-3 w-3" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={deleteResume.isPending}
            className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

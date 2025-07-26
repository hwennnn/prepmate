"use client";

import { api } from "~/trpc/react";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { ConfirmDialog } from "~/components/ui/confirm-dialog";

export interface ResumeCardProps {
  resume: Resume;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const deleteResume = api.resume.deleteResume.useMutation();
  const utils = api.useUtils();

  const router = useRouter();

  const [open, setOpen] = useState(false);

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

  const handleShare = async () => {
    if (publicData?.slug) {
      await navigator.clipboard.writeText(
        `${window.location.origin}/r/${publicData.slug}`,
      );
      notifyToaster(true, "Link copied to clipboard!", 3000);
    }
  };

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
        setOpen(false); // Close modal on success
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
            Share
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
          {publicData?.slug ? (
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link
                href={`/r/${publicData.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                title={`View at /r/${publicData.slug}`}
              >
                <Eye className="mr-1 h-3 w-3" />
                {publicData?.isPublic ? "View" : "Preview"}
              </Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="flex-1"
              title="No public URL available"
              onClick={() =>
                notifyToaster(
                  false,
                  "No public URL available for this resume",
                  2500,
                )
              }
            >
              <Eye className="mr-1 h-3 w-3" />
              {publicData?.isPublic ? "View" : "Preview"}
            </Button>
          )}
          <Button size="sm" onClick={handleEdit} className="flex-1">
            <Edit className="mr-1 h-3 w-3" />
            Edit
          </Button>
          {/** Delete API */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
            disabled={deleteResume.isPending}
            className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
          >
            <Trash2 className="mr-1 h-3 w-3" />
            Delete
          </Button>

          {/* Confirmation Modal */}
          <ConfirmDialog isOpen={open} onClose={() => setOpen(false)}>
            <div className="w-56 text-center">
              <Trash2 className="mx-auto mb-4 h-12 w-12 text-red-500" />
              <div className="mx-auto my-4 w-48">
                <h3 className="text-lg font-black text-gray-800">
                  Confirm Delete
                </h3>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete &quot;{resume.resumeName}
                  &quot;? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={handleDelete}
                  disabled={deleteResume.isPending}
                  variant="destructive"
                  className="w-full"
                >
                  {deleteResume.isPending ? "Deleting..." : "Delete"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </ConfirmDialog>
        </div>
      </CardFooter>
    </Card>
  );
}

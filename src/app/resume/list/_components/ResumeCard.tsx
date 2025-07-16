"use client";

import { api } from "~/trpc/react";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Resume } from "~/app/_components/onboarding/types";
import { notifyToaster } from "~/lib/notification";

import { Edit, Eye, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";

export interface ResumeCardProps {
  resume: Resume;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const deleteResume = api.resume.deleteResume.useMutation();
  const utils = api.useUtils();

  const router = useRouter();

  const handleEdit = () => {
    router.push(`/resume/builder/${resume.id}`);
  };

  const handleView = () => {
    // TODO: Navigate to public view
    // router.push(`/resume/view/${resume.id}`);
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
      }
    } catch (error) {
      console.error("Failed to delete resume:", error);
      notifyToaster(false, "Failed to delete resume!", 2500);
    }
  }, [resume.id, deleteResume, utils]);

  return (
    <Card className="group transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {resume.resumeName}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {resume.template.name} Template
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {/* Preview Thumbnail?  - placeholder for now */}
        <div className="mb-3 aspect-[3/4] rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mb-2 text-2xl">📄</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {/*TODO: RESUME PREVIEW*/}
                Resume Preview
              </p>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          Resume ID: {resume.id.slice(0, 8)}...
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleView}
            className="flex-1"
          >
            <Eye className="mr-1 h-3 w-3" />
            View
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

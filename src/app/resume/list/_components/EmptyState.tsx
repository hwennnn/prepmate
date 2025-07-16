"use client";

import Link from "next/link";

import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
          <Plus className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
          No resumes yet
        </h3>
        <p className="mb-6 text-slate-600 dark:text-slate-400">
          Get started by creating your first resume
        </p>
        <Link href="/resume/templates">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Resume
          </Button>
        </Link>
      </div>
    </div>
  );
}

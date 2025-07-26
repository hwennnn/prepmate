"use client";

import { Check, Loader2, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

interface BulletPointEnhancerProps {
  bulletPoints: string[];
  context: {
    type: "experience" | "project";
    title: string;
    company?: string;
    description?: string;
  };
  onAccept: (enhancedPoints: string[]) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export function BulletPointEnhancer({
  bulletPoints,
  context,
  onAccept,
  onCancel,
  isOpen,
}: BulletPointEnhancerProps) {
  const [enhancedPoints, setEnhancedPoints] = useState<string[]>([]);
  const [selectedPoints, setSelectedPoints] = useState<boolean[]>([]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const enhanceMutation = api.resume.enhanceBulletPoints.useMutation({
    onSuccess: (data) => {
      setEnhancedPoints(data.enhanced);
      setSelectedPoints(new Array(data.enhanced.length).fill(true)); // Select all by default
    },
    onError: (error) => {
      console.error("Enhancement failed:", error);
    },
  });

  const handleEnhance = () => {
    // Filter out empty bullet points
    const validPoints = bulletPoints.filter((point) => point.trim().length > 0);
    if (validPoints.length === 0) return;

    enhanceMutation.mutate({
      bulletPoints: validPoints,
      context,
    });
  };

  const handleAccept = () => {
    // Combine accepted enhanced points with original rejected points
    const finalPoints: string[] = [];
    let originalIndex = 0;

    enhancedPoints.forEach((enhancedPoint, index) => {
      if (selectedPoints[index]) {
        finalPoints.push(enhancedPoint);
      } else {
        finalPoints.push(bulletPoints[originalIndex] ?? "");
      }
      originalIndex++;
    });

    onAccept(finalPoints);
  };

  const togglePointSelection = (index: number) => {
    setSelectedPoints((prev) => {
      const newSelection = [...prev];
      newSelection[index] = !newSelection[index];
      return newSelection;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex h-full flex-col bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Enhance Your Bullet Points
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {context.type === "experience"
                  ? `For ${context.title} at ${context.company}`
                  : `For ${context.title} project`}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {!enhanceMutation.data && !enhanceMutation.isPending && (
          <div className="mx-auto flex h-full max-w-md flex-col items-center justify-center text-center">
            <Sparkles className="mb-4 h-12 w-12 text-blue-600" />
            <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
              Ready to enhance your bullet points
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Our AI will transform your bullet points to be more impactful,
              professional, and results-focused while maintaining accuracy.
            </p>
            <Button
              onClick={handleEnhance}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Enhance Bullet Points
            </Button>
          </div>
        )}

        {enhanceMutation.isPending && (
          <div className="flex h-full flex-col items-center justify-center">
            <Loader2 className="mb-3 h-10 w-10 animate-spin text-blue-600" />
            <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
              Enhancing your bullet points...
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This may take a few moments
            </p>
          </div>
        )}

        {enhanceMutation.error && (
          <div className="mx-auto flex h-full max-w-md flex-col items-center justify-center text-center">
            <div className="mb-4 text-red-600">
              Enhancement failed: {enhanceMutation.error.message}
            </div>
            <Button onClick={handleEnhance} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {enhanceMutation.data && (
          <div className="mx-auto max-w-6xl pb-20">
            <div className="mb-6 text-center">
              <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                Review Your Enhanced Bullet Points
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Check the boxes next to enhanced versions you want to accept.
                Unchecked items will keep their original text.
              </p>
            </div>

            <div className="space-y-6">
              {enhanceMutation.data.enhanced.map((enhancedPoint, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={selectedPoints[index] ?? false}
                        onChange={() => togglePointSelection(index)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex-1 space-y-4">
                      {/* Original */}
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <div className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                            Original
                          </div>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                            {enhanceMutation.data.original[index]}
                          </p>
                        </div>
                      </div>

                      {/* Enhanced */}
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <div className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
                            Enhanced
                          </div>
                          <Sparkles className="h-3 w-3 text-blue-600" />
                        </div>
                        <div
                          className={`rounded-lg border p-3 transition-all duration-200 ${
                            selectedPoints[index]
                              ? "border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-950"
                              : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                          }`}
                        >
                          <p
                            className={`text-sm leading-relaxed ${
                              selectedPoints[index]
                                ? "text-blue-900 dark:text-blue-100"
                                : "text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {enhancedPoint}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer - only show when we have results */}
      {enhanceMutation.data && (
        <div className="flex-shrink-0 border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
          <div className="mx-auto flex max-w-6xl justify-end gap-3">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleAccept}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="mr-2 h-4 w-4" />
              Accept Selected ({selectedPoints.filter(Boolean).length} of{" "}
              {selectedPoints.length})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

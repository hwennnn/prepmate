import { CheckCircle, FileText, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { api } from "~/trpc/react";
import type { OnboardingFormData } from "./types";

interface ResumeUploadProps {
  onDataParsed: (data: Partial<OnboardingFormData>) => void;
  onClose: () => void;
}

export function ResumeUpload({ onDataParsed, onClose }: ResumeUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const notifyError = (err: string) => {
    toast.error(err, {
      duration: 4000,
      position: "top-center",
      style: {
        padding: "0.5cm",
      },
    });
  };

  const parseResumeMutation = api.onboarding.parseResume.useMutation({
    onSuccess: (data: Partial<OnboardingFormData>) => {
      onDataParsed(data);
      setIsParsing(false);
    },
    onError: (error: { message?: string }) => {
      notifyError(error.message ?? "Failed to parse resume");
      setIsParsing(false);
    },
  });

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      return "Please upload a PDF, DOC, DOCX, or TXT file";
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return "File size must be less than 10MB";
    }

    return null;
  };

  const processFile = (file: File) => {
    const error = validateFile(file);
    if (error) {
      notifyError(error);
      return;
    }

    setUploadedFile(file);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current++;
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragOver(false);
    dragCounter.current = 0;

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file instanceof File) {
        processFile(file);
      }
    }
  };

  const handleParseResume = async () => {
    if (!uploadedFile) return;

    setIsParsing(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(",")[1]; // Remove data:application/pdf;base64, prefix

        await parseResumeMutation.mutateAsync({
          fileName: uploadedFile.name,
          fileData: base64Data!,
          mimeType: uploadedFile.type,
        });
      };
      reader.readAsDataURL(uploadedFile);
    } catch (error) {
      console.error("🚀 ~ handleParseResume ~ error:", error);
      notifyError("Failed to process file");
      setIsParsing(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Quick Setup with Resume</h3>
          <p className="text-muted-foreground text-sm">
            Upload your resume to automatically fill in your details
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {!uploadedFile ? (
        <div className="space-y-4">
          <div
            onClick={handleUploadClick}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              isDragOver
                ? "border-primary bg-muted"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {isDragOver ? (
              <FileText className="text-primary mx-auto mb-4 h-12 w-12" />
            ) : (
              <Upload className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            )}
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {isDragOver
                  ? "Drop your file here"
                  : "Click to upload your resume"}
              </p>
              <p className="text-muted-foreground text-xs">
                Supports PDF, DOC, DOCX, and TXT files (max 10MB)
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-muted flex items-center gap-3 rounded-lg p-3">
            <FileText className="text-primary h-8 w-8" />
            <div className="flex-1">
              <p className="text-sm font-medium">{uploadedFile.name}</p>
              <p className="text-muted-foreground text-xs">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={removeFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleParseResume}
              disabled={isParsing}
              className="flex-1"
            >
              {isParsing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Parsing Resume...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Parse & Fill Details
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Skip
            </Button>
          </div>
        </div>
      )}

      <div className="text-muted-foreground text-xs">
        <p>
          <strong>Note:</strong> Resume parsing uses AI to extract information.
          Please review and correct any details after parsing.
        </p>
      </div>
      <Toaster />
    </Card>
  );
}

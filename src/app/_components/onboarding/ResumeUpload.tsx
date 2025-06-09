import { CheckCircle, FileText, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
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
  const [parseError, setParseError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseResumeMutation = api.onboarding.parseResume.useMutation({
    onSuccess: (data: Partial<OnboardingFormData>) => {
      onDataParsed(data);
      setIsParsing(false);
    },
    onError: (error: { message?: string }) => {
      setParseError(error.message ?? "Failed to parse resume");
      setIsParsing(false);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];

      if (!allowedTypes.includes(file.type)) {
        setParseError("Please upload a PDF, DOC, DOCX, or TXT file");
        return;
      }

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setParseError("File size must be less than 10MB");
        return;
      }

      setUploadedFile(file);
      setParseError(null);
    }
  };

  const handleParseResume = async () => {
    if (!uploadedFile) return;

    setIsParsing(true);
    setParseError(null);

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
      setParseError("Failed to process file");
      setIsParsing(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setParseError(null);
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
            className="border-muted-foreground/25 hover:border-primary/50 cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors"
          >
            <Upload className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <div className="space-y-2">
              <p className="text-sm font-medium">Click to upload your resume</p>
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

          {parseError && (
            <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-3">
              <p className="text-destructive text-sm">{parseError}</p>
            </div>
          )}

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
    </Card>
  );
}

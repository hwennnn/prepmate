"use client";

import { ArrowRight, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Header } from "~/components/layout";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

// Mock templates for now - we'll replace this with real data later
const templates = [
  {
    id: "modern",
    name: "modern",
    displayName: "Modern Professional",
    description:
      "Clean, modern design with subtle accent lines. Perfect for tech and creative roles.",
    category: "modern",
  },
  {
    id: "classic",
    name: "classic",
    displayName: "Classic Traditional",
    description:
      "Traditional format with Times New Roman font. Ideal for conservative industries.",
    category: "classic",
  },
  {
    id: "creative",
    name: "creative",
    displayName: "Creative Bold",
    description:
      "Eye-catching design with creative elements. Great for design and marketing roles.",
    category: "creative",
  },
];

export function TemplateSelectionClient() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );
  const router = useRouter();

  const handleProceed = () => {
    if (selectedTemplateId) {
      router.push(`/resume/builder?template=${selectedTemplateId}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Header
        variant="blurred"
        showDashboardLink
        showProfileLink
        showSignOutButton
        isAuthenticated
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white">
            Choose Your Resume Template 📄
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Select a professional template that best represents your style and
            industry.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 md:grid-cols-3">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={`flex h-full cursor-pointer flex-col transition-all duration-200 hover:shadow-lg ${
                  selectedTemplateId === template.id
                    ? "shadow-lg ring-2 ring-blue-500"
                    : ""
                }`}
                onClick={() => setSelectedTemplateId(template.id)}
              >
                <CardHeader className="flex h-24 flex-shrink-0 items-center">
                  <div className="flex w-full items-center justify-between">
                    <CardTitle className="text-lg">
                      {template.displayName}
                    </CardTitle>
                    <Badge variant="secondary" className="capitalize">
                      {template.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-grow flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    {/* Template Preview */}
                    <div className="aspect-[8.5/11] rounded-lg border bg-white p-4 shadow-sm">
                      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                        <FileText className="h-16 w-16" />
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {template.description}
                    </p>
                  </div>

                  <Button
                    variant={
                      selectedTemplateId === template.id ? "default" : "outline"
                    }
                    size="sm"
                    className="mt-auto w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTemplateId(template.id);
                    }}
                  >
                    {selectedTemplateId === template.id ? "Selected" : "Select"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Proceed Button */}
          <div className="mt-8 text-center">
            <Button
              onClick={handleProceed}
              disabled={!selectedTemplateId}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              Continue with Template
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

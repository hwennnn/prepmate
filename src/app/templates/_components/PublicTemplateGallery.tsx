"use client";

import { ArrowRight, Sparkles, Download, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import type { RouterOutputs } from "~/trpc/react";

interface PublicTemplateGalleryProps {
  templates: RouterOutputs["resume"]["getTemplates"];
}

export function PublicTemplateGallery({
  templates,
}: PublicTemplateGalleryProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-slate-100">
          Professional Resume Templates
        </h1>
        <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-slate-300">
          Choose from our collection of professionally designed, ATS-friendly
          templates that help you stand out to employers and land your dream
          job.
        </p>
      </div>

      {/* Features Banner */}
      <div className="mb-12 rounded-lg border bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-3">
          <div className="flex flex-col items-center">
            <Sparkles className="mb-2 h-8 w-8 text-blue-600" />
            <h3 className="font-semibold text-gray-900 dark:text-slate-100">
              AI-Enhanced
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-300">
              Transform your content using the proven XYZ formula
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Eye className="mb-2 h-8 w-8 text-green-600" />
            <h3 className="font-semibold text-gray-900 dark:text-slate-100">
              Live Preview
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-300">
              See changes in real-time as you edit
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Download className="mb-2 h-8 w-8 text-purple-600" />
            <h3 className="font-semibold text-gray-900 dark:text-slate-100">
              Multiple Formats
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-300">
              Download PDF and get shareable links
            </p>
          </div>
        </div>
      </div>

      {/* Template Grid */}
      <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:hover:shadow-slate-800/50"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{template.name}</CardTitle>
                <Badge variant="secondary">Popular</Badge>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {template.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Image
                  src={`/template-previews/${template.id}.png`}
                  alt={`${template.name} resume template preview`}
                  width={600}
                  height={800}
                  className="h-auto w-full rounded-lg border transition-colors group-hover:border-blue-300 dark:border-slate-700 dark:group-hover:border-blue-500"
                  quality={95}
                  priority={false}
                />
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
                  ATS-Friendly Design
                </div>
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
                  Professional Layout
                </div>
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
                  Easy Customization
                </div>
              </div>

              <Button
                asChild
                className="w-full transition-colors group-hover:bg-blue-700 hover:bg-blue-700 dark:group-hover:bg-blue-600 dark:hover:bg-blue-600"
              >
                <Link href="/auth/signin?callbackUrl=/resume/templates">
                  Try This Template
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white">
        <h2 className="mb-4 text-3xl font-bold">
          Ready to Create Your Perfect Resume?
        </h2>
        <p className="mb-6 text-xl opacity-90">
          {
            "Join thousands of job seekers who've landed their dream jobs with PrepMate"
          }
        </p>
        <div className="space-x-4">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/auth/signin">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Template Credits */}
      <div className="mt-12 border-t border-gray-200 pt-8 dark:border-slate-700">
        <div className="text-center text-sm text-slate-600 dark:text-slate-300">
          <p className="mb-4">Template Credits:</p>
          <div className="flex flex-col items-center justify-evenly gap-4 sm:flex-row sm:gap-8">
            <span>
              Classic template by{" "}
              <a
                href="https://github.com/steadyfall/simple-technical-resume-template"
                className="text-blue-600 hover:underline"
              >
                Himank Dave{" "}
              </a>
            </span>
            <span>
              Modern template by{" "}
              <a
                href="https://github.com/stuxf/basic-typst-resume-template"
                className="text-blue-600 hover:underline"
              >
                stuxf
              </a>
            </span>
            <span>
              Creative template by{" "}
              <a
                href="https://github.com/elegaanz/vercanard"
                className="text-blue-600 hover:underline"
              >
                Ana Gelez
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

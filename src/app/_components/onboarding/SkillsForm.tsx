import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import type { OnboardingFormData } from "./types";

interface SkillsFormProps {
  register: UseFormRegister<OnboardingFormData>;
  errors: FieldErrors<OnboardingFormData>;
}

export function SkillsForm({ register, errors }: SkillsFormProps) {
  return (
    <Card className="border-slate-200 bg-white/50 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/50">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-white">
          Skills & Technologies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label
            htmlFor="languages"
            className="text-slate-700 dark:text-slate-300"
          >
            Programming Languages
          </Label>
          <Input
            id="languages"
            {...register("skills.languages")}
            placeholder="JavaScript, Python, Java, C++, TypeScript"
            className="bg-white dark:bg-slate-900"
          />
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Separate multiple languages with commas
          </p>
          {errors.skills?.languages && (
            <p className="mt-1 text-sm text-red-500">
              {errors.skills.languages.message}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="frameworks"
            className="text-slate-700 dark:text-slate-300"
          >
            Frameworks & Technologies
          </Label>
          <Textarea
            id="frameworks"
            {...register("skills.frameworks")}
            placeholder="React, Node.js, Express, PostgreSQL, Docker, AWS, Git"
            rows={3}
            className="bg-white dark:bg-slate-900"
          />
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Separate multiple technologies with commas
          </p>
          {errors.skills?.frameworks && (
            <p className="mt-1 text-sm text-red-500">
              {errors.skills.frameworks.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

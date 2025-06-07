import { CheckCircle, Plus, Trash2 } from "lucide-react";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { AchievementsField } from "./AchievementsField";
import type { FormData } from "./types";

interface ProjectsFormProps {
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  errors: FieldErrors<FormData>;
}

export function ProjectsForm({
  register,
  control,
  watch,
  setValue,
  errors,
}: ProjectsFormProps) {
  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control,
    name: "projects",
  });

  const addProject = () => {
    appendProject({
      name: "",
      description: "",
      url: "",
      achievements: [],
      technologies: "",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          Projects
        </h3>
        <Button
          type="button"
          onClick={addProject}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {projectFields.map((field, index) => (
        <Card
          key={field.id}
          className="border-slate-200 bg-white/50 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/50"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-slate-900 dark:text-white">
                Project #{index + 1}
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeProject(index)}
                className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-700 dark:text-slate-300">
                Project Name *
              </Label>
              <Input
                {...register(`projects.${index}.name`)}
                placeholder="E-commerce Platform"
                className="bg-white dark:bg-slate-900"
              />
              {errors.projects?.[index]?.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.projects[index]?.name?.message}
                </p>
              )}
            </div>

            <div>
              <Label className="text-slate-700 dark:text-slate-300">
                Description *
              </Label>
              <Textarea
                {...register(`projects.${index}.description`)}
                placeholder="A full-stack e-commerce platform built with modern technologies..."
                rows={3}
                className="bg-white dark:bg-slate-900"
              />
              {errors.projects?.[index]?.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.projects[index]?.description?.message}
                </p>
              )}
            </div>

            <div>
              <Label className="text-slate-700 dark:text-slate-300">
                Project URL
              </Label>
              <Input
                {...register(`projects.${index}.url`)}
                placeholder="https://github.com/yourname/project or https://liveproject.com"
                className="bg-white dark:bg-slate-900"
              />
              {errors.projects?.[index]?.url && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.projects[index]?.url?.message}
                </p>
              )}
            </div>

            <AchievementsField
              watch={watch}
              setValue={setValue}
              fieldKey={`projects.${index}.achievements`}
              errors={errors}
              placeholder="e.g., Built responsive UI with React"
            />

            <div>
              <Label className="text-slate-700 dark:text-slate-300">
                Technologies Used (comma-separated)
              </Label>
              <Input
                {...register(`projects.${index}.technologies`)}
                placeholder="React, Node.js, MongoDB, Stripe API"
                className="bg-white dark:bg-slate-900"
              />
              {errors.projects?.[index]?.technologies && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.projects[index]?.technologies?.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {projectFields.length === 0 && (
        <Card className="border-slate-200 bg-white/50 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/50">
          <CardContent className="py-12 text-center">
            <div className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <CheckCircle className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                  No projects yet
                </h3>
                <p className="mb-4 text-slate-600 dark:text-slate-400">
                  Showcase your personal projects
                </p>
                <Button
                  type="button"
                  onClick={addProject}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Project
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

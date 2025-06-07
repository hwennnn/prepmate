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
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { DatePicker } from "./DatePicker";
import type { FormData } from "./types";

interface ExperienceFormProps {
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  errors: FieldErrors<FormData>;
}

export function ExperienceForm({
  register,
  control,
  watch,
  setValue,
  errors,
}: ExperienceFormProps) {
  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experience",
  });

  const addExperience = () => {
    appendExperience({
      company: "",
      jobTitle: "",
      location: "",
      isCurrentJob: false,
      startDate: new Date(),
      endDate: undefined,
      achievements: "",
      technologies: "",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          Work Experience
        </h3>
        <Button
          type="button"
          onClick={addExperience}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>

      {experienceFields.map((field, index) => (
        <Card
          key={field.id}
          className="border-slate-200 bg-white/50 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/50"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-slate-900 dark:text-white">
                Experience #{index + 1}
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeExperience(index)}
                className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-700 dark:text-slate-300">
                  Company Name *
                </Label>
                <Input
                  {...register(`experience.${index}.company`)}
                  placeholder="Tech Company Inc."
                  className="bg-white dark:bg-slate-900"
                />
                {errors.experience?.[index]?.company && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.experience[index]?.company?.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-slate-700 dark:text-slate-300">
                  Job Title *
                </Label>
                <Input
                  {...register(`experience.${index}.jobTitle`)}
                  placeholder="Software Engineer"
                  className="bg-white dark:bg-slate-900"
                />
                {errors.experience?.[index]?.jobTitle && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.experience[index]?.jobTitle?.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label className="text-slate-700 dark:text-slate-300">
                Location
              </Label>
              <Input
                {...register(`experience.${index}.location`)}
                placeholder="San Francisco, CA"
                className="bg-white dark:bg-slate-900"
              />
              {errors.experience?.[index]?.location && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.experience[index]?.location?.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={watch(`experience.${index}.isCurrentJob`)}
                onCheckedChange={(checked) =>
                  setValue(`experience.${index}.isCurrentJob`, !!checked)
                }
              />
              <Label className="text-slate-700 dark:text-slate-300">
                Currently working here
              </Label>
              {errors.experience?.[index]?.isCurrentJob && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.experience[index]?.isCurrentJob?.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-700 dark:text-slate-300">
                  Start Date *
                </Label>
                <DatePicker
                  value={watch(`experience.${index}.startDate`)}
                  onChange={(date) =>
                    setValue(
                      `experience.${index}.startDate`,
                      date ?? new Date(),
                    )
                  }
                />
                {errors.experience?.[index]?.startDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.experience[index]?.startDate?.message}
                  </p>
                )}
              </div>
              {!watch(`experience.${index}.isCurrentJob`) && (
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">
                    End Date
                  </Label>
                  <DatePicker
                    value={watch(`experience.${index}.endDate`)}
                    onChange={(date) =>
                      setValue(`experience.${index}.endDate`, date)
                    }
                  />
                  {errors.experience?.[index]?.endDate && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.experience[index]?.endDate?.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <Label className="text-slate-700 dark:text-slate-300">
                Key Achievements
              </Label>
              <Textarea
                {...register(`experience.${index}.achievements`)}
                placeholder="• Increased system performance by 40%&#10;• Led team of 5 developers&#10;• Implemented new features"
                rows={4}
                className="bg-white dark:bg-slate-900"
              />
              {errors.experience?.[index]?.achievements && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.experience[index]?.achievements?.message}
                </p>
              )}
            </div>

            <div>
              <Label className="text-slate-700 dark:text-slate-300">
                Technologies Used (comma-separated)
              </Label>
              <Input
                {...register(`experience.${index}.technologies`)}
                placeholder="React, Node.js, TypeScript, PostgreSQL"
                className="bg-white dark:bg-slate-900"
              />
              {errors.experience?.[index]?.technologies && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.experience[index]?.technologies?.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {experienceFields.length === 0 && (
        <Card className="border-slate-200 bg-white/50 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/50">
          <CardContent className="py-12 text-center">
            <div className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <CheckCircle className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                  No work experience yet
                </h3>
                <p className="mb-4 text-slate-600 dark:text-slate-400">
                  Add your professional experience
                </p>
                <Button
                  type="button"
                  onClick={addExperience}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Experience
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

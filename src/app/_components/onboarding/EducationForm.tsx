import { CheckCircle, Plus, Trash2 } from "lucide-react";
import type {
  Control,
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

interface EducationFormProps {
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
}

export function EducationForm({
  register,
  control,
  watch,
  setValue,
}: EducationFormProps) {
  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  const addEducation = () => {
    appendEducation({
      institution: "",
      degree: "",
      isAttending: false,
      startDate: undefined,
      endDate: undefined,
      expectedGradDate: undefined,
      gpa: "",
      awards: "",
      coursework: "",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          Education
        </h3>
        <Button
          type="button"
          onClick={addEducation}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </div>

      {educationFields.map((field, index) => (
        <Card
          key={field.id}
          className="border-slate-200 bg-white/50 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/50"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-slate-900 dark:text-white">
                Education #{index + 1}
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeEducation(index)}
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
                  Institution Name *
                </Label>
                <Input
                  {...register(`education.${index}.institution`)}
                  placeholder="University of Example"
                  className="bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <Label className="text-slate-700 dark:text-slate-300">
                  Degree/Program *
                </Label>
                <Input
                  {...register(`education.${index}.degree`)}
                  placeholder="Bachelor in Computer Science"
                  className="bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={watch(`education.${index}.isAttending`)}
                onCheckedChange={(checked) =>
                  setValue(`education.${index}.isAttending`, !!checked)
                }
              />
              <Label className="text-slate-700 dark:text-slate-300">
                Currently attending
              </Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-700 dark:text-slate-300">
                  Start Date
                </Label>
                <DatePicker
                  value={watch(`education.${index}.startDate`)}
                  onChange={(date) =>
                    setValue(`education.${index}.startDate`, date)
                  }
                />
              </div>
              {!watch(`education.${index}.isAttending`) ? (
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">
                    End Date
                  </Label>
                  <DatePicker
                    value={watch(`education.${index}.endDate`)}
                    onChange={(date) =>
                      setValue(`education.${index}.endDate`, date)
                    }
                  />
                </div>
              ) : (
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">
                    Expected Graduation Date
                  </Label>
                  <DatePicker
                    value={watch(`education.${index}.expectedGradDate`)}
                    onChange={(date) =>
                      setValue(`education.${index}.expectedGradDate`, date)
                    }
                  />
                </div>
              )}
            </div>

            <div>
              <Label className="text-slate-700 dark:text-slate-300">GPA</Label>
              <Input
                {...register(`education.${index}.gpa`)}
                placeholder="3.8/4.0"
                className="bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <Label className="text-slate-700 dark:text-slate-300">
                Awards (comma-separated)
              </Label>
              <Input
                {...register(`education.${index}.awards`)}
                placeholder="Dean's List, Honors Graduate"
                className="bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <Label className="text-slate-700 dark:text-slate-300">
                Relevant Coursework (comma-separated)
              </Label>
              <Textarea
                {...register(`education.${index}.coursework`)}
                placeholder="Data Structures, Algorithms, Database Systems"
                rows={2}
                className="bg-white dark:bg-slate-900"
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {educationFields.length === 0 && (
        <Card className="border-slate-200 bg-white/50 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/50">
          <CardContent className="py-12 text-center">
            <div className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <CheckCircle className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                  No education entries yet
                </h3>
                <p className="mb-4 text-slate-600 dark:text-slate-400">
                  Add your educational background to strengthen your profile
                </p>
                <Button
                  type="button"
                  onClick={addEducation}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Education
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

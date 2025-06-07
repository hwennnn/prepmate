import { Plus, Trash2 } from "lucide-react";
import type {
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import type { FormData } from "./types";

interface AchievementsFieldProps {
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  fieldKey: string; // e.g., "experience.0.achievements" or "projects.1.achievements"
  errors: FieldErrors<FormData>;
  placeholder?: string;
}

export function AchievementsField({
  watch,
  setValue,
  fieldKey,
  errors,
  placeholder = "e.g., Increased system performance by 40%",
}: AchievementsFieldProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const achievements = (watch(fieldKey as any) as string[]) ?? [];

  const addAchievement = () => {
    const currentAchievements = achievements;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(fieldKey as any, [...currentAchievements, ""]);
  };

  const removeAchievement = (achievementIndex: number) => {
    const currentAchievements = achievements;
    const newAchievements = currentAchievements.filter(
      (_: string, index: number) => index !== achievementIndex,
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(fieldKey as any, newAchievements);
  };

  const updateAchievement = (achievementIndex: number, value: string) => {
    const currentAchievements = achievements;
    const newAchievements = [...currentAchievements];
    newAchievements[achievementIndex] = value;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(fieldKey as any, newAchievements);
  };

  // Extract error for a specific achievement index
  const getAchievementError = (achievementIndex: number) => {
    const achievementFieldKey = `${fieldKey}.${achievementIndex}`;
    const pathParts = achievementFieldKey.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let error: any = errors;
    for (const part of pathParts) {
      if (error && typeof error === "object") {
        const numberRegex = /^\d+$/;
        if (numberRegex.exec(part)) {
          // It's an array index
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          error = error[parseInt(part)];
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          error = error[part];
        }
      } else {
        return undefined;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return error;
  };

  // Extract error for the entire achievements array
  const getArrayFieldError = () => {
    const pathParts = fieldKey.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let error: any = errors;
    for (const part of pathParts) {
      if (error && typeof error === "object") {
        const numberRegex = /^\d+$/;
        if (numberRegex.exec(part)) {
          // It's an array index
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          error = error[parseInt(part)];
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          error = error[part];
        }
      } else {
        return undefined;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return error;
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const arrayFieldError = getArrayFieldError();

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Label className="text-slate-700 dark:text-slate-300">
          Key Achievements
        </Label>
        <Button
          type="button"
          onClick={addAchievement}
          size="sm"
          variant="outline"
          className="h-8 px-2 text-xs"
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Achievement
        </Button>
      </div>

      {achievements.length === 0 && (
        <div className="mb-2 text-sm text-slate-500 dark:text-slate-400">
          No achievements added yet. Click &quot;Add Achievement&quot; to get
          started.
        </div>
      )}

      <div className="space-y-2">
        {achievements.map((achievement: string, achievementIndex: number) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const achievementError = getAchievementError(achievementIndex);

          return (
            <div key={achievementIndex} className="space-y-1">
              <div className="flex items-center gap-2">
                <Textarea
                  value={achievement}
                  onChange={(e) =>
                    updateAchievement(achievementIndex, e.target.value)
                  }
                  placeholder={placeholder}
                  className="flex-1 bg-white dark:bg-slate-900"
                />
                <Button
                  type="button"
                  onClick={() => removeAchievement(achievementIndex)}
                  size="sm"
                  variant="outline"
                  className="h-10 w-10 border-red-300 p-0 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {achievementError && (
                <p className="text-sm text-red-500">
                  {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                  {achievementError?.message}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {arrayFieldError && (
        <p className="mt-1 text-sm text-red-500">
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
          {arrayFieldError?.message}
        </p>
      )}
    </div>
  );
}

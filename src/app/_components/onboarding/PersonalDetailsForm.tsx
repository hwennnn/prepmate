import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { FormData } from "./types";

interface PersonalDetailsFormProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

export function PersonalDetailsForm({
  register,
  errors,
}: PersonalDetailsFormProps) {
  return (
    <Card className="border-slate-200 bg-white/50 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/50">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-white">
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="firstName"
              className="text-slate-700 dark:text-slate-300"
            >
              First Name *
            </Label>
            <Input
              id="firstName"
              {...register("personalDetails.firstName")}
              placeholder="John"
              className="bg-white dark:bg-slate-900"
            />
            {errors.personalDetails?.firstName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.personalDetails.firstName.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="lastName"
              className="text-slate-700 dark:text-slate-300"
            >
              Last Name *
            </Label>
            <Input
              id="lastName"
              {...register("personalDetails.lastName")}
              placeholder="Doe"
              className="bg-white dark:bg-slate-900"
            />
            {errors.personalDetails?.lastName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.personalDetails.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
            Email *
          </Label>
          <Input
            id="email"
            {...register("personalDetails.email")}
            placeholder="john.doe@example.com"
            className="bg-white dark:bg-slate-900"
          />
          {errors.personalDetails?.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.personalDetails.email.message}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="phoneNumber"
            className="text-slate-700 dark:text-slate-300"
          >
            Phone Number
          </Label>
          <Input
            id="phoneNumber"
            {...register("personalDetails.phoneNumber")}
            placeholder="+1 (555) 123-4567"
            className="bg-white dark:bg-slate-900"
          />
          {errors.personalDetails?.phoneNumber && (
            <p className="mt-1 text-sm text-red-500">
              {errors.personalDetails.phoneNumber.message}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="website"
            className="text-slate-700 dark:text-slate-300"
          >
            Personal Website
          </Label>
          <Input
            id="website"
            {...register("personalDetails.website")}
            placeholder="https://yourwebsite.com"
            className="bg-white dark:bg-slate-900"
          />
          {errors.personalDetails?.website && (
            <p className="mt-1 text-sm text-red-500">
              {errors.personalDetails.website.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="linkedinUrl"
              className="text-slate-700 dark:text-slate-300"
            >
              LinkedIn URL
            </Label>
            <Input
              id="linkedinUrl"
              {...register("personalDetails.linkedinUrl")}
              placeholder="https://linkedin.com/in/yourname"
              className="bg-white dark:bg-slate-900"
            />
            {errors.personalDetails?.linkedinUrl && (
              <p className="mt-1 text-sm text-red-500">
                {errors.personalDetails.linkedinUrl.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="githubUrl"
              className="text-slate-700 dark:text-slate-300"
            >
              GitHub URL
            </Label>
            <Input
              id="githubUrl"
              {...register("personalDetails.githubUrl")}
              placeholder="https://github.com/yourname"
              className="bg-white dark:bg-slate-900"
            />
            {errors.personalDetails?.githubUrl && (
              <p className="mt-1 text-sm text-red-500">
                {errors.personalDetails.githubUrl.message}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

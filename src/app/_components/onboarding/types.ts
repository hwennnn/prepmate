import { z } from "zod";

// Form schemas
export const personalDetailsSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(20, "First name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(20, "Last name is too long"),
  email: z
    .string()
    .email("Invalid email address")
    .max(50, "Email address is too long"),
  phoneNumber: z.string().optional(),
  website: z.string().optional(),
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
});

export const educationSchema = z
  .object({
    institution: z
      .string()
      .min(1, "Institution name is required")
      .max(100, "Institution name is too long"),
    degree: z
      .string()
      .min(1, "Degree/Program name is required")
      .max(100, "Degree/Program name is too long"),
    isAttending: z.boolean(),
    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date({ required_error: "End date is required" }),
    gpa: z.string().optional(),
    awards: z.string().optional(),
    coursework: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate) return false;
      if (!data.endDate) return false;
      return data.startDate <= data.endDate;
    },
    {
      message: "Start date must be before or equal to end date",
      path: ["endDate"],
    },
  );

export const experienceSchema = z
  .object({
    company: z.string().min(1, "Company name is required"),
    jobTitle: z.string().min(1, "Job title is required"),
    location: z.string().min(1, "Location is required"),
    isCurrentJob: z.boolean(),
    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date().optional(),
    achievements: z
      .array(z.string().min(1, "Achievement must not be empty"))
      .min(1, "At least one achievement is required")
      .optional(),
    technologies: z.string().optional(),
  })
  .refine(
    (data) => {
      // If it's a current job, end date is not required
      if (data.isCurrentJob) return true;
      // If it's not a current job, end date is required
      return !!data.endDate;
    },
    {
      message: "End date is required for past positions",
      path: ["endDate"],
    },
  )
  .refine(
    (data) => {
      // Only validate date order if both dates exist
      if (!data.startDate || !data.endDate) return true;
      return data.startDate <= data.endDate;
    },
    {
      message: "Start date must be before or equal to end date",
      path: ["endDate"],
    },
  );

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  url: z.string().url().optional(),
  achievements: z
    .array(z.string().min(1, "Achievement must not be empty"))
    .optional(),
  technologies: z.string().optional(),
});

export const skillsSchema = z.object({
  languages: z.string().optional(),
  frameworks: z.string().optional(),
});

export const completeProfileSchema = z.object({
  personalDetails: personalDetailsSchema,
  education: z.array(educationSchema).optional(),
  experience: z.array(experienceSchema).optional(),
  projects: z.array(projectSchema).optional(),
  skills: skillsSchema.optional(),
});

export type FormData = z.infer<typeof completeProfileSchema>;
export type PersonalDetails = z.infer<typeof personalDetailsSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Skills = z.infer<typeof skillsSchema>;

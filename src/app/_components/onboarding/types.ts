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
  website: z.string().optional().or(z.literal("")),
  linkedinUrl: z.string().optional().or(z.literal("")),
  githubUrl: z.string().optional().or(z.literal("")),
});

export const educationSchema = z.object({
  institution: z
    .string()
    .min(1, "Institution name is required")
    .max(100, "Institution name is too long"),
  degree: z
    .string()
    .min(1, "Degree/Program name is required")
    .max(100, "Degree/Program name is too long"),
  isAttending: z.boolean(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  expectedGradDate: z.date().optional(),
  gpa: z.string().optional(),
  awards: z.string().optional(),
  coursework: z.string().optional(),
});

export const experienceSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  location: z.string().min(1, "Location is required"),
  isCurrentJob: z.boolean(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  achievements: z
    .array(z.string().min(1, "Achievement must not be empty"))
    .min(1, "At least one achievement is required")
    .optional(),
  technologies: z.string().optional(),
});

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  url: z.string().url().optional().or(z.literal("")),
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

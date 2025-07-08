import { z } from "zod";
import { completeProfileSchema } from "~/app/_components/onboarding/types";
import { compileResume } from "~/lib/typst-compiler";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const resumeRouter = createTRPCRouter({
  // Get available templates
  getTemplates: protectedProcedure.query(async ({ ctx }) => {
    const templates = await ctx.db.template.findMany({
      select: { id: true, name: true, description: true },
      orderBy: { name: "asc" },
    });
    return templates;
  }),

  // Get All resumes for specific user
  // - Maybe just include resume field in getProfile procedure in onboarding.ts
  getResumes: protectedProcedure.query(async ({ ctx }) => {
    const resumes = await ctx.db.userProfile.findUnique({
      where: { userId: ctx.session.user.id },
      select: { resume: true },
    });
    return resumes;
  }),

  // Get resume by resume id
  getResume: protectedProcedure
    .input(z.object({ resumeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const resume = await ctx.db.resume.findUnique({
        where: {
          id: input.resumeId,
          profileId: ctx.session.user.id, // Security: only user's resumes
        },
        include: {
          template: true,
          education: true,
          experience: true,
          projects: true,
          skills: true,
          profile: true,
        },
      });
      // Resume null check
      if (!resume) {
        throw new Error("Resume not found");
      }

      return resume;
    }),

  // Save resume (for edits and update)
  saveResume: protectedProcedure
    .input(
      z.object({
        templateId: z.string(),
        formData: completeProfileSchema,
        resumeId: z.string().optional(), // If provided = update, if not = create
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { templateId, formData, resumeId } = input;
      const userId = ctx.session.user.id;
      /*
       * Logic:
       * 1. Check if it is update (resumeId nullcheck)
       * 2. Upsert (Update or Insert )
       * 		2a. If resumeId exists, update where resumeId, userId
       * 		2b. Else create
       */
      if (resumeId) {
        // Update Exisiting Resume Entry
        const resume = await ctx.db.resume.update({
          where: {
            id: resumeId,
            profileId: userId, // Security: only user's resumes
          },
          data: {
            id: templateId,
            profileId: userId,
            education: {
              deleteMany: {}, // delete existing data
              create:
                formData.education?.map((edu) => ({
                  // resumeId: resumeId,
                  institution: edu.institution,
                  degree: edu.degree,
                  isAttending: edu.isAttending,
                  startDate: edu.startDate,
                  endDate: edu.endDate,
                  gpa: edu.gpa,
                  awards: edu.awards,
                  coursework: edu.coursework,
                })) ?? [],
            },
            experience: {
              deleteMany: {}, // delete existing
              create:
                formData.experience?.map((exp) => ({
                  // resumeId: resumeId,
                  company: exp.company,
                  jobTitle: exp.jobTitle,
                  location: exp.location,
                  isCurrentJob: exp.isCurrentJob,
                  startDate: exp.startDate,
                  endDate: exp.endDate,
                  achievements: exp.achievements ?? [],
                  technologies: exp.technologies,
                })) ?? [],
            },
            projects: {
              deleteMany: {}, // delete existing
              create:
                formData.projects?.map((proj) => ({
                  // resumeId: resumeId,
                  name: proj.name,
                  description: proj.description,
                  url: proj.url,
                  achievements: proj.achievements ?? [],
                  technologies: proj.technologies,
                })) ?? [],
            },
            skills: formData.skills
              ? {
                  upsert: {
                    create: {
                      languages: formData.skills.languages,
                      frameworks: formData.skills.frameworks,
                    },
                    update: {
                      languages: formData.skills.languages,
                      frameworks: formData.skills.frameworks,
                    },
                  },
                }
              : undefined,
          },
        });

        return resume;
      } else {
        // Create new resume entry
        const resume = await ctx.db.resume.create({
          data: {
            templateId: templateId,
            profileId: userId,
            education: {
              create:
                formData.education?.map((edu) => ({
                  institution: edu.institution,
                  degree: edu.degree,
                  isAttending: edu.isAttending,
                  startDate: edu.startDate,
                  endDate: edu.endDate,
                  gpa: edu.gpa,
                  awards: edu.awards,
                  coursework: edu.coursework,
                })) ?? [],
            },
            experience: {
              create:
                formData.experience?.map((exp) => ({
                  company: exp.company,
                  jobTitle: exp.jobTitle,
                  location: exp.location,
                  isCurrentJob: exp.isCurrentJob,
                  startDate: exp.startDate,
                  endDate: exp.endDate,
                  achievements: exp.achievements ?? [],
                  technologies: exp.technologies,
                })) ?? [],
            },
            projects: {
              create:
                formData.projects?.map((proj) => ({
                  name: proj.name,
                  description: proj.description,
                  url: proj.url,
                  achievements: proj.achievements ?? [],
                  technologies: proj.technologies,
                })) ?? [],
            },
            skills: formData.skills
              ? {
                  create: {
                    languages: formData.skills.languages,
                    frameworks: formData.skills.frameworks,
                  },
                }
              : undefined,
          },
        });

        return resume;
      }
    }),

  // Export PDF from builder
  exportLivePDF: protectedProcedure
    .input(
      z.object({
        formData: completeProfileSchema,
        templateId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const pdfBuffer = await compileResume({
        formData: input.formData,
        templateId: input.templateId,
      });

      if (!pdfBuffer) {
        throw new Error("PDF generation failed");
      }

      return {
        pdf: Buffer.from(pdfBuffer).toString("base64"), // encode the buffer as b64 string
        filename: `${ctx.session.user.id}-${input.templateId}.pdf`,
      };
    }),

  // Export PDF from saved resume
});

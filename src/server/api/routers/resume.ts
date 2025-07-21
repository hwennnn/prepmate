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
  getResumes: protectedProcedure.query(async ({ ctx }) => {
    // Get user profile associated with session
    const userProfile = await ctx.db.userProfile.findUnique({
      where: { userId: ctx.session.user.id },
      select: { id: true },
    });

    if (!userProfile) {
      throw new Error("No such user found");
    }

    // Get resume associated with user
    const resumes = await ctx.db.resume.findMany({
      where: { profileId: userProfile.id },
      include: {
        template: {
          select: { id: true, name: true, description: true },
        },
      },
      orderBy: { id: "desc" },
    });
    return resumes;
  }),

  // Get resume by resume id
  getResume: protectedProcedure
    .input(z.object({ resumeId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Get user profile associated with session
      const userProfile = await ctx.db.userProfile.findUnique({
        where: {
          userId: ctx.session.user.id,
        },
      });

      if (!userProfile) {
        throw new Error("No such user found");
      }

      // Get specific resume by resumeId
      const resume = await ctx.db.resume.findUnique({
        where: {
          id: input.resumeId,
          profileId: userProfile.id, // Security: only user's resumes
        },
        include: {
          template: true,
          education: true,
          experience: true,
          projects: true,
          skills: true,
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
        resumeName: z.string(),
        personalDetails: z.object({
          firstName: z.string(),
          lastName: z.string(),
          email: z.string(),
          phoneNumber: z.string().optional(),
          website: z.string().optional(),
          linkedinUrl: z.string().optional(),
          githubUrl: z.string().optional(),
        }),
        formData: completeProfileSchema,
        resumeId: z.string().optional(), // If provided = update, if not = create
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { templateId, resumeName, personalDetails, formData, resumeId } =
        input;
      // Get user profile associated with session
      const userProfile = await ctx.db.userProfile.findUnique({
        where: { userId: ctx.session.user.id },
        select: { id: true },
      });

      if (!userProfile) {
        throw new Error("User not found");
      }
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
            profileId: userProfile.id, // Security: only user's resumes
          },
          data: {
            templateId: templateId, // for updates, just assign templateId
            resumeName: resumeName,
            firstName: personalDetails.firstName,
            lastName: personalDetails.lastName,
            email: personalDetails.email,
            phoneNumber: personalDetails.phoneNumber,
            website: personalDetails.website,
            linkedinUrl: personalDetails.linkedinUrl,
            githubUrl: personalDetails.githubUrl,
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
          include: {
            template: true,
            education: true,
            experience: true,
            projects: true,
            skills: true,
            profile: true,
          },
        });

        return resume;
      } else {
        // Create new resume entry
        const resume = await ctx.db.resume.create({
          data: {
            templateId: templateId,
            profileId: userProfile.id,
            resumeName: resumeName,
            firstName: personalDetails.firstName,
            lastName: personalDetails.lastName,
            email: personalDetails.email,
            phoneNumber: personalDetails.phoneNumber,
            website: personalDetails.website,
            linkedinUrl: personalDetails.linkedinUrl,
            githubUrl: personalDetails.githubUrl,
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
          include: {
            template: true,
          },
        });

        return resume;
      }
    }),

  // Delete resume by id
  deleteResume: protectedProcedure
    .input(
      z.object({
        resumeId: z.string(), // Required, not optional
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { resumeId } = input;
      // Get user profile associated with session
      const userProfile = await ctx.db.userProfile.findUnique({
        where: { userId: ctx.session.user.id },
        select: { id: true },
      });

      if (!userProfile) {
        throw new Error("User not found");
      }

      // Security: Only delete if resume belongs to this user
      await ctx.db.resume.delete({
        where: {
          id: resumeId,
          profileId: userProfile.id, // Security check
        },
      });

      return { success: true, deletedId: resumeId };
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

import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { completeProfileSchema } from "~/app/_components/onboarding/types";
import { compileResume, compileResumeToSVG } from "~/lib/typst-compiler";
import { generateSlug } from "~/lib/slug";

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

  // Create minimal resume after template selection
  createResume: protectedProcedure
    .input(z.object({ templateId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { templateId } = input;

      // Get user profile associated with session
      const userProfile = await ctx.db.userProfile.findUnique({
        where: { userId: ctx.session.user.id },
        include: {
          education: true,
          experience: true,
          projects: true,
          skills: true,
        },
      });

      if (!userProfile) {
        throw new Error("User profile not found");
      }

      // Create resume with profile data as starting point
      const resume = await ctx.db.resume.create({
        data: {
          templateId: templateId,
          profileId: userProfile.id,
          resumeName: `${userProfile.firstName} ${userProfile.lastName} Resume`,
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          email: userProfile.email,
          phoneNumber: userProfile.phoneNumber,
          website: userProfile.website,
          linkedinUrl: userProfile.linkedinUrl,
          githubUrl: userProfile.githubUrl,
          education: {
            create: userProfile.education.map((edu) => ({
              institution: edu.institution,
              degree: edu.degree,
              isAttending: edu.isAttending,
              startDate: edu.startDate,
              endDate: edu.endDate,
              gpa: edu.gpa,
              awards: edu.awards,
              coursework: edu.coursework,
            })),
          },
          experience: {
            create: userProfile.experience.map((exp) => ({
              company: exp.company,
              jobTitle: exp.jobTitle,
              location: exp.location,
              isCurrentJob: exp.isCurrentJob,
              startDate: exp.startDate,
              endDate: exp.endDate,
              achievements: exp.achievements,
              technologies: exp.technologies,
            })),
          },
          projects: {
            create: userProfile.projects.map((proj) => ({
              name: proj.name,
              description: proj.description,
              url: proj.url,
              achievements: proj.achievements,
              technologies: proj.technologies,
            })),
          },
          skills: userProfile.skills
            ? {
                create: {
                  languages: userProfile.skills.languages,
                  frameworks: userProfile.skills.frameworks,
                },
              }
            : undefined,
        },
      });

      // Create PublicResume entry (default private)
      const baseSlug = generateSlug(
        userProfile.firstName,
        userProfile.lastName,
      );
      let finalSlug = baseSlug;
      let counter = 1;

      // Check for slug conflicts
      while (true) {
        const slugTaken = await ctx.db.publicResume.findUnique({
          where: { slug: finalSlug },
        });

        if (!slugTaken) break;

        finalSlug = `${baseSlug}-${counter}`;
        counter = counter + 1;
      }

      // Create PublicResume entry
      await ctx.db.publicResume.create({
        data: {
          resumeId: resume.id,
          slug: finalSlug,
          viewCount: 0,
        },
      });

      return {
        success: true,
        resumeId: resume.id,
        templateId: templateId,
      };
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

  // Public Resume Procedures

  // Procedure to get the resume data from slug url
  // input: slug parameter
  // output: resume data, view count, slug, private preview boolean
  getPublicResume: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const publicResume = await ctx.db.publicResume.findUnique({
        where: { slug: input.slug },
        include: {
          resume: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              isPublic: true,
              profile: {
                // required for checking if user is owner
                select: { userId: true },
              },
            },
          },
        },
      });

      if (!publicResume) {
        throw new Error("Resume not found!");
      }

      // Access control - Accessible only if :
      // 1. Resume is Public
      // 2. Viewer is the owner
      const isOwner =
        ctx.session?.user.id === publicResume.resume.profile.userId;
      if (!publicResume.resume.isPublic && !isOwner) {
        throw new Error("Resume is private.");
      }

      // View count management - Increment only for public views
      let currViewCount = publicResume.viewCount;
      if (publicResume.resume.isPublic && !isOwner) {
        // update database
        const updatedPublicResume = await ctx.db.publicResume.update({
          where: { id: publicResume.id },
          data: { viewCount: { increment: 1 } },
        });
        currViewCount = updatedPublicResume.viewCount;
      }

      return {
        resume: publicResume.resume,
        viewCount: currViewCount,
        slug: publicResume.slug,
        isPrivatePreview: !publicResume.resume.isPublic && isOwner,
      };
    }),

  // Procedure to compile resume and return buffer
  // input: slug, resumeId
  // output: svgData
  getPublicResumeSVG: publicProcedure
    .input(z.object({ slug: z.string(), resumeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const publicResume = await ctx.db.publicResume.findUnique({
        where: { slug: input.slug },
        include: {
          resume: {
            include: {
              template: true,
              education: true,
              experience: true,
              projects: true,
              skills: true,
              profile: {
                select: { userId: true },
              },
            },
          },
        },
      });

      if (!publicResume) {
        throw new Error("Resume not found");
      }

      if (publicResume.resume.id != input.resumeId) {
        throw new Error("Resume mismatch!");
      }

      const { resume } = publicResume;

      // Access Control
      const isOwner = ctx.session?.user.id === resume.profile.userId;
      if (!resume.isPublic && !isOwner) {
        throw new Error("Resume is private.");
      }

      // Format resume data
      const formData = {
        personalDetails: {
          firstName: resume.firstName,
          lastName: resume.lastName,
          email: resume.email,
          phoneNumber: resume.phoneNumber ?? undefined,
          website: resume.website ?? undefined,
          linkedinUrl: resume.linkedinUrl ?? undefined,
          githubUrl: resume.githubUrl ?? undefined,
        },
        education: resume.education.map((edu) => ({
          institution: edu.institution,
          degree: edu.degree,
          isAttending: edu.isAttending,
          startDate: edu.startDate,
          endDate: edu.endDate,
          gpa: edu.gpa ?? undefined,
          awards: edu.awards ?? undefined,
          coursework: edu.coursework ?? undefined,
        })),
        experience: resume.experience.map((exp) => ({
          company: exp.company,
          jobTitle: exp.jobTitle,
          location: exp.location,
          isCurrentJob: exp.isCurrentJob,
          startDate: exp.startDate,
          endDate: exp.endDate ?? undefined,
          achievements: exp.achievements,
          technologies: exp.technologies ?? undefined,
        })),
        projects: resume.projects.map((proj) => ({
          name: proj.name,
          description: proj.description,
          url: proj.url ?? undefined,
          achievements: proj.achievements,
          technologies: proj.technologies ?? undefined,
        })),
        skills: resume.skills
          ? {
              languages: resume.skills.languages ?? undefined,
              frameworks: resume.skills.frameworks ?? undefined,
            }
          : undefined,
      };

      // Compile Reusme Data into SVG buffer
      const svgBuffer = await compileResumeToSVG({
        formData,
        templateId: resume.templateId,
      });

      if (!svgBuffer) {
        throw new Error("Compilation to SVG Buffer failed.");
      }

      return svgBuffer;
    }),

  // Procedure to download public resume as pdf
  // input:
  downloadPublicResumePDF: publicProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const publicResume = await ctx.db.publicResume.findUnique({
        where: { slug: input.slug },
        include: {
          resume: {
            include: {
              template: true,
              education: true,
              experience: true,
              projects: true,
              skills: true,
              profile: {
                select: { userId: true },
              },
            },
          },
        },
      });

      if (!publicResume) {
        throw new Error("Resume not found.");
      }

      const { resume } = publicResume;

      // Access Control
      const isOwner = ctx.session?.user.id === resume.profile.userId;
      if (!resume.isPublic && !isOwner) {
        throw new Error("Resume is private.");
      }

      // Format resume data
      const formData = {
        personalDetails: {
          firstName: resume.firstName,
          lastName: resume.lastName,
          email: resume.email,
          phoneNumber: resume.phoneNumber ?? undefined,
          website: resume.website ?? undefined,
          linkedinUrl: resume.linkedinUrl ?? undefined,
          githubUrl: resume.githubUrl ?? undefined,
        },
        education: resume.education.map((edu) => ({
          institution: edu.institution,
          degree: edu.degree,
          isAttending: edu.isAttending,
          startDate: edu.startDate,
          endDate: edu.endDate,
          gpa: edu.gpa ?? undefined,
          awards: edu.awards ?? undefined,
          coursework: edu.coursework ?? undefined,
        })),
        experience: resume.experience.map((exp) => ({
          company: exp.company,
          jobTitle: exp.jobTitle,
          location: exp.location,
          isCurrentJob: exp.isCurrentJob,
          startDate: exp.startDate,
          endDate: exp.endDate ?? undefined,
          achievements: exp.achievements,
          technologies: exp.technologies ?? undefined,
        })),
        projects: resume.projects.map((proj) => ({
          name: proj.name,
          description: proj.description,
          url: proj.url ?? undefined,
          achievements: proj.achievements,
          technologies: proj.technologies ?? undefined,
        })),
        skills: resume.skills
          ? {
              languages: resume.skills.languages ?? undefined,
              frameworks: resume.skills.frameworks ?? undefined,
            }
          : undefined,
      };

      const pdfBuffer = await compileResume({
        formData,
        templateId: resume.templateId,
      });

      if (!pdfBuffer) {
        throw new Error("PDF generation failed");
      }

      return {
        pdf: Buffer.from(pdfBuffer).toString("base64"),
        filename: `${resume.firstName}-${resume.lastName}-Resume.pdf`,
      };
    }),
  // Procedure to check Slug availability [ NOT NEEDED ATM ]

  // Procedure to toggle public/private status
  // input: resumeId, isPublic (current state)
  togglePublic: protectedProcedure
    .input(
      z.object({
        resumeId: z.string(),
        isPublic: z.boolean(), // Current state from frontend
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { resumeId, isPublic } = input;

      // Get user profile id associated with session
      const userProfile = await ctx.db.userProfile.findUnique({
        where: { userId: ctx.session.user.id },
        select: { id: true },
      });

      if (!userProfile) {
        throw new Error("User not found!");
      }

      // Use transaction for data consistency
      const result = await ctx.db.$transaction(async (tx) => {
        // Backend controls the toggle logic - single source of truth
        const updatedResume = await tx.resume.update({
          where: {
            id: resumeId,
            profileId: userProfile.id, // Security: only user's resumes
          },
          data: { isPublic: !isPublic }, // Backend flips the state
        });

        // Get the associated PublicResume slug
        const publicResume = await tx.publicResume.findUnique({
          where: { resumeId: resumeId },
          select: { slug: true },
        });

        if (!publicResume) {
          throw new Error(
            "PublicResume entry not found. This resume may not be properly configured.",
          );
        }

        return {
          success: true,
          isPublic: updatedResume.isPublic, // Return the new state
          slug: publicResume.slug,
        };
      });

      return result;
    }),

  // Procedure to get resume analytics
  // input: resumeId
  // output: isPublic, slug, viewCount
  getPublicResumeAnalytics: protectedProcedure
    .input(z.object({ resumeId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Get user profile id associated with session
      const userProfile = await ctx.db.userProfile.findUnique({
        where: { userId: ctx.session.user.id },
        select: { id: true },
      });

      if (!userProfile) {
        throw new Error("User not found!");
      }

      const resume = await ctx.db.resume.findUnique({
        where: {
          id: input.resumeId,
          profileId: userProfile.id,
        },
        include: {
          PublicResume: true,
        },
      });

      if (!resume) {
        throw new Error("Resume not found.");
      }

      if (!resume.PublicResume) {
        throw new Error("Resume hosting url not found.");
      }

      return {
        isPublic: resume.isPublic,
        slug: resume.PublicResume.slug,
        viewCount: resume.PublicResume.viewCount,
      };
    }),
});

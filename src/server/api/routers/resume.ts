import { z } from "zod";
import { completeProfileSchema } from "~/app/_components/onboarding/types";
import { enhanceBulletPoints } from "~/lib/gemini";
import { generateSlug } from "~/lib/slug";
import { compileResume, compileResumeToSVG } from "~/lib/typst-compiler";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const resumeRouter = createTRPCRouter({
  // Get available templates
  getTemplates: publicProcedure.query(async ({ ctx }) => {
    const templates = await ctx.db.template.findMany({
      select: { id: true, name: true, description: true },
      orderBy: { name: "asc" },
    });
    return templates;
  }),

  // Get All resumes for specific user
  getResumes: protectedProcedure.query(async ({ ctx }) => {
    // Get all user profiles associated with session
    const userProfiles = await ctx.db.userProfile.findMany({
      where: { userId: ctx.session.user.id },
      select: { id: true },
    });

    if (userProfiles.length === 0) {
      throw new Error("No profiles found for user");
    }

    const profileIds = userProfiles.map((profile) => profile.id);

    // Get resumes associated with any of the user's profiles
    const resumes = await ctx.db.resume.findMany({
      where: { profileId: { in: profileIds } },
      include: {
        template: {
          select: { id: true, name: true, description: true },
        },
        profile: {
          select: {
            id: true,
            profileName: true,
            isDefault: true,
            firstName: true,
            lastName: true,
          },
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
      // Get specific resume by resumeId and verify it belongs to the user
      const resume = await ctx.db.resume.findUnique({
        where: {
          id: input.resumeId,
        },
        include: {
          template: true,
          education: true,
          experience: true,
          projects: true,
          skills: true,
          profile: {
            select: { userId: true }, // Only need userId for security check
          },
        },
      });

      // Resume not found
      if (!resume) {
        throw new Error("Resume not found");
      }

      // Security check: ensure the resume belongs to the current user
      if (resume.profile.userId !== ctx.session.user.id) {
        throw new Error("Resume not found"); // Don't reveal that it exists
      }

      return resume;
    }),

  // Create minimal resume after template selection
  createResume: protectedProcedure
    .input(
      z.object({
        templateId: z.string(),
        profileId: z.string().optional(), // Optional profile ID, defaults to default profile
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { templateId, profileId } = input;

      // Get the profile to use (specified or default)
      let userProfile;
      if (profileId) {
        userProfile = await ctx.db.userProfile.findFirst({
          where: {
            id: profileId,
            userId: ctx.session.user.id, // Security: only user's profiles
          },
          include: {
            education: true,
            experience: true,
            projects: true,
            skills: true,
          },
        });
      } else {
        // Use default profile
        userProfile = await ctx.db.userProfile.findFirst({
          where: {
            userId: ctx.session.user.id,
            isDefault: true,
          },
          include: {
            education: true,
            experience: true,
            projects: true,
            skills: true,
          },
        });
      }

      if (!userProfile) {
        throw new Error("Profile not found");
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

      // Verify the resume belongs to the user
      const existingResume = await ctx.db.resume.findUnique({
        where: { id: resumeId },
        include: {
          profile: {
            select: { userId: true },
          },
        },
      });

      if (!existingResume) {
        throw new Error("Resume not found");
      }

      // Security check: ensure the resume belongs to the current user
      if (existingResume.profile.userId !== ctx.session.user.id) {
        throw new Error("Resume not found");
      }

      // Update Existing Resume Entry
      const resume = await ctx.db.resume.update({
        where: {
          id: resumeId,
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

      // Verify the resume exists and belongs to the user
      const existingResume = await ctx.db.resume.findUnique({
        where: { id: resumeId },
        include: {
          profile: {
            select: { userId: true },
          },
        },
      });

      if (!existingResume) {
        throw new Error("Resume not found");
      }

      // Security check: ensure the resume belongs to the current user
      if (existingResume.profile.userId !== ctx.session.user.id) {
        throw new Error("Resume not found");
      }

      // Delete the resume
      await ctx.db.resume.delete({
        where: { id: resumeId },
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
  // input: slug parameter, countView boolean (default true)
  // output: resume data, view count, slug, private preview boolean
  getPublicResume: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        countView: z.boolean().default(true),
      }),
    )
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

      // View count management - Increment only for public views and when countView is true
      let currViewCount = publicResume.viewCount;
      if (input.countView && publicResume.resume.isPublic && !isOwner) {
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
  togglePublic: protectedProcedure
    .input(
      z.object({
        resumeId: z.string(),
        isPublic: z.boolean(), // Current state from frontend
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { resumeId, isPublic } = input;

      // Verify the resume exists and belongs to the user
      const existingResume = await ctx.db.resume.findUnique({
        where: { id: resumeId },
        include: {
          profile: {
            select: { userId: true },
          },
        },
      });

      if (!existingResume) {
        throw new Error("Resume not found");
      }

      // Security check: ensure the resume belongs to the current user
      if (existingResume.profile.userId !== ctx.session.user.id) {
        throw new Error("Resume not found");
      }

      // Use transaction for data consistency
      const result = await ctx.db.$transaction(async (tx) => {
        // Backend controls the toggle logic - single source of truth
        const updatedResume = await tx.resume.update({
          where: { id: resumeId },
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
      // Verify the resume exists and belongs to the user
      const resume = await ctx.db.resume.findUnique({
        where: { id: input.resumeId },
        include: {
          PublicResume: true,
          profile: {
            select: { userId: true },
          },
        },
      });

      if (!resume) {
        throw new Error("Resume not found");
      }

      // Security check: ensure the resume belongs to the current user
      if (resume.profile.userId !== ctx.session.user.id) {
        throw new Error("Resume not found");
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

  getDashBoardAnalytics: protectedProcedure
    .input(z.object({ profileId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      let whereClause;

      if (input.profileId) {
        // Get resumes for specific profile
        // First verify the profile belongs to the user
        const profile = await ctx.db.userProfile.findFirst({
          where: {
            id: input.profileId,
            userId: ctx.session.user.id,
          },
        });

        if (!profile) {
          throw new Error("Profile not found");
        }

        whereClause = {
          profileId: input.profileId,
        };
      } else {
        // Get resumes for all user's profiles
        const userProfiles = await ctx.db.userProfile.findMany({
          where: { userId: ctx.session.user.id },
          select: { id: true },
        });

        whereClause = {
          profileId: { in: userProfiles.map((p) => p.id) },
        };
      }

      const resumes = await ctx.db.resume.findMany({
        where: whereClause,
        include: {
          PublicResume: { select: { viewCount: true } },
        },
      });

      const totalViews = resumes.reduce(
        (sum, curr) => sum + (curr.PublicResume?.viewCount ?? 0),
        0,
      );

      return {
        totalViews: totalViews,
        numberOfResumes: resumes.length,
      };
    }),

  // Enhance bullet points with AI
  enhanceBulletPoints: protectedProcedure
    .input(
      z.object({
        bulletPoints: z
          .array(z.string())
          .min(1, "At least one bullet point is required"),
        context: z.object({
          type: z.enum(["experience", "project"]),
          title: z.string().min(1, "Title is required"),
          company: z.string().optional(),
          description: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      const { bulletPoints, context } = input;

      // Filter out empty bullet points
      const validBulletPoints = bulletPoints.filter(
        (point) => point.trim().length > 0,
      );

      if (validBulletPoints.length === 0) {
        throw new Error("No valid bullet points to enhance");
      }

      try {
        const enhancedPoints = await enhanceBulletPoints({
          bulletPoints: validBulletPoints,
          context,
        });

        return {
          original: validBulletPoints,
          enhanced: enhancedPoints,
        };
      } catch (error) {
        console.error("Error in enhanceBulletPoints procedure:", error);
        throw new Error("Failed to enhance bullet points. Please try again.");
      }
    }),
});

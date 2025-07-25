import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  // Get all profiles for the current user
  getProfiles: protectedProcedure.query(async ({ ctx }) => {
    const profiles = await ctx.db.userProfile.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        education: {
          orderBy: { startDate: "desc" },
        },
        experience: {
          orderBy: { startDate: "desc" },
        },
        projects: {
          orderBy: { createdAt: "desc" },
        },
        skills: true,
      },
      orderBy: [
        { isDefault: "desc" }, // Default profile first
        { createdAt: "asc" }, // Then by creation date
      ],
    });

    return profiles;
  }),

  // Get a specific profile by ID
  getProfile: protectedProcedure
    .input(z.object({ profileId: z.string() }))
    .query(async ({ ctx, input }) => {
      const profile = await ctx.db.userProfile.findFirst({
        where: {
          id: input.profileId,
          userId: ctx.session.user.id, // Security: only user's profiles
        },
        include: {
          education: {
            orderBy: { startDate: "desc" },
          },
          experience: {
            orderBy: { startDate: "desc" },
          },
          projects: {
            orderBy: { createdAt: "desc" },
          },
          skills: true,
        },
      });

      if (!profile) {
        throw new Error("Profile not found");
      }

      return profile;
    }),

  // Get the default profile for the current user
  getDefaultProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.userProfile.findFirst({
      where: {
        userId: ctx.session.user.id,
        isDefault: true,
      },
      include: {
        education: {
          orderBy: { startDate: "desc" },
        },
        experience: {
          orderBy: { startDate: "desc" },
        },
        projects: {
          orderBy: { createdAt: "desc" },
        },
        skills: true,
      },
    });

    return profile;
  }),

  // Create a new profile based on the default profile
  createProfile: protectedProcedure
    .input(
      z.object({
        profileName: z.string().min(1, "Profile name is required"),
        baseProfileId: z.string().optional(), // If not provided, use default profile
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { profileName, baseProfileId } = input;

      // Get the base profile to copy from
      let baseProfile;
      if (baseProfileId) {
        baseProfile = await ctx.db.userProfile.findFirst({
          where: {
            id: baseProfileId,
            userId: ctx.session.user.id, // Security check
          },
          include: {
            education: true,
            experience: true,
            projects: true,
            skills: true,
          },
        });
      } else {
        // Use default profile as base
        baseProfile = await ctx.db.userProfile.findFirst({
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

      if (!baseProfile) {
        throw new Error("Base profile not found");
      }

      // Create new profile with data from base profile
      const newProfile = await ctx.db.userProfile.create({
        data: {
          userId: ctx.session.user.id,
          profileName: profileName,
          isDefault: false, // New profiles are never default
          firstName: baseProfile.firstName,
          lastName: baseProfile.lastName,
          email: baseProfile.email,
          phoneNumber: baseProfile.phoneNumber,
          website: baseProfile.website,
          linkedinUrl: baseProfile.linkedinUrl,
          githubUrl: baseProfile.githubUrl,
          education: {
            create: baseProfile.education.map((edu) => ({
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
            create: baseProfile.experience.map((exp) => ({
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
            create: baseProfile.projects.map((proj) => ({
              name: proj.name,
              description: proj.description,
              url: proj.url,
              achievements: proj.achievements,
              technologies: proj.technologies,
            })),
          },
          skills: baseProfile.skills
            ? {
                create: {
                  languages: baseProfile.skills.languages,
                  frameworks: baseProfile.skills.frameworks,
                },
              }
            : undefined,
        },
        include: {
          education: true,
          experience: true,
          projects: true,
          skills: true,
        },
      });

      return newProfile;
    }),

  // Delete a profile (cannot delete default profile)
  deleteProfile: protectedProcedure
    .input(z.object({ profileId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { profileId } = input;

      // Verify the profile belongs to the user and is not the default
      const profile = await ctx.db.userProfile.findFirst({
        where: {
          id: profileId,
          userId: ctx.session.user.id,
        },
      });

      if (!profile) {
        throw new Error("Profile not found");
      }

      if (profile.isDefault) {
        throw new Error("Cannot delete the default profile");
      }

      // Check if any resumes are using this profile
      const resumeCount = await ctx.db.resume.count({
        where: { profileId: profileId },
      });

      if (resumeCount > 0) {
        throw new Error(
          `Cannot delete profile. It is being used by ${resumeCount} resume(s)`,
        );
      }

      // Delete the profile
      await ctx.db.userProfile.delete({
        where: { id: profileId },
      });

      return { success: true, deletedId: profileId };
    }),

  // Set a profile as the new default (only one default per user)
  setAsDefault: protectedProcedure
    .input(z.object({ profileId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { profileId } = input;

      // Verify the profile belongs to the user
      const profile = await ctx.db.userProfile.findFirst({
        where: {
          id: profileId,
          userId: ctx.session.user.id,
        },
      });

      if (!profile) {
        throw new Error("Profile not found");
      }

      // Use transaction to ensure atomicity
      await ctx.db.$transaction(async (tx) => {
        // Remove default flag from all user's profiles
        await tx.userProfile.updateMany({
          where: { userId: ctx.session.user.id },
          data: { isDefault: false },
        });

        // Set the selected profile as default
        await tx.userProfile.update({
          where: { id: profileId },
          data: { isDefault: true },
        });
      });

      return { success: true, newDefaultId: profileId };
    }),
});

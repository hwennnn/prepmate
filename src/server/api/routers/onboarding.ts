import { z } from "zod";
import { completeProfileSchema } from "~/app/_components/onboarding/types";
import { extractTextFromDocument } from "~/lib/document-parser";
import { parseResumeText } from "~/lib/gemini";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const onboardingRouter = createTRPCRouter({
  // Check if user has completed onboarding
  getOnboardingStatus: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { hasCompletedOnboarding: true },
    });

    return {
      hasCompletedOnboarding: user?.hasCompletedOnboarding ?? false,
    };
  }),

  // Get user's profile data for editing
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    // For backward compatibility, return the default profile
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

  // Save or update profile data
  saveProfile: protectedProcedure
    .input(completeProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      let existingProfile;

      if (input.profileId) {
        // Edit mode: Update specific profile by ID
        existingProfile = await ctx.db.userProfile.findFirst({
          where: {
            id: input.profileId,
            userId, // Security: ensure user owns this profile
          },
        });

        if (!existingProfile) {
          throw new Error(
            "Profile not found or you don't have permission to edit it",
          );
        }
      } else {
        // Onboarding mode: Check if user has any profiles (for backward compatibility)
        existingProfile = await ctx.db.userProfile.findFirst({
          where: {
            userId,
            isDefault: true, // Update the default profile during onboarding
          },
        });
      }

      let profileData;

      if (existingProfile) {
        // Update existing profile
        profileData = await ctx.db.userProfile.update({
          where: { id: existingProfile.id },
          data: {
            firstName: input.personalDetails.firstName,
            lastName: input.personalDetails.lastName,
            email: input.personalDetails.email,
            phoneNumber: input.personalDetails.phoneNumber ?? null,
            website: input.personalDetails.website ?? null,
            linkedinUrl: input.personalDetails.linkedinUrl ?? null,
            githubUrl: input.personalDetails.githubUrl ?? null,
          },
        });
      } else {
        // Create new default profile (only during onboarding)
        profileData = await ctx.db.userProfile.create({
          data: {
            userId,
            profileName: "Default Profile",
            isDefault: true,
            firstName: input.personalDetails.firstName,
            lastName: input.personalDetails.lastName,
            email: input.personalDetails.email,
            phoneNumber: input.personalDetails.phoneNumber ?? null,
            website: input.personalDetails.website ?? null,
            linkedinUrl: input.personalDetails.linkedinUrl ?? null,
            githubUrl: input.personalDetails.githubUrl ?? null,
          },
        });
      }

      const profileId = profileData.id;

      // Handle education records
      if (input.education && input.education.length > 0) {
        // Delete existing education records
        await ctx.db.education.deleteMany({
          where: { profileId: profileId },
        });

        // Create new education records
        await ctx.db.education.createMany({
          data: input.education.map((edu) => ({
            profileId: profileId,
            institution: edu.institution,
            degree: edu.degree,
            isAttending: edu.isAttending,
            startDate: edu.startDate,
            endDate: edu.endDate,
            gpa: edu.gpa,
            awards: edu.awards,
            coursework: edu.coursework,
          })),
        });
      }

      // Handle experience records
      if (input.experience && input.experience.length > 0) {
        // Delete existing experience records
        await ctx.db.experience.deleteMany({
          where: { profileId: profileId },
        });

        // Create new experience records
        await ctx.db.experience.createMany({
          data: input.experience.map((exp) => ({
            profileId: profileId,
            company: exp.company,
            jobTitle: exp.jobTitle,
            location: exp.location,
            isCurrentJob: exp.isCurrentJob,
            startDate: exp.startDate,
            endDate: exp.endDate,
            achievements: exp.achievements,
            technologies: exp.technologies,
          })),
        });
      }

      // Handle project records
      if (input.projects && input.projects.length > 0) {
        // Delete existing project records
        await ctx.db.project.deleteMany({
          where: { profileId: profileId },
        });

        // Create new project records
        await ctx.db.project.createMany({
          data: input.projects.map((proj) => ({
            profileId: profileId,
            name: proj.name,
            description: proj.description,
            url: proj.url ?? null,
            achievements: proj.achievements,
            technologies: proj.technologies,
          })),
        });
      }

      // Handle skills
      if (input.skills) {
        await ctx.db.skills.upsert({
          where: { profileId: profileId },
          create: {
            profileId: profileId,
            languages: input.skills.languages,
            frameworks: input.skills.frameworks,
          },
          update: {
            languages: input.skills.languages,
            frameworks: input.skills.frameworks,
          },
        });
      }

      return profileData;
    }),

  // Mark onboarding as complete
  completeOnboarding: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: { hasCompletedOnboarding: true },
    });

    return { success: true };
  }),

  // Parse resume and extract data
  parseResume: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileData: z.string(), // base64 encoded file data
        mimeType: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        // Extract text from the document using local parsers
        const extractedText = await extractTextFromDocument(
          input.fileData,
          input.fileName,
          input.mimeType,
        );

        // Use Gemini to parse the extracted text
        const parsedData = await parseResumeText(extractedText);

        return parsedData;
      } catch (error) {
        console.error("Error parsing resume:", error);
        throw new Error(
          "Failed to parse resume. Please try uploading a different file or fill the form manually.",
        );
      }
    }),
});

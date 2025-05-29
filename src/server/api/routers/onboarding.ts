import { completeProfileSchema } from "~/app/_components/onboarding/types";
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
    const profile = await ctx.db.userProfile.findUnique({
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
    });

    return profile;
  }),

  // Save or update profile data
  saveProfile: protectedProcedure
    .input(completeProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Create or update user profile
      const profile = await ctx.db.userProfile.upsert({
        where: { userId },
        create: {
          userId,
          firstName: input.personalDetails.firstName,
          lastName: input.personalDetails.lastName,
          email: input.personalDetails.email,
          phoneNumber: input.personalDetails.phoneNumber ?? null,
          website: input.personalDetails.website ?? null,
          linkedinUrl: input.personalDetails.linkedinUrl ?? null,
          githubUrl: input.personalDetails.githubUrl ?? null,
        },
        update: {
          firstName: input.personalDetails.firstName,
          lastName: input.personalDetails.lastName,
          email: input.personalDetails.email,
          phoneNumber: input.personalDetails.phoneNumber ?? null,
          website: input.personalDetails.website ?? null,
          linkedinUrl: input.personalDetails.linkedinUrl ?? null,
          githubUrl: input.personalDetails.githubUrl ?? null,
        },
      });

      // Handle education records
      if (input.education && input.education.length > 0) {
        // Delete existing education records
        await ctx.db.education.deleteMany({
          where: { profileId: profile.id },
        });

        // Create new education records
        await ctx.db.education.createMany({
          data: input.education.map((edu) => ({
            profileId: profile.id,
            institution: edu.institution,
            degree: edu.degree,
            isAttending: edu.isAttending,
            startDate: edu.startDate,
            endDate: edu.endDate,
            expectedGradDate: edu.expectedGradDate,
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
          where: { profileId: profile.id },
        });

        // Create new experience records
        await ctx.db.experience.createMany({
          data: input.experience.map((exp) => ({
            profileId: profile.id,
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
          where: { profileId: profile.id },
        });

        // Create new project records
        await ctx.db.project.createMany({
          data: input.projects.map((proj) => ({
            profileId: profile.id,
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
          where: { profileId: profile.id },
          create: {
            profileId: profile.id,
            languages: input.skills.languages,
            frameworks: input.skills.frameworks,
          },
          update: {
            languages: input.skills.languages,
            frameworks: input.skills.frameworks,
          },
        });
      }

      return profile;
    }),

  // Mark onboarding as complete
  completeOnboarding: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: { hasCompletedOnboarding: true },
    });

    return { success: true };
  }),
});

import { z } from "zod";
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
      console.log("🚀 ~ .mutation ~ input:", input);

      // For now, return a mock response
      const mockParsedData = {
        personalDetails: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phoneNumber: "+1 (555) 123-4567",
          website: "",
          linkedinUrl: "https://linkedin.com/in/johndoe",
          githubUrl: "https://github.com/johndoe",
        },
        education: [
          {
            institution: "University of Technology",
            degree: "Bachelor of Science in Computer Science",
            isAttending: false,
            startDate: new Date("2018-09-01"),
            endDate: new Date("2022-05-15"),
            gpa: "3.8",
            awards: "Dean's List",
            coursework: "Data Structures, Algorithms, Software Engineering",
          },
        ],
        experience: [
          {
            company: "Tech Corp",
            jobTitle: "Software Engineer",
            location: "San Francisco, CA",
            isCurrentJob: true,
            startDate: new Date("2022-06-01"),
            achievements:
              "Developed scalable web applications, improved performance by 40%",
            technologies: "React, Node.js, PostgreSQL",
          },
        ],
        projects: [
          {
            name: "E-commerce Platform",
            description:
              "Full-stack e-commerce application with payment integration",
            url: "https://github.com/johndoe/ecommerce",
            achievements: "Handled 1000+ concurrent users",
            technologies: "React, Express, MongoDB",
          },
        ],
        skills: {
          languages: "JavaScript, TypeScript, Python, Java",
          frameworks: "React, Next.js, Express, Django",
        },
      };

      return mockParsedData;
    }),
});

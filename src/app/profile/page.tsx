"use client";

import { format } from "date-fns";
import {
  Award,
  Briefcase,
  Building2,
  Calendar,
  Code,
  ExternalLink,
  FolderOpen,
  Github,
  Globe,
  GraduationCap,
  Linkedin,
  Link as LinkIcon,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { ThemeToggle } from "~/components/theme-toggle";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { Logo } from "~/components/ui/logo";
import { api } from "~/trpc/react";
import { OnboardingCheck } from "../_components/OnboardingCheck";
import { SignedInOnly } from "../_components/SignedInOnly";

export default function ProfilePage() {
  const {
    data: profile,
    isLoading,
    error,
  } = api.onboarding.getProfile.useQuery();

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading profile..." size="lg" />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400">
                Failed to load profile: {error.message}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-slate-600 dark:text-slate-400">
                No profile found. Please complete your onboarding first.
              </p>
              <Button asChild className="mt-4">
                <Link href="/onboarding">Complete Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SignedInOnly>
      <OnboardingCheck />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        {/* Navigation - Consistent with Dashboard */}
        <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
          <div className="container mx-auto flex items-center justify-between px-4 py-4">
            <div className="flex items-center space-x-2">
              <Logo size="md" variant="rounded-lg" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                PrepMate
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              {/* TODO: add a button to edit the profile */}
              {/* <Button variant="ghost" size="sm" asChild>
                <Link href="/profile/edit">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button> */}
              <div className="flex items-center space-x-2">
                <form
                  action={async () => {
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <Button variant="outline" size="sm" type="submit">
                    Sign Out
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Title Section */}
        <div className="border-b border-slate-100 bg-white/50 dark:border-slate-800 dark:bg-slate-950/50">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              My Profile
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              View and manage your professional profile
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Personal Information Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {profile.firstName} {profile.lastName}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Mail className="h-4 w-4" />
                      <span>{profile.email}</span>
                    </div>

                    {profile.phoneNumber && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Phone className="h-4 w-4" />
                        <span>{profile.phoneNumber}</span>
                      </div>
                    )}

                    {profile.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Visit Website
                          <ExternalLink className="ml-1 inline h-3 w-3" />
                        </a>
                      </div>
                    )}

                    {profile.linkedinUrl && (
                      <div className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <a
                          href={profile.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          LinkedIn Profile
                          <ExternalLink className="ml-1 inline h-3 w-3" />
                        </a>
                      </div>
                    )}

                    {profile.githubUrl && (
                      <div className="flex items-center gap-2">
                        <Github className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <a
                          href={profile.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          GitHub Profile
                          <ExternalLink className="ml-1 inline h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              {profile.skills && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile.skills.languages && (
                      <div>
                        <h4 className="mb-2 font-medium text-slate-900 dark:text-white">
                          Programming Languages
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.languages
                            .split(",")
                            .map((skill, index) => (
                              <Badge key={index} variant="secondary">
                                {skill.trim()}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}

                    {profile.skills.frameworks && (
                      <div>
                        <h4 className="mb-2 font-medium text-slate-900 dark:text-white">
                          Frameworks & Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.frameworks
                            .split(",")
                            .map((skill, index) => (
                              <Badge key={index} variant="outline">
                                {skill.trim()}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Main Content */}
            <div className="space-y-8 lg:col-span-2">
              {/* Experience */}
              {profile.experience && profile.experience.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Work Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {profile.experience.map((exp) => (
                        <div
                          key={exp.id}
                          className="border-l-2 border-blue-200 pl-4 dark:border-blue-800"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-slate-900 dark:text-white">
                                {exp.jobTitle}
                              </h3>
                              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <Building2 className="h-4 w-4" />
                                <span>{exp.company}</span>
                                {exp.location && (
                                  <>
                                    <MapPin className="ml-2 h-4 w-4" />
                                    <span>{exp.location}</span>
                                  </>
                                )}
                              </div>
                              <div className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {format(new Date(exp.startDate), "MMM yyyy")}{" "}
                                  -{" "}
                                  {exp.isCurrentJob
                                    ? "Present"
                                    : exp.endDate
                                      ? format(
                                          new Date(exp.endDate),
                                          "MMM yyyy",
                                        )
                                      : "Present"}
                                </span>
                                {exp.isCurrentJob && (
                                  <Badge variant="secondary" className="ml-2">
                                    Current
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {exp.achievements && (
                            <div className="mt-3">
                              <h4 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                Key Achievements
                              </h4>
                              <p className="text-sm whitespace-pre-wrap text-slate-600 dark:text-slate-400">
                                {exp.achievements}
                              </p>
                            </div>
                          )}

                          {exp.technologies && (
                            <div className="mt-3">
                              <h4 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                Technologies Used
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {exp.technologies
                                  .split(",")
                                  .map((tech, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {tech.trim()}
                                    </Badge>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Education */}
              {profile.education && profile.education.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {profile.education.map((edu) => (
                        <div
                          key={edu.id}
                          className="border-l-2 border-green-200 pl-4 dark:border-green-800"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-slate-900 dark:text-white">
                                {edu.degree}
                              </h3>
                              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <Building2 className="h-4 w-4" />
                                <span>{edu.institution}</span>
                              </div>
                              <div className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {edu.startDate
                                    ? format(
                                        new Date(edu.startDate),
                                        "MMM yyyy",
                                      )
                                    : "Start Date"}{" "}
                                  -{" "}
                                  {edu.isAttending
                                    ? "Present"
                                    : edu.endDate
                                      ? format(
                                          new Date(edu.endDate),
                                          "MMM yyyy",
                                        )
                                      : edu.expectedGradDate
                                        ? `Expected ${format(new Date(edu.expectedGradDate), "MMM yyyy")}`
                                        : "End Date"}
                                </span>
                                {edu.isAttending && (
                                  <Badge variant="secondary" className="ml-2">
                                    Currently Attending
                                  </Badge>
                                )}
                              </div>
                              {edu.gpa && (
                                <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                  GPA: {edu.gpa}
                                </div>
                              )}
                            </div>
                          </div>

                          {edu.awards && (
                            <div className="mt-3">
                              <h4 className="mb-2 flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                                <Award className="h-3 w-3" />
                                Awards & Honors
                              </h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {edu.awards}
                              </p>
                            </div>
                          )}

                          {edu.coursework && (
                            <div className="mt-3">
                              <h4 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                Relevant Coursework
                              </h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {edu.coursework}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Projects */}
              {profile.projects && profile.projects.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5" />
                      Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {profile.projects.map((project) => (
                        <div
                          key={project.id}
                          className="rounded-lg border bg-slate-50 p-4 dark:bg-slate-800/50"
                        >
                          <div className="mb-3 flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-slate-900 dark:text-white">
                                {project.name}
                              </h3>
                              {project.url && (
                                <a
                                  href={project.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  <LinkIcon className="h-3 w-3" />
                                  View Project
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                          </div>

                          <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
                            {project.description}
                          </p>

                          {project.achievements && (
                            <div className="mb-3">
                              <h4 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                Key Achievements
                              </h4>
                              <p className="text-sm whitespace-pre-wrap text-slate-600 dark:text-slate-400">
                                {project.achievements}
                              </p>
                            </div>
                          )}

                          {project.technologies && (
                            <div>
                              <h4 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                Technologies Used
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {project.technologies
                                  .split(",")
                                  .map((tech, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {tech.trim()}
                                    </Badge>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </SignedInOnly>
  );
}

import {
  Download,
  Edit3,
  Eye,
  FileText,
  Plus,
  Share2,
  Trash2,
} from "lucide-react";
import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { SignedInOnly } from "~/app/_components/SignedInOnly";
import { ThemeToggle } from "~/components/theme-toggle";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Logo } from "~/components/ui/logo";
import { auth, signOut } from "~/server/auth";
import { OnboardingCheck } from "../_components/OnboardingCheck";

export const metadata: Metadata = {
  title: "Dashboard - PrepMate",
  description: "Manage your resumes and track your job search progress.",
};

export default async function DashboardPage() {
  const session = await auth();

  // Redirect if not signed in
  if (!session?.user) {
    redirect("/auth/signin");
  }

  // TODO: Mock data - replace with real data from the database
  const stats = {
    totalResumes: 3,
    totalViews: 127,
    downloadsThisMonth: 24,
    sharedLinks: 2,
  };

  const resumes = [
    {
      id: 1,
      title: "Senior Developer Resume",
      template: "Modern",
      lastModified: "2 hours ago",
      views: 45,
      downloads: 12,
      isPublic: true,
    },
    {
      id: 2,
      title: "Product Manager Resume",
      template: "Classic",
      lastModified: "1 day ago",
      views: 32,
      downloads: 8,
      isPublic: false,
    },
    {
      id: 3,
      title: "Marketing Specialist Resume",
      template: "Creative",
      lastModified: "3 days ago",
      views: 50,
      downloads: 4,
      isPublic: true,
    },
  ];

  return (
    <SignedInOnly>
      <OnboardingCheck>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
          {/* Navigation */}
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
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {session.user.name}
                  </span>
                  <form
                    action={async () => {
                      "use server";
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

          <main className="container mx-auto px-4 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Welcome back, {session.user.name?.split(" ")[0]}! 👋
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Manage your resumes and track your job search progress.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Resumes
                  </CardTitle>
                  <FileText className="h-4 w-4 text-slate-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalResumes}</div>
                  <p className="text-xs text-slate-500">+1 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Views
                  </CardTitle>
                  <Eye className="h-4 w-4 text-slate-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalViews}</div>
                  <p className="text-xs text-slate-500">+23% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Downloads
                  </CardTitle>
                  <Download className="h-4 w-4 text-slate-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.downloadsThisMonth}
                  </div>
                  <p className="text-xs text-slate-500">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Shared Links
                  </CardTitle>
                  <Share2 className="h-4 w-4 text-slate-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.sharedLinks}</div>
                  <p className="text-xs text-slate-500">Active links</p>
                </CardContent>
              </Card>
            </div>

            {/* Actions Section */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  Your Resumes
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Manage and track your resume collection
                </p>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                <Plus className="mr-2 h-4 w-4" />
                Create New Resume
              </Button>
            </div>

            {/* Resumes Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resumes.map((resume) => (
                <Card
                  key={resume.id}
                  className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {resume.title}
                        </CardTitle>
                        <CardDescription>
                          {resume.template} template • {resume.lastModified}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={resume.isPublic ? "default" : "secondary"}
                      >
                        {resume.isPublic ? "Public" : "Private"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {resume.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {resume.downloads}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit3 className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State - show if no resumes */}
            {resumes.length === 0 && (
              <Card className="py-16 text-center">
                <CardContent>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <FileText className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">No resumes yet</h3>
                  <p className="mb-4 text-slate-600 dark:text-slate-400">
                    Get started by creating your first resume with our
                    AI-powered builder.
                  </p>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Resume
                  </Button>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </OnboardingCheck>
    </SignedInOnly>
  );
}

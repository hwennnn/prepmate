import {
  ArrowRight,
  CheckCircle,
  Download,
  FileText,
  Share2,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Header } from "~/components/layout";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Logo } from "~/components/ui/logo";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <Header showSignInButton />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6 animate-pulse">
              🚀 AI-Powered Resume Builder
            </Badge>

            <h1 className="mb-8 text-5xl font-bold tracking-tight md:text-7xl">
              Craft Your
              <span className="animate-gradient block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Perfect Resume
              </span>
              in Minutes
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-slate-600 dark:text-slate-300">
              Transform your career with AI-enhanced resumes using the proven
              XYZ formula. Choose from stunning templates and share your
              professional story online.
            </p>

            <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="transform px-8 py-6 text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                asChild
              >
                <Link href="/auth/signin">
                  Start Building Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                asChild
              >
                <Link href="/templates">View Templates</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            {/* <div className="flex flex-col items-center justify-center gap-8 border-t border-slate-200 pt-8 text-sm text-slate-500 sm:flex-row">
              <div className="flex items-center gap-2 transition-colors hover:text-blue-600">
                <Users className="h-4 w-4" />
                <span className="font-medium">10,000+ resumes created</span>
              </div>
              <div className="flex items-center gap-2 transition-colors hover:text-yellow-600">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">4.9/5 user rating</span>
              </div>
              <div className="flex items-center gap-2 transition-colors hover:text-amber-600">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span className="font-medium">98% job success rate</span>
              </div>
            </div> */}
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4">
              ✨ Features
            </Badge>
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Everything you need to land your dream job
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              From AI-powered content enhancement to beautiful templates and
              online hosting.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-slate-800/50 dark:shadow-slate-900/50">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 transition-all duration-300 group-hover:from-blue-100 group-hover:to-purple-100 dark:from-blue-950/20 dark:to-purple-950/20 dark:group-hover:from-blue-900/30 dark:group-hover:to-purple-900/30"></div>
              <CardHeader className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="transition-colors group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-400">
                  AI-Enhanced Content
                </CardTitle>
                <CardDescription className="dark:text-slate-300">
                  Transform your bullet points with AI using the proven XYZ
                  formula for maximum impact.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-slate-800/50 dark:shadow-slate-900/50">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 transition-all duration-300 group-hover:from-green-100 group-hover:to-emerald-100 dark:from-green-950/20 dark:to-emerald-950/20 dark:group-hover:from-green-900/30 dark:group-hover:to-emerald-900/30"></div>
              <CardHeader className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-tr from-green-500 to-emerald-500 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="transition-colors group-hover:text-green-700 dark:text-slate-100 dark:group-hover:text-green-400">
                  Beautiful Templates
                </CardTitle>
                <CardDescription className="dark:text-slate-300">
                  Choose from multiple professionally designed templates that
                  make you stand out.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-slate-800/50 dark:shadow-slate-900/50">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 transition-all duration-300 group-hover:from-orange-100 group-hover:to-red-100 dark:from-orange-950/20 dark:to-red-950/20 dark:group-hover:from-orange-900/30 dark:group-hover:to-red-900/30"></div>
              <CardHeader className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-tr from-orange-500 to-red-500 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="transition-colors group-hover:text-orange-700 dark:text-slate-100 dark:group-hover:text-orange-400">
                  Quick Setup
                </CardTitle>
                <CardDescription className="dark:text-slate-300">
                  Upload your existing resume or fill out our smart forms to get
                  started instantly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-slate-800/50 dark:shadow-slate-900/50">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 transition-all duration-300 group-hover:from-purple-100 group-hover:to-pink-100 dark:from-purple-950/20 dark:to-pink-950/20 dark:group-hover:from-purple-900/30 dark:group-hover:to-pink-900/30"></div>
              <CardHeader className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="transition-colors group-hover:text-purple-700 dark:text-slate-100 dark:group-hover:text-purple-400">
                  Multiple Formats
                </CardTitle>
                <CardDescription className="dark:text-slate-300">
                  Download your resume in PDF format or export to various file
                  types.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-slate-800/50 dark:shadow-slate-900/50">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 transition-all duration-300 group-hover:from-cyan-100 group-hover:to-blue-100 dark:from-cyan-950/20 dark:to-blue-950/20 dark:group-hover:from-cyan-900/30 dark:group-hover:to-blue-900/30"></div>
              <CardHeader className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-500 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  <Share2 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="transition-colors group-hover:text-cyan-700 dark:text-slate-100 dark:group-hover:text-cyan-400">
                  Online Sharing
                </CardTitle>
                <CardDescription className="dark:text-slate-300">
                  Get a unique link to share your resume online with recruiters
                  and employers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-slate-800/50 dark:shadow-slate-900/50">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 transition-all duration-300 group-hover:from-emerald-100 group-hover:to-teal-100 dark:from-emerald-950/20 dark:to-teal-950/20 dark:group-hover:from-emerald-900/30 dark:group-hover:to-teal-900/30"></div>
              <CardHeader className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="transition-colors group-hover:text-emerald-700 dark:text-slate-100 dark:group-hover:text-emerald-400">
                  Live Preview
                </CardTitle>
                <CardDescription className="dark:text-slate-300">
                  See your changes in real-time with our live preview feature as
                  you edit.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto bg-gradient-to-b from-white to-slate-50 px-4 py-20 dark:from-slate-950 dark:to-slate-900">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4">
              🎯 Process
            </Badge>
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              How it works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Get from zero to hired in just four simple steps.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                step: "01",
                title: "Sign Up",
                description:
                  "Create your account with email or social login in seconds.",
              },
              {
                step: "02",
                title: "Add Your Info",
                description:
                  "Fill out our smart forms or upload your existing resume.",
              },
              {
                step: "03",
                title: "Choose Template",
                description:
                  "Pick from our collection of professional, ATS-friendly templates.",
              },
              {
                step: "04",
                title: "Download & Share",
                description:
                  "Get your perfect resume and share it with a unique online link.",
              },
            ].map((item, index) => (
              <div key={index} className="group text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 text-lg font-bold text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                  {item.step}
                </div>
                <h3 className="mb-3 text-xl font-semibold transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {item.title}
                </h3>
                <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-center text-white shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>
            {/* Decorative circles */}
            <div className="absolute -top-10 -left-10 h-20 w-20 rounded-full bg-white/10"></div>
            <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-white/10"></div>
            <div className="relative">
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                Ready to build your dream resume?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed opacity-90">
                Join thousands of job seekers who have successfully landed their
                dream jobs with PrepMate.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-6 text-lg shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                asChild
              >
                <Link href="/auth/signin">
                  Start Building Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto border-t border-slate-200 px-4 py-12 dark:border-slate-800">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 flex items-center space-x-2 md:mb-0">
              <Logo size="sm" variant="rounded" className="shadow-sm" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-semibold text-transparent">
                PrepMate
              </span>
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              © 2025 PrepMate. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </HydrateClient>
  );
}

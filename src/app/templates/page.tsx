import { type Metadata } from "next";
import { api } from "~/trpc/server";
import { Header } from "~/components/layout";
import { PublicTemplateGallery } from "./_components/PublicTemplateGallery";

export const metadata: Metadata = {
  title: "Resume Templates | PrepMate",
  description:
    "Choose from our collection of professional, ATS-friendly resume templates designed to help you land your dream job.",
};

export default async function PublicTemplatesPage() {
  const templates = await api.resume.getTemplates();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Header showThemeToggle={true} showSignInButton />
      <main>
        <PublicTemplateGallery templates={templates} />
      </main>
    </div>
  );
}

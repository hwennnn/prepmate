import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { PublicResumeView } from "../_components/PublicResumeView";

interface PublicResumePageProps {
  params: {
    slug: string;
  };
}

// Metadata for SEO optimization.
// Reference: @https://nextjs.org/docs/app/getting-started/metadata-and-og-images
export async function generateMetadata({
  params,
}: PublicResumePageProps): Promise<Metadata> {
  try {
    const data = await api.resume.getPublicResume({ slug: params.slug });
    const { resume } = data;

    return {
      title: `${resume.firstName} ${resume.lastName} - Resume`,
      description: `View ${resume.firstName} ${resume.lastName}'s professional resume`,
    };
  } catch {
    return {
      title: "Resume Not Found",
      description: "The requested resume could not be found.",
    };
  }
}

export default async function PublicResumePage({
  params,
}: PublicResumePageProps) {
  try {
    const data = await api.resume.getPublicResume({ slug: params.slug });

    return (
      <div className="min-h-screen bg-gray-50">
        <PublicResumeView
          resume={data.resume}
          viewCount={data.viewCount}
          slug={data.slug}
          isPrivatePreview={data.isPrivatePreview}
        />
      </div>
    );
  } catch {
    notFound();
  }
}

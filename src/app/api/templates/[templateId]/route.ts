import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

// Template directory
const templateDir = "src/templates/resume";

// Handler function
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> },
) {
  try {
    // Extract the templateId from parameter
    const { templateId } = await params;

    if (!templateId) {
      throw new Error("Template ID is required.");
    }

    // TODO: Validate templateId (checking with database)

    // Load template file
    const templatePath = join(process.cwd(), templateDir, `${templateId}.typ`);
    const templateContent = readFileSync(templatePath, "utf-8");

    // Return template content
    return new NextResponse(
      templateContent, // body
      //headers
      {
        status: 200,
        statusText: "OK",
        headers: {
          "Content-Type": "text/plain",
          // shared resource, static template
          "Cache-Control": "public, max-age=3600",
        },
      },
    );
  } catch (error) {
    console.error("Error loading template:", error);
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }
}

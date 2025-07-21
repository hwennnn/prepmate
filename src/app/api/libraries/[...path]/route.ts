import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

// Template libraries
const librariesDir = "src/templates/libraries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    // Extract the path from parameter
    const { path } = await params;

    if (!path || path.length < 2) {
      return NextResponse.json({ error: "Invalid library" }, { status: 400 });
    }

    const [libraryName, fileName] = path;

    // TODO: Validate path?
    if (!libraryName || !fileName) {
      return NextResponse.json(
        { error: "Invalid library or file name" },
        { status: 400 },
      );
    }

    // Load template libraries - either lib.typ or resume.typ per request
    const libPath = join(process.cwd(), librariesDir, libraryName, fileName);
    // Read contents
    const libContent = readFileSync(libPath, "utf-8");

    // Return library file contents
    return new NextResponse(
      libContent, // body
      //headers
      {
        status: 200,
        statusText: "OK",
        headers: {
          "Content-Type": "text/plain",
          // shared resource, static library content
          "Cache-Control": "public, max-age=3600",
        },
      },
    );
  } catch (error) {
    console.error("Error loading library:", error);
    return NextResponse.json(
      { error: "Invalid library or file name" },
      { status: 400 },
    );
  }
}

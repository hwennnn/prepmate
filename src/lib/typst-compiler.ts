"use server";
import { $typst } from "@myriaddreamin/typst.ts";
import { join } from "path";
import { readFileSync } from "fs";
import type { OnboardingFormData } from "~/app/_components/onboarding/types";
import { templateLibs } from "~/templates/template-lib-map";
import { formatDataForTypst } from "~/lib/profile";

/*
 *  Procedure:
 * 	1. Receives form data and templateId
 * 	2. Verify templateId (Optional)
 * 	3. Load coressponding resume typst file template
 * 	4. Inject form data into template for Compiler to compile
 * 	5. Return the compiled pdf buffer
 */

// Note: Using virtual file system via addSource() to handle file access

function compilationInit({
  formData,
  templateId,
}: {
  formData: OnboardingFormData;
  templateId: string;
}) {
  // Template directory
  const templateDir = "src/templates/resume";
  const librariesDir = "src/templates/libraries";

  // Load template file
  const templatePath = join(process.cwd(), templateDir, `${templateId}.typ`);
  const templateContent = readFileSync(templatePath, "utf-8");

  // Load template libraries
  const requiredLib = templateLibs[templateId];

  if (!requiredLib) {
    throw new Error(`Template library not found for templateId: ${templateId}`);
  }

  const libraryFiles = new Map();
  const libPath = join(process.cwd(), librariesDir, requiredLib);
  const libTypPath = join(libPath, "lib.typ");
  const resumeTypPath = join(libPath, "resume.typ");

  libraryFiles.set(
    `/libraries/${requiredLib}/lib.typ`,
    readFileSync(libTypPath, "utf-8"),
  );
  libraryFiles.set(
    `/libraries/${requiredLib}/resume.typ`,
    readFileSync(resumeTypPath, "utf-8"),
  );

  // Format data for Typst
  const formattedData = formatDataForTypst(formData);
  return {
    templateContent,
    libraryFiles,
    formattedData,
  };
}

export async function compileResume({
  formData,
  templateId,
}: {
  // Type definition of inputs
  formData: OnboardingFormData;
  templateId: string;
}) {
  try {
    // Load
    const { templateContent, libraryFiles, formattedData } = compilationInit({
      formData,
      templateId,
    });

    // Add source files to the virtual file system
    await $typst.addSource("/main.typ", templateContent);

    // Add all library files to the virtual file system
    for (const [path, content] of libraryFiles) {
      await $typst.addSource(path as string, content as string);
    }

    // Return the PDF compilation result directly
    const buffer = await $typst.pdf({
      mainContent: templateContent,
      inputs: { data: JSON.stringify(formattedData) },
    });

    return buffer;
  } catch (error) {
    console.error("Compilation error: ", error);
    //throw new Error("Compilation failed");
    throw error;
  }
}

export async function compileResumeToSVG({
  formData,
  templateId,
}: {
  formData: OnboardingFormData;
  templateId: string;
}) {
  try {
    // Load
    const { templateContent, libraryFiles, formattedData } = compilationInit({
      formData,
      templateId,
    });

    // Add source files to the virtual file system
    await $typst.addSource("/main.typ", templateContent);

    // Add all library files to the virtual file system
    for (const [path, content] of libraryFiles) {
      await $typst.addSource(path as string, content as string);
    }

    // Return the SVG compilation result
    const svgBuffer = await $typst.svg({
      mainFilePath: "/main.typ",
      inputs: { data: JSON.stringify(formattedData) },
    });

    return svgBuffer;
  } catch (error) {
    console.error("SVG compilation error: ", error);
    throw error;
  }
}

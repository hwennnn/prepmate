"use server";
import { $typst } from "@myriaddreamin/typst.ts";
import { join } from "path";
import { readFileSync } from "fs";
import type { OnboardingFormData } from "~/app/_components/onboarding/types";
import { templateLibs } from "~/templates/template-lib-map";
import { formatDataForTypst } from "~/lib/profile";

// Initialize Typst with local WASM files for server-side compilation
let isTypstInitialized = false;

async function initializeTypst() {
  if (isTypstInitialized) {
    console.log("✅ Typst already initialized");
    return;
  }

  try {
    // Set WASM paths to public directory files
    const wasmBasePath = join(process.cwd(), "public");
    const compilerWasmPath = join(
      wasmBasePath,
      "typst_ts_web_compiler_bg.wasm",
    );
    const rendererWasmPath = join(wasmBasePath, "typst_ts_renderer_bg.wasm");

    console.log("🔧 Initializing Typst with local WASM files:");
    console.log("   Compiler WASM:", compilerWasmPath);
    console.log("   Renderer WASM:", rendererWasmPath);

    // Check if WASM files exist
    const compilerBuffer = readFileSync(compilerWasmPath);
    const rendererBuffer = readFileSync(rendererWasmPath);

    console.log("📦 WASM file sizes:");
    console.log(
      `   Compiler: ${(compilerBuffer.length / 1024 / 1024).toFixed(2)} MB`,
    );
    console.log(
      `   Renderer: ${(rendererBuffer.length / 1024 / 1024).toFixed(2)} MB`,
    );

    // Initialize with local WASM files
    $typst.setCompilerInitOptions({
      getModule: () => {
        console.log("🚀 Loading compiler WASM from local file");
        return compilerBuffer;
      },
    });

    $typst.setRendererInitOptions({
      getModule: () => {
        console.log("🚀 Loading renderer WASM from local file");
        return rendererBuffer;
      },
    });

    isTypstInitialized = true;
    console.log("✅ Typst successfully initialized with local WASM files");
  } catch (error) {
    console.error(
      "❌ Failed to initialize Typst with local WASM files:",
      error,
    );
    console.log("🔄 Falling back to default initialization");
    // Fallback to default initialization
    isTypstInitialized = true;
  }
}

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
  console.log(`📄 Starting PDF compilation for template: ${templateId}`);

  try {
    // Initialize Typst with local WASM files
    await initializeTypst();

    // Load
    const { templateContent, libraryFiles, formattedData } = compilationInit({
      formData,
      templateId,
    });

    console.log(
      `📝 Template loaded (${templateContent.length} chars), Libraries: ${libraryFiles.size}`,
    );

    // Add source files to the virtual file system
    await $typst.addSource("/main.typ", templateContent);

    // Add all library files to the virtual file system
    for (const [path, content] of libraryFiles) {
      await $typst.addSource(path as string, content as string);
    }

    // Return the PDF compilation result directly
    console.log("🔄 Compiling to PDF...");
    const buffer = await $typst.pdf({
      mainContent: templateContent,
      inputs: { data: JSON.stringify(formattedData) },
    });

    console.log(`✅ PDF compilation successful!)`);
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
  console.log(`🎨 Starting SVG compilation for template: ${templateId}`);

  try {
    // Initialize Typst with local WASM files
    await initializeTypst();

    // Load
    const { templateContent, libraryFiles, formattedData } = compilationInit({
      formData,
      templateId,
    });

    console.log(
      `📝 Template loaded (${templateContent.length} chars), Libraries: ${libraryFiles.size}`,
    );

    // Add source files to the virtual file system
    await $typst.addSource("/main.typ", templateContent);

    // Add all library files to the virtual file system
    for (const [path, content] of libraryFiles) {
      await $typst.addSource(path as string, content as string);
    }

    // Return the SVG compilation result
    console.log("🔄 Compiling to SVG...");
    const svgBuffer = await $typst.svg({
      mainFilePath: "/main.typ",
      inputs: { data: JSON.stringify(formattedData) },
    });

    console.log(
      `✅ SVG compilation successful (${(svgBuffer.length / 1024).toFixed(2)} KB)`,
    );
    return svgBuffer;
  } catch (error) {
    console.error("SVG compilation error: ", error);
    throw error;
  }
}

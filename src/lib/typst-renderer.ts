"use client";

import type { OnboardingFormData } from "~/app/_components/onboarding/types";
import { templateLibs } from "~/templates/template-lib-map";
import { formatDataForTypst } from "~/lib/profile";

interface RenderOptions {
  formData: OnboardingFormData;
  templateId: string;
}

export class TypstResumeRenderer {
  // Caches for optimization (for repeated api calls)
  // Initialization tracker to use cache
  private isInitialized = false;

  // Maps templateId: string -> typst template content: string
  private templateCache = new Map<string, string>();

  // Maps templateId: string -> library files: Map resume.typ/lib.typ -> lib content: string
  private libraryCache = new Map<string, Map<string, string>>();

  // Initialize function (mainly for state management)
  async initialize() {
    if (this.isInitialized) return;

    try {
      /* Typst compiler initialization */
      // Await custom promise to confirm that typst compiler wasm has been loaded
      await new Promise<void>((resolve) => {
        // Use poll to periodically perform checks
        const poll = () => {
          if (window.__typstInited && window.$typst) resolve();
          else setTimeout(poll, 50);
        };
        poll();
      });

      // Update state if no problems
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to intialize typst renderer: ", error);
      throw error;
    }
  }

  // Load Template function
  async loadTemplate(templateId: string): Promise<string> {
    // Check if cache contains the templateId
    const cached = this.templateCache.get(templateId);
    if (cached) {
      return cached;
    }

    try {
      // Check if typst compiler initialized
      await this.initialize();

      // client api call to fetch template contents
      const res = await fetch(`/api/templates/${templateId}`);

      // handle invalid res
      if (!res.ok) {
        throw new Error(`Failed to load template: ${res.statusText}`);
      }

      // extract template content from res body
      const templateContent = await res.text();

      // update template cache
      this.templateCache.set(templateId, templateContent);

      // return template content
      return templateContent;
    } catch (error) {
      console.error("Failed to load template: ", error);
      throw error;
    }
  }

  // Function to load library files for template compilation
  async loadLibrary(templateId: string): Promise<Map<string, string>> {
    // Check if cache contains the templateId
    const cached = this.libraryCache.get(templateId);
    if (cached) {
      return cached;
    }

    try {
      // Check if typst compiler initialized
      await this.initialize();
      // Load required library based on templateId
      const requiredLib = templateLibs[templateId];

      // Check if required library found
      if (!requiredLib) {
        throw new Error(
          `Template library not found for templateId: ${templateId}`,
        );
      }
      // Set up library files mapping lib/resume.typ -> lib/resume file content
      const libraryFiles = new Map<string, string>();

      // Fetch lib.typ path for particular templateId
      const libTypRes = await fetch(`/api/libraries/${requiredLib}/lib.typ`);
      if (libTypRes.ok) {
        // Update libraryFiles
        libraryFiles.set(
          `/libraries/${requiredLib}/lib.typ`,
          await libTypRes.text(),
        );
      }

      // Fetch resume.typ path for particular templateId
      const resumeTypRes = await fetch(
        `/api/libraries/${requiredLib}/resume.typ`,
      );
      if (resumeTypRes.ok) {
        // Update libraryFiles
        libraryFiles.set(
          `/libraries/${requiredLib}/resume.typ`,
          await resumeTypRes.text(),
        );
      }

      // Update LibraryCache
      this.libraryCache.set(templateId, libraryFiles);

      // return libraryFiles
      return libraryFiles;
    } catch (error) {
      console.error(`Error loading libraries for ${templateId}: `, error);
      throw error;
    }
  }

  // Rendering Function Typst -> SVG Pages
  async renderToSVG({
    formData,
    templateId,
  }: RenderOptions): Promise<string[]> {
    try {
      // Load template and library
      const templateContent = await this.loadTemplate(templateId);
      const libraryFiles = await this.loadLibrary(templateId);

      // Format data
      const formattedData = formatDataForTypst(formData);

      // Add template to virtual file system
      if (window.$typst) {
        await window.$typst.addSource("/main.typ", templateContent);

        for (const [path, content] of libraryFiles) {
          await window.$typst.addSource(path, content);
        }

        const svgBuffer = await window.$typst.svg({
          mainFilePath: "/main.typ", // Use the file we added to VFS
          inputs: { data: JSON.stringify(formattedData) },
        });

        // Try to split SVG by detecting page boundaries
        const pages = TypstResumeRenderer.splitSVGByPages(svgBuffer);
        // Manual pop last page (extra space)
        pages.pop();
        return pages;
      } else {
        throw new Error("window.$typst is not defined");
      }
    } catch (error) {
      console.error("Live rendering compilation error: ", error);
      throw error;
    }
  }

  // Helper method to split single SVG into pages based on content analysis
  public static splitSVGByPages(svgContent: string): string[] {
    try {
      // Parse the SVG content into a DOM element to retrieve content height and width
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent, "image/svg+xml");
      const svgElement = doc.querySelector("svg");

      if (!svgElement) {
        return [svgContent];
      }

      // Get SVG height
      const height = parseFloat(svgElement.getAttribute("height") ?? "0");

      // Use A4 page dimensions in points (595.276 x 841.89)
      const pageWidth = 595.276;
      const pageHeight = 841.89;

      // Calculate number of pages based on height
      const numPages = Math.ceil(height / pageHeight);

      if (numPages <= 1) {
        return [svgContent];
      }

      // Split into multiple pages
      const pages: string[] = [];

      for (let i = 0; i < numPages; i++) {
        const yOffset = i * pageHeight;
        // Create a new SVG for this page with responsive attributes
        // Mark as SVG
        // Scales uniformly to the center
        const pageContent = `
          <svg width="${pageWidth}" height="${pageHeight}" viewBox="0 ${yOffset} ${pageWidth} ${pageHeight}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
            ${svgElement.innerHTML}
          </svg>
        `;
        // Push the created svg into pages array
        pages.push(pageContent);
      }

      return pages;
    } catch (error) {
      console.error("Error splitting SVG into pages:", error);
      return [svgContent]; // Return original if splitting fails
    }
  }
}

// Singleton instance
export const liveRenderer = new TypstResumeRenderer();

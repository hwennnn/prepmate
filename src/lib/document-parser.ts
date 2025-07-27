import { Buffer } from "buffer";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";

// Dynamic imports to handle optional dependencies
async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    const result = await pdfParse(buffer);
    return result.text;
  } catch (error) {
    console.error("PDF parsing failed:", error);
    throw new Error("PDF parsing failed.");
  }
}

// Helper function to convert HTML to text while preserving hyperlinks
function convertHtmlToTextWithLinks(html: string): string {
  // Replace <a> tags with "text (url)" format
  const withLinks = html.replace(
    /<a[^>]+href="([^"]*)"[^>]*>(.*?)<\/a>/gi,
    (match: string, url: string, content: string) => {
      // Remove HTML tags from the link content to get clean text
      const cleanText = content.replace(/<[^>]+>/g, "");

      // Clean up malformed URLs
      let cleanUrl = url;

      // Fix mailto: prefix with http/https URLs
      if (
        cleanUrl.startsWith("mailto:") &&
        (cleanUrl.includes("http://") || cleanUrl.includes("https://"))
      ) {
        cleanUrl = cleanUrl.replace("mailto:", "");
      }

      // Fix double protocols (e.g., https://https://...)
      cleanUrl = cleanUrl.replace(/^https?:\/\/https?:\/\//, "https://");

      // Ensure common domains have proper protocol
      if (/^(github\.com|linkedin\.com|twitter\.com|x\.com)/.test(cleanUrl)) {
        cleanUrl = "https://" + cleanUrl;
      }

      return `${cleanText} (${cleanUrl})`;
    },
  );

  // Remove other HTML tags
  const textOnly = withLinks
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Clean up extra whitespace
  return textOnly.replace(/\s+/g, " ").trim();
}

async function parseDocx(buffer: Buffer): Promise<string> {
  try {
    // First try to convert to HTML to preserve hyperlinks
    const htmlResult = await mammoth.convertToHtml({ buffer });
    if (htmlResult.value) {
      return convertHtmlToTextWithLinks(htmlResult.value);
    }

    // Fallback to raw text if HTML conversion fails
    const textResult = await mammoth.extractRawText({ buffer });
    return textResult.value;
  } catch (error) {
    console.error("DOCX parsing failed:", error);
    throw new Error("DOCX parsing failed.");
  }
}

async function parseDoc(buffer: Buffer): Promise<string> {
  try {
    const mammoth = await import("mammoth");

    // First try to convert to HTML to preserve hyperlinks
    const htmlResult = await mammoth.convertToHtml({ buffer });
    if (htmlResult.value) {
      return convertHtmlToTextWithLinks(htmlResult.value);
    }

    // Fallback to raw text if HTML conversion fails
    const textResult = await mammoth.extractRawText({ buffer });
    return textResult.value;
  } catch (error) {
    console.error("DOC parsing failed:", error);
    throw new Error("DOC parsing failed.");
  }
}

function parseText(buffer: Buffer): string {
  return buffer.toString("utf-8");
}

export async function extractTextFromDocument(
  fileData: string, // base64 encoded
  fileName: string,
  mimeType: string,
): Promise<string> {
  const buffer = Buffer.from(fileData, "base64");

  let extractedText: string;

  try {
    switch (mimeType) {
      case "application/pdf":
        extractedText = await parsePDF(buffer);
        break;

      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        extractedText = await parseDocx(buffer);
        break;

      case "application/msword":
        extractedText = await parseDoc(buffer);
        break;

      case "text/plain":
        extractedText = parseText(buffer);
        break;

      default:
        extractedText = parseText(buffer);
        break;
    }

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error("No text content could be extracted from the document");
    }

    return extractedText;
  } catch (error) {
    console.error("❌ Document parsing failed:", error);
    throw new Error(
      `Failed to parse ${fileName}: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

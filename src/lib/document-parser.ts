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

async function parseDocx(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error("DOCX parsing failed:", error);
    throw new Error("DOCX parsing failed.");
  }
}

async function parseDoc(buffer: Buffer): Promise<string> {
  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
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

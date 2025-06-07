import { GoogleGenAI } from "@google/genai";
import { env } from "~/env";

if (!env.GOOGLE_GEMINI_API_KEY) {
  throw new Error("GOOGLE_GEMINI_API_KEY is required");
}

const ai = new GoogleGenAI({ apiKey: env.GOOGLE_GEMINI_API_KEY });

export async function parseResumeText(resumeText: string) {
  try {
    const prompt = `
You are an expert resume parser. Extract information from the following resume text and return it as a JSON object with this exact structure:

{
  "personalDetails": {
    "firstName": "string",
    "lastName": "string", 
    "email": "string",
    "phoneNumber": "string",
    "website": "string",
    "linkedinUrl": "string",
    "githubUrl": "string"
  },
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "isAttending": boolean,
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "expectedGradDate": "YYYY-MM-DD",
      "gpa": "string",
      "awards": "string",
      "coursework": "string"
    }
  ],
  "experience": [
    {
      "company": "string",
      "jobTitle": "string",
      "location": "string",
      "startDate": "YYYY-MM-DD", 
      "endDate": "YYYY-MM-DD",
      "achievements": "string",
      "technologies": "string",
      "isCurrentJob": boolean
    }
  ],
  "projects": [
    {
      "name": "string",
      "url": "string",
      "achievements": "string",
      "technologies": "string"
    }
  ],
  "skills": {
    "languages": "string (comma-separated)",
    "frameworks": "string (comma-separated)"
  }
}

IMPORTANT EXTRACTION GUIDELINES:
1. Extract ALL information available in each section - don't leave anything out
2. For education: Include ALL degrees, certifications, courses mentioned
3. For experience: Include ALL jobs, internships, volunteer work
4. For projects: Include ALL projects mentioned with complete details and technologies used
5. For skills: Separate programming languages from frameworks/tools
6. Use actual dates when available, or reasonable estimates based on context
7. If information is missing, use empty string "" or empty array [] - never use null
8. For boolean fields like isCurrentJob/isAttending, determine from context (present tense, "current", etc.)
9. Extract URLs carefully - look for LinkedIn, GitHub, personal websites, project URLs
10. For achievements/descriptions: Convert bullet points to clean, complete sentences. Remove bullet point symbols (•, -, *) and line breaks. Join multiple achievements into a single paragraph with proper sentence structure.

FORMATTING RULES FOR ACHIEVEMENTS:
- Remove all bullet point symbols (•, -, *, etc.)
- Remove line breaks and extra whitespace
- Convert each bullet point into a complete sentence
- Join sentences with proper punctuation and spacing
- Result should be a single, well-formatted paragraph

Resume text to parse:
${resumeText}

Return only the JSON object, no additional text or formatting.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
    });

    const text = response.text;

    if (!text) {
      throw new Error("No response text received from Gemini");
    }

    // Clean up the response to extract JSON
    const jsonRegex = /\{[\s\S]*\}/;
    const jsonMatch = jsonRegex.exec(text);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response");
    }

    const parsedData = JSON.parse(jsonMatch[0]) as Record<string, unknown>;

    return parsedData;
  } catch (error) {
    console.error("Error parsing resume with Gemini:", error);
    throw new Error("Failed to parse resume content");
  }
}

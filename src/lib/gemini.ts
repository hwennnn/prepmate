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
      "achievements": ["string", "string"],
      "technologies": "string",
      "isCurrentJob": boolean
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "url": "string",
      "achievements": ["string", "string"],
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
10. For achievements: Each bullet point should be a separate string in the achievements array

FORMATTING RULES FOR ACHIEVEMENTS:
- achievements should be an ARRAY of strings, not a single string
- Each bullet point becomes a separate array element
- Remove bullet point symbols (•, -, *, etc.) from each achievement
- Clean up each achievement to be a complete, well-formatted sentence
- Do NOT join achievements into a single paragraph - keep them as separate array elements
- Example: ["Increased system performance by 40%", "Led team of 5 developers", "Implemented new authentication system"]

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

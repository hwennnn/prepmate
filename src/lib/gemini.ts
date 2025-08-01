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
    "phoneNumber": "string (omit if not found)",
    "website": "string (omit if not found)",
    "linkedinUrl": "string (omit if not found)",
    "githubUrl": "string (omit if not found)"
  },
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "isAttending": boolean,
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "gpa": "string (omit if not found)",
      "awards": "string (omit if not found)",
      "coursework": "string (omit if not found)"
    }
  ],
  "experience": [
    {
      "company": "string",
      "jobTitle": "string",
      "location": "string",
      "isCurrentJob": boolean,
      "startDate": "YYYY-MM-DD", 
      "endDate": "YYYY-MM-DD (omit if isCurrentJob=true)",
      "achievements": ["string", "string"] (omit if not found),
      "technologies": "string (omit if not found)"
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "url": "string (omit if not found)",
      "achievements": ["string", "string"] (omit if not found),
      "technologies": "string (omit if not found)"
    }
  ],
  "skills": {
    "languages": "string (comma-separated) (omit if not found)",
    "frameworks": "string (comma-separated) (omit if not found)"
  }
}

IMPORTANT EXTRACTION GUIDELINES:
1. Extract ALL information available in each section - don't leave anything out
2. For education: Include ALL degrees, certifications, courses mentioned
3. For experience: Include ALL jobs, internships, volunteer work
4. For projects: Include ALL projects mentioned with complete details and technologies used
5. For skills: Separate programming languages from frameworks/tools
6. Use actual dates when available, or reasonable estimates based on context
7. For boolean fields like isCurrentJob/isAttending, determine from context (present tense, "current", etc.)
8. Extract URLs carefully - look for LinkedIn, GitHub, personal websites, project URLs

MISSING VALUE HANDLING (CRITICAL):
- For REQUIRED fields (firstName, lastName, email, institution, degree, company, jobTitle, location, startDate): Always extract or provide reasonable defaults
- For OPTIONAL fields, OMIT the field entirely from JSON if information is not found in resume:
  * personalDetails: phoneNumber, website, linkedinUrl, githubUrl
  * education: gpa, awards, coursework  
  * experience: endDate (when isCurrentJob=true), achievements, technologies
  * projects: url, achievements, technologies
  * skills: languages, frameworks (omit entire fields if no skills section found)
- NEVER include fields with undefined, null, or empty values - completely omit them from JSON
- This ensures valid JSON that can be parsed without errors

DATE REQUIREMENTS (CRITICAL):
- Education: BOTH startDate and endDate are ALWAYS required (even if currently attending)
- Experience: startDate is ALWAYS required
- Experience: endDate is REQUIRED only if isCurrentJob is false (past positions)
- Experience: endDate should be empty string "" if isCurrentJob is true (current positions)
- For currently attending education, use estimated graduation date for endDate
- Always provide dates in YYYY-MM-DD format

PROJECT STRUCTURE GUIDELINES:
- "description": What the project IS - a clear, concise summary of the project's purpose in 10 words or less, without periods
- "achievements": What you DID or ACCOMPLISHED in the project - specific results, metrics, improvements, or notable implementations
- ONLY include achievements if there are actual accomplishments listed (not just descriptions)
- If the project section only has a brief description without specific accomplishments, leave achievements as an empty array []

FORMATTING RULES FOR ACHIEVEMENTS:
- achievements should be an ARRAY of strings, not a single string
- Each bullet point should represent a specific accomplishment or result
- Remove bullet point symbols (•, -, *, etc.) from each achievement
- Clean up each achievement to be a complete, well-formatted sentence
- Do NOT join achievements into a single paragraph - keep them as separate array elements
- Only include items that show what you accomplished, not what the project does
- Examples of GOOD achievements: ["Increased performance by 40%", "Reduced load time from 3s to 500ms", "Implemented OAuth authentication", "Led team of 3 developers"]
- Examples of what should go in description instead: "Web application for task management", "Mobile app built with React Native"

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

export async function enhanceBulletPoints({
  bulletPoints,
  context,
}: {
  bulletPoints: string[];
  context: {
    type: "experience" | "project";
    title: string; // job title or project name
    company?: string; // for experience
    description?: string; // for projects
  };
}) {
  try {
    const contextDescription =
      context.type === "experience"
        ? `${context.title} at ${context.company}`
        : `${context.title} project${context.description ? `: ${context.description}` : ""}`;

    const prompt = `
You are an expert resume writer and career consultant. Your task is to enhance bullet points for a resume to make them more impactful, specific, and professional while maintaining accuracy and truthfulness.

Context: ${contextDescription}

Original bullet points:
${bulletPoints.map((point, index) => `${index + 1}. ${point}`).join("\n")}

Please enhance these bullet points following these guidelines:

ENHANCEMENT PRINCIPLES:
1. **Action-Oriented**: Start with strong action verbs (Developed, Implemented, Optimized, Led, Created, etc.)
2. **Quantify Impact**: Add realistic metrics, percentages, or numbers where appropriate (but don't fabricate specific numbers)
3. **Show Results**: Focus on outcomes, improvements, and business impact
4. **Use Industry Terms**: Include relevant technical terms and industry language
5. **Maintain Truth**: Only enhance what's already there - don't add fabricated accomplishments
6. **Professional Tone**: Use professional language appropriate for the context
7. **Specificity**: Make vague statements more specific and concrete

WHAT TO ENHANCE:
- Weak verbs → Strong action verbs
- Vague descriptions → Specific, measurable outcomes  
- Technical details → Industry-standard terminology
- Basic tasks → Strategic contributions and impact
- Generic statements → Role-specific achievements

WHAT NOT TO CHANGE:
- Don't add specific numbers/metrics that weren't implied in the original
- Don't change the core meaning or add fake accomplishments
- Don't make claims that can't be substantiated
- Don't add technologies or skills not mentioned in context

FORMAT: Return ONLY a JSON object with this structure:
{
  "enhancedBulletPoints": [
    "Enhanced version of bullet point 1",
    "Enhanced version of bullet point 2",
    ...
  ]
}

Provide exactly ${bulletPoints.length} enhanced bullet points, maintaining the same order as the original.`;

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

    const parsedData = JSON.parse(jsonMatch[0]) as {
      enhancedBulletPoints: string[];
    };

    if (
      !parsedData.enhancedBulletPoints ||
      !Array.isArray(parsedData.enhancedBulletPoints)
    ) {
      throw new Error(
        "Invalid response format - expected enhancedBulletPoints array",
      );
    }

    return parsedData.enhancedBulletPoints;
  } catch (error) {
    console.error("Error enhancing bullet points with Gemini:", error);
    throw new Error("Failed to enhance bullet points");
  }
}

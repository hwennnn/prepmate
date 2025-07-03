import { GoogleGenAI } from "@google/genai";
import { env } from "~/env";

if (!env.GOOGLE_GEMINI_API_KEY) {
  throw new Error("GOOGLE_GEMINI_API_KEY is required");
}

const ai = new GoogleGenAI({ apiKey: env.GOOGLE_GEMINI_API_KEY });

export async function parseResumeText(resumeText: string) {
  try {
    const prompt = `Extract information from this resume text and structure it according to the schema. Extract ALL available information in each section.

Resume text:
${resumeText}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
      config: {
        systemInstruction:
          "You are an expert resume parser that extracts structured information from resume text.",
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            personalDetails: {
              type: "object",
              properties: {
                firstName: {
                  type: "string",
                  description:
                    "Required field. Extract from resume or provide reasonable default.",
                },
                lastName: {
                  type: "string",
                  description:
                    "Required field. Extract from resume or provide reasonable default.",
                },
                email: {
                  type: "string",
                  description:
                    "Required field. Extract from resume or provide reasonable default.",
                },
                phoneNumber: {
                  type: "string",
                  description:
                    "Optional field. Omit entirely if not found in resume.",
                },
                website: {
                  type: "string",
                  description:
                    "Optional field. Extract personal website URL. Omit entirely if not found.",
                },
                linkedinUrl: {
                  type: "string",
                  description:
                    "Optional field. Extract LinkedIn profile URL carefully. Omit entirely if not found.",
                },
                githubUrl: {
                  type: "string",
                  description:
                    "Optional field. Extract GitHub profile URL carefully. Omit entirely if not found.",
                },
              },
              required: ["firstName", "lastName", "email"],
            },
            education: {
              type: "array",
              description:
                "Include ALL degrees, certifications, courses mentioned in the resume.",
              items: {
                type: "object",
                properties: {
                  institution: {
                    type: "string",
                    description:
                      "Required field. Name of educational institution.",
                  },
                  degree: {
                    type: "string",
                    description:
                      "Required field. Degree, certification, or course name.",
                  },
                  isAttending: {
                    type: "boolean",
                    description:
                      "Required field. Determine from context (present tense, 'current', etc.)",
                  },
                  startDate: {
                    type: "string",
                    description:
                      "Required field. YYYY-MM-DD format. Use actual date or reasonable estimate.",
                  },
                  endDate: {
                    type: "string",
                    description:
                      "Required field. YYYY-MM-DD format. For currently attending, use estimated graduation date.",
                  },
                  gpa: {
                    type: "string",
                    description:
                      "Optional field. Omit entirely if not found in resume.",
                  },
                  awards: {
                    type: "string",
                    description:
                      "Optional field. Academic honors or awards. Omit entirely if not found.",
                  },
                  coursework: {
                    type: "string",
                    description:
                      "Optional field. Relevant coursework mentioned. Omit entirely if not found.",
                  },
                },
                required: [
                  "institution",
                  "degree",
                  "isAttending",
                  "startDate",
                  "endDate",
                ],
              },
            },
            experience: {
              type: "array",
              description:
                "Include ALL jobs, internships, volunteer work mentioned in the resume.",
              items: {
                type: "object",
                properties: {
                  company: {
                    type: "string",
                    description:
                      "Required field. Company or organization name.",
                  },
                  jobTitle: {
                    type: "string",
                    description: "Required field. Position or role title.",
                  },
                  location: {
                    type: "string",
                    description:
                      "Required field. Work location (city, state/country).",
                  },
                  isCurrentJob: {
                    type: "boolean",
                    description:
                      "Required field. Determine from context (present tense, 'current', etc.)",
                  },
                  startDate: {
                    type: "string",
                    description:
                      "Required field. YYYY-MM-DD format. Use actual date or reasonable estimate.",
                  },
                  endDate: {
                    type: "string",
                    description:
                      "Required only if isCurrentJob is false. YYYY-MM-DD format. Omit entirely if current job.",
                  },
                  achievements: {
                    type: "array",
                    items: { type: "string" },
                    description:
                      "Optional field. Array of specific accomplishments or results. Each should be a complete sentence without bullet symbols. Examples: 'Increased performance by 40%', 'Led team of 3 developers'. Omit entirely if no accomplishments listed.",
                  },
                  technologies: {
                    type: "string",
                    description:
                      "Optional field. Technologies or tools used in this role. Omit entirely if not found.",
                  },
                },
                required: [
                  "company",
                  "jobTitle",
                  "location",
                  "isCurrentJob",
                  "startDate",
                ],
              },
            },
            projects: {
              type: "array",
              description:
                "Include ALL projects mentioned with complete details and technologies used.",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Required field. Project name or title.",
                  },
                  description: {
                    type: "string",
                    description:
                      "Required field. What the project IS - a clear, concise summary of the project's purpose in 10 words or less, without periods. Example: 'Web application for task management'",
                  },
                  url: {
                    type: "string",
                    description:
                      "Optional field. Project URL (GitHub, live demo, etc.). Omit entirely if not found.",
                  },
                  achievements: {
                    type: "array",
                    items: { type: "string" },
                    description:
                      "Optional field. What you DID or ACCOMPLISHED in the project - specific results, metrics, improvements. Each should be a complete sentence without bullet symbols. Only include if actual accomplishments are listed, not just descriptions. Leave as empty array if only brief description without accomplishments. Omit entirely if no achievements found.",
                  },
                  technologies: {
                    type: "string",
                    description:
                      "Optional field. Technologies, frameworks, or tools used. Omit entirely if not found.",
                  },
                },
                required: ["name", "description"],
              },
            },
            skills: {
              type: "object",
              description:
                "Separate programming languages from frameworks/tools. Omit entire fields if no skills section found.",
              properties: {
                languages: {
                  type: "string",
                  description:
                    "Optional field. Comma-separated programming languages only. Omit entirely if not found.",
                },
                frameworks: {
                  type: "string",
                  description:
                    "Optional field. Comma-separated frameworks, libraries, and tools (not programming languages). Omit entirely if not found.",
                },
              },
            },
          },
          required: [
            "personalDetails",
            "education",
            "experience",
            "projects",
            "skills",
          ],
        },
      },
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

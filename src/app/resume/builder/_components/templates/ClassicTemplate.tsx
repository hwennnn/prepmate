import type { OnboardingFormData } from "~/app/_components/onboarding/types";
import { formatDateRange } from "../../../../../lib/date";

interface ClassicTemplateProps {
  data: OnboardingFormData;
}

export default function ClassicTemplate({ data }: ClassicTemplateProps) {
  return (
    <div className="min-h-full p-8 font-serif text-xs text-black">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-black">
          {data.personalDetails.firstName} {data.personalDetails.lastName}
        </h1>
        <div className="text-black">
          <a
            href={`mailto:${data.personalDetails.email}`}
            className="hover:underline"
          >
            {data.personalDetails.email}
          </a>
          {data.personalDetails.phoneNumber && (
            <>
              {" | "}
              <a
                href={`tel:${data.personalDetails.phoneNumber}`}
                className="hover:underline"
              >
                {data.personalDetails.phoneNumber}
              </a>
            </>
          )}
          {data.personalDetails.website && (
            <>
              {" | "}
              <a
                href={
                  data.personalDetails.website.startsWith("http")
                    ? data.personalDetails.website
                    : `https://${data.personalDetails.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {data.personalDetails.website}
              </a>
            </>
          )}
        </div>
      </div>

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-6 break-inside-avoid">
          <h2 className="mb-2 border-b border-black text-lg font-bold text-black">
            EDUCATION
          </h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-3 break-inside-avoid">
              <div className="flex justify-between">
                <span className="font-bold text-black">{edu.institution}</span>
                <span className="text-black">
                  {formatDateRange(edu.startDate, edu.endDate, edu.isAttending)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-black italic">{edu.degree}</span>
                {edu.gpa && <span className="text-black">GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-6 break-inside-avoid">
          <h2 className="mb-2 border-b border-black text-lg font-bold text-black">
            PROFESSIONAL EXPERIENCE
          </h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4 break-inside-avoid">
              <div className="flex justify-between">
                <span className="font-bold text-black">
                  {exp.company}, {exp.location}
                </span>
                <span className="text-black">
                  {formatDateRange(
                    exp.startDate,
                    exp.endDate,
                    exp.isCurrentJob,
                  )}
                </span>
              </div>
              <div className="mb-1 text-black italic">{exp.jobTitle}</div>
              {exp.achievements?.map((achievement, achIndex) => (
                <div key={achIndex} className="text-xs text-black">
                  • {achievement}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-6 break-inside-avoid">
          <h2 className="mb-2 border-b border-black text-lg font-bold text-black">
            PROJECTS
          </h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-2 break-inside-avoid text-black">
              • <span className="font-bold">{project.name}</span>:{" "}
              {project.description}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills && (
        <div className="break-inside-avoid">
          <h2 className="mb-2 border-b border-black text-lg font-bold text-black">
            TECHNICAL SKILLS
          </h2>
          {data.skills.languages && (
            <div className="mb-1 text-black">
              • <span className="font-bold">Programming Languages:</span>{" "}
              {data.skills.languages}
            </div>
          )}
          {data.skills.frameworks && (
            <div className="text-black">
              • <span className="font-bold">Technologies & Frameworks:</span>{" "}
              {data.skills.frameworks}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import type { OnboardingFormData } from "~/app/_components/onboarding/types";
import { formatDateRange } from "../../../../../lib/date";

interface ModernTemplateProps {
  data: OnboardingFormData;
}

export default function ModernTemplate({ data }: ModernTemplateProps) {
  return (
    <div className="min-h-full p-8 text-xs text-black">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-black">
          {data.personalDetails.firstName}{" "}
          <span className="underline">{data.personalDetails.lastName}</span>
        </h1>
        <div className="space-x-2 text-blue-600">
          <a
            href={`mailto:${data.personalDetails.email}`}
            className="hover:underline"
          >
            {data.personalDetails.email}
          </a>
          {data.personalDetails.phoneNumber && (
            <>
              <span>|</span>
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
              <span>|</span>
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
          {data.personalDetails.githubUrl && (
            <>
              <span>|</span>
              <a
                href={
                  data.personalDetails.githubUrl.startsWith("http")
                    ? data.personalDetails.githubUrl
                    : `https://${data.personalDetails.githubUrl}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {data.personalDetails.githubUrl}
              </a>
            </>
          )}
        </div>
      </div>

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-6 break-inside-avoid">
          <h2 className="mb-2 text-xs font-bold text-black uppercase">
            Education
          </h2>
          <div className="mb-3 border-b-2 border-gray-300"></div>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-3 break-inside-avoid">
              <div className="flex justify-between">
                <span className="font-bold text-black">{edu.institution}</span>
                <span className="text-black">
                  {formatDateRange(edu.startDate, edu.endDate, edu.isAttending)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">{edu.degree}</span>
                {edu.gpa && <span className="text-black">GPA: {edu.gpa}</span>}
              </div>
              {edu.coursework && (
                <div className="mt-1 text-xs text-black">
                  • {edu.coursework}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-6 break-inside-avoid">
          <h2 className="mb-2 text-xs font-bold text-black uppercase">
            Experience
          </h2>
          <div className="mb-3 border-b-2 border-gray-300"></div>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4 break-inside-avoid">
              <div className="flex justify-between">
                <span className="font-bold text-black">{exp.company}</span>
                <span className="text-black">
                  {formatDateRange(
                    exp.startDate,
                    exp.endDate,
                    exp.isCurrentJob,
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">{exp.jobTitle}</span>
                <span className="text-black">{exp.location}</span>
              </div>
              {exp.achievements?.map((achievement, achIndex) => (
                <div key={achIndex} className="mt-1 text-xs text-black">
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
          <h2 className="mb-2 text-xs font-bold text-black uppercase">
            Projects
          </h2>
          <div className="mb-3 border-b-2 border-gray-300"></div>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-2 break-inside-avoid">
              <span className="font-bold text-blue-600 underline">
                {project.name}
              </span>
              <span className="text-black">: {project.description}</span>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills && (
        <div className="break-inside-avoid">
          <h2 className="mb-2 text-xs font-bold text-black uppercase">
            Skills
          </h2>
          <div className="mb-3 border-b-2 border-gray-300"></div>
          {data.skills.languages && (
            <div className="mb-1 text-black">
              <span className="font-bold">Languages:</span>{" "}
              {data.skills.languages}
            </div>
          )}
          {data.skills.frameworks && (
            <div className="text-black">
              <span className="font-bold">Technologies:</span>{" "}
              {data.skills.frameworks}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

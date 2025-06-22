import type { OnboardingFormData } from "~/app/_components/onboarding/types";
import { formatDateRange } from "../../../../../lib/date";

interface CreativeTemplateProps {
  data: OnboardingFormData;
}

export default function CreativeTemplate({ data }: CreativeTemplateProps) {
  return (
    <div className="min-h-full text-xs text-black">
      {/* Creative Header with Gradient */}
      <div className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <h1 className="mb-2 text-2xl font-bold">
          {data.personalDetails.firstName}{" "}
          <span className="italic">{data.personalDetails.lastName}</span>
        </h1>
        <div>
          <a
            href={`mailto:${data.personalDetails.email}`}
            className="text-white hover:underline"
          >
            {data.personalDetails.email}
          </a>
          {data.personalDetails.phoneNumber && (
            <>
              {" • "}
              <a
                href={`tel:${data.personalDetails.phoneNumber}`}
                className="text-white hover:underline"
              >
                {data.personalDetails.phoneNumber}
              </a>
            </>
          )}
          {data.personalDetails.website && (
            <>
              {" • "}
              <a
                href={
                  data.personalDetails.website.startsWith("http")
                    ? data.personalDetails.website
                    : `https://${data.personalDetails.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:underline"
              >
                {data.personalDetails.website}
              </a>
            </>
          )}
        </div>
      </div>

      <div className="px-6">
        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div className="mb-6 break-inside-avoid">
            <h2 className="mb-3 flex items-center text-lg font-bold text-blue-600">
              💼 PROFESSIONAL EXPERIENCE
            </h2>
            {data.experience.map((exp, index) => (
              <div
                key={index}
                className="mb-4 break-inside-avoid rounded border-l-4 border-blue-600 bg-slate-50 p-3"
              >
                <div className="flex justify-between">
                  <span className="font-bold text-blue-600">{exp.company}</span>
                  <span className="text-black italic">
                    {formatDateRange(
                      exp.startDate,
                      exp.endDate,
                      exp.isCurrentJob,
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black">
                    {exp.jobTitle}
                  </span>
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

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div className="mb-6 break-inside-avoid">
            <h2 className="mb-3 flex items-center text-lg font-bold text-blue-600">
              🎓 EDUCATION
            </h2>
            {data.education.map((edu, index) => (
              <div
                key={index}
                className="mb-3 break-inside-avoid rounded border border-blue-600 bg-blue-50 p-3"
              >
                <div className="flex justify-between">
                  <span className="font-bold text-blue-600">
                    {edu.institution}
                  </span>
                  <span className="text-black">
                    {formatDateRange(
                      edu.startDate,
                      edu.endDate,
                      edu.isAttending,
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black italic">{edu.degree}</span>
                  {edu.gpa && (
                    <span className="text-black">GPA: {edu.gpa}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div className="mb-6 break-inside-avoid">
            <h2 className="mb-3 flex items-center text-lg font-bold text-blue-600">
              🚀 FEATURED PROJECTS
            </h2>
            <div className="rounded border border-red-200 bg-red-50 p-3">
              {data.projects.map((project, index) => (
                <div key={index} className="mb-2 break-inside-avoid text-black">
                  • <span className="font-bold">{project.name}</span>:{" "}
                  {project.description}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills && (
          <div className="break-inside-avoid">
            <h2 className="mb-3 flex items-center text-lg font-bold text-blue-600">
              ⚡ TECHNICAL SKILLS
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {data.skills.languages && (
                <div className="text-black">
                  <span className="font-bold">Languages</span>
                  <br />
                  {data.skills.languages}
                </div>
              )}
              {data.skills.frameworks && (
                <div className="text-black">
                  <span className="font-bold">Technologies</span>
                  <br />
                  {data.skills.frameworks}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

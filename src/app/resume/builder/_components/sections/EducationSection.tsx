import React from "react";
import { ResumeSectionTitle } from "./ResumeComponents";
import type { OnboardingFormData } from "~/app/_components/onboarding/types";
import { formatDateRange } from "~/lib/date";
import { getThemeClasses } from "~/app/resume/builder/_components/templates/theme-classes";

interface EducationSectionProps {
  education: OnboardingFormData["education"];
  templateId: string;
}

export function EducationSection({
  education,
  templateId,
}: EducationSectionProps) {
  const classes = getThemeClasses(templateId);

  if (!education || education.length === 0) {
    return null;
  }

  //Sort Education by date
  const sortedEducation = education.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );

  return (
    <div className={classes.section.wrapper}>
      <ResumeSectionTitle title="Education" templateId={templateId} />
      {sortedEducation.map((edu, index) => (
        <div key={index} className={classes.education.item}>
          <div className="mb-1 flex justify-between">
            <span className={classes.education.institution}>
              {edu.institution}
            </span>
            <span className={classes.education.date}>
              {formatDateRange(edu.startDate, edu.endDate, edu.isAttending)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={classes.education.degree}>{edu.degree}</span>
            {/* TODO: ADD A THRESHOLD TO INCLUDE / OPTIONAL */}
            {edu.gpa && (
              <span className={classes.education.gpa}>GPA: {edu.gpa}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

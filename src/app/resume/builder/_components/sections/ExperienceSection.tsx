import React from "react";
import { ResumeSectionTitle } from "./ResumeComponents";
import type { OnboardingFormData } from "~/app/_components/onboarding/types";
import { formatDateRange } from "~/lib/date";
import { getThemeClasses } from "~/app/resume/builder/_components/templates/theme-classes";

interface WorkExperienceSectionProps {
  experience: OnboardingFormData["experience"];
  templateId: string;
}

export function ExperienceSection({
  experience,
  templateId,
}: WorkExperienceSectionProps) {
  const classes = getThemeClasses(templateId);

  if (!experience || experience.length === 0) {
    return null;
  }

  // Sort experience by date
  const sortedExperience = experience.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );

  return (
    <div className={classes.section.wrapper}>
      <ResumeSectionTitle title="Work Experience" templateId={templateId} />
      {sortedExperience.map((job, index) => (
        <div key={index} className={classes.experience.item}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={classes.experience.company}>
                  {job.company}
                </span>
                <span>•</span>
                <span className={classes.experience.location}>
                  {job.location}
                </span>
              </div>
              <div className={classes.experience.title}>{job.jobTitle}</div>
            </div>
            <div className={classes.experience.date}>
              {formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}
            </div>
          </div>
          {job.achievements && job.achievements.length > 0 && (
            <ul className={classes.experience.achievementList}>
              {job.achievements.map((achievement, achIndex) => (
                <li key={achIndex} className={classes.experience.achievement}>
                  {achievement}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

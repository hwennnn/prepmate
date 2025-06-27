import type { OnboardingFormData } from "~/app/_components/onboarding/types";
import { getThemeClasses } from "~/app/resume/builder/_components/templates/theme-classes";
import { formatDateRange } from "~/lib/date";
import { ResumeSectionTitle } from "./ResumeComponents";

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
          <div className="mb-1 flex justify-between">
            <span className={classes.experience.company}>{job.company}</span>
            <span className={classes.experience.date}>
              {formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={classes.experience.title}>{job.jobTitle}</span>
            <span className={classes.experience.location}>{job.location}</span>
          </div>
          {((job.achievements && job.achievements.length > 0) ??
            job.technologies) && (
            <ul className={classes.experience.achievementList}>
              {job.achievements?.map((achievement, achIndex) => (
                <li key={achIndex}>{achievement}</li>
              ))}
              {job.technologies && (
                <li>
                  <span className="font-semibold">Technologies: </span>
                  {job.technologies}
                </li>
              )}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

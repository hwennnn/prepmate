import type { OnboardingFormData } from "~/app/_components/onboarding/types";
import { getThemeClasses } from "~/app/resume/builder/_components/templates/theme-classes";
import {
  ResumeHeader,
  EducationSection,
  ExperienceSection,
  ProjectSection,
  SkillsSection,
} from "~/app/resume/builder/_components/sections";

interface UniversalTemplateProps {
  data: OnboardingFormData;
  templateId: string;
}

export default function UniversalTemplate({
  data,
  templateId,
}: UniversalTemplateProps) {
  const classes = getThemeClasses(templateId);

  return (
    <div className={classes.container}>
      {/* Header */}
      <ResumeHeader profile={data} templateId={templateId} />

      {/* Education */}
      <EducationSection education={data.education} templateId={templateId} />

      {/* Experience */}
      <ExperienceSection experience={data.experience} templateId={templateId} />

      {/* Projects */}
      <ProjectSection projects={data.projects} templateId={templateId} />

      {/* Skills */}
      <SkillsSection skills={data.skills} templateId={templateId} />
    </div>
  );
}

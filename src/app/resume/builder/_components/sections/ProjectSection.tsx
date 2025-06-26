import React from "react";
import { ResumeSectionTitle } from "./ResumeComponents";
import type { OnboardingFormData } from "~/app/_components/onboarding/types";
import { getThemeClasses } from "~/app/resume/builder/_components/templates/theme-classes";

interface ProjectSectionProps {
  projects: OnboardingFormData["projects"];
  templateId: string;
}

export function ProjectSection({ projects, templateId }: ProjectSectionProps) {
  const classes = getThemeClasses(templateId);

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div className={classes.section.wrapper}>
      <ResumeSectionTitle title="Projects" templateId={templateId} />
      {projects.map((project, index) => (
        <div key={index} className={classes.projects.item}>
          <div className="mb-1">
            <span className={classes.projects.name}>
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  {project.name}
                </a>
              ) : (
                project.name
              )}
            </span>
            {project.description && (
              <span className={classes.projects.description}>
                | {project.description}
              </span>
            )}
            {project.technologies && (
              <span className={classes.projects.technology}>
                | {project.technologies}
              </span>
            )}
          </div>
          {/* TODO: MAKE THIS AN OPTIONAL FIELD */}
          {project.achievements && project.achievements.length > 0 && (
            <ul className={classes.projects.achievementList}>
              {project.achievements.map((achievement, achIndex) => (
                <li key={achIndex}>{achievement}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

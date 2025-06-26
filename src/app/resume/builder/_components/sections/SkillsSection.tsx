import React from "react";
import { ResumeSectionTitle } from "./ResumeComponents";
import type { OnboardingFormData } from "~/app/_components/onboarding/types";
import { getThemeClasses } from "~/app/resume/builder/_components/templates/theme-classes";

interface TechnicalSkillsSectionProps {
  skills?: OnboardingFormData["skills"];
  templateId: string;
}

export function SkillsSection({ skills, templateId }: TechnicalSkillsSectionProps) {
  const classes = getThemeClasses(templateId);

  if (!skills || (!skills.languages && !skills.frameworks)) {
    return null;
  }

	const skillCategories = [];
  
  if (skills.languages) {
    skillCategories.push({
      category: 'Languages',
      //items: skills.languages.split(',').map(item => item.trim())
      items: skills.languages.split(',').map(item => item.trim()).join(', ')
    });
  }
  
  if (skills.frameworks) {
    skillCategories.push({
      category: 'Frameworks & Tools',
      //items: skills.frameworks.split(',').map(item => item.trim())
      items: skills.frameworks.split(',').map(item => item.trim()).join(', ')
    });
  }

  return (
    <div className={classes.section.wrapper}>
      <ResumeSectionTitle title="Technical Skills" templateId={templateId} />
      <div className={classes.skills.container}>
        {skillCategories.map((skillCategory, index) => (
          <div key={index} className="flex">
            <span className={classes.skills.category}>{skillCategory.category}: </span>
            <span className={classes.skills.items}>{skillCategory.items}</span>
          </div>
        ))}
      </div>
      {/*skills.languages && skills.frameworks && 
        skillCategories.map((skillCategory, index) => (
          <div key={index} className="flex">
            <span className="font-medium text-gray-800 min-w-32">{skillCategory.category}:</span>
            <span className="text-gray-700">{skillCategory.items.join(', ')}</span>
          </div>
        ))
      */}
    </div>
  );
};

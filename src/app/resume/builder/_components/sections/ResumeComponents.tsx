import type { OnboardingFormData } from "~/app/_components/onboarding/types";
import React from "react";
import { getThemeClasses } from "~/app/resume/builder/_components/templates/theme-classes";

interface ResumeHeaderProps {
  profile?: OnboardingFormData;
  templateId: string;
}

interface ResumeSectionTitleProps {
  title: string;
  templateId: string;
}

// Header Component
export function ResumeHeader({ profile, templateId }: ResumeHeaderProps) {
  const classes = getThemeClasses(templateId);

  if (!profile) return null;

  return (
    <>
      {profile && (
        <div className={classes.header.wrapper}>
          <h1 className={classes.header.name}>
            {profile.personalDetails.firstName}{" "}
            {profile.personalDetails.lastName}
          </h1>
          <div className={classes.header.contact.container}>
            {profile.personalDetails.phoneNumber && (
              <div className={classes.header.contact.item}>
                <span>
                  <a
                    href={`tel:${profile.personalDetails.phoneNumber}`}
                    className={classes.header.contact.link}
                  >
                    {profile.personalDetails.phoneNumber}
                  </a>
                </span>
              </div>
            )}
            {profile.personalDetails.website && (
              <div className={classes.header.contact.item}>
                <span className={classes.header.contact.separator}>|</span>
                <span>
                  <a
                    href={
                      profile.personalDetails.website.startsWith("http")
                        ? profile.personalDetails.website
                        : `https://${profile.personalDetails.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.header.contact.link}
                  >
                    {profile.personalDetails.website}
                  </a>
                </span>
              </div>
            )}
            {profile.personalDetails.email && (
              <div className={classes.header.contact.item}>
                <span className={classes.header.contact.separator}>|</span>
                <span>
                  <a
                    href={`mailto:${profile.personalDetails.email}`}
                    className={classes.header.contact.link}
                  >
                    {profile.personalDetails.email}
                  </a>
                </span>
              </div>
            )}
            {profile.personalDetails.linkedinUrl && (
              <div className={classes.header.contact.item}>
                <span className={classes.header.contact.separator}>|</span>
                <span>
                  <a
                    href={profile.personalDetails.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.header.contact.link}
                  >
                    {profile.personalDetails.linkedinUrl}
                  </a>
                </span>
              </div>
            )}
            {profile.personalDetails.githubUrl && (
              <div className={classes.header.contact.item}>
                <span className={classes.header.contact.separator}>|</span>
                <span>
                  <a
                    href={profile.personalDetails.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.header.contact.link}
                  >
                    {profile.personalDetails.githubUrl}
                  </a>
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Section Header Component
export function ResumeSectionTitle({
  title,
  templateId,
}: ResumeSectionTitleProps) {
  const classes = getThemeClasses(templateId);


  return <h2 className={classes.section.title}> {title}</h2>;
}

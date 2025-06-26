import type { OnboardingFormData } from "~/app/_components/onboarding/types";
import React from "react";
// import { Mail, Phone, Linkedin, Github, Globe, } from "lucide-react";
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
          {" "}
          {/* modern: header.containerStyle my-6 text-center */}
          <h1 className={classes.header.name}>
            {" "}
            {/* modern: header.nameStyle mb-2 text-3xl font-bold font-serif text-gray-800*/}
            {profile.personalDetails.firstName}{" "}
            {profile.personalDetails.lastName}
          </h1>
          <div className={classes.header.contact.container}>
            {" "}
            {/* modern: header.contactStyle flex justify-center items-center gap-2 mb-3 */}
            {profile.personalDetails.phoneNumber && (
              <div className={classes.header.contact.item}>
                {" "}
                {/* modern: header.contactItemStyle */}
                {/* <Phone size={14} /> */}
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
                {" "}
                {/* modern: header.contactItemStyle */}
                <span className={classes.header.contact.separator}>|</span>
                {/*<Globe size={14} /> */}
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
                {" "}
                {/* modern: header.contactItemStyle */}
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
                {" "}
                {/* modern: header.contactItemStyle */}
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
                {" "}
                {/* modern: header.contactItemStyle */}
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

  return (
    <h2 className={classes.section.title}>
      {" "}
      {/* modern: section.titleStyle "mb-2 border-b border-black text-lg font-bold text-black"*/}
      {title}
    </h2>
  );
}

export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

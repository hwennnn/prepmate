import type { Template } from "@prisma/client";

/*
 *  Library imports contain the typst functions for resumes
 *  They are taken from github and creators are creddited
 *  The import directory should contain - resume.typ and lib.typ
 *  	- resume.typ : where main resume templating functions are defined
 * 		- lib.typ : entry point to the resume functions
 *  For additional templates (future), add the mapping below
 */

export const templateLibs: Record<Template["id"], string> = {
  // TemplateID: import directory name
  classic: "simple-technical-resume",
  modern: "basic-resume",
  creative: "vercanard",
  // add more here
} as const;

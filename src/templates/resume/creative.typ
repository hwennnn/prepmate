#import "@preview/resume-ng:1.0.0": *

// Creative template using resume-ng package (placeholder)
// TODO: Replace with more creative template later
// Maps to your OnboardingFormData structure

#let creative-resume(data) = {
  // Extract personal details
  let personal = data.personalDetails
  
  // Build contacts array
  let contacts = ()
  if personal.phoneNumber != none and personal.phoneNumber != "" {
    contacts.push(personal.phoneNumber)
  }
  if personal.email != none {
    contacts.push(link("mailto:" + personal.email, personal.email))
  }
  if personal.githubUrl != none and personal.githubUrl != "" {
    contacts.push(link(personal.githubUrl, "GitHub"))
  }
  if personal.linkedinUrl != none and personal.linkedinUrl != "" {
    contacts.push(link(personal.linkedinUrl, "LinkedIn"))
  }
  if personal.website != none and personal.website != "" {
    contacts.push(link(personal.website, "Portfolio"))
  }

  // Configure the resume-ng template
  show: project.with(
    title: "Resume",
    author: (name: personal.firstName + " " + personal.lastName),
    contacts: contacts
  )

  // Education Section
  if data.education != none and data.education.len() > 0 {
    resume-section("Education")
    for edu in data.education {
      let endDateStr = if edu.isAttending { "Present" } else { edu.endDate.display("[year]-[month repr:numerical padding:zero]") }
      
      resume-education(
        university: edu.institution,
        degree: edu.degree,
        school: "", 
        start: edu.startDate.display("[year]-[month repr:numerical padding:zero]"),
        end: endDateStr
      )[
        #if edu.gpa != none and edu.gpa != "" [
          *GPA: #edu.gpa*. 
        ]
        #if edu.awards != none and edu.awards != "" [
          Awards: #edu.awards. 
        ]
        #if edu.coursework != none and edu.coursework != "" [
          Relevant Coursework: #edu.coursework.
        ]
      ]
    }
  }

  // Experience Section
  if data.experience != none and data.experience.len() > 0 {
    resume-section("Experience")
    for exp in data.experience {
      let endDateStr = if exp.isCurrentJob { "Present" } else { exp.endDate.display("[year]-[month repr:numerical padding:zero]") }
      
      resume-work(
        company: exp.company,
        duty: exp.jobTitle,
        start: exp.startDate.display("[year]-[month repr:numerical padding:zero]"),
        end: endDateStr,
        location: exp.location
      )[
        #if exp.achievements != none {
          for achievement in exp.achievements [
            • #achievement
          ]
        }
        #if exp.technologies != none and exp.technologies != "" [
          
          *Technologies used:* #exp.technologies
        ]
      ]
    }
  }

  // Projects Section
  if data.projects != none and data.projects.len() > 0 {
    resume-section("Projects")
    for project in data.projects {
      resume-work(
        company: project.name,
        duty: if project.url != none and project.url != "" { link(project.url, "View Project") } else { "Personal Project" },
        start: "",
        end: "",
        location: ""
      )[
        #project.description
        
        #if project.achievements != none {
          for achievement in project.achievements [
            • #achievement
          ]
        }
        #if project.technologies != none and project.technologies != "" [
          
          *Technologies:* #project.technologies
        ]
      ]
    }
  }

  // Skills Section
  if data.skills != none {
    resume-section("Technical Skills")
    if data.skills.languages != none and data.skills.languages != "" [
      *Programming Languages:* #data.skills.languages
      
    ]
    if data.skills.frameworks != none and data.skills.frameworks != "" [
      *Frameworks & Technologies:* #data.skills.frameworks
    ]
  }
}
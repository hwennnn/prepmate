#import "@preview/modern-cv:0.8.0": *

// Modern template using modern-cv package
// Maps to your OnboardingFormData structure

#let modern-resume(data) = {
  // Extract personal details
  let personal = data.personalDetails
  
  // Extract GitHub username from URL if present
  let github-username = if personal.githubUrl != none {
    let url = personal.githubUrl
    if url.contains("github.com/") {
      url.split("github.com/").at(1).split("/").at(0)
    } else { none }
  } else { none }
  
  // Extract LinkedIn username from URL if present  
  let linkedin-username = if personal.linkedinUrl != none {
    let url = personal.linkedinUrl
    if url.contains("linkedin.com/in/") {
      url.split("linkedin.com/in/").at(1).split("/").at(0)
    } else { none }
  } else { none }

  // Configure the modern CV template
  show: resume.with(
    author: (
      firstname: personal.firstName,
      lastname: personal.lastName,
      email: personal.email,
      phone: personal.phoneNumber,
      github: github-username,
      linkedin: linkedin-username,
      address: "", // Not in your current schema
      positions: () // Could be extracted from experience
    ),
    date: datetime.today().display(),
    page-size: "us-letter"
  )

  // Education Section
  if data.education != none and data.education.len() > 0 {
    cvsection("Education")
    for edu in data.education {
      let endDateStr = if edu.isAttending { "Present" } else { edu.endDate.display("[month repr:short] [year]") }
      
      cventry(
        title: edu.degree,
        company-or-university: edu.institution,
        date: edu.startDate.display("[month repr:short] [year]") + " - " + endDateStr,
        location: "", // Not in your schema
        description: [
          #if edu.gpa != none and edu.gpa != "" [
            *GPA:* #edu.gpa \
          ]
          #if edu.awards != none and edu.awards != "" [
            *Awards:* #edu.awards \
          ]
          #if edu.coursework != none and edu.coursework != "" [
            *Relevant Coursework:* #edu.coursework
          ]
        ]
      )
    }
  }

  // Experience Section
  if data.experience != none and data.experience.len() > 0 {
    cvsection("Experience")
    for exp in data.experience {
      let endDateStr = if exp.isCurrentJob { "Present" } else { exp.endDate.display("[month repr:short] [year]") }
      
      cventry(
        title: exp.jobTitle,
        company-or-university: exp.company,
        date: exp.startDate.display("[month repr:short] [year]") + " - " + endDateStr,
        location: exp.location,
        description: [
          #if exp.achievements != none {
            for achievement in exp.achievements [
              • #achievement \
            ]
          }
          #if exp.technologies != none and exp.technologies != "" [
            *Technologies:* #exp.technologies
          ]
        ]
      )
    }
  }

  // Projects Section
  if data.projects != none and data.projects.len() > 0 {
    cvsection("Projects")
    for project in data.projects {
      cventry(
        title: project.name,
        company-or-university: if project.url != none and project.url != "" { link(project.url) } else { "" },
        date: "",
        location: "",
        description: [
          #project.description \
          #if project.achievements != none {
            for achievement in project.achievements [
              • #achievement \
            ]
          }
          #if project.technologies != none and project.technologies != "" [
            *Technologies:* #project.technologies
          ]
        ]
      )
    }
  }

  // Skills Section
  if data.skills != none {
    cvsection("Skills")
    if data.skills.languages != none and data.skills.languages != "" [
      *Programming Languages:* #data.skills.languages \
    ]
    if data.skills.frameworks != none and data.skills.frameworks != "" [
      *Frameworks & Technologies:* #data.skills.frameworks
    ]
  }
}
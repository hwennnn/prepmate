// Modern template using basic-resume package

// Importing the resume template function library locally
#import "/libraries/basic-resume/lib.typ": *

// ================= Utility function ===============
// Remove https or http in urls
#let linkParse(link) = {
	if link.starts-with("https") {
    link.replace("https://", "")
  } else if link.starts-with("http") {
    link.replace("http://", "")
  } else {
    link
  }
}

// Date formatting
#let format-date(date) = {
  // Define an array of three-letter month names
  let months = (
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  )
  
  // Split the input string into parts
  let parts = date.split("-")
  let year = parts.at(0)
  let monthNum = int(parts.at(1))
  
  let month = months.at(monthNum - 1)

  // Return formatted string
  [#month #year]
}

// =========== End of Utility Functions =============

// ================== MAIN =====================

#let modern-template(data) = {
  let personal = data.personalDetails

  show: resume.with(
    author: personal.firstName + " " + personal.lastName,
    location: "",
    email: personal.email,
    github: linkParse(personal.githubUrl),
    linkedin: linkParse(personal.linkedinUrl),
    phone: personal.phoneNumber,
    personal-site: linkParse(personal.website),
    accent-color: "#26428b",
    font: "New Computer Modern",
    paper: "a4",
    author-position: center,
    personal-info-position: center,
  )

  [== Education]
  for ed in data.education {
    edu(
      institution: ed.institution,
      location: "",
      dates: if ed.isAttending {
        dates-helper(
          start-date: format-date(ed.startDate),
          end-date: "Present"
        )
      } else {
        dates-helper(
          start-date: format-date(ed.startDate),
          end-date: format-date(ed.endDate)
        )
      },
      degree: ed.degree
    )
    [
      - Cumulative GPA: #ed.gpa
      #if ed.awards != "" { [- *Awards:* #ed.awards] }
      #if ed.coursework != "" { [- *Relevant Coursework:* #ed.coursework] }
    ]
  }

  [== Work Experience]
  for exp in data.experience {
    work(
      title: exp.jobTitle,
      location: exp.location,
      company: exp.company,
      dates: if exp.isCurrentJob { // Start to End Date
        dates-helper(
          start-date: format-date(exp.startDate),
          end-date: "Present"
        )
      } else {
        dates-helper(
          start-date: format-date(exp.startDate),
          end-date: format-date(exp.endDate)
        )
      }
    )
    [
      #for achievement in exp.achievements [ - #achievement ]
      #if exp.technologies != "" {[- *Technologies:* #exp.technologies]}
    ]
  }

  [== Projects]
  for proj in data.projects {
    project(
      name: proj.name,
      //role: 
      //dates:
      url: proj.url
    )
    [
      - #proj.description
      #for achievement in proj.achievements [
        - #achievement
      ]
    ]
  }

  [== Skills]
  [ - *Programming Languages*: #data.skills.languages]
  [ - *Frameworks and Technologies*: #data.skills.frameworks]
}
// ================== END OF MAIN =====================

// Defining data
#let data = json.decode(sys.inputs.data)

// Call the template
#modern-template(data)
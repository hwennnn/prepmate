// Creative template using vercanard package

// Importing the resume template function library locally
#import "/libraries/vercanard/lib.typ": *

// ================= Utility function ===============
// Remove https or http in urls
#let linkParse(url) = {
  if url.starts-with("https") {
    url.replace("https://", "")
  } else if url.starts-with("http") {
    url.replace("http://", "")
  } else {
    url
  }
}

#let githubParse(url) = {
  if url.contains("github") {
    url.split("github.com/").at(1)
  } else {
    url
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
#let creative-template(data) = {
  let personal = data.personalDetails
  
  show: resume.with(
    name: personal.firstName + " " + personal.lastName,
    title: "",
    accent-color: rgb("f3bc54"),
    margin: 1.6cm,
    aside: [
      // Contact Info
      = Contact
      - #link("mailto:" + personal.email)
      - #personal.phoneNumber
      - #link(personal.website)
      - #link(personal.githubUrl)
      - #link(personal.linkedinUrl)

      // Skills
      = Skills
      - *Programming Languages:*
      #tagListStyle(data.skills.languages.split(", ").split(",").flatten())

      - *Frameworks & Technologies:*
      #tagListStyle(data.skills.frameworks.split(", ").split(",").flatten())
    ]
  )

  // ============ Main content ===========
  
  // Work Experience
  [= Experience]
  [
    #for exp in data.experience {
      work-entry(
        exp.company,
        exp.jobTitle,
        [
          #if exp.isCurrentJob {
            [#format-date(exp.startDate) - Present]
          } else {
            [#format-date(exp.startDate) - #format-date(exp.endDate)]
          }
        ],
        exp.location,
        [
          #for achievement in exp.achievements {
            [ - #achievement ]
          }
          #if exp.technologies != "" {
            [- *Technologies:* #exp.technologies]
          }
        ]
      )
    }
  ]

  // Projects
  [= Projects]
  [
    #for proj in data.projects {
      project-entry(
        proj.name,
        url: proj.url,
        description: proj.description,
        [
          #for achievement in proj.achievements {
            [ - #achievement ]
          }
          #if proj.technologies != "" {
            [- *Technologies:* #proj.technologies]
          }
        ]
      )
    }
  ]

  // Education
  [= Education]
  [
    #for edu in data.education {
      edu-entry(
        edu.institution,
        edu.degree,
        [
          #if edu.isAttending {
            [#format-date(edu.startDate) - Present]
          } else {
            [#format-date(edu.startDate) - #format-date(edu.endDate)]
          }
        ],
        gpa: edu.gpa,
        [
          #if edu.awards != "" {
            [- *Awards:* #edu.awards]
          }
          #if edu.coursework != "" {
            [- *Relevant Coursework:* #edu.coursework]
          }
        ]
      )
    }
  ]
}
// ================== END OF MAIN =====================

// Defining data
#let data = json.decode(sys.inputs.data)

// Call the template
#creative-template(data)
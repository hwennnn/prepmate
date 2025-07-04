#import "/lib/simple-technical-resume/lib.typ": *

// Utility function
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

// Empty String if null

// Extract github username
#let github-user(url) = {
	if url != none {
		if url.contains("github.com/") {
      url.split("github.com/").at(1)
    } else { url }
	} else { none }
}

#let linkedin-user(url) = {
	if url != none {
		if url.contains("linkedin.com/in/") {
      url.split("linkedin.com/in/").at(1)
    } else { url }
	} else { none }
}

// Your template implementation goes here
#let my-resume(data) = {
  let personal = data.personalDetails

  let github-user = github-user(personal.githubUrl)
	let linkedin-user = linkedin-user(personal.linkedinUrl)
  
  show: resume.with(
    author-name: personal.firstName + " " + personal.lastName,
    phone: personal.phoneNumber,
    email: personal.email,
    github-username: github-user,
    linkedin-user-id: linkedin-user,
    website: linkParse(personal.website),
    font: "New Computer Modern",
    top-margin: 0.45in,
  )

  // Education Section
  custom-title("Education")[
    #for edu in data.education {
      education-heading(
        edu.institution,
        "", // Location
        edu.degree, 
        "", // Major
        datetime(
          year: int(edu.startDate.split("-").at(0)),
          month: int(edu.startDate.split("-").at(1)),
          day: int(edu.startDate.split("-").at(2))
        ),
        if edu.isAttending { "Present" } else {
          datetime(
            year: int(edu.endDate.split("-").at(0)),
            month: int(edu.endDate.split("-").at(1)),
            day: int(edu.endDate.split("-").at(2))
          )
        }
      )[
        #if edu.gpa != "" { [- *GPA:* #edu.gpa] }
        //#if edu.awards != "" { [- *Awards:* #edu.awards] }
        //#if edu.coursework != "" { [- *Coursework:* #edu.coursework] }
      ]
    }
  ]

  // Experience Section  
  custom-title("Experience")[
    #for exp in data.experience {
      work-heading(
        exp.jobTitle,
        exp.company,
        exp.location,
        datetime(
          year: int(exp.startDate.split("-").at(0)),
          month: int(exp.startDate.split("-").at(1)),
          day: int(exp.startDate.split("-").at(2))
        ), 
        if exp.isCurrentJob { "Present" } else {
          datetime(
            year: int(exp.endDate.split("-").at(0)),
            month: int(exp.endDate.split("-").at(1)),
            day: int(exp.endDate.split("-").at(2))
          )
        }
      )[
        #for achievement in exp.achievements [
          - #achievement
        ]
        #if exp.technologies != "" { [- *Technologies:* #exp.technologies]}
      ]
    }
  ]
}

// Defining data
#let data = json.decode(sys.inputs.data)

// Call the template
#my-resume(data)
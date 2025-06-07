import { format } from "date-fns";
import { Briefcase, Building2, Calendar, MapPin } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface Experience {
  id: string;
  company: string;
  jobTitle: string;
  location?: string | null;
  isCurrentJob: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  achievements?: string[] | null;
  technologies?: string | null;
}

interface ExperienceCardProps {
  experience: Experience[];
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  if (!experience || experience.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Work Experience
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {experience.map((exp) => (
            <div
              key={exp.id}
              className="border-l-2 border-blue-200 pl-4 dark:border-blue-800"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {exp.jobTitle}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Building2 className="h-4 w-4" />
                    <span>{exp.company}</span>
                    {exp.location && (
                      <>
                        <MapPin className="ml-2 h-4 w-4" />
                        <span>{exp.location}</span>
                      </>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {exp.startDate
                        ? format(new Date(exp.startDate), "MMM yyyy")
                        : "N/A"}{" "}
                      -{" "}
                      {exp.isCurrentJob
                        ? "Present"
                        : exp.endDate
                          ? format(new Date(exp.endDate), "MMM yyyy")
                          : "Present"}
                    </span>
                    {exp.isCurrentJob && (
                      <Badge variant="secondary" className="ml-2">
                        Current
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {exp.achievements && exp.achievements.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Key Achievements
                  </h4>
                  <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-800/30">
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500"></div>
                          <span className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                            {achievement}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {exp.technologies && (
                <div className="mt-3">
                  <h4 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {exp.technologies.split(",").map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tech.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

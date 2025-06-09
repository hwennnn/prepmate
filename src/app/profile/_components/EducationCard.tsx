import type { Education } from "@prisma/client";
import { format } from "date-fns";
import { Award, Building2, Calendar, GraduationCap } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface EducationCardProps {
  education: Education[];
}

export function EducationCard({ education }: EducationCardProps) {
  if (!education || education.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Education
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="border-l-2 border-green-200 pl-4 dark:border-green-800"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {edu.degree}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Building2 className="h-4 w-4" />
                    <span>{edu.institution}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {edu.startDate
                        ? format(new Date(edu.startDate), "MMM yyyy")
                        : "Start Date"}{" "}
                      -{" "}
                      {edu.endDate
                        ? `${format(new Date(edu.endDate), "MMM yyyy")}${
                            edu.isAttending ? " (Expected)" : ""
                          }`
                        : "End Date"}
                    </span>
                    {edu.isAttending && (
                      <Badge variant="secondary" className="ml-2">
                        Currently Attending
                      </Badge>
                    )}
                  </div>
                  {edu.gpa && (
                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      GPA: {edu.gpa}
                    </div>
                  )}
                </div>
              </div>

              {edu.awards && (
                <div className="mt-3">
                  <h4 className="mb-2 flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Award className="h-3 w-3" />
                    Awards & Honors
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {edu.awards}
                  </p>
                </div>
              )}

              {edu.coursework && (
                <div className="mt-3">
                  <h4 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Relevant Coursework
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {edu.coursework}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

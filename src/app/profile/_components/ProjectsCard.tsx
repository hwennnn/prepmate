import type { Project } from "@prisma/client";
import { ExternalLink, FolderOpen, Link as LinkIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { formatUrlProtocol } from "~/lib/utils";

interface ProjectsCardProps {
  projects: Project[];
}

export function ProjectsCard({ projects }: ProjectsCardProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Projects
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-lg border bg-slate-50 p-4 dark:bg-slate-800/50"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {project.name}
                  </h3>
                  {project.url && (
                    <a
                      href={formatUrlProtocol(project.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <LinkIcon className="h-3 w-3" />
                      View Project
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
                {project.description}
              </p>

              {project.achievements && project.achievements.length > 0 && (
                <div className="mb-4">
                  <h4 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Key Achievements
                  </h4>
                  <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-800/30">
                    <ul className="space-y-2">
                      {project.achievements.map((achievement, index) => (
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

              {project.technologies && (
                <div>
                  <h4 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.split(",").map((tech, index) => (
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

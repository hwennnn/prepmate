import { ExternalLink, FolderOpen, Link as LinkIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string | null;
  achievements?: string | null;
  technologies?: string | null;
}

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
                      href={project.url}
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

              {project.achievements && (
                <div className="mb-3">
                  <h4 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Key Achievements
                  </h4>
                  <p className="text-sm whitespace-pre-wrap text-slate-600 dark:text-slate-400">
                    {project.achievements}
                  </p>
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

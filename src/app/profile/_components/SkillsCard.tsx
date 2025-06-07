import type { Skills } from "@prisma/client";
import { Code } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface SkillsCardProps {
  skills: Skills;
}

export function SkillsCard({ skills }: SkillsCardProps) {
  if (!skills.languages && !skills.frameworks) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Skills
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.languages && (
          <div>
            <h4 className="mb-2 font-medium text-slate-900 dark:text-white">
              Programming Languages
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.languages.split(",").map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill.trim()}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {skills.frameworks && (
          <div>
            <h4 className="mb-2 font-medium text-slate-900 dark:text-white">
              Frameworks & Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.frameworks.split(",").map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill.trim()}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import {
  ExternalLink,
  Github,
  Globe,
  Linkedin,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface PersonalInfoCardProps {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string | null;
    website?: string | null;
    linkedinUrl?: string | null;
    githubUrl?: string | null;
  };
}

export function PersonalInfoCard({ profile }: PersonalInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            {profile.firstName} {profile.lastName}
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Mail className="h-4 w-4" />
            <span>{profile.email}</span>
          </div>

          {profile.phoneNumber && (
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Phone className="h-4 w-4" />
              <span>{profile.phoneNumber}</span>
            </div>
          )}

          {profile.website && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Visit Website
                <ExternalLink className="ml-1 inline h-3 w-3" />
              </a>
            </div>
          )}

          {profile.linkedinUrl && (
            <div className="flex items-center gap-2">
              <Linkedin className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                LinkedIn Profile
                <ExternalLink className="ml-1 inline h-3 w-3" />
              </a>
            </div>
          )}

          {profile.githubUrl && (
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                GitHub Profile
                <ExternalLink className="ml-1 inline h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

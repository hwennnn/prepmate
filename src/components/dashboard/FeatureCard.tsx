import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  href?: string;
  buttonText: string;
  buttonVariant?: "default" | "outline";
  buttonClassName?: string;
  isComingSoon?: boolean;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  iconColor,
  href,
  buttonText,
  buttonVariant = "outline",
  buttonClassName = "",
  isComingSoon = false,
}: FeatureCardProps) {
  const cardContent = (
    <Card
      className={`flex h-full cursor-pointer flex-col transition-shadow hover:shadow-lg ${
        isComingSoon ? "opacity-50" : ""
      }`}
    >
      <CardHeader className="flex-grow">
        <CardTitle className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <Button
          variant={buttonVariant}
          className={`w-full ${buttonClassName}`}
          disabled={isComingSoon}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );

  if (href && !isComingSoon) {
    return (
      <Link href={href} className="h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

"use client";

import { User } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { type ReactNode } from "react";
import { ThemeToggle } from "~/components/theme-toggle";
import { Button } from "~/components/ui/button";
import { Logo } from "~/components/ui/logo";

interface HeaderProps {
  // Styling options
  variant?: "default" | "blurred";
  className?: string;

  // Navigation options
  showThemeToggle?: boolean;
  showSignInButton?: boolean;
  showDashboardLink?: boolean;
  showProfileLink?: boolean;
  showSignOutButton?: boolean;

  // Custom actions
  customActions?: ReactNode;

  isAuthenticated?: boolean;
  disabledLogoNavigation?: boolean;
}

export function Header({
  variant = "default",
  className = "",
  showThemeToggle = true,
  showSignInButton = false,
  showDashboardLink = false,
  showProfileLink = false,
  showSignOutButton = false,
  customActions,
  isAuthenticated = false,
  disabledLogoNavigation,
}: HeaderProps) {
  const variantClasses = {
    default: "py-6",
    blurred:
      "border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80",
  };

  const handleSignOut = async () => {
    await signOut({ redirectTo: "/" });
  };

  return (
    <nav className={`${variantClasses[variant]} ${className}`}>
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo and Brand */}
        {disabledLogoNavigation ? (
          <div className="flex items-center space-x-2">
            <Logo size="md" variant="rounded-lg" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
              PrepMate
            </span>
          </div>
        ) : (
          <Link href={isAuthenticated ? "/dashboard" : "/"}>
            <div className="flex items-center space-x-2">
              <Logo size="md" variant="rounded-lg" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                PrepMate
              </span>
            </div>
          </Link>
        )}

        {/* Navigation Actions */}
        <div className="flex items-center space-x-4">
          {showThemeToggle && <ThemeToggle />}

          {showDashboardLink && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}

          {showProfileLink && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </Button>
          )}

          {customActions}

          <div className="flex items-center space-x-2">
            {showSignInButton && (
              <Button
                asChild
                className="shadow-md transition-shadow hover:shadow-lg"
              >
                <Link href="/auth/signin">Get Started</Link>
              </Button>
            )}

            {showSignOutButton && (
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

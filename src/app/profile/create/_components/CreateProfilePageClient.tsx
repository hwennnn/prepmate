"use client";

import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ErrorMessage } from "~/components/error-message";
import { ThemeToggle } from "~/components/theme-toggle";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { Logo } from "~/components/ui/logo";
import { notifyToaster } from "~/lib/notification";
import { api } from "~/trpc/react";

export function CreateProfilePageClient() {
  const [profileName, setProfileName] = useState("");
  const [selectedBaseProfileId, setSelectedBaseProfileId] = useState<
    string | null
  >(null);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const {
    data: profiles,
    isLoading: profilesLoading,
    error: profilesError,
    refetch,
  } = api.profile.getProfiles.useQuery();

  const createProfile = api.profile.createProfile.useMutation();
  const utils = api.useUtils();

  const handleCreate = async () => {
    if (!profileName.trim()) {
      notifyToaster(false, "Please enter a profile name", 2000);
      return;
    }

    setIsCreating(true);
    try {
      await createProfile.mutateAsync({
        profileName: profileName.trim(),
        baseProfileId: selectedBaseProfileId ?? undefined,
      });

      notifyToaster(
        true,
        `Profile "${profileName}" created successfully!`,
        2000,
      );

      // Invalidate profiles cache
      await utils.profile.getProfiles.invalidate();

      // Redirect to profile page
      router.push("/profile");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create profile";
      notifyToaster(false, errorMessage, 3000);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRetry = () => {
    void refetch();
  };

  if (profilesLoading) {
    return <LoadingSpinner fullScreen text="Loading profiles..." size="lg" />;
  }

  if (profilesError) {
    return (
      <ErrorMessage
        error={profilesError}
        title="Failed to Load Profiles"
        description={profilesError.message}
        retry={handleRetry}
        showHomeButton={true}
        showTechnicalDetails={true}
      />
    );
  }

  // Set default base profile if none selected
  if (!selectedBaseProfileId && profiles && profiles.length > 0) {
    const defaultProfile = profiles.find((p) => p.isDefault) ?? profiles[0];
    setSelectedBaseProfileId(defaultProfile?.id ?? null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      {/* Header */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-2">
            <Logo size="md" variant="rounded-lg" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
              PrepMate
            </span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white">
            Create New Profile 🎯
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Create a new profile tailored for specific roles or industries.
            Start with an existing profile as your base.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Profile Name Input */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="profileName">Profile Name *</Label>
                <Input
                  id="profileName"
                  placeholder="e.g., Frontend Developer, Data Scientist, Marketing Manager"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="mt-1"
                  maxLength={50}
                />
                <p className="mt-1 text-sm text-slate-500">
                  Choose a descriptive name for your profile
                </p>
              </div>

              <div className="border-t pt-4">
                <Button
                  onClick={handleCreate}
                  disabled={!profileName.trim() || isCreating}
                  className="w-full"
                  size="lg"
                >
                  {isCreating ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="sm" className="mr-2" />
                      Creating Profile...
                    </div>
                  ) : (
                    "Create Profile"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Base Profile Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Base Profile</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your new profile will start with all the information from the
                selected profile.
              </p>
            </CardHeader>
            <CardContent>
              {!profiles || profiles.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-slate-600 dark:text-slate-400">
                    No profiles found to use as base.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {profiles.map((profile) => (
                    <div
                      key={profile.id}
                      className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                        selectedBaseProfileId === profile.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                          : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
                      }`}
                      onClick={() => setSelectedBaseProfileId(profile.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-slate-900 dark:text-white">
                              {profile.profileName}
                            </h3>
                            {profile.isDefault && (
                              <Badge variant="default" className="text-xs">
                                <Star className="mr-1 h-3 w-3" />
                                Default
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {profile.firstName} {profile.lastName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-500">
                            {profile.experience?.length || 0} experiences •{" "}
                            {profile.education?.length || 0} education •{" "}
                            {profile.projects?.length || 0} projects
                          </p>
                        </div>
                        <div
                          className={`h-4 w-4 rounded-full border-2 ${
                            selectedBaseProfileId === profile.id
                              ? "border-blue-500 bg-blue-500"
                              : "border-slate-300 dark:border-slate-600"
                          }`}
                        >
                          {selectedBaseProfileId === profile.id && (
                            <div className="h-full w-full scale-50 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button variant="ghost" onClick={() => router.push("/profile")}>
            ← Back to Profiles
          </Button>
        </div>
      </div>
    </div>
  );
}

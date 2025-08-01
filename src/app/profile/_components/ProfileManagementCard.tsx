"use client";

import { Edit, Plus, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ErrorMessage } from "~/components/error-message";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ConfirmDialog } from "~/components/ui/confirm-dialog";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { notifyToaster } from "~/lib/notification";
import { api } from "~/trpc/react";

interface ProfileManagementCardProps {
  onProfileSelect?: (profileId: string) => void;
  selectedProfileId?: string | null;
  showCreateButton?: boolean;
}

export function ProfileManagementCard({
  onProfileSelect,
  selectedProfileId,
  showCreateButton = true,
}: ProfileManagementCardProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const {
    data: profiles,
    isLoading,
    error,
    refetch,
  } = api.profile.getProfiles.useQuery();

  const deleteProfile = api.profile.deleteProfile.useMutation();
  const setAsDefault = api.profile.setAsDefault.useMutation();
  const utils = api.useUtils();

  const openDeleteDialog = (profileId: string, profileName: string) => {
    setProfileToDelete({ id: profileId, name: profileName });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!profileToDelete) return;

    setDeletingId(profileToDelete.id);
    setDeleteDialogOpen(false);

    try {
      await deleteProfile.mutateAsync({ profileId: profileToDelete.id });
      notifyToaster(true, "Profile deleted successfully", 2000);
      await utils.profile.getProfiles.invalidate();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete profile";
      notifyToaster(false, errorMessage, 3000);
    } finally {
      setDeletingId(null);
      setProfileToDelete(null);
    }
  };

  const handleSetAsDefault = async (profileId: string, profileName: string) => {
    setSettingDefaultId(profileId);
    try {
      await setAsDefault.mutateAsync({ profileId });
      notifyToaster(true, `"${profileName}" is now your default profile`, 2000);
      await utils.profile.getProfiles.invalidate();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to set as default";
      notifyToaster(false, errorMessage, 3000);
    } finally {
      setSettingDefaultId(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner size="md" text="Loading profiles..." />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorMessage
            error={error}
            title="Failed to load profiles"
            description={error.message}
            retry={() => refetch()}
            showTechnicalDetails={false}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          My Profiles
          <Badge variant="secondary">{profiles?.length ?? 0}</Badge>
        </CardTitle>
        {showCreateButton && (
          <Button asChild size="sm">
            <Link href="/profile/create">
              <Plus className="mr-2 h-4 w-4" />
              New Profile
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {!profiles || profiles.length === 0 ? (
          <div className="py-8 text-center">
            <p className="mb-4 text-slate-600 dark:text-slate-400">
              No profiles found. Create your first profile to get started.
            </p>
            {showCreateButton && (
              <Button asChild>
                <Link href="/profile/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Profile
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {profiles.map((profile) => {
              const isSelected = selectedProfileId === profile.id;
              return (
                <div
                  key={profile.id}
                  className={`flex items-center justify-between rounded-lg border p-4 transition-all duration-200 ${
                    isSelected
                      ? "border-blue-500 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20 dark:border-blue-400 dark:bg-blue-950/20 dark:ring-blue-400/20"
                      : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => onProfileSelect?.(profile.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`font-medium transition-colors duration-200 ${
                              isSelected
                                ? "text-blue-900 dark:text-blue-100"
                                : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {profile.profileName}
                          </h3>
                          {profile.isDefault && (
                            <Badge variant="default" className="text-xs">
                              <Star className="mr-1 h-3 w-3" />
                              Default
                            </Badge>
                          )}
                        </div>
                        <p
                          className={`text-sm transition-colors duration-200 ${
                            isSelected
                              ? "text-blue-700 dark:text-blue-300"
                              : "text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {profile.firstName} {profile.lastName} •{" "}
                          {profile.email}
                        </p>
                        <p
                          className={`text-xs transition-colors duration-200 ${
                            isSelected
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-slate-500 dark:text-slate-500"
                          }`}
                        >
                          {profile.experience?.length ?? 0} experiences •{" "}
                          {profile.education?.length ?? 0} education •{" "}
                          {profile.projects?.length ?? 0} projects
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/profile/edit/${profile.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>

                    {!profile.isDefault && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleSetAsDefault(profile.id, profile.profileName)
                          }
                          disabled={settingDefaultId === profile.id}
                        >
                          {settingDefaultId === profile.id ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <Star className="h-4 w-4" />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            openDeleteDialog(profile.id, profile.profileName)
                          }
                          disabled={deletingId === profile.id}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
                        >
                          {deletingId === profile.id ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Delete Profile
          </h3>
          <p className="text-slate-600">
            Are you sure you want to delete{" "}
            <strong>{`"${profileToDelete?.name}"`}</strong>? This action cannot
            be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Profile
            </Button>
          </div>
        </div>
      </ConfirmDialog>
    </Card>
  );
}

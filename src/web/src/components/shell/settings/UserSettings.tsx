"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

import { useUserSnapshot } from "@/features/user/hooks/useUserSnapshot";
import { useUser } from "@/features/user/hooks/useUser";
import { useFeedbackToast } from "@/hooks/useFeedbackToast";

import { useUserSettingsForms } from "@/components/shell/settings/hooks/useUserSettingsForms";
import { UserSettingsView } from "@/components/shell/settings/UserSettingsView";

export default function UserSettings() {
  const searchParams = useSearchParams();
  const emailChangeToken =
    searchParams.get("emailChangeToken") ?? searchParams.get("token") ?? "";

  const { user, isLoading } = useUserSnapshot();
  const { updateAvatar, isUploading } = useUser();
  const toast = useFeedbackToast();

  const {
    nicknameForm,
    emailForm,
    passwordForm,
    onSubmitNickname,
    onSubmitEmailStart,
    onConfirmEmail,
    onSubmitPassword,
  } = useUserSettingsForms({
    userName: user?.userName ?? "",
    emailChangeToken,
  });

  const displayName = user?.userName ?? "User";
  const subtitle = user?.email ?? "";

  const onUploadAvatar = async (file: File) => {
    try {
      await updateAvatar(file);
    } catch (e) {
      toast.error({
        title: "Avatar upload failed",
        message: e instanceof Error ? e.message : "Failed to upload avatar",
      });
    }
  };

  return (
    <UserSettingsView
      isLoading={isLoading}
      displayName={displayName}
      subtitle={subtitle}
      avatarUrl={user?.avatarUrl ?? undefined}
      emailChangeToken={emailChangeToken}
      nicknameForm={nicknameForm}
      emailForm={emailForm}
      passwordForm={passwordForm}
      onSubmitNickname={onSubmitNickname}
      onSubmitEmailStart={onSubmitEmailStart}
      onConfirmEmail={onConfirmEmail}
      onSubmitPassword={onSubmitPassword}
      isUploadingAvatar={isUploading}
      onUploadAvatar={onUploadAvatar}
    />
  );
}

"use client";

import type { UseFormReturn } from "react-hook-form";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/Card";
import { Input } from "@/components/ui/input/Input";
import { Button } from "@/components/ui/button/Button";
import { UserCard } from "@/components/shell/cards/UserCard";
import { FiLock, FiMail, FiUser } from "react-icons/fi";

import type { NicknameValues, EmailChangeStartValues } from "@/schemas/user";
import type { PasswordChangeValues } from "@/schemas/password";

import { AvatarUploaderCard } from "@/components/shell/settings/AvatarUploaderCard";

export function UserSettingsView(props: {
  isLoading: boolean;
  displayName: string;
  subtitle: string;
  avatarUrl?: string;
  emailChangeToken: string;

  nicknameForm: UseFormReturn<NicknameValues>;
  emailForm: UseFormReturn<EmailChangeStartValues>;
  passwordForm: UseFormReturn<PasswordChangeValues>;

  onSubmitNickname: () => Promise<void>;
  onSubmitEmailStart: () => Promise<void>;
  onConfirmEmail: () => Promise<void>;
  onSubmitPassword: () => Promise<void>;

  isUploadingAvatar: boolean;
  onUploadAvatar: (file: File) => Promise<void>;
}) {
  const {
    nicknameForm,
    emailForm,
    passwordForm,
    isLoading,
    displayName,
    subtitle,
    avatarUrl,
    emailChangeToken,
    onSubmitNickname,
    onSubmitEmailStart,
    onConfirmEmail,
    onSubmitPassword,
    isUploadingAvatar,
    onUploadAvatar,
  } = props;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <FiUser className="size-4 text-muted-foreground" aria-hidden />
              <span>Profile</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          <UserCard
            variant="full"
            name={displayName}
            subtitle={subtitle}
            avatarUrl={avatarUrl}
            loading={isLoading}
            block
          />

          <form
            className="flex flex-1 flex-col gap-3"
            onSubmit={nicknameForm.handleSubmit(onSubmitNickname)}
          >
            <Input
              block
              label="Nickname"
              placeholder="Your nickname"
              disabled={isLoading}
              status={
                nicknameForm.formState.errors.nickname ? "error" : "default"
              }
              errorText={nicknameForm.formState.errors.nickname?.message}
              {...nicknameForm.register("nickname")}
            />
            <CardFooter className="mt-auto px-0 py-0">
              <Button
                type="submit"
                variant="muted"
                isLoading={nicknameForm.formState.isSubmitting}
              >
                Save nickname
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <FiMail className="size-4 text-muted-foreground" aria-hidden />
              <span>Email</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="space-y-3"
            onSubmit={emailForm.handleSubmit(onSubmitEmailStart)}
          >
            <Input
              block
              label="New email"
              placeholder="name@example.com"
              autoComplete="email"
              disabled={isLoading}
              status={emailForm.formState.errors.newEmail ? "error" : "default"}
              errorText={emailForm.formState.errors.newEmail?.message}
              {...emailForm.register("newEmail")}
            />
            <Input
              block
              type="password"
              label="Current password"
              autoComplete="current-password"
              disabled={isLoading}
              status={
                emailForm.formState.errors.currentPassword ? "error" : "default"
              }
              errorText={emailForm.formState.errors.currentPassword?.message}
              {...emailForm.register("currentPassword")}
            />

            <p className="text-xs text-muted-foreground">
              We will send a verification link to your new email address.
            </p>

            <CardFooter className="px-0 py-0">
              <Button
                type="submit"
                variant="muted"
                isLoading={emailForm.formState.isSubmitting}
              >
                Send verification link
              </Button>
            </CardFooter>
          </form>

          {emailChangeToken ? (
            <div className="space-y-2 rounded-xl border border-border bg-surface/5 p-3">
              <div className="text-sm font-medium">Confirm email change</div>
              <div className="text-xs text-muted-foreground break-all">
                {emailChangeToken}
              </div>
              <Button type="button" variant="primary" onClick={onConfirmEmail}>
                Confirm
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <FiLock className="size-4 text-muted-foreground" aria-hidden />
              <span>Password</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="space-y-3"
            onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
          >
            <Input
              block
              type="password"
              label="Current password"
              autoComplete="current-password"
              disabled={isLoading}
              status={
                passwordForm.formState.errors.currentPassword
                  ? "error"
                  : "default"
              }
              errorText={passwordForm.formState.errors.currentPassword?.message}
              {...passwordForm.register("currentPassword")}
            />
            <Input
              block
              type="password"
              label="New password"
              autoComplete="new-password"
              disabled={isLoading}
              status={
                passwordForm.formState.errors.newPassword ? "error" : "default"
              }
              errorText={passwordForm.formState.errors.newPassword?.message}
              {...passwordForm.register("newPassword")}
            />
            <Input
              block
              type="password"
              label="Confirm new password"
              autoComplete="new-password"
              disabled={isLoading}
              status={
                passwordForm.formState.errors.confirmNewPassword
                  ? "error"
                  : "default"
              }
              errorText={
                passwordForm.formState.errors.confirmNewPassword?.message
              }
              {...passwordForm.register("confirmNewPassword")}
            />
            <CardFooter className="px-0 py-0">
              <Button
                type="submit"
                variant="muted"
                isLoading={passwordForm.formState.isSubmitting}
              >
                Change password
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      <AvatarUploaderCard
        isLoading={isLoading}
        isUploading={isUploadingAvatar}
        onUpload={onUploadAvatar}
      />
    </div>
  );
}

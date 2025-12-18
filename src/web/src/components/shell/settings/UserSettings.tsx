"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { useUserSnapshot } from "@/features/user/hooks/useUserSnapshot";
import { useUser } from "@/features/user/hooks/useUser";
import {
  ContextMenu,
  type ContextMenuItem,
} from "@/components/ui/contextMenu/ContextMenu";
import { useFeedbackToast } from "@/components/ui/callout/useFeedbackToast";

const nicknameSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(2, "Nickname must be at least 2 characters")
    .max(32, "Nickname must be at most 32 characters"),
});

type NicknameValues = z.infer<typeof nicknameSchema>;

const emailStartSchema = z.object({
  newEmail: z.string().trim().email("Enter a valid email"),
  currentPassword: z.string().min(1, "Current password is required"),
});

type EmailStartValues = z.infer<typeof emailStartSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((v) => v.newPassword === v.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
  });

type PasswordValues = z.infer<typeof passwordSchema>;

export default function UserSettings() {
  const searchParams = useSearchParams();
  const emailChangeToken =
    searchParams.get("emailChangeToken") ?? searchParams.get("token") ?? "";

  const { user, isLoading } = useUserSnapshot();
  const { updateAvatar, isUploading } = useUser();
  const toast = useFeedbackToast();
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const nicknameForm = useForm<NicknameValues>({
    resolver: zodResolver(nicknameSchema),
    defaultValues: { nickname: user?.userName ?? "" },
  });

  React.useEffect(() => {
    nicknameForm.reset({ nickname: user?.userName ?? "" });
  }, [user?.userName, nicknameForm]);

  const emailForm = useForm<EmailStartValues>({
    resolver: zodResolver(emailStartSchema),
    defaultValues: { newEmail: "", currentPassword: "" },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  React.useEffect(() => {
    if (!emailChangeToken) return;
    toast.info({
      title: "Email change",
      message:
        "Token detected in URL. This simulates clicking the verification link.",
      autoDismissMs: 6000,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailChangeToken]);

  const onSubmitNickname = async () => {
    toast.info({
      title: "Nickname",
      message:
        "UI is ready. Backend endpoint for nickname update will be added next.",
    });
  };

  const onSubmitEmailStart = async () => {
    toast.info({
      title: "Email",
      message:
        "UI is ready. Next step: backend will send a verification link to the new email.",
    });
  };

  const onConfirmEmail = async () => {
    toast.info({
      title: "Email",
      message:
        "UI is ready. Next step: backend will verify the token and apply the email change.",
    });
  };

  const onSubmitPassword = async () => {
    toast.info({
      title: "Password",
      message:
        "UI is ready. Backend endpoint for password change will be added next.",
    });
  };

  const uploadAvatarFile = async (file: File) => {
    try {
      await updateAvatar(file);
    } catch (e) {
      toast.error({
        title: "Avatar upload failed",
        message: e instanceof Error ? e.message : "Failed to upload avatar",
        autoDismissMs: 7000,
      });
    }
  };

  const avatarMenuItems: ContextMenuItem[] = [
    { type: "label", label: "Avatar" },
    {
      label: "Choose file…",
      disabled: isUploading || isLoading,
      onSelect: () => {
        fileInputRef.current?.click();
      },
    },
  ];

  const displayName = user?.userName ?? "User";
  const subtitle = user?.email ?? "";

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <UserCard
            variant="full"
            name={displayName}
            subtitle={subtitle}
            avatarUrl={user?.avatarUrl ?? undefined}
            loading={isLoading}
            block
          />

          <form
            className="space-y-3"
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
            <CardFooter className="px-0 py-0">
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
          <CardTitle>Email</CardTitle>
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
          <CardTitle>Password</CardTitle>
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

      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Right-click to choose a file, or drag & drop an image here. JPG, PNG
            or WebP. Max 5MB.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={isLoading || isUploading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              e.currentTarget.value = "";

              await uploadAvatarFile(file);
            }}
          />

          <ContextMenu items={avatarMenuItems}>
            <div
              role="button"
              tabIndex={0}
              aria-disabled={isLoading || isUploading}
              aria-busy={isUploading || undefined}
              className={
                "relative flex min-h-24 items-center justify-center rounded-xl border border-dashed border-border bg-surface/5 px-4 py-6 text-center text-sm text-muted-foreground outline-none " +
                (isDragOver ? "bg-surface/10" : "") +
                (isLoading || isUploading
                  ? " pointer-events-none opacity-60"
                  : "")
              }
              onDragEnter={(e) => {
                e.preventDefault();
                if (isLoading || isUploading) return;
                setIsDragOver(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (isLoading || isUploading) return;
                setIsDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragOver(false);
              }}
              onDrop={async (e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (isLoading || isUploading) return;

                const file = e.dataTransfer.files?.[0];
                if (!file) return;

                await uploadAvatarFile(file);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onClick={() => {
                fileInputRef.current?.click();
              }}
            >
              {isUploading ? "Uploading…" : "Drop image here (or right-click)"}
            </div>
          </ContextMenu>
        </CardContent>
      </Card>
    </div>
  );
}

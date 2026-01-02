import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  type EmailChangeStartValues,
  type NicknameValues,
  emailChangeStartSchema,
  nicknameSchema,
} from "@/schemas/user";
import {
  type PasswordChangeValues,
  passwordChangeSchema,
} from "@/schemas/password";
import { useFeedbackToast } from "@/hooks/useFeedbackToast";

export function useUserSettingsForms(params: {
  userName: string;
  emailChangeToken: string;
}) {
  const toast = useFeedbackToast();

  const nicknameForm = useForm<NicknameValues>({
    resolver: zodResolver(nicknameSchema),
    defaultValues: { nickname: params.userName },
  });

  React.useEffect(() => {
    nicknameForm.reset({ nickname: params.userName });
  }, [params.userName, nicknameForm]);

  const emailForm = useForm<EmailChangeStartValues>({
    resolver: zodResolver(emailChangeStartSchema),
    defaultValues: { newEmail: "", currentPassword: "" },
  });

  const passwordForm = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  React.useEffect(() => {
    if (!params.emailChangeToken) return;
    toast.info({
      title: "Email change",
      message:
        "Token detected in URL. This simulates clicking the verification link.",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.emailChangeToken]);

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

  return {
    nicknameForm,
    emailForm,
    passwordForm,
    onSubmitNickname,
    onSubmitEmailStart,
    onConfirmEmail,
    onSubmitPassword,
  };
}

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { login } from "@/features/auth/api/authApi";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login.schema";
import { getErrorMessage } from "@/lib/getErrorMessage";

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  useEffect(() => {
    if (searchParams.get("expired") === "true") {
      setTimeout(() => {
        form.setError("root", {
          message: "Session expired. Please log in again.",
        });
      }, 0);
    }
  }, [searchParams, form]);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login({
        email: values.email,
        password: values.password,
        rememberMe: !!values.remember,
      });

      router.replace(callbackUrl);
    } catch (error) {
      const message = await getErrorMessage(error);
      form.setError("root", { message });
    }
  };

  return {
    form,
    showPassword,
    togglePassword,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
    rootError: form.formState.errors.root?.message,
  };
}

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HTTPError } from "ky";
import { api } from "@/lib/client";
import { loginSchema, LoginFormValues } from "../schemas/login.schema";

export function useLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const togglePassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await api.post("auth/login", {
        json: {
          email: values.email,
          password: values.password,
          rememberMe: !!values.remember,
        },
      });

      router.replace("/dashboard");
    } catch (error: unknown) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Login error:", error);
      }

      let message = "Login failed. Please check your credentials.";

      if (error instanceof HTTPError) {
        const status = error.response.status;

        if (status === 401) {
          message = "Invalid credentials. Please try again.";
        } else if (status === 500) {
          message = "Server error - please try again later.";
        } else {
          try {
            type ErrorResponse = { message?: string; [key: string]: unknown };

            const errorData =
              (await error.response.json()) as ErrorResponse | null;
            if (
              errorData &&
              typeof errorData.message === "string" &&
              errorData.message
            ) {
              message = errorData.message;
            }
          } catch {}
        }
      }

      form.setError("root", {
        message,
      });
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

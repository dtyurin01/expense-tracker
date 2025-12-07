import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
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
      await api.post("/auth/login", {
        email: values.email,
        password: values.password,
        rememberMe: !!values.remember,
      });

      router.replace("/dashboard");
    } catch (error: unknown) {
      // Log error for debugging (remove or replace with proper logging in production)
      if (process.env.NODE_ENV !== "production") {
        console.error("Login error:", error);
      }
      let message = "Login failed. Please check your credentials.";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number }; message?: string };
        if (axiosError?.response?.status === 401) {
          message = "Invalid credentials. Please try again.";
        } else if (axiosError?.response?.status === 500) {
          message = "Server error - please try again later.";
        } else if (axiosError?.message) {
          message = axiosError.message;
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

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/client";
import { loginSchema, LoginFormValues } from "../schemas/login.schema";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { useSearchParams } from "next/navigation";

export function useLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();

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
      await api.post("auth/login", {
        json: {
          email: values.email,
          password: values.password,
          rememberMe: !!values.remember,
        },
      });

      router.replace("/dashboard");
    } catch (error) {
      const message = await getErrorMessage(error);

      if (process.env.NODE_ENV !== "production") console.error(error);

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

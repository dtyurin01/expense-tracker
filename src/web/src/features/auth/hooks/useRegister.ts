import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { registerSchema, RegisterFormValues } from "../schemas/register.schema";

export function useRegister() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const togglePassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await api.post("/auth/register", {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });

      // Если всё ок (204) — отправляем юзера логиниться
      // Можно добавить тут "toast" уведомление: "Account created! Please login."
      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);

      form.setError("root", {
        message: "Registration failed. Please check your credentials.",
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

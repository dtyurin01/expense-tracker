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

      router.push("/login");
    } catch (error: unknown) {
      console.error("Registration error:", error);

      let errorMessage = "Registration failed. Please try again.";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError?.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }
      form.setError("root", {
        message: errorMessage,
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

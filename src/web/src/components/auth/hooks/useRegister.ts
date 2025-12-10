import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HTTPError } from "ky";
import { api } from "@/lib/client";
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
      await api.post("auth/register", {
        json: {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
        },
      });

      router.push("/login");
    } catch (error: unknown) {
      console.error("Registration error:", error);

      let errorMessage = "Registration failed. Please try again.";

      if (error instanceof HTTPError) {
        try {
          const errorData = await error.response.json();

          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (Array.isArray(errorData) && errorData[0]?.description) {
            errorMessage = errorData[0].description;
          }
        } catch {
          errorMessage = error.message;
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

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/client";
import { registerSchema, RegisterFormValues } from "../schemas/register.schema";
import { getErrorMessage } from "@/lib/getErrorMessage";

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

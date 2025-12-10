"use client";

import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { Input } from "@/components/ui/input/Input";
import { Button } from "@/components/ui/button/Button";
import { useRegister } from "../hooks/useRegister";
import { PasswordStrength } from "./PasswordStrength";
import { SocialAuth } from "./SocialAuth";

export function RegisterForm() {
  const {
    form,
    showPassword,
    togglePassword,
    onSubmit,
    isSubmitting,
    rootError,
  } = useRegister();
  const {
    register,
    formState: { errors },
  } = form;

  const passwordValue = form.watch("password");

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-4.5">
        <Input
          block
          type="text"
          label="Full Name"
          placeholder="John Doe"
          leftIcon={<FiUser className="size-5" />}
          status={errors.fullName ? "error" : "default"}
          errorText={errors.fullName?.message}
          {...register("fullName")}
        />

        <Input
          block
          type="email"
          label="Email address"
          placeholder="you@example.com"
          leftIcon={<FiMail className="size-5" />}
          status={errors.email ? "error" : "default"}
          errorText={errors.email?.message}
          {...register("email")}
        />

        <Input
          block
          type={showPassword ? "text" : "password"}
          label="Password"
          placeholder="••••••••"
          leftIcon={<FiLock className="size-5" />}
          rightIcon={
            <Button
              type="button"
              variant="ghost"
              onClick={togglePassword}
              className="p-1"
            >
              {showPassword ? (
                <FiEyeOff className="size-5" />
              ) : (
                <FiEye className="size-5" />
              )}
            </Button>
          }
          status={errors.password ? "error" : "default"}
          errorText={errors.password?.message}
          {...register("password")}
        />

        <PasswordStrength password={passwordValue} />

        <Input
          block
          type={showPassword ? "text" : "password"}
          label="Confirm Password"
          placeholder="Repeat password"
          leftIcon={<FiLock className="size-5" />}
          status={errors.confirmPassword ? "error" : "default"}
          errorText={errors.confirmPassword?.message}
          rightIcon={
            <Button
              type="button"
              variant="ghost"
              onClick={togglePassword}
              className="p-1"
            >
              {showPassword ? (
                <FiEyeOff className="size-5" />
              ) : (
                <FiEye className="size-5" />
              )}
            </Button>
          }
          {...register("confirmPassword")}
        />

        {rootError && (
          <p className="text-sm text-error text-center">{rootError}</p>
        )}

        <Button type="submit" block isLoading={isSubmitting}>
          Create Account
        </Button>
      </form>

      <SocialAuth />
    </div>
  );
}

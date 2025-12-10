"use client";

import Link from "next/link";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { Controller } from "react-hook-form";

import { Input } from "@/components/ui/input/Input";
import { Button } from "@/components/ui/button/Button";
import { Checkbox } from "@/components/ui";
import { useLogin } from "../hooks/useLogin";
import { SocialAuth } from "./SocialAuth";

export function LoginForm() {
  const {
    form,
    showPassword,
    togglePassword,
    onSubmit,
    isSubmitting,
    rootError,
  } = useLogin();
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-4.5">
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

        <div className="flex items-center justify-between">
          <Controller
            name="remember"
            control={control}
            render={({ field }) => (
              <label
                htmlFor="remember"
                className="inline-flex select-none items-center gap-2 text-sm text-muted-foreground cursor-pointer"
              >
                <Checkbox
                  id="remember"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <span>Remember me</span>
              </label>
            )}
          />
          <Link
            href="/forgot-password"
            className="text-sm text-brand hover:text-brand-600"
          >
            Forgot password?
          </Link>
        </div>

        {rootError && (
          <p className="text-sm text-error text-center">{rootError}</p>
        )}

        <Button type="submit" block isLoading={isSubmitting}>
          Login
        </Button>
      </form>
      
      <SocialAuth />
    </div>
  );
}

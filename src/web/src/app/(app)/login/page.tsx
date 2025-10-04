"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

import { Input } from "@/components/ui/input/Input";
import { Button } from "@/components/ui/button/Button";
import { Checkbox } from "@/components/ui";
import Image from "next/image";

type LoginForm = {
  email: string;
  password: string;
  remember?: boolean;
};

export default function LoginPage() {
  const router = useRouter();
  const [showPw, setShowPw] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    control,
  } = useForm<LoginForm>({
    defaultValues: { email: "", password: "", remember: true },
    mode: "onSubmit",
  });

  async function onSubmit(values: LoginForm) {
    try {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL ?? ""}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: values.email,
            password: values.password,
            rememberMe: !!values.remember,
          }),
        }
      );

      if (!resp.ok) {
        setError("root", { message: "Invalid email or password." });
        return;
      }

      router.replace("/dashboard");
    } catch {
      setError("root", { message: "Something went wrong. Try again." });
    }
  }

  return (
    <div className="min-h-svh grid place-items-center bg-background">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(600px_circle_at_20%_20%,hsl(198_81%_67%/.06),transparent_60%),radial-gradient(600px_circle_at_80%_80%,hsl(198_81%_67%/.06),transparent_60%)]" />

      <div className="w-[92%] max-w-md rounded-2xl border border-border bg-surface/95 shadow-2xl backdrop-blur p-6 sm:p-7">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 grid size-12 place-items-center rounded-full bg-brand/15 text-brand ring-1 ring-brand/30">
            <Image
              src="/PocketPulseLogo.svg"
              alt="PocketPulse"
              width={24}
              height={24}
              priority
            />
          </div>
          <h1 className="text-h5 sm:text-h4 font-semibold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-brand hover:text-brand-600">
              Sign up
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            block
            type="email"
            autoComplete="email"
            label="Email address"
            placeholder="you@example.com"
            leftIcon={<FiMail aria-hidden className="size-5" />}
            status={errors.email ? "error" : "default"}
            errorText={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
          />

          <Input
            block
            type={showPw ? "text" : "password"}
            autoComplete="current-password"
            label="Password"
            placeholder="••••••••"
            leftIcon={<FiLock aria-hidden className="size-5" />}
            rightIcon={
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Hide password" : "Show password"}
                className="grid text-muted-foreground place-items-center rounded-md p-1 hover:bg-surface/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
              >
                {showPw ? (
                  <FiEyeOff className="size-5" />
                ) : (
                  <FiEye className="size-5" />
                )}
              </Button>
            }
            status={errors.password ? "error" : "default"}
            errorText={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Min length is 6" },
            })}
          />

          <div className="flex items-center justify-between ml-2">
            <Controller
              name="remember"
              control={control}
              render={({ field }) => (
                <label className="inline-flex select-none items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    id="remember"
                    size="md"
                    variant={"solid"}
                    checked={field.value}
                    onCheckedChange={(v) => field.onChange(v === true)}
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

          {/* Auth error */}
          <p
            role={errors.root?.message ? "alert" : undefined}
            aria-live="polite"
            className="min-h-3 text-sm text-error"
          >
            {errors.root?.message}
          </p>

          <Button type="submit" radius="lg" block isLoading={isSubmitting}>
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}

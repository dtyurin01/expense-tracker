import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitleText="Don’t have an account?"
      subtitleLinkText="Sign up"
      subtitleLinkHref="/register"
    >
      <LoginForm />
    </AuthLayout>
  );
}

import { AuthLayout } from "@/components/auth/components/AuthLayout";
import { LoginForm } from "@/components/auth/components/LoginForm";

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

import { AuthLayout } from "@/components/auth/components/AuthLayout";
import { RegisterForm } from "@/components/auth/components/RegisterForm";

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create an account"
      subtitleText="Already have an account?"
      subtitleLinkText="Log in"
      subtitleLinkHref="/login"
    >
      <RegisterForm />
    </AuthLayout>
  );
}

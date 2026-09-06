import { LoginForm } from "@/features/auth/components/LoginForm";
import { buildMetadata } from "@/components/seo/PageSEO";
import { Suspense } from "react";

export const metadata = buildMetadata({
  title: "Login",
  description: "Sign in to your Abroadly student dashboard.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { buildMetadata } from "@/components/seo/PageSEO";

export const metadata = buildMetadata({
  title: "Register",
  description: "Create your Abroadly account and start your study abroad journey.",
  path: "/register",
});

export default function RegisterPage() {
  return <RegisterForm />;
}

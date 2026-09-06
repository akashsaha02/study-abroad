"use client";

import { Input } from "antd";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { GoogleAuthButton } from "@/features/auth/components/GoogleAuthButton";
import { login, type AuthActionState } from "@/features/auth/actions";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

const initialState: AuthActionState = {};

export function LoginForm() {
  const t = useTranslations("auth");
  const [state, action, pending] = useActionState(login, initialState);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  return (
    <SurfaceCard hover={false} padding="lg">
      <form action={action} className="space-y-4">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">{t("loginTitle")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("loginSubtitle")}</p>
        </div>

        {redirect && <input type="hidden" name="redirect" value={redirect} />}

        <FormField label={t("email")} htmlFor="email" required>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@email.com"
            required
            size="large"
          />
        </FormField>

        <FormField label={t("password")} htmlFor="password" required>
          <Input id="password" name="password" type="password" required size="large" />
        </FormField>

        {state.error && <p className="text-sm text-destructive">{state.error}</p>}

        <SubmitButton loading={pending} className="w-full">
          {t("loginSubmit")}
        </SubmitButton>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">{t("loginOr")}</span>
          </div>
        </div>

        <GoogleAuthButton />

        <div className="flex justify-between text-sm">
          <Link href="/forgot-password" className="text-primary hover:underline">
            {t("forgotPasswordLink")}
          </Link>
          <Link href="/register" className="text-primary hover:underline">
            {t("createAccountLink")}
          </Link>
        </div>
      </form>
    </SurfaceCard>
  );
}

"use client";

import { Input } from "antd";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { GoogleAuthButton } from "@/components/forms/GoogleAuthButton";
import { register, type AuthActionState } from "@/lib/auth/actions";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useActionState } from "react";

const initialState: AuthActionState = {};

export function RegisterForm() {
  const t = useTranslations("auth");
  const [state, action, pending] = useActionState(register, initialState);

  return (
    <SurfaceCard hover={false} padding="lg">
      <form action={action} className="space-y-4">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">{t("registerTitle")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("registerSubtitle")}</p>
        </div>

        <FormField label={t("name")} htmlFor="fullName" required>
          <Input
            id="fullName"
            name="fullName"
            placeholder={t("name")}
            required
            size="large"
          />
        </FormField>

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

        <FormField label={t("phone")} htmlFor="phone" required>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+880 1XXX-XXXXXX"
            required
            size="large"
          />
        </FormField>

        <FormField label={t("password")} htmlFor="password" required>
          <Input id="password" name="password" type="password" required size="large" />
        </FormField>

        <FormField label={t("confirmPassword")} htmlFor="confirmPassword" required>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            size="large"
          />
        </FormField>

        {state.error && <p className="text-sm text-destructive">{state.error}</p>}

        {state.success && (
          <p className="text-sm text-green-600 dark:text-green-400">{state.success}</p>
        )}

        <SubmitButton loading={pending} className="w-full">
          {t("registerSubmit")}
        </SubmitButton>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">{t("registerOr")}</span>
          </div>
        </div>

        <GoogleAuthButton />

        <p className="text-center text-sm">
          {t("hasAccount")}{" "}
          <Link href="/login" className="text-primary hover:underline">
            {t("signInLink")}
          </Link>
        </p>
      </form>
    </SurfaceCard>
  );
}

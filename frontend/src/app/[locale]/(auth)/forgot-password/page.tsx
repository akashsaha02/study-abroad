"use client";

import { Input } from "antd";
import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { forgotPassword, type AuthActionState } from "@/lib/auth/actions";
import { Link } from "@/i18n/navigation";
import { useActionState } from "react";

const initialState: AuthActionState = {};

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(forgotPassword, initialState);

  return (
    <div className="mx-auto max-w-md py-16">
      <h1 className="mb-6 text-2xl font-bold">Forgot password</h1>
      <form action={action} className="space-y-4">
        <FormField label="Email" htmlFor="email" required>
          <Input id="email" name="email" type="email" required />
        </FormField>
        {state.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
        {state.success && (
          <p className="text-sm text-emerald-600">{state.success}</p>
        )}
        <SubmitButton loading={pending} className="w-full">
          Send reset link
        </SubmitButton>
      </form>
      <p className="mt-4 text-center text-sm">
        <Link href="/login" className="text-primary hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}

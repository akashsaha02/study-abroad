"use client";

import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Input } from "@/components/ui/input";
import { forgotPassword, type AuthActionState } from "@/lib/auth/actions";
import Link from "next/link";
import { useActionState } from "react";

const initialState: AuthActionState = {};

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(forgotPassword, initialState);

  return (
    <form action={action} className="space-y-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Forgot password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your email to receive a reset link
        </p>
      </div>

      <FormField label="Email" htmlFor="email" required>
        <Input id="email" name="email" type="email" required />
      </FormField>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && <p className="text-sm text-green-600">{state.success}</p>}

      <SubmitButton loading={pending} className="w-full">
        Send reset link
      </SubmitButton>

      <p className="text-center text-sm">
        <Link href="/login" className="text-primary hover:underline">
          Back to login
        </Link>
      </p>
    </form>
  );
}

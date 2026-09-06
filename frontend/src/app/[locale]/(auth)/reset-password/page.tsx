"use client";

import { Input } from "antd";
import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { resetPassword, type AuthActionState } from "@/lib/auth/actions";
import { useActionState } from "react";

const initialState: AuthActionState = {};

export default function ResetPasswordPage() {
  const [state, action, pending] = useActionState(resetPassword, initialState);

  return (
    <form action={action} className="space-y-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Reset password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your new password
        </p>
      </div>

      <FormField label="New Password" htmlFor="password" required>
        <Input id="password" name="password" type="password" required />
      </FormField>

      <FormField label="Confirm Password" htmlFor="confirmPassword" required>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
        />
      </FormField>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <SubmitButton loading={pending} className="w-full">
        Update password
      </SubmitButton>
    </form>
  );
}

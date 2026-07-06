"use client";

import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Input } from "@/components/ui/input";
import { login, type AuthActionState } from "@/lib/auth/actions";
import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

const initialState: AuthActionState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  return (
    <form action={action} className="space-y-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to your Abroadly account
        </p>
      </div>

      {redirect && <input type="hidden" name="redirect" value={redirect} />}

      <FormField label="Email" htmlFor="email" required>
        <Input id="email" name="email" type="email" placeholder="you@email.com" required />
      </FormField>

      <FormField label="Password" htmlFor="password" required>
        <Input id="password" name="password" type="password" required />
      </FormField>

      {state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <SubmitButton loading={pending} className="w-full">
        Sign in
      </SubmitButton>

      <div className="flex justify-between text-sm">
        <Link href="/forgot-password" className="text-primary hover:underline">
          Forgot password?
        </Link>
        <Link href="/register" className="text-primary hover:underline">
          Create account
        </Link>
      </div>
    </form>
  );
}

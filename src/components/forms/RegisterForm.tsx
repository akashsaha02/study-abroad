"use client";

import { SurfaceCard } from "@/components/common/SurfaceCard";
import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Input } from "@/components/ui/input";
import { GoogleAuthButton } from "@/components/forms/GoogleAuthButton";
import { register, type AuthActionState } from "@/lib/auth/actions";
import Link from "next/link";
import { useActionState } from "react";

const initialState: AuthActionState = {};

export function RegisterForm() {
  const [state, action, pending] = useActionState(register, initialState);

  return (
    <SurfaceCard hover={false} padding="lg">
      <form action={action} className="space-y-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Start your study abroad journey
        </p>
      </div>

      <FormField label="Full Name" htmlFor="fullName" required>
        <Input id="fullName" name="fullName" placeholder="Your full name" required />
      </FormField>

      <FormField label="Email" htmlFor="email" required>
        <Input id="email" name="email" type="email" placeholder="you@email.com" required />
      </FormField>

      <FormField label="Phone" htmlFor="phone" required>
        <Input id="phone" name="phone" type="tel" placeholder="+880 1XXX-XXXXXX" required />
      </FormField>

      <FormField label="Password" htmlFor="password" required>
        <Input id="password" name="password" type="password" required />
      </FormField>

      <FormField label="Confirm Password" htmlFor="confirmPassword" required>
        <Input id="confirmPassword" name="confirmPassword" type="password" required />
      </FormField>

      {state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      {state.success && (
        <p className="text-sm text-green-600 dark:text-green-400">{state.success}</p>
      )}

      <SubmitButton loading={pending} className="w-full">
        Create account
      </SubmitButton>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <GoogleAuthButton />

      <p className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
    </SurfaceCard>
  );
}

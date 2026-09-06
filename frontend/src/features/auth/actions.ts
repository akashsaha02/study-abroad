"use server";

import { createClient } from "@/lib/supabase/server";
import { getDashboardPathForRole } from "@/features/auth/redirects";
import type { UserRole } from "@/types";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@abroadly/shared/validations/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

export type AuthActionState = {
  error?: string;
  success?: string;
};

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

function formatAuthError(error: { message?: string; status?: number }) {
  const message = (error.message ?? "").trim();
  const lower = message.toLowerCase();
  if (
    !message ||
    message === "{}" ||
    error.status === 0 ||
    lower === "fetch failed" ||
    lower === "failed to fetch" ||
    lower.includes("enotfound")
  ) {
    return "Cannot reach Supabase yet. If you just restored the project, wait a minute and try again.";
  }
  return message;
}

async function redirectToApp(path: string): Promise<void> {
  const locale = await getLocale();
  revalidatePath("/", "layout");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  redirect(`/${locale}${normalized}`);
}

function safeInternalPath(path: string | undefined, role?: UserRole | null): string | undefined {
  if (!path) return undefined;
  const trimmed = path.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("\\") || trimmed.includes("://")) {
    return undefined;
  }

  const stripped = trimmed.replace(/^\/(en|bn)(?=\/|$)/, "") || "/";
  if (stripped === "/login" || stripped === "/register") return undefined;

  if (stripped.startsWith("/admin") && role !== "admin" && role !== "super_admin") {
    return undefined;
  }
  if (
    stripped.startsWith("/counselor") &&
    role !== "counselor" &&
    role !== "admin" &&
    role !== "super_admin"
  ) {
    return undefined;
  }

  return stripped;
}

async function redirectAfterAuth(
  supabase: Awaited<ReturnType<typeof createClient>>,
  fallbackPath?: string
): Promise<AuthActionState> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Signed in, but the session could not be saved. Please try again.",
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const path =
    safeInternalPath(fallbackPath, profile?.role as UserRole) ??
    getDashboardPathForRole(profile?.role as UserRole);

  await redirectToApp(path);
  return {};
}

export async function login(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      return { error: formatAuthError(error) };
    }
  } catch (err) {
    return {
      error: formatAuthError({
        message: err instanceof Error ? err.message : "fetch failed",
      }),
    };
  }

  const redirectTo = formData.get("redirect")?.toString();
  return redirectAfterAuth(supabase, redirectTo);
}

export async function register(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName, phone: parsed.data.phone },
    },
  });

  if (error) {
    return { error: formatAuthError(error) };
  }

  if (data.user && !data.session) {
    return {
      success:
        "Account created. Check your email to confirm your account before signing in.",
    };
  }

  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      email: parsed.data.email,
      full_name: parsed.data.fullName,
      phone: parsed.data.phone,
      role: "student",
    });
  }

  return redirectAfterAuth(supabase);
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getAppUrl()}/auth/callback`,
    },
  });

  if (error) {
    await redirectToApp(`/login?error=${encodeURIComponent(formatAuthError(error))}`);
  }

  if (data.url) {
    redirect(data.url);
  }

  await redirectToApp("/login?error=oauth_failed");
}

export async function forgotPassword(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${getAppUrl()}/reset-password`,
  });

  if (error) {
    return { error: formatAuthError(error) };
  }

  return { success: "Password reset link sent to your email." };
}

export async function resetPassword(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: formatAuthError(error) };
  }

  await redirectToApp("/login");
  return {};
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  await redirectToApp("/login");
}

import { createClient } from "@/infrastructure/supabase/client";
import { newsletterSchema } from "@abroadly/shared/validations/newsletter";
import { AppError, ValidationError } from "@/shared/http/errors";

export async function subscribe(emailRaw: string) {
  const email = emailRaw.toLowerCase().trim();
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("id, is_active")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    if (!existing.is_active) {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .update({ is_active: true, unsubscribed_at: null })
        .eq("id", existing.id);
      if (error) throw new AppError(error.message, 500);
    }
    return { success: true, reactivated: true as const };
  }

  const { error } = await supabase.from("newsletter_subscribers").insert({ email });
  if (error) throw new AppError(error.message, 500);
  return { success: true };
}

export function parseNewsletter(body: unknown) {
  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues[0]?.message ?? "Invalid email");
  }
  return parsed.data;
}

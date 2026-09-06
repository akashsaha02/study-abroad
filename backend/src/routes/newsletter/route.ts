import { createClient } from "@/lib/supabase/server";
import { newsletterSchema } from "@/lib/validations/newsletter";
import { NextResponse } from "@/lib/http/response";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid email" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const email = parsed.data.email.toLowerCase().trim();

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
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
      }
      return NextResponse.json({ success: true, reactivated: true });
    }

    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

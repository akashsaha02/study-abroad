import { applyFkPayload, detectFkColumns } from "@abroadly/shared/countries/fk-guard";
import { getCountryNameById } from "@abroadly/shared/countries/resolve";
import { sanitizeHtml } from "@abroadly/shared/html";
import type { AuthUser } from "@abroadly/shared/types";
import type { SupabaseClient } from "@supabase/supabase-js";

type Payload = Record<string, unknown>;
type Ctx = { user: AuthUser; supabase: SupabaseClient; id?: string };

function withSanitizedContent(data: Payload): Payload {
  if (typeof data.content !== "string") return data;
  return { ...data, content: sanitizeHtml(data.content) };
}

export async function mapBlogCreate(data: Payload, ctx: Ctx): Promise<Payload> {
  const timestamp = new Date().toISOString();
  return {
    ...withSanitizedContent(data),
    author_id: ctx.user.id,
    published_at: data.is_published ? timestamp : null,
    updated_at: timestamp,
  };
}

export async function mapBlogUpdate(
  data: Payload,
  ctx: Ctx
): Promise<Payload> {
  const timestamp = new Date().toISOString();
  const next: Payload = { ...withSanitizedContent(data), updated_at: timestamp };

  if (data.is_published === true && ctx.id) {
    const { data: existing } = await ctx.supabase
      .from("blog_posts")
      .select("published_at")
      .eq("id", ctx.id)
      .maybeSingle();
    if (!existing?.published_at) {
      next.published_at = timestamp;
    }
  } else if (data.is_published === false) {
    next.published_at = null;
  }

  return next;
}

export async function mapTestimonialPayload(
  data: Payload,
  ctx: Ctx
): Promise<Payload> {
  const fks = await detectFkColumns(ctx.supabase);
  const next = { ...data };

  if (data.country_id) {
    next.destination_country = await getCountryNameById(
      ctx.supabase,
      String(data.country_id)
    );
  }

  if (data.university_id) {
    const { data: university } = await ctx.supabase
      .from("universities")
      .select("name, country_id")
      .eq("id", data.university_id)
      .maybeSingle();

    if (university?.name) next.university_name = university.name;
    if (university?.country_id && !data.country_id) {
      next.country_id = university.country_id;
      next.destination_country = await getCountryNameById(
        ctx.supabase,
        university.country_id
      );
    }
  }

  return applyFkPayload(fks, next, [
    ["testimonials", "country_id"],
    ["testimonials", "university_id"],
  ]) as Payload;
}

async function withCountryName(
  supabase: SupabaseClient,
  data: Payload
): Promise<Payload> {
  const countryName = await getCountryNameById(
    supabase,
    String(data.country_id)
  );
  return {
    ...data,
    country: countryName ?? data.country ?? "",
  };
}

export async function mapCountryNamedCreate(
  data: Payload,
  ctx: Ctx
): Promise<Payload> {
  return withCountryName(ctx.supabase, data);
}

export async function mapCountryNamedUpdate(
  data: Payload,
  ctx: Ctx
): Promise<Payload> {
  if (!data.country_id) return data;
  return withCountryName(ctx.supabase, data);
}

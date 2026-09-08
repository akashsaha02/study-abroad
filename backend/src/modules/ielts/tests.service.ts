import { hasIeltsPermission, type IeltsStaffRole } from "@abroadly/shared/ielts";
import { ieltsTestSchema, ieltsTestUpdateSchema } from "@abroadly/shared/validations/ielts";
import type { AuthUser } from "@abroadly/shared/types";
import { createClient } from "@/infrastructure/supabase/client";
import { AppError, ForbiddenError, NotFoundError, ValidationError } from "@/shared/http/errors";

type Staff = { user: AuthUser; staffRole: IeltsStaffRole | null };

export async function listTests(query: Record<string, unknown>, publicOnly = false) {
  const supabase = createClient();
  let q = supabase
    .from("ielts_tests")
    .select("*, ielts_test_sections(count), ielts_test_questions(count)", {
      count: "exact",
    })
    .order("updated_at", { ascending: false });

  if (publicOnly) {
    q = q.eq("status", "published").in("visibility", ["public", "students"]);
  }
  if (query.skill) q = q.eq("skill", query.skill);
  if (query.kind) q = q.eq("kind", query.kind);
  if (query.status) q = q.eq("status", query.status);

  const { data, error } = await q;
  if (error) throw new AppError(error.message, 500);
  return data ?? [];
}

export async function getTest(id: string, includeQuestions = true) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ielts_tests")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) throw new NotFoundError("Test not found");
  if (!includeQuestions) return data;

  const [{ data: sections }, { data: tq }] = await Promise.all([
    supabase.from("ielts_test_sections").select("*").eq("test_id", id),
    supabase.from("ielts_test_questions").select("*").eq("test_id", id),
  ]);
  return {
    ...data,
    ielts_test_sections: sections ?? [],
    ielts_test_questions: tq ?? [],
  };
}

async function saveComposition(
  supabase: ReturnType<typeof createClient>,
  testId: string,
  sections: {
    id?: string;
    skill: string;
    title: string;
    sort_order: number;
    duration_seconds?: number | null;
    passage_id?: string | null;
    media_id?: string | null;
    question_ids: string[];
  }[]
) {
  await supabase.from("ielts_test_questions").delete().eq("test_id", testId);
  await supabase.from("ielts_test_sections").delete().eq("test_id", testId);

  for (const [index, section] of sections.entries()) {
    const { data: saved, error } = await supabase
      .from("ielts_test_sections")
      .insert({
        test_id: testId,
        skill: section.skill,
        title: section.title,
        sort_order: section.sort_order ?? index,
        duration_seconds: section.duration_seconds ?? null,
        passage_id: section.passage_id ?? null,
        media_id: section.media_id ?? null,
      })
      .select("id")
      .single();
    if (error || !saved) throw new AppError("Failed to save section", 500);

    if (section.question_ids.length) {
      const rows = section.question_ids.map((questionId, sort) => ({
        test_id: testId,
        section_id: saved.id,
        question_id: questionId,
        sort_order: sort,
      }));
      const { error: qErr } = await supabase.from("ielts_test_questions").insert(rows);
      if (qErr) throw new AppError(qErr.message, 500);
    }
  }
}

export async function createTest(body: unknown, staff: Staff) {
  if (
    !hasIeltsPermission("ielts.tests.create", staff.user.profile?.role, staff.staffRole)
  ) {
    throw new ForbiddenError();
  }
  const parsed = ieltsTestSchema.safeParse(body);
  if (!parsed.success) throw new ValidationError(parsed.error);

  const supabase = createClient();
  const { sections, ...rest } = parsed.data;
  const { data, error } = await supabase
    .from("ielts_tests")
    .insert({
      ...rest,
      created_by: staff.user.id,
      updated_by: staff.user.id,
      published_at: rest.status === "published" ? new Date().toISOString() : null,
    })
    .select("*")
    .single();
  if (error || !data) throw new AppError(error?.message ?? "Failed to create test", 500);
  await saveComposition(supabase, data.id, sections);
  return getTest(data.id);
}

export async function updateTest(id: string, body: unknown, staff: Staff) {
  if (!hasIeltsPermission("ielts.tests.edit", staff.user.profile?.role, staff.staffRole)) {
    throw new ForbiddenError();
  }
  const parsed = ieltsTestUpdateSchema.safeParse(body);
  if (!parsed.success) throw new ValidationError(parsed.error);
  if (
    parsed.data.status === "published" &&
    !hasIeltsPermission("ielts.tests.publish", staff.user.profile?.role, staff.staffRole)
  ) {
    throw new ForbiddenError();
  }

  const supabase = createClient();
  const { sections, ...rest } = parsed.data;
  const { data, error } = await supabase
    .from("ielts_tests")
    .update({
      ...rest,
      updated_by: staff.user.id,
      updated_at: new Date().toISOString(),
      published_at:
        rest.status === "published" ? new Date().toISOString() : undefined,
    })
    .eq("id", id)
    .select("id")
    .single();
  if (error || !data) throw new NotFoundError("Test not found");
  if (sections) await saveComposition(supabase, id, sections);
  return getTest(id);
}

export async function duplicateTest(id: string, staff: Staff) {
  const existing = await getTest(id);
  return createTest(
    {
      title: `${existing.title} (copy)`,
      description: existing.description,
      ielts_type: existing.ielts_type,
      kind: existing.kind,
      skill: existing.skill,
      duration_seconds: existing.duration_seconds,
      attempt_limit: existing.attempt_limit,
      visibility: existing.visibility,
      review_policy: existing.review_policy,
      allow_audio_replay: existing.allow_audio_replay,
      status: "draft",
      sections: (existing.ielts_test_sections ?? [])
        .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
        .map((section: {
          id: string;
          skill: string;
          title: string;
          sort_order: number;
          duration_seconds: number | null;
          passage_id: string | null;
          media_id: string | null;
        }) => ({
          skill: section.skill,
          title: section.title,
          sort_order: section.sort_order,
          duration_seconds: section.duration_seconds,
          passage_id: section.passage_id,
          media_id: section.media_id,
          question_ids: (existing.ielts_test_questions ?? [])
            .filter((row: { section_id: string }) => row.section_id === section.id)
            .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
            .map((row: { question_id: string }) => row.question_id),
        })),
    },
    staff
  );
}

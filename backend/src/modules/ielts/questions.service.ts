import {
  canEditQuestion,
  hasIeltsPermission,
  type IeltsStaffRole,
} from "@abroadly/shared/ielts";
import {
  IELTS_QUESTION_TYPE_SET,
  ieltsQuestionSchema,
  ieltsQuestionUpdateSchema,
} from "@abroadly/shared/validations/ielts";
import type { AuthUser } from "@abroadly/shared/types";
import { createClient } from "@/infrastructure/supabase/client";
import { AppError, ForbiddenError, NotFoundError, ValidationError } from "@/shared/http/errors";

type Staff = { user: AuthUser; staffRole: IeltsStaffRole | null };

function parseList(value: unknown) {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string" && value) return value.split(",").map((s) => s.trim());
  return [];
}

async function ensurePassage(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  passageId?: string | null,
  passage?: string | null,
  title?: string | null,
  skill?: string,
  ieltsType?: string
) {
  if (passageId) return passageId;
  if (!passage?.trim()) return null;
  const { data, error } = await supabase
    .from("ielts_passages")
    .insert({
      title: title || "Passage",
      body: passage,
      skill: skill ?? "reading",
      ielts_type: ieltsType ?? "academic",
      created_by: userId,
    })
    .select("id")
    .single();
  if (error || !data) throw new AppError("Failed to save passage", 500);
  return data.id as string;
}

export async function listQuestions(
  query: Record<string, unknown>,
  staff: Staff
) {
  const supabase = createClient();
  const page = Math.max(1, Number(query.page ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(query.pageSize ?? 20)));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let q = supabase
    .from("ielts_questions")
    .select("*, ielts_question_stats(*)", { count: "exact" })
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (query.skill) q = q.eq("skill", query.skill);
  if (query.question_type) q = q.eq("question_type", query.question_type);
  if (query.difficulty) q = q.eq("difficulty", query.difficulty);
  if (query.status) q = q.eq("status", query.status);
  if (query.ielts_type) q = q.eq("ielts_type", query.ielts_type);
  if (query.created_by) q = q.eq("created_by", query.created_by);
  if (query.mine === "1") q = q.eq("created_by", staff.user.id);
  if (query.search) {
    q = q.or(
      `title.ilike.%${query.search}%,question_text.ilike.%${query.search}%`
    );
  }
  const tags = parseList(query.tags);
  if (tags.length) q = q.overlaps("tags", tags);

  const { data, error, count } = await q;
  if (error) throw new AppError(error.message, 500);
  return { items: data ?? [], total: count ?? 0, page, pageSize };
}

export async function getQuestion(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ielts_questions")
    .select("*, ielts_passages(*), ielts_media(*), ielts_question_stats(*)")
    .eq("id", id)
    .single();
  if (error || !data) throw new NotFoundError("Question not found");
  return data;
}

export async function createQuestion(body: unknown, staff: Staff) {
  if (
    !hasIeltsPermission(
      "ielts.questions.create",
      staff.user.profile?.role,
      staff.staffRole
    )
  ) {
    throw new ForbiddenError();
  }
  const parsed = ieltsQuestionSchema.safeParse(body);
  if (!parsed.success) throw new ValidationError(parsed.error);
  if (!IELTS_QUESTION_TYPE_SET.has(parsed.data.question_type)) {
    throw new ValidationError("Unknown question type");
  }

  const supabase = createClient();
  const passageId = await ensurePassage(
    supabase,
    staff.user.id,
    parsed.data.passage_id,
    parsed.data.passage,
    parsed.data.passage_title,
    parsed.data.skill,
    parsed.data.ielts_type
  );

  const status =
    parsed.data.status === "published" &&
    !hasIeltsPermission(
      "ielts.questions.publish",
      staff.user.profile?.role,
      staff.staffRole
    )
      ? "review"
      : parsed.data.status;

  const { data, error } = await supabase
    .from("ielts_questions")
    .insert({
      title: parsed.data.title,
      skill: parsed.data.skill,
      ielts_type: parsed.data.ielts_type,
      section: parsed.data.section ?? null,
      question_type: parsed.data.question_type,
      difficulty: parsed.data.difficulty,
      passage_id: passageId,
      media_id: parsed.data.media_id ?? null,
      instructions: parsed.data.instructions ?? null,
      question_text: parsed.data.question_text,
      prompt: parsed.data.prompt ?? null,
      options: parsed.data.options ?? null,
      correct_answer: parsed.data.correct_answer ?? null,
      accepted_answers: parsed.data.accepted_answers ?? [],
      explanation: parsed.data.explanation ?? null,
      marks: parsed.data.marks,
      tags: parsed.data.tags,
      source: parsed.data.source ?? null,
      status,
      word_min: parsed.data.word_min ?? null,
      word_max: parsed.data.word_max ?? null,
      suggested_minutes: parsed.data.suggested_minutes ?? null,
      cue_card: parsed.data.cue_card ?? null,
      created_by: staff.user.id,
      updated_by: staff.user.id,
      published_at: status === "published" ? new Date().toISOString() : null,
    })
    .select("*")
    .single();

  if (error || !data) throw new AppError(error?.message ?? "Failed to create", 500);
  return data;
}

export async function updateQuestion(id: string, body: unknown, staff: Staff) {
  const existing = await getQuestion(id);
  if (
    !canEditQuestion(
      staff.user.profile?.role,
      staff.staffRole,
      existing.created_by,
      staff.user.id,
      existing.status
    )
  ) {
    throw new ForbiddenError();
  }

  const parsed = ieltsQuestionUpdateSchema.safeParse(body);
  if (!parsed.success) throw new ValidationError(parsed.error);

  const nextStatus = parsed.data.status ?? existing.status;
  if (
    nextStatus === "published" &&
    existing.status !== "published" &&
    !hasIeltsPermission(
      "ielts.questions.publish",
      staff.user.profile?.role,
      staff.staffRole
    )
  ) {
    throw new ForbiddenError();
  }

  const supabase = createClient();
  const passageId = await ensurePassage(
    supabase,
    staff.user.id,
    parsed.data.passage_id ?? existing.passage_id,
    parsed.data.passage,
    parsed.data.passage_title,
    parsed.data.skill ?? existing.skill,
    parsed.data.ielts_type ?? existing.ielts_type
  );

  const { data, error } = await supabase
    .from("ielts_questions")
    .update({
      ...parsed.data,
      passage_id: passageId,
      passage: undefined,
      passage_title: undefined,
      updated_by: staff.user.id,
      reviewed_by:
        nextStatus === "published" ? staff.user.id : existing.reviewed_by,
      published_at:
        nextStatus === "published"
          ? existing.published_at ?? new Date().toISOString()
          : existing.published_at,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) throw new AppError(error?.message ?? "Failed to update", 500);
  return data;
}

export async function duplicateQuestion(id: string, staff: Staff) {
  const existing = await getQuestion(id);
  const supabase = createClient();
  const { id: _id, created_at, updated_at, ...rest } = existing;
  void _id;
  void created_at;
  void updated_at;
  const { data, error } = await supabase
    .from("ielts_questions")
    .insert({
      title: `${existing.title} (copy)`,
      skill: rest.skill,
      ielts_type: rest.ielts_type,
      section: rest.section,
      question_type: rest.question_type,
      difficulty: rest.difficulty,
      passage_id: existing.passage_id,
      media_id: existing.media_id,
      instructions: rest.instructions,
      question_text: rest.question_text,
      prompt: rest.prompt,
      options: rest.options,
      correct_answer: rest.correct_answer,
      accepted_answers: rest.accepted_answers,
      explanation: rest.explanation,
      marks: rest.marks,
      tags: rest.tags,
      source: rest.source,
      status: "draft",
      word_min: rest.word_min,
      word_max: rest.word_max,
      suggested_minutes: rest.suggested_minutes,
      cue_card: rest.cue_card,
      created_by: staff.user.id,
      updated_by: staff.user.id,
    })
    .select("*")
    .single();
  if (error || !data) throw new AppError("Failed to duplicate", 500);
  return data;
}

export async function archiveQuestion(id: string, staff: Staff) {
  if (
    !hasIeltsPermission(
      "ielts.questions.delete",
      staff.user.profile?.role,
      staff.staffRole
    )
  ) {
    throw new ForbiddenError();
  }
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ielts_questions")
    .update({
      status: "archived",
      updated_by: staff.user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id")
    .single();
  if (error || !data) throw new NotFoundError("Question not found");
  return { success: true };
}

export async function bulkQuestionStatus(
  ids: string[],
  status: "published" | "archived" | "review" | "draft",
  staff: Staff
) {
  const needPublish = status === "published";
  const perm = needPublish ? "ielts.questions.publish" : "ielts.questions.edit";
  if (!hasIeltsPermission(perm, staff.user.profile?.role, staff.staffRole)) {
    throw new ForbiddenError();
  }
  if (!ids.length) return { updated: 0 };
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ielts_questions")
    .update({
      status,
      updated_by: staff.user.id,
      updated_at: new Date().toISOString(),
      published_at: needPublish ? new Date().toISOString() : undefined,
    })
    .in("id", ids)
    .select("id");
  if (error) throw new AppError(error.message, 500);
  return { updated: data?.length ?? 0 };
}

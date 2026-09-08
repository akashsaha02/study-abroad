import { createClient } from "@/lib/supabase/server";

export async function getPublishedIeltsTests() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ielts_tests")
    .select("id, title, description, skill, kind, ielts_type, duration_seconds")
    .eq("status", "published")
    .in("visibility", ["public", "students"])
    .order("published_at", { ascending: false });
  return data ?? [];
}

export async function getPublishedQuestionCounts() {
  const supabase = await createClient();
  const skills = ["listening", "reading", "writing", "speaking"] as const;
  const counts = await Promise.all(
    skills.map(async (skill) => {
      const { count } = await supabase
        .from("ielts_questions")
        .select("id", { count: "exact", head: true })
        .eq("status", "published")
        .eq("skill", skill);
      return [skill, count ?? 0] as const;
    })
  );
  return Object.fromEntries(counts) as Record<(typeof skills)[number], number>;
}

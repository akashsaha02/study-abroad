import { PageHeader } from "@/components/common/PageHeader";
import { PageStack } from "@/components/common/PageStack";
import { QuestionBankClient } from "@/features/ielts/admin/QuestionBankClient";
import { createClient } from "@/lib/supabase/server";

export default async function AdminIeltsQuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ mine?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  let q = supabase
    .from("ielts_questions")
    .select("*, ielts_question_stats(*)")
    .order("updated_at", { ascending: false })
    .limit(100);
  const { data: user } = await supabase.auth.getUser();
  if (params.mine === "1" && user.user) q = q.eq("created_by", user.user.id);
  const { data } = await q;

  return (
    <PageStack>
      <PageHeader
        compact
        title="IELTS question bank"
        description="Create, review, publish, and archive questions. Archive is used instead of hard delete."
      />
      <QuestionBankClient items={(data ?? []) as never} total={data?.length ?? 0} />
    </PageStack>
  );
}

import { EligibilityRuleForm } from "@/components/admin/forms/EligibilityRuleForm";
import { createClient } from "@/lib/supabase/server";
import type { EligibilityRule } from "@/types";
import { notFound } from "next/navigation";

export default async function EditEligibilityRulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("eligibility_rules").select("*").eq("id", id).single();

  if (!data) notFound();

  return <EligibilityRuleForm initial={data as EligibilityRule} />;
}

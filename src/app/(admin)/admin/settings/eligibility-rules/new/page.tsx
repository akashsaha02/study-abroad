import { EligibilityRuleForm } from "@/components/admin/forms/EligibilityRuleForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewEligibilityRulePage() {
  const supabase = await createClient();
  const { data: countries } = await supabase.from("countries").select("id, name").order("name");

  return <EligibilityRuleForm countries={countries ?? []} />;
}

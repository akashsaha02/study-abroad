import { CostSettingForm } from "@/components/admin/forms/CostSettingForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewCostSettingPage() {
  const supabase = await createClient();
  const { data: countries } = await supabase.from("countries").select("id, name").order("name");

  return <CostSettingForm countries={countries ?? []} />;
}

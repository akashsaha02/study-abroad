import { CostSettingForm } from "@/components/admin/forms/CostSettingForm";
import { createClient } from "@/lib/supabase/server";
import type { CostSetting } from "@/types";
import { notFound } from "next/navigation";

export default async function EditCostSettingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data }, { data: countries }] = await Promise.all([
    supabase.from("cost_settings").select("*").eq("id", id).single(),
    supabase.from("countries").select("id, name").order("name"),
  ]);

  if (!data) notFound();

  return <CostSettingForm countries={countries ?? []} initial={data as CostSetting} />;
}

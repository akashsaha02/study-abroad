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
  const { data } = await supabase.from("cost_settings").select("*").eq("id", id).single();

  if (!data) notFound();

  return <CostSettingForm initial={data as CostSetting} />;
}

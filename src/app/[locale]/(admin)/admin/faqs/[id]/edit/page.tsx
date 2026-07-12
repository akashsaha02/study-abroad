import { FaqForm } from "@/components/admin/forms/FaqForm";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data }, { data: countries }] = await Promise.all([
    supabase.from("faqs").select("*").eq("id", id).single(),
    supabase.from("countries").select("id, name").order("name"),
  ]);

  if (!data) notFound();

  return <FaqForm countries={countries ?? []} initial={data} />;
}

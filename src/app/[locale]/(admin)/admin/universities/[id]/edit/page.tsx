import { UniversityForm } from "@/components/admin/forms/UniversityForm";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function EditUniversityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data }, { data: countries }] = await Promise.all([
    supabase.from("universities").select("*").eq("id", id).single(),
    supabase.from("countries").select("id, name").order("name"),
  ]);

  if (!data) notFound();

  return <UniversityForm countries={countries ?? []} initial={data} />;
}

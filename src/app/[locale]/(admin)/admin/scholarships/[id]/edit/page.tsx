import { ScholarshipForm } from "@/components/admin/forms/ScholarshipForm";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function EditScholarshipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data }, { data: universities }, { data: countries }] = await Promise.all([
    supabase.from("scholarships").select("*").eq("id", id).single(),
    supabase.from("universities").select("id, name").order("name"),
    supabase.from("countries").select("id, name").order("name"),
  ]);

  if (!data) notFound();

  return (
    <ScholarshipForm
      universities={universities ?? []}
      countries={countries ?? []}
      initial={data}
    />
  );
}

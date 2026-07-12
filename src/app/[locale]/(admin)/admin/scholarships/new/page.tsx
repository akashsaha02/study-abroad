import { ScholarshipForm } from "@/components/admin/forms/ScholarshipForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewScholarshipPage() {
  const supabase = await createClient();
  const [{ data: universities }, { data: countries }] = await Promise.all([
    supabase.from("universities").select("id, name").order("name"),
    supabase.from("countries").select("id, name").order("name"),
  ]);

  return (
    <ScholarshipForm
      universities={universities ?? []}
      countries={countries ?? []}
    />
  );
}

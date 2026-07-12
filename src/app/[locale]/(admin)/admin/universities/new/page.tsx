import { UniversityForm } from "@/components/admin/forms/UniversityForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewUniversityPage() {
  const supabase = await createClient();
  const { data: countries } = await supabase
    .from("countries")
    .select("id, name")
    .order("name");

  return <UniversityForm countries={countries ?? []} />;
}

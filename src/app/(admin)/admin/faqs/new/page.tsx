import { FaqForm } from "@/components/admin/forms/FaqForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewFaqPage() {
  const supabase = await createClient();
  const { data: countries } = await supabase
    .from("countries")
    .select("id, name")
    .order("name");

  return <FaqForm countries={countries ?? []} />;
}

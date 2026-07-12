import { TestimonialForm } from "@/components/admin/forms/TestimonialForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewTestimonialPage() {
  const supabase = await createClient();
  const [{ data: countries }, { data: universities }] = await Promise.all([
    supabase.from("countries").select("id, name").order("name"),
    supabase.from("universities").select("id, name, country_id").order("name"),
  ]);

  return (
    <TestimonialForm countries={countries ?? []} universities={universities ?? []} />
  );
}

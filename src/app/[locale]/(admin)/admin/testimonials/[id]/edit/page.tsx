import { TestimonialForm } from "@/components/admin/forms/TestimonialForm";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data }, { data: countries }, { data: universities }] = await Promise.all([
    supabase.from("testimonials").select("*").eq("id", id).single(),
    supabase.from("countries").select("id, name").order("name"),
    supabase.from("universities").select("id, name, country_id").order("name"),
  ]);

  if (!data) notFound();

  return (
    <TestimonialForm
      countries={countries ?? []}
      universities={universities ?? []}
      initial={data}
    />
  );
}

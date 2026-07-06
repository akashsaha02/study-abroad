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
  const { data } = await supabase.from("testimonials").select("*").eq("id", id).single();

  if (!data) notFound();

  return <TestimonialForm initial={data} />;
}

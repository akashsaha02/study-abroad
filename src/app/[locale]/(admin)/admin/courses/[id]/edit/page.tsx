import { CourseForm } from "@/components/admin/forms/CourseForm";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data }, { data: universities }] = await Promise.all([
    supabase.from("courses").select("*").eq("id", id).single(),
    supabase.from("universities").select("id, name").order("name"),
  ]);

  if (!data) notFound();

  return <CourseForm universities={universities ?? []} initial={data} />;
}

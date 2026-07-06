import { CourseForm } from "@/components/admin/forms/CourseForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewCoursePage() {
  const supabase = await createClient();
  const { data: universities } = await supabase
    .from("universities")
    .select("id, name")
    .order("name");

  return <CourseForm universities={universities ?? []} />;
}

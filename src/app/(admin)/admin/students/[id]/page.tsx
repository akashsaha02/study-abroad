import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminStudentDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: student } = await supabase
    .from("students")
    .select("*, profiles(full_name, email, phone)")
    .eq("id", id)
    .single();

  if (!student) notFound();

  const { data: applications } = await supabase
    .from("applications")
    .select("*, universities(name), countries(name)")
    .eq("student_id", id);

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("student_id", id);

  const profile = student.profiles as { full_name?: string; email?: string; phone?: string };

  return (
    <div className="space-y-6">
      <PageHeader title={profile.full_name ?? "Student"} description={profile.email} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-2 p-6">
            <h3 className="font-semibold">Profile</h3>
            <p className="text-sm">Phone: {profile.phone ?? "—"}</p>
            <p className="text-sm">Country: {student.preferred_country ?? "—"}</p>
            <p className="text-sm">Education: {student.highest_education ?? "—"}</p>
            <p className="text-sm">CGPA: {student.cgpa ?? "—"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold">Applications ({applications?.length ?? 0})</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {applications?.map((a) => (
                <li key={a.id}>
                  {(a.universities as { name?: string })?.name} — {a.status}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="font-semibold">Documents ({documents?.length ?? 0})</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {documents?.map((d) => (
                <li key={d.id}>
                  {d.document_type} — {d.status}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Card } from "antd";
import { PageHeader } from "@/components/common/PageHeader";

import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SendNotificationForm } from "./SendNotificationForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminStudentDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: student } = await supabase
    .from("students")
    .select("*, profiles(full_name, email, phone, id)")
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

  const profile = student.profiles as {
    id: string;
    full_name?: string;
    email?: string;
    phone?: string;
  };

  return (
    <div className="space-y-6">
      <PageHeader title={profile.full_name ?? "Student"} description={profile.email} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="space-y-2 p-6">
            <h3 className="font-semibold">Profile</h3>
            <p className="text-sm">Phone: {profile.phone ?? "—"}</p>
            <p className="text-sm">Country: {student.preferred_country ?? "—"}</p>
            <p className="text-sm">Education: {student.highest_education ?? "—"}</p>
            <p className="text-sm">CGPA: {student.cgpa ?? "—"}</p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <h3 className="font-semibold">Applications ({applications?.length ?? 0})</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {applications?.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/admin/applications/${a.id}`}
                    className="text-primary hover:underline"
                  >
                    {(a.universities as { name?: string })?.name}
                  </Link>{" "}
                  — {a.status}
                </li>
              ))}
            </ul>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <SendNotificationForm userId={profile.id} />
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <div className="p-6">
            <h3 className="font-semibold">Documents ({documents?.length ?? 0})</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {documents?.map((d) => (
                <li key={d.id}>
                  {d.document_type} — {d.status}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}

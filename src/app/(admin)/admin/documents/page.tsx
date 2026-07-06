import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable } from "@/components/tables/DataTable";
import { createClient } from "@/lib/supabase/server";
import { DocumentReviewActions } from "./review-actions";

export default async function AdminDocumentsPage() {
  const supabase = await createClient();
  const { data: documents } = await supabase
    .from("documents")
    .select("*, students(profiles(full_name))")
    .eq("status", "pending_review")
    .order("uploaded_at", { ascending: false });

  const columns = [
    {
      key: "student",
      header: "Student",
      cell: (row: NonNullable<typeof documents>[0]) =>
        (row.students as { profiles?: { full_name?: string } })?.profiles?.full_name ?? "—",
    },
    { key: "type", header: "Type", cell: (row: NonNullable<typeof documents>[0]) => row.document_type },
    { key: "file", header: "File", cell: (row: NonNullable<typeof documents>[0]) => row.file_name },
    {
      key: "status",
      header: "Status",
      cell: (row: NonNullable<typeof documents>[0]) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row: NonNullable<typeof documents>[0]) => (
        <DocumentReviewActions documentId={row.id} />
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Document Review" description="Review pending student documents." />
      <DataTable
        columns={columns}
        data={documents ?? []}
        emptyMessage="No pending documents"
      />
    </div>
  );
}

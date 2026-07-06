import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { getUser } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";

export default async function CounselorNotesPage() {
  const user = await getUser();
  const supabase = await createClient();
  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .eq("author_id", user?.id)
    .order("created_at", { ascending: false });

  const columns = [
    {
      key: "content",
      header: "Note",
      cell: (row: NonNullable<typeof notes>[0]) => (
        <span className="line-clamp-2">{row.content}</span>
      ),
    },
    {
      key: "visibility",
      header: "Visibility",
      cell: (row: NonNullable<typeof notes>[0]) => row.visibility,
    },
    {
      key: "date",
      header: "Date",
      cell: (row: NonNullable<typeof notes>[0]) =>
        new Date(row.created_at).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <PageHeader title="Notes" description="Your internal notes." />
      <DataTable columns={columns} data={notes ?? []} emptyMessage="No notes yet" />
    </div>
  );
}

import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { ConsultationStatusSelect } from "@/components/admin/ConsultationStatusSelect";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable } from "@/components/tables/DataTable";
import { createClient } from "@/lib/supabase/server";
import type { ConsultationStatus } from "@/types";
import Link from "next/link";

export default async function AdminConsultationsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("consultations")
    .select(
      "*, leads(name), students(profiles(full_name)), counselors:profiles!consultations_counselor_id_fkey(full_name)"
    )
    .order("created_at", { ascending: false });

  type Row = NonNullable<typeof data>[0];

  const columns = [
    {
      key: "participant",
      header: "Lead / Student",
      cell: (r: Row) => {
        const leadName = (r.leads as { name?: string })?.name;
        const studentName = (
          r.students as { profiles?: { full_name?: string } }
        )?.profiles?.full_name;
        return leadName ?? studentName ?? "—";
      },
    },
    {
      key: "counselor",
      header: "Counselor",
      cell: (r: Row) =>
        (r.counselors as { full_name?: string })?.full_name ?? "—",
    },
    {
      key: "scheduled",
      header: "Scheduled",
      cell: (r: Row) =>
        r.scheduled_at
          ? new Date(r.scheduled_at).toLocaleString()
          : r.requested_date ?? "—",
    },
    {
      key: "status",
      header: "Status",
      cell: (r: Row) => <StatusBadge status={r.status} />,
    },
    {
      key: "actions",
      header: "Update Status",
      cell: (r: Row) => (
        <ConsultationStatusSelect
          consultationId={r.id}
          currentStatus={r.status as ConsultationStatus}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Consultations" description="Schedule and manage consultations.">
        <AdminPageActions href="/admin/consultations/new" label="Schedule consultation" />
      </PageHeader>
      <DataTable columns={columns} data={data ?? []} emptyMessage="No consultations" />
      {data && data.length > 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          <Link href="/admin/consultations/new" className="text-primary hover:underline">
            Schedule a new consultation
          </Link>
        </p>
      )}
    </div>
  );
}

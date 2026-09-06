import { ConsultationsAdminPanel } from "@/components/admin/ConsultationsAdminPanel";
import { CONSULTATION_STATUSES } from "@/constants";
import { formatDate, translateStatus } from "@/lib/i18n-format";
import { buildUniqueFilters } from "@/lib/table-helpers";
import {
  CONSULTATIONS_LIST_SELECT,
  STUDENTS_ID_EMAIL_SELECT,
} from "@/lib/supabase/embeds";
import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";

async function getConsultations() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("consultations")
    .select(CONSULTATIONS_LIST_SELECT)
    .order("created_at", { ascending: false });
  return data ?? [];
}

async function getConsultationFormData() {
  const supabase = await createClient();
  const [{ data: leads }, { data: students }, { data: counselors }] = await Promise.all([
    supabase.from("leads").select("id, name").order("name"),
    supabase
      .from("students")
      .select(STUDENTS_ID_EMAIL_SELECT)
      .order("created_at", { ascending: false }),
    supabase
      .from("counselors")
      .select("profile_id, profiles(full_name)")
      .eq("is_active", true),
  ]);

  const studentOptions = (students ?? []).map((s) => ({
    id: s.id,
    label:
      (s.profiles as { full_name?: string; email?: string })?.full_name ??
      (s.profiles as { email?: string })?.email ??
      s.id,
  }));

  const counselorOptions = (counselors ?? []).map((c) => ({
    profile_id: c.profile_id,
    name: (c.profiles as { full_name?: string })?.full_name ?? c.profile_id,
  }));

  return {
    leads: leads ?? [],
    students: studentOptions,
    counselors: counselorOptions,
  };
}

export default async function AdminConsultationsPage() {
  const t = await getTranslations("adminPages.consultations");
  const tStatus = await getTranslations("status");
  const tCommon = await getTranslations("common");
  const locale = await getLocale();
  const dateLocale = locale === "bn" ? "bn-BD" : "en-US";
  const [consultations, formData] = await Promise.all([
    getConsultations(),
    getConsultationFormData(),
  ]);

  const rows = consultations.map((r) => {
    const leadName = (r.leads as { name?: string })?.name;
    const studentName = (
      r.students as { profiles?: { full_name?: string } }
    )?.profiles?.full_name;
    const scheduledDisplay = r.scheduled_at
      ? formatDate(r.scheduled_at, dateLocale, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : (r.requested_date ?? "—");

    return {
      id: r.id,
      participant: leadName ?? studentName ?? "—",
      counselor: (r.counselors as { full_name?: string })?.full_name ?? "—",
      scheduled: scheduledDisplay,
      scheduled_at: r.scheduled_at ?? r.requested_date ?? "",
      status: r.status,
      statusLabel: translateStatus(tStatus, r.status),
    };
  });

  return (
    <ConsultationsAdminPanel
      title={t("title")}
      description={t("description")}
      addLabel="Schedule consultation"
      emptyText={t("empty")}
      rows={rows}
      leads={formData.leads}
      students={formData.students}
      counselors={formData.counselors}
      columns={[
        {
          key: "participant",
          title: t("columns.participant"),
          dataIndex: "participant",
          searchable: true,
          sortable: true,
        },
        {
          key: "counselor",
          title: t("columns.counselor"),
          dataIndex: "counselor",
          searchable: true,
          filters: buildUniqueFilters(rows.map((r) => r.counselor)),
        },
        {
          key: "scheduled",
          title: t("columns.scheduled"),
          dataIndex: "scheduled",
          sortKey: "scheduled_at",
          sortable: "date",
        },
        {
          key: "status",
          title: t("columns.status"),
          dataIndex: "status",
          filters: buildUniqueFilters(CONSULTATION_STATUSES, (s) => tStatus(s)),
          cell: { type: "status", labelKey: "statusLabel" },
        },
        {
          key: "actions",
          title: tCommon("actions"),
          cell: { type: "consultation-status" },
        },
      ]}
    />
  );
}

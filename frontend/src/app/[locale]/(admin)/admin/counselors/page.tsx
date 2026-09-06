import { CounselorsAdminPanel } from "@/components/admin/resource-admin-panels";
import { buildUniqueFilters } from "@/lib/table-helpers";
import { createClient } from "@/lib/supabase/server";
import type { Counselor } from "@/types";
import { getTranslations } from "next-intl/server";

async function getCounselors() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("counselors")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

async function getProfileOptions() {
  const supabase = await createClient();
  const [{ data: counselorProfiles }, { data: existingCounselors }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("role", "counselor")
      .order("full_name"),
    supabase.from("counselors").select("profile_id"),
  ]);
  const usedIds = new Set(existingCounselors?.map((c) => c.profile_id) ?? []);
  const availableProfiles = (counselorProfiles ?? []).filter((p) => !usedIds.has(p.id));
  return { counselorProfiles: counselorProfiles ?? [], availableProfiles };
}

export default async function AdminCounselorsPage() {
  const t = await getTranslations("adminPages.counselors");
  const tCommon = await getTranslations("common");
  const [counselors, { counselorProfiles, availableProfiles }] = await Promise.all([
    getCounselors(),
    getProfileOptions(),
  ]);

  const records = counselors.map((row) => {
    const { profiles: _unused, ...counselor } = row;
    void _unused;
    return counselor as Counselor;
  });

  const rows = counselors.map((r) => ({
    id: r.id,
    name: (r.profiles as { full_name?: string })?.full_name ?? "—",
    email: (r.profiles as { email?: string })?.email ?? "—",
    specialization: r.specialization ?? "—",
    is_active: String(r.is_active),
    isActive: r.is_active,
  }));

  return (
    <CounselorsAdminPanel
      counselorProfiles={counselorProfiles}
      availableProfiles={availableProfiles}
      title={t("title")}
      description={t("description")}
      addLabel="New counselor"
      formId="counselor-form"
      formTitleAdd="New counselor"
      formTitleEdit="Edit counselor"
      records={records}
      data={rows}
      emptyText={t("empty")}
      modalWidth={720}
      columns={[
        {
          key: "name",
          title: t("columns.name"),
          dataIndex: "name",
          searchable: true,
          sortable: true,
        },
        {
          key: "email",
          title: t("columns.email"),
          dataIndex: "email",
          searchable: true,
        },
        {
          key: "specialization",
          title: t("columns.specialization"),
          dataIndex: "specialization",
          searchable: true,
          filters: buildUniqueFilters(rows.map((r) => r.specialization)),
        },
        {
          key: "active",
          title: t("columns.active"),
          dataIndex: "is_active",
          filters: [
            { text: tCommon("yes"), value: "true" },
            { text: tCommon("no"), value: "false" },
          ],
          cell: { type: "yesNo" },
        },
        {
          key: "actions",
          title: tCommon("actions"),
          cell: { type: "counselor-actions", nameKey: "name", activeKey: "isActive" },
        },
      ]}
    />
  );
}

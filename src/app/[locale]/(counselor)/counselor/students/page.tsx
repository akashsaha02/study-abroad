import { PageHeader } from "@/components/common/PageHeader";
import { FilterableDataTable } from "@/components/tables/FilterableDataTable";
import { getUser } from "@/lib/auth/get-user";
import { buildUniqueFilters } from "@/lib/table-helpers";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";

export default async function CounselorStudentsPage() {
  const t = await getTranslations("adminPages.students");
  const tPage = await getTranslations("counselorPages.students");
  const user = await getUser();
  const supabase = await createClient();
  const { data: students } = await supabase
    .from("students")
    .select("*, profiles(full_name, email)")
    .eq("assigned_counselor_id", user?.id);

  const rows = (students ?? []).map((student) => ({
    id: student.id,
    name: (student.profiles as { full_name?: string })?.full_name ?? "—",
    email: (student.profiles as { email?: string })?.email ?? "—",
    country: student.preferred_country ?? "—",
  }));

  return (
    <div>
      <PageHeader title={tPage("title")} description={tPage("description")} />
      <FilterableDataTable
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
            key: "country",
            title: t("columns.country"),
            dataIndex: "country",
            filters: buildUniqueFilters(rows.map((r) => r.country)),
          },
        ]}
        data={rows}
        emptyText={tPage("empty")}
      />
    </div>
  );
}

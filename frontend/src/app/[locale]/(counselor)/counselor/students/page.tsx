import { PageHeader } from "@/components/common/PageHeader";
import { PageStack } from "@/components/common/PageStack";
import { PanelCard } from "@/components/common/PanelCard";
import { FilterableDataTable } from "@/components/tables/FilterableDataTable";
import { getUser } from "@/infrastructure/auth/get-user";
import { resolveStudentCountryNames } from "@abroadly/shared/countries/display";
import { buildUniqueFilters } from "@/lib/table-helpers";
import { STUDENTS_WITH_PROFILE_BASIC } from "@abroadly/shared/embeds";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";

export default async function CounselorStudentsPage() {
  const t = await getTranslations("adminPages.students");
  const tPage = await getTranslations("counselorPages.students");
  const user = await getUser();
  const supabase = await createClient();
  const { data: students, error } = await supabase
    .from("students")
    .select(STUDENTS_WITH_PROFILE_BASIC)
    .eq("assigned_counselor_id", user?.id);

  if (error) {
    return (
      <PageStack>
        <PageHeader compact title={tPage("title")} description={tPage("description")} />
        <PanelCard className="border-destructive/30 bg-destructive/5">
          <p className="text-sm text-destructive">{tPage("loadError")}</p>
        </PanelCard>
      </PageStack>
    );
  }

  const countryMap = await resolveStudentCountryNames(supabase, students ?? []);

  const rows = (students ?? []).map((student) => ({
    id: student.id,
    name: (student.profiles as { full_name?: string })?.full_name ?? "—",
    detailHref: `/counselor/students/${student.id}`,
    email: (student.profiles as { email?: string })?.email ?? "—",
    country: countryMap.get(student.id) ?? "—",
  }));

  return (
    <PageStack>
      <PageHeader compact title={tPage("title")} description={tPage("description")} />
      <FilterableDataTable
        columns={[
          {
            key: "name",
            title: t("columns.name"),
            dataIndex: "name",
            searchable: true,
            sortable: true,
            cell: { type: "link", hrefKey: "detailHref", labelKey: "name" },
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
    </PageStack>
  );
}

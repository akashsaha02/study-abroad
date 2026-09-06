import { PageHeader } from "@/components/common/PageHeader";
import { PageStack } from "@/components/common/PageStack";
import { PanelCard } from "@/components/common/PanelCard";
import { FilterableDataTable } from "@/components/tables/FilterableDataTable";
import { resolveStudentCountryNames } from "@/lib/countries/display";
import { buildUniqueFilters } from "@/lib/table-helpers";
import { STUDENTS_WITH_PROFILE } from "@/lib/supabase/embeds";
import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";

export default async function AdminStudentsPage() {
  const t = await getTranslations("adminPages.students");
  const locale = await getLocale();
  const dateLocale = locale === "bn" ? "bn-BD" : "en-US";
  const supabase = await createClient();
  const { data: students, error } = await supabase
    .from("students")
    .select(STUDENTS_WITH_PROFILE)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <PageStack>
        <PageHeader compact title={t("title")} description={t("description")} />
        <PanelCard className="border-destructive/30 bg-destructive/5">
          <p className="text-sm text-destructive">{t("loadError")}</p>
        </PanelCard>
      </PageStack>
    );
  }

  const countryMap = await resolveStudentCountryNames(supabase, students ?? []);

  const rows = (students ?? []).map((student) => ({
    id: student.id,
    name: (student.profiles as { full_name?: string })?.full_name ?? "—",
    detailHref: `/admin/students/${student.id}`,
    email: (student.profiles as { email?: string })?.email ?? "—",
    phone: (student.profiles as { phone?: string })?.phone ?? "—",
    country: countryMap.get(student.id) ?? "—",
    created_at: student.created_at,
  }));

  return (
    <PageStack>
      <PageHeader compact title={t("title")} description={t("description")} />
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
            key: "phone",
            title: t("columns.phone"),
            dataIndex: "phone",
            searchable: true,
          },
          {
            key: "country",
            title: t("columns.country"),
            dataIndex: "country",
            filters: buildUniqueFilters(rows.map((r) => r.country)),
          },
          {
            key: "created",
            title: t("columns.created"),
            dataIndex: "created_at",
            sortable: "date",
            cell: { type: "date", locale: dateLocale },
          },
        ]}
        data={rows}
        emptyText={t("empty")}
      />
    </PageStack>
  );
}

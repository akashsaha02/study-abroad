import { CoursesAdminPanel } from "@/components/admin/resource-admin-panels";
import { buildPublishedFilters, buildUniqueFilters } from "@/lib/table-helpers";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";

async function getCourses() {
  const supabase = await createClient();
  const { data } = await supabase.from("courses").select("*").order("title");
  return data ?? [];
}

async function getUniversities() {
  const supabase = await createClient();
  const { data } = await supabase.from("universities").select("id, name").order("name");
  return data ?? [];
}

export default async function AdminCoursesPage() {
  const t = await getTranslations("adminPages.courses");
  const tCommon = await getTranslations("common");
  const [courses, universities] = await Promise.all([getCourses(), getUniversities()]);
  const universityMap = new Map(universities.map((u) => [u.id, u.name]));

  const rows = courses.map((r) => ({
    id: r.id,
    title: r.title,
    university: universityMap.get(r.university_id) ?? "—",
    degree_level: r.degree_level ?? "—",
    is_published: String(r.is_published),
  }));

  return (
    <CoursesAdminPanel
      universities={universities}
      title={t("title")}
      description={t("description")}
      addLabel="New course"
      formId="course-form"
      formTitleAdd="New course"
      formTitleEdit="Edit course"
      records={courses}
      data={rows}
      emptyText={t("empty")}
      modalWidth={800}
      columns={[
        {
          key: "title",
          title: t("columns.name"),
          dataIndex: "title",
          searchable: true,
          sortable: true,
        },
        {
          key: "university",
          title: t("columns.university"),
          dataIndex: "university",
          searchable: true,
          filters: buildUniqueFilters(rows.map((r) => r.university)),
        },
        {
          key: "level",
          title: t("columns.degree"),
          dataIndex: "degree_level",
          filters: buildUniqueFilters(rows.map((r) => r.degree_level)),
        },
        {
          key: "published",
          title: t("columns.published"),
          dataIndex: "is_published",
          filters: buildPublishedFilters(tCommon),
          cell: { type: "published" },
        },
        {
          key: "actions",
          title: tCommon("actions"),
          cell: {
            type: "resource-actions",
            apiPath: "/api/admin/courses",
            publishedKey: "is_published",
            nameKey: "title",
          },
        },
      ]}
    />
  );
}

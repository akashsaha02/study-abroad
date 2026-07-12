import { TestimonialsAdminPanel } from "@/components/admin/resource-admin-panels";
import { buildPublishedFilters, buildUniqueFilters } from "@/lib/table-helpers";
import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";

async function getTestimonials() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

async function getCountries() {
  const supabase = await createClient();
  const { data } = await supabase.from("countries").select("id, name").order("name");
  return data ?? [];
}

async function getUniversities() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("universities")
    .select("id, name, country_id")
    .order("name");
  return data ?? [];
}

export default async function AdminTestimonialsPage() {
  const t = await getTranslations("adminPages.testimonials");
  const tCommon = await getTranslations("common");
  const locale = await getLocale();
  const dateLocale = locale === "bn" ? "bn-BD" : "en-US";
  const [testimonials, countries, universities] = await Promise.all([
    getTestimonials(),
    getCountries(),
    getUniversities(),
  ]);

  const rows = testimonials.map((r) => ({
    id: r.id,
    name: r.student_name,
    country: r.destination_country ?? "—",
    rating: String(r.rating),
    is_published: String(r.is_published),
    created_at: r.created_at,
  }));

  return (
    <TestimonialsAdminPanel
      countries={countries}
      universities={universities}
      title={t("title")}
      description={t("description")}
      addLabel="New testimonial"
      formId="testimonial-form"
      formTitleAdd="New testimonial"
      formTitleEdit="Edit testimonial"
      records={testimonials}
      data={rows}
      emptyText={t("empty")}
      modalWidth={800}
      columns={[
        {
          key: "name",
          title: t("columns.name"),
          dataIndex: "name",
          searchable: true,
          sortable: true,
        },
        {
          key: "country",
          title: t("columns.country"),
          dataIndex: "country",
          filters: buildUniqueFilters(rows.map((r) => r.country)),
        },
        {
          key: "rating",
          title: t("columns.rating"),
          dataIndex: "rating",
          sortable: "number",
        },
        {
          key: "published",
          title: t("columns.published"),
          dataIndex: "is_published",
          filters: buildPublishedFilters(tCommon),
          cell: { type: "published" },
        },
        {
          key: "created",
          title: t("columns.created"),
          dataIndex: "created_at",
          sortable: "date",
          cell: { type: "date", locale: dateLocale },
        },
        {
          key: "actions",
          title: tCommon("actions"),
          cell: {
            type: "resource-actions",
            apiPath: "/api/admin/testimonials",
            publishedKey: "is_published",
            nameKey: "name",
          },
        },
      ]}
    />
  );
}

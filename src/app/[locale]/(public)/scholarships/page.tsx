import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { ScholarshipCard } from "@/components/public/ScholarshipCard";
import { buildMetadata } from "@/components/seo/PageSEO";
import { getPublishedScholarships } from "@/lib/services/content";
import { StarIcon } from "@hugeicons/core-free-icons";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("public.scholarships");
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/scholarships",
  });
}

export default async function ScholarshipsPage() {
  const t = await getTranslations("public.scholarships");
  const scholarships = await getPublishedScholarships();

  return (
    <PageLayout>
      <PageHeader
        eyebrow={t("eyebrow")}
        eyebrowIcon={StarIcon}
        title={t("title")}
        description={t("description")}
      />
      {scholarships.length === 0 ? (
        <EmptyState title={t("emptyTitle")} description={t("emptyDesc")} />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {scholarships.map((s) => {
            const country = (s as { countries?: { name?: string } }).countries
              ?.name;
            const university = (s as { universities?: { name?: string } })
              .universities?.name;
            return (
              <ScholarshipCard
                key={s.id}
                title={s.title}
                amount={s.amount}
                location={[university, country].filter(Boolean).join(" · ")}
                deadline={s.deadline}
              />
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { ScholarshipCard } from "@/components/public/ScholarshipCard";
import { buildMetadata } from "@/components/seo/PageSEO";
import { getPublishedScholarships } from "@/lib/services/content";
import { StarIcon } from "@hugeicons/core-free-icons";

export const metadata = buildMetadata({
  title: "Scholarships",
  description: "Discover scholarship opportunities for international students.",
  path: "/scholarships",
});

export default async function ScholarshipsPage() {
  const scholarships = await getPublishedScholarships();

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Funding"
        eyebrowIcon={StarIcon}
        title="Scholarships"
        description="Funding opportunities to make your study abroad journey more affordable."
      />
      {scholarships.length === 0 ? (
        <EmptyState
          title="No scholarships listed yet"
          description="Scholarships will appear here once published."
        />
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

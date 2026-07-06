import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { buildMetadata } from "@/components/seo/PageSEO";
import { Card, CardContent } from "@/components/ui/card";
import { getPublishedScholarships } from "@/lib/services/content";

export const metadata = buildMetadata({
  title: "Scholarships",
  description: "Discover scholarship opportunities for international students.",
  path: "/scholarships",
});

export default async function ScholarshipsPage() {
  const scholarships = await getPublishedScholarships();

  return (
    <Container className="py-12">
      <PageHeader
        title="Scholarships"
        description="Funding opportunities for your study abroad journey."
      />
      {scholarships.length === 0 ? (
        <EmptyState
          title="No scholarships listed yet"
          description="Scholarships will appear here once published."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {scholarships.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-6">
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.amount}</p>
                {s.deadline && (
                  <p className="mt-2 text-sm">Deadline: {s.deadline}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}

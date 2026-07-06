import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { buildMetadata } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { FALLBACK_UNIVERSITIES } from "@/data/fallback";
import { getPublishedCourses, getUniversityBySlug } from "@/lib/services/content";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const uni = await getUniversityBySlug(slug);
  const fallback = FALLBACK_UNIVERSITIES.find((u) => u.slug === slug);
  const name = uni?.name ?? fallback?.name;
  if (!name) return { title: "University Not Found" };
  return buildMetadata({
    title: name,
    description: `Study at ${name}. View courses, requirements, and tuition.`,
    path: `/universities/${slug}`,
  });
}

export default async function UniversityDetailPage({ params }: Props) {
  const { slug } = await params;
  const uni = await getUniversityBySlug(slug);
  const fallback = FALLBACK_UNIVERSITIES.find((u) => u.slug === slug);
  const university = uni ?? fallback;

  if (!university) notFound();

  const courses = university.id
    ? await getPublishedCourses({ universityId: university.id as string })
    : [];

  return (
    <Container className="py-12">
      <PageHeader
        title={university.name!}
        description={[university.city, (university as { countries?: { name: string } }).countries?.name]
          .filter(Boolean)
          .join(", ")}
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {university.description && (
            <p className="text-muted-foreground">{university.description}</p>
          )}
          {university.requirements && (
            <section>
              <h2 className="text-lg font-semibold">Entry Requirements</h2>
              <p className="mt-2 text-muted-foreground">{university.requirements}</p>
            </section>
          )}
          {courses.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold">Available Courses</h2>
              <ul className="mt-4 space-y-2">
                {courses.map((c) => (
                  <li key={c.id} className="rounded-lg border p-4">
                    <Link href={`${ROUTES.courses}/${c.slug}`} className="font-medium hover:underline">
                      {c.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {c.degree_level} · {c.duration}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <div className="space-y-4">
          {university.tuition_min && (
            <p className="text-sm">
              Tuition: ${university.tuition_min.toLocaleString()} – $
              {university.tuition_max?.toLocaleString()}/year
            </p>
          )}
          <Button asChild className="w-full">
            <Link href={ROUTES.contact}>Apply with Abroadly</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}

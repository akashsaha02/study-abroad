import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { CourseCard } from "@/components/public/CourseCard";
import { buildMetadata } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { FALLBACK_UNIVERSITIES } from "@/data/fallback";
import { getPublishedCourses, getUniversityBySlug } from "@/lib/services/content";
import {
  ArrowRight01Icon,
  GraduationScrollIcon,
  Money01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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

function monogram(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /[A-Za-z]/.test(w[0] ?? ""))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
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

  const location = [university.city, (university as { countries?: { name: string } }).countries?.name]
    .filter(Boolean)
    .join(", ");

  return (
    <PageLayout>
      <PageHeader
        eyebrow="University"
        eyebrowIcon={GraduationScrollIcon}
        title={university.name!}
        description={location}
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SurfaceCard hover={false} padding="lg" className="flex-row items-center gap-4">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl border bg-muted/50 text-lg font-bold text-primary">
              {monogram(university.name!)}
            </span>
            <div>
              <p className="text-sm text-muted-foreground">{location}</p>
              {university.ranking && (
                <p className="mt-1 text-sm font-medium">World ranking: {university.ranking}</p>
              )}
            </div>
          </SurfaceCard>

          {university.description && (
            <SurfaceCard hover={false} padding="lg">
              <h2 className="text-lg font-semibold">About</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{university.description}</p>
            </SurfaceCard>
          )}

          {university.requirements && (
            <SurfaceCard hover={false} padding="lg">
              <h2 className="text-lg font-semibold">Entry Requirements</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{university.requirements}</p>
            </SurfaceCard>
          )}

          {courses.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-semibold">Available Courses</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {courses.map((c) => (
                  <CourseCard
                    key={c.id}
                    slug={c.slug}
                    title={c.title}
                    degreeLevel={c.degree_level}
                    subjectArea={c.subject_area}
                    tuitionFee={c.tuition_fee}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <SurfaceCard hover={false} padding="lg" className="sticky top-24">
            {university.tuition_min && (
              <div className="flex items-start gap-3">
                <HugeiconsIcon icon={Money01Icon} className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Annual tuition</p>
                  <p className="text-lg font-bold text-primary">
                    ${university.tuition_min.toLocaleString()} – $
                    {university.tuition_max?.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
            <Button asChild className="mt-6 w-full">
              <Link href={ROUTES.contact}>
                Apply with Abroadly
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="mt-2 w-full">
              <Link href={ROUTES.eligibilityChecker}>Check eligibility</Link>
            </Button>
          </SurfaceCard>
        </aside>
      </div>
    </PageLayout>
  );
}

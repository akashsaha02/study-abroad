import { Button } from "antd";
import { CoverImage } from "@/components/common/CoverImage";
import { PageLayout } from "@/components/common/PageLayout";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { CourseCard } from "@/features/catalog/components/CourseCard";
import { buildMetadata } from "@/components/seo/PageSEO";
import { ROUTES } from "@/constants";
import { buildLeadContextUrl } from "@/features/leads/urls";
import { FALLBACK_UNIVERSITIES } from "@/data/fallback";
import { Link } from "@/i18n/navigation";
import { getUniversityImage } from "@/lib/images/public-assets";
import { getPublishedCourses, getUniversityBySlug } from "@/features/catalog/queries";
import { ArrowRight01Icon, Money01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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

  const heroImage = getUniversityImage({
    slug: university.slug,
    logo_url: university.logo_url,
  });

  const countrySlug = (university as { countries?: { slug?: string } }).countries?.slug;
  const contactHref = buildLeadContextUrl(ROUTES.contact, {
    university: university.slug,
    country: countrySlug,
  });

  return (
    <PageLayout>
      <div className="relative mb-8 overflow-hidden rounded-3xl">
        <CoverImage
          src={heroImage}
          alt={university.name!}
          className="h-48 md:h-56"
          priority
          fallback={
            <span className="text-3xl font-bold text-primary">
              {monogram(university.name!)}
            </span>
          }
        />
        <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
          <p className="text-sm font-medium text-primary">University</p>
          <h1 className="text-2xl font-bold md:text-3xl">{university.name}</h1>
          <p className="mt-1 text-muted-foreground">{location}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {university.ranking && (
            <SurfaceCard hover={false} padding="lg">
              <p className="text-sm font-medium">World ranking: {university.ranking}</p>
            </SurfaceCard>
          )}

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
            <Link href={contactHref}>
          <Button className="mt-6 w-full">
                Apply with Abroadly
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" data-icon="inline-end" />
              </Button>
        </Link>
            <Link href={ROUTES.eligibilityChecker}>
          <Button  className="mt-2 w-full">Check eligibility</Button>
        </Link>
          </SurfaceCard>
        </aside>
      </div>
    </PageLayout>
  );
}

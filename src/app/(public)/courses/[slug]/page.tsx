import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { buildMetadata } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { getCourseBySlug } from "@/lib/services/content";
import {
  ArrowRight01Icon,
  BookOpen01Icon,
  Clock01Icon,
  Globe02Icon,
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
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Course Not Found" };

  const university = course.universities as { name?: string; countries?: { name?: string } };
  return buildMetadata({
    title: course.title,
    description: `${course.degree_level ?? "Program"} at ${university?.name ?? "partner university"}.`,
    path: `/courses/${slug}`,
  });
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const university = course.universities as {
    name?: string;
    slug?: string;
    countries?: { name?: string; slug?: string };
  };

  const details = [
    { label: "Degree", value: course.degree_level, icon: BookOpen01Icon },
    { label: "Subject", value: course.subject_area, icon: Globe02Icon },
    { label: "Duration", value: course.duration, icon: Clock01Icon },
    { label: "Language", value: course.language_requirement, icon: Globe02Icon },
  ].filter((d) => d.value);

  return (
    <PageLayout>
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {university?.countries?.slug && (
          <>
            <Link href={ROUTES.studyIn(university.countries.slug)} className="hover:text-foreground">
              {university.countries.name}
            </Link>
            <span>/</span>
          </>
        )}
        {university?.slug && (
          <>
            <Link href={`${ROUTES.universities}/${university.slug}`} className="hover:text-foreground">
              {university.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-foreground">{course.title}</span>
      </nav>

      <PageHeader
        eyebrow="Course"
        eyebrowIcon={BookOpen01Icon}
        title={course.title}
        description={[university?.name, university?.countries?.name].filter(Boolean).join(" · ")}
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {details.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {details.map((d) => (
                <SurfaceCard key={d.label} hover={false} padding="md">
                  <div className="flex items-center gap-3">
                    <HugeiconsIcon icon={d.icon} className="size-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">{d.label}</p>
                      <p className="font-semibold">{d.value}</p>
                    </div>
                  </div>
                </SurfaceCard>
              ))}
            </div>
          )}

          {course.academic_requirement && (
            <SurfaceCard hover={false} padding="lg">
              <h2 className="text-lg font-semibold">Academic requirements</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{course.academic_requirement}</p>
            </SurfaceCard>
          )}
        </div>

        <aside>
          <SurfaceCard hover={false} padding="lg" className="sticky top-24">
            {course.tuition_fee && (
              <div className="flex items-start gap-3">
                <HugeiconsIcon icon={Money01Icon} className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Annual tuition</p>
                  <p className="text-2xl font-bold text-primary">
                    ${course.tuition_fee.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
            {university?.slug && (
              <Button variant="outline" asChild className="mt-6 w-full">
                <Link href={`${ROUTES.universities}/${university.slug}`}>View university</Link>
              </Button>
            )}
            <Button asChild className="mt-2 w-full">
              <Link href={ROUTES.contact}>
                Apply with Abroadly
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" data-icon="inline-end" />
              </Link>
            </Button>
          </SurfaceCard>
        </aside>
      </div>
    </PageLayout>
  );
}

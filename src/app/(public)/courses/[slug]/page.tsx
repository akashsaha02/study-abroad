import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { buildMetadata } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { getCourseBySlug } from "@/lib/services/content";
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

  return (
    <Container className="py-12">
      <nav className="mb-6 text-sm text-muted-foreground">
        {university?.countries?.slug && (
          <>
            <Link href={ROUTES.studyIn(university.countries.slug)} className="hover:text-foreground">
              {university.countries.name}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        {university?.slug && (
          <>
            <Link href={`${ROUTES.universities}/${university.slug}`} className="hover:text-foreground">
              {university.name}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-foreground">{course.title}</span>
      </nav>

      <PageHeader
        title={course.title}
        description={[university?.name, university?.countries?.name].filter(Boolean).join(" · ")}
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="grid gap-3 sm:grid-cols-2">
            {course.degree_level && (
              <p className="text-sm">
                <span className="font-medium">Degree:</span> {course.degree_level}
              </p>
            )}
            {course.subject_area && (
              <p className="text-sm">
                <span className="font-medium">Subject:</span> {course.subject_area}
              </p>
            )}
            {course.duration && (
              <p className="text-sm">
                <span className="font-medium">Duration:</span> {course.duration}
              </p>
            )}
            {course.language_requirement && (
              <p className="text-sm">
                <span className="font-medium">Language:</span> {course.language_requirement}
              </p>
            )}
          </section>
          {course.academic_requirement && (
            <section>
              <h2 className="text-lg font-semibold">Academic requirements</h2>
              <p className="mt-2 text-muted-foreground">{course.academic_requirement}</p>
            </section>
          )}
        </div>
        <div className="space-y-4">
          {course.tuition_fee && (
            <p className="text-sm">
              Tuition: <span className="font-semibold text-primary">${course.tuition_fee.toLocaleString()}/year</span>
            </p>
          )}
          {university?.slug && (
            <Button variant="outline" asChild className="w-full">
              <Link href={`${ROUTES.universities}/${university.slug}`}>View university</Link>
            </Button>
          )}
          <Button asChild className="w-full">
            <Link href={ROUTES.contact}>Apply with Abroadly</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}

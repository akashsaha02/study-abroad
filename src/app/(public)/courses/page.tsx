import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { CourseFilters } from "@/components/public/CourseFilters";
import { buildMetadata } from "@/components/seo/PageSEO";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import { getPublishedCountries, getPublishedCourses } from "@/lib/services/content";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = buildMetadata({
  title: "Courses",
  description: "Find courses at partner universities worldwide.",
  path: "/courses",
});

interface Props {
  searchParams: Promise<{ country?: string; degree?: string }>;
}

export default async function CoursesPage({ searchParams }: Props) {
  const { country, degree } = await searchParams;
  const [countries, courses] = await Promise.all([
    getPublishedCountries(),
    getPublishedCourses({
      countryId: country,
      degreeLevel: degree,
    }),
  ]);

  const degreeLevels = [
    ...new Set(courses.map((c) => c.degree_level).filter(Boolean) as string[]),
  ].sort();

  return (
    <Container className="py-12">
      <PageHeader
        title="Courses"
        description="Browse available programs across our partner universities."
      />
      <Suspense fallback={null}>
        <CourseFilters countries={countries} degreeLevels={degreeLevels} />
      </Suspense>
      {courses.length === 0 ? (
        <EmptyState
          title="No courses listed yet"
          description="Try adjusting filters or check back once more programs are published."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {courses.map((course) => {
            const university = course.universities as {
              name?: string;
              slug?: string;
              countries?: { name?: string; slug?: string };
            };
            return (
              <Link key={course.id} href={`${ROUTES.courses}/${course.slug}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {university?.name}
                      {university?.countries?.name ? ` · ${university.countries.name}` : ""}
                    </p>
                    <p className="mt-2 text-sm">
                      {course.degree_level} · {course.subject_area}
                    </p>
                    {course.tuition_fee && (
                      <p className="mt-1 text-sm text-primary">
                        ${course.tuition_fee.toLocaleString()}/year
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </Container>
  );
}

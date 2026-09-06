import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { CourseCard } from "@/features/catalog/components/CourseCard";
import { CourseFilters } from "@/features/catalog/components/CourseFilters";
import { buildMetadata } from "@/components/seo/PageSEO";
import { getPublishedCountries, getPublishedCourses } from "@/features/catalog/queries";
import { GraduationScrollIcon } from "@hugeicons/core-free-icons";
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
    getPublishedCourses({ countryId: country, degreeLevel: degree }),
  ]);

  const degreeLevels = [
    ...new Set(courses.map((c) => c.degree_level).filter(Boolean) as string[]),
  ].sort();

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Programs"
        eyebrowIcon={GraduationScrollIcon}
        title="Courses & programs"
        description="Browse published programs across our partner universities."
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
        <div className="grid gap-5 md:grid-cols-2">
          {courses.map((course) => {
            const university = course.universities as {
              name?: string;
              countries?: { name?: string };
            };
            return (
              <CourseCard
                key={course.id}
                slug={course.slug!}
                title={course.title}
                universityName={university?.name}
                countryName={university?.countries?.name}
                degreeLevel={course.degree_level}
                subjectArea={course.subject_area}
                tuitionFee={course.tuition_fee}
              />
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}

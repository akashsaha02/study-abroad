import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { buildMetadata } from "@/components/seo/PageSEO";
import { Card, CardContent } from "@/components/ui/card";
import { getPublishedCourses } from "@/lib/services/content";

export const metadata = buildMetadata({
  title: "Courses",
  description: "Find courses at partner universities worldwide.",
  path: "/courses",
});

export default async function CoursesPage() {
  const courses = await getPublishedCourses();

  return (
    <Container className="py-12">
      <PageHeader
        title="Courses"
        description="Browse available programs across our partner universities."
      />
      {courses.length === 0 ? (
        <EmptyState
          title="No courses listed yet"
          description="Courses will appear here once published by admin."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardContent className="p-6">
                <h3 className="font-semibold">{course.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {(course.universities as { name?: string })?.name}
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
          ))}
        </div>
      )}
    </Container>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import type { Testimonial } from "@/types";
import { Section } from "../common/Section";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <Section variant="muted">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold">Success Stories</h2>
        <p className="mt-2 text-muted-foreground">
          Hear from students who achieved their dreams
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <Card key={t.id}>
            <CardContent className="p-6">
              <p className="text-sm italic text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-4">
                <p className="font-semibold">{t.student_name}</p>
                <p className="text-sm text-muted-foreground">
                  {t.university_name} · {t.destination_country}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

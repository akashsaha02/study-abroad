import { SectionHeader } from "@/components/common/SectionHeader";
import { Badge } from "@/components/ui/badge";
import type { Testimonial } from "@/types";
import {
  Message01Icon,
  QuoteUpIcon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Section } from "../common/Section";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

function initials(name?: string) {
  if (!name) return "S";
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  return (
    <Section variant="muted">
      <SectionHeader
        eyebrow="Success stories"
        eyebrowIcon={Message01Icon}
        title="Students who made it abroad"
        description="Real journeys from students we've guided from first inquiry to visa approval."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => {
          const university =
            (t as { universities?: { name?: string } }).universities?.name ??
            t.university_name ??
            "University";
          const country =
            (t as { countries?: { name?: string } }).countries?.name ??
            t.destination_country ??
            "Abroad";
          return (
            <figure
              key={t.id}
              className="flex flex-col rounded-2xl border bg-card p-6 ring-1 ring-foreground/5 transition-shadow duration-200 hover:shadow-lg"
            >
              <HugeiconsIcon
                icon={QuoteUpIcon}
                className="size-7 text-primary/25"
              />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/90">
                {t.quote}
              </blockquote>
              <div className="mt-5 flex items-center gap-3 border-t pt-4">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {initials(t.student_name)}
                </span>
                <figcaption className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {t.student_name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {university} · {country}
                  </p>
                </figcaption>
                <Badge variant="secondary" className="ml-auto gap-1">
                  <HugeiconsIcon
                    icon={StarIcon}
                    className="size-3 text-amber-500"
                  />
                  5.0
                </Badge>
              </div>
            </figure>
          );
        })}
      </div>
    </Section>
  );
}

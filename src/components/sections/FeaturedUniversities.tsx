import { SectionHeader } from "@/components/common/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import type { University } from "@/types";
import {
  ArrowRight01Icon,
  StarIcon,
  UniversityIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Section } from "../common/Section";

interface FeaturedUniversitiesProps {
  universities: Partial<University>[];
}

function monogram(name?: string) {
  if (!name) return "U";
  return name
    .split(/\s+/)
    .filter((w) => /[A-Za-z]/.test(w[0] ?? ""))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export function FeaturedUniversities({
  universities,
}: FeaturedUniversitiesProps) {
  return (
    <Section variant="muted">
      <SectionHeader
        align="left"
        eyebrow="Partners"
        eyebrowIcon={UniversityIcon}
        title="Featured universities"
        description="A selection of our top partner institutions worldwide."
        action={
          <Button variant="outline" asChild>
            <Link href={ROUTES.universities}>
              View all
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="size-4"
                data-icon="inline-end"
              />
            </Link>
          </Button>
        }
      />
      <div className="grid gap-5 md:grid-cols-3">
        {universities.map((uni) => (
          <Link
            key={uni.slug}
            href={`${ROUTES.universities}/${uni.slug}`}
            className="group flex flex-col rounded-2xl border bg-card p-6 ring-1 ring-foreground/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-12 items-center justify-center rounded-xl border bg-muted/50 text-sm font-bold text-primary">
                {monogram(uni.name)}
              </span>
              {uni.ranking && (
                <Badge variant="outline" className="gap-1">
                  <HugeiconsIcon icon={StarIcon} className="size-3" />
                  {uni.ranking}
                </Badge>
              )}
            </div>
            <h3 className="mt-4 font-semibold">{uni.name}</h3>
            <p className="text-sm text-muted-foreground">{uni.city}</p>
            {uni.tuition_min && (
              <p className="mt-3 text-sm font-medium text-primary">
                From ${uni.tuition_min.toLocaleString()}/year
              </p>
            )}
          </Link>
        ))}
      </div>
    </Section>
  );
}

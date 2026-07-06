import { ArrowRight01Icon } from "@/constants/nav-icons";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import type { University } from "@/types";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Section } from "../common/Section";

interface FeaturedUniversitiesProps {
  universities: Partial<University>[];
}

export function FeaturedUniversities({ universities }: FeaturedUniversitiesProps) {
  return (
    <Section variant="muted">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold">Featured Universities</h2>
          <p className="mt-2 text-muted-foreground">
            Top partner institutions worldwide
          </p>
        </div>
        <Link
          href={ROUTES.universities}
          className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
        >
          View all
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {universities.map((uni) => (
          <Link key={uni.slug} href={`${ROUTES.universities}/${uni.slug}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold">{uni.name}</h3>
                <p className="text-sm text-muted-foreground">{uni.city}</p>
                {uni.ranking && (
                  <p className="mt-2 text-sm font-medium text-primary">
                    {uni.ranking}
                  </p>
                )}
                {uni.tuition_min && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    From ${uni.tuition_min.toLocaleString()}/year
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}

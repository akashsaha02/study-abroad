import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import type { Country } from "@/types";
import Link from "next/link";
import { Section } from "../common/Section";

interface PopularDestinationsProps {
  countries: Partial<Country>[];
}

export function PopularDestinations({ countries }: PopularDestinationsProps) {
  return (
    <Section>
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold">Popular Destinations</h2>
        <p className="mt-2 text-muted-foreground">
          Explore top study abroad destinations
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((country) => (
          <Link key={country.slug} href={ROUTES.studyIn(country.slug!)}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">{country.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {country.description}
                </p>
                {country.tuition_min && (
                  <p className="mt-3 text-sm font-medium text-primary">
                    From ${country.tuition_min.toLocaleString()}/year
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

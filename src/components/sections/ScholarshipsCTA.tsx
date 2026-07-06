import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import Link from "next/link";
import { Section } from "../common/Section";

export function ScholarshipsCTA() {
  return (
    <Section>
      <div className="rounded-2xl border bg-gradient-to-r from-primary/10 to-accent/20 p-8 md:p-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold">Find Scholarships</h2>
          <p className="mt-4 text-muted-foreground">
            Discover funding opportunities that match your profile. Many of our
            partner universities offer scholarships for international students.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href={ROUTES.scholarships}>Browse Scholarships</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={ROUTES.costCalculator}>Estimate Costs</Link>
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

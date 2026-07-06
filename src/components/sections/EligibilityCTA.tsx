import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import Link from "next/link";
import { Section } from "../common/Section";

export function EligibilityCTA() {
  return (
    <Section variant="primary">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold">Not Sure Where to Start?</h2>
        <p className="mt-4 text-primary-foreground/80">
          Take our free eligibility check and get personalized country and
          university recommendations in minutes.
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="mt-8"
          asChild
        >
          <Link href={ROUTES.eligibilityChecker}>Check Your Eligibility</Link>
        </Button>
      </div>
    </Section>
  );
}

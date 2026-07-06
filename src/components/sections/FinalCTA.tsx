import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import Link from "next/link";
import { Section } from "../common/Section";

export function FinalCTA() {
  return (
    <Section className="pb-24">
      <div className="rounded-2xl bg-primary px-8 py-16 text-center text-primary-foreground md:px-16">
        <h2 className="text-3xl font-bold">Ready to Start Your Journey?</h2>
        <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
          Book a free consultation with our expert counselors and take the first
          step toward your international education.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" variant="secondary" asChild>
            <Link href={ROUTES.contact}>Book Free Consultation</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            asChild
          >
            <Link href={ROUTES.eligibilityChecker}>Check Eligibility</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}

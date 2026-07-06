import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import Link from "next/link";
import { Section } from "../common/Section";

export function HeroSection() {
  return (
    <Section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-accent/20" />
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-medium text-primary">
          Trusted by 5,000+ students worldwide
        </p>
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
          Study Abroad with{" "}
          <span className="text-primary">Confidence</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground md:text-xl">
          Find the right country, university, scholarship, and application path
          with expert guidance from start to visa.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link href={ROUTES.eligibilityChecker}>Check Your Eligibility</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href={ROUTES.contact}>Book Free Consultation</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}

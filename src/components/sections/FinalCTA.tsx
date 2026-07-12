import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/Container";
import { ROUTES } from "@/constants";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="pb-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground md:px-16">
          <div className="absolute inset-0 z-0 bg-grid opacity-10" aria-hidden />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
              Ready to start your journey?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-primary-foreground/80 md:text-lg">
              Book a free consultation with our expert counselors and take the
              first step toward your international education.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href={ROUTES.contact}>
                  Book free consultation
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className="size-4"
                    data-icon="inline-end"
                  />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link href={ROUTES.eligibilityChecker}>Check eligibility</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

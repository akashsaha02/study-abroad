import { Container } from "@/components/common/Container";
import { ROUTES } from "@/constants";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight01Icon,
  FileValidationIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "antd";

export function EligibilityCTA() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-primary-foreground md:px-16">
          <div className="absolute inset-0 z-0 bg-grid opacity-10" aria-hidden />
          <div className="relative mx-auto max-w-2xl text-center">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary-foreground/15">
              <HugeiconsIcon icon={FileValidationIcon} className="size-6" />
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-balance md:text-4xl">
              Not sure where to start?
            </h2>
            <p className="mt-4 text-pretty text-primary-foreground/80 md:text-lg">
              Take our free eligibility check and get personalized country and
              university recommendations in minutes.
            </p>
            <Link href={ROUTES.eligibilityChecker}>
              <Button
                size="large"
                className="mt-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Check your eligibility
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-4"
                  data-icon="inline-end"
                />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

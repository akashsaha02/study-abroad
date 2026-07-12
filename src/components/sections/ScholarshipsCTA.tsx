import { Container } from "@/components/common/Container";
import { IconBadge } from "@/components/common/IconBadge";
import { ROUTES } from "@/constants";
import { Link } from "@/i18n/navigation";
import { Calculator01Icon, StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "antd";

export function ScholarshipsCTA() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl border bg-linear-to-br from-primary/8 via-card to-emerald-500/10 p-8 ring-1 ring-foreground/5 md:grid-cols-[1fr_auto] md:p-12">
          <div className="max-w-xl">
            <IconBadge icon={StarIcon} tone="amber" size="lg" />
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-balance">
              Find scholarships that fit you
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
              Discover funding opportunities matched to your profile. Many of our
              partner universities offer scholarships for international students.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <Link href={ROUTES.scholarships}>
              <Button type="primary" size="large">
                Browse scholarships
              </Button>
            </Link>
            <Link href={ROUTES.costCalculator}>
              <Button size="large">
                <HugeiconsIcon
                  icon={Calculator01Icon}
                  className="size-4"
                  data-icon="inline-start"
                />
                Estimate costs
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

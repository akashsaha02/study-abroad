import { Container } from "@/components/common/Container";
import { ROUTES } from "@/constants";
import { Link } from "@/i18n/navigation";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "antd";
import { getTranslations } from "next-intl/server";

export async function FinalCTA() {
  const t = await getTranslations("home.cta");

  return (
    <section className="relative pb-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground md:px-16">
          <div className="absolute inset-0 z-0 bg-mesh opacity-40" aria-hidden />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
              {t("title")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-primary-foreground/80 md:text-lg">
              {t("description")}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href={ROUTES.contact}>
                <Button
                  size="large"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  {t("consultation")}
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className="size-4"
                    data-icon="inline-end"
                  />
                </Button>
              </Link>
              <Link href={ROUTES.eligibilityChecker}>
                <Button
                  size="large"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  {t("eligibility")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

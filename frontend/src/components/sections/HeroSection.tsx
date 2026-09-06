import { Eyebrow } from "@/components/common/Eyebrow";
import { Container } from "@/components/common/Container";
import { ROUTES } from "@/constants";
import { Link } from "@/i18n/navigation";
import { ArrowRight01Icon, StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "antd";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export async function HeroSection() {
  const t = await getTranslations("home.hero");

  return (
    <section className="relative flex min-h-[min(60vh,720px)] md:min-h-[min(80vh,720px)] lg:min-h-[min(90vh,720px)] items-center overflow-hidden">
      <Image
        src="/images/hero_img.png"
        alt={t("imageAlt")}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* <div
        className="absolute inset-0 bg-linear-to-r from-background via-background/92 to-background/55 dark:from-background dark:via-background/95 dark:to-background/70"
        aria-hidden
      /> */}
      <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />

      <Container className="relative z-10 py-20 md:py-28">
        <div className="max-w-2xl animate-fade-in-up">
          <Eyebrow icon={StarIcon}>{t("eyebrow")}</Eyebrow>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
            {t("title")}{" "}
            <span className="text-primary">{t("titleHighlight")}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-pretty text-muted-foreground md:text-xl">
            {t("subtitle")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={ROUTES.eligibilityChecker}>
              <Button type="primary" size="large">
                {t("ctaEligibility")}
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-4"
                  data-icon="inline-end"
                />
              </Button>
            </Link>
            <Link href={ROUTES.bookConsultation}>
              <Button size="large">{t("ctaConsultation")}</Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

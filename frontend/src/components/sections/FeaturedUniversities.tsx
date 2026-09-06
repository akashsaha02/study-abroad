import { CoverImage } from "@/components/common/CoverImage";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Container } from "@/components/common/Container";
import { DecorativeBackground } from "@/components/common/DecorativeBackground";
import { ROUTES } from "@/constants";
import { Link } from "@/i18n/navigation";
import { getUniversityImage } from "@/lib/images/public-assets";
import type { University } from "@/types";
import {
  ArrowRight01Icon,
  StarIcon,
  UniversityIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Tag } from "antd";
import { getTranslations } from "next-intl/server";

interface FeaturedUniversitiesProps {
  universities: Partial<University>[];
}

function monogram(name?: string) {
  if (!name) return "U";
  return name
    .split(/\s+/)
    .filter((w) => /[A-Za-z]/.test(w[0] ?? ""))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export async function FeaturedUniversities({
  universities,
}: FeaturedUniversitiesProps) {
  const t = await getTranslations("home.universities");

  if (universities.length === 0) return null;

  return (
    <DecorativeBackground variant="primary" className="py-16 md:py-24">
      <Container>
        <SectionHeader
          align="left"
          eyebrow={t("eyebrow")}
          eyebrowIcon={UniversityIcon}
          title={t("title")}
          description={t("description")}
          action={
            <Link href={ROUTES.universities}>
              <Button>
                {t("viewAll")}
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-4"
                  data-icon="inline-end"
                />
              </Button>
            </Link>
          }
        />
        <div className="stagger-children grid gap-5 md:grid-cols-3">
          {universities.map((uni) => {
            const imageSrc = getUniversityImage(uni);
            return (
              <Link
                key={uni.slug}
                href={`${ROUTES.universities}/${uni.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border bg-card ring-1 ring-foreground/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <CoverImage
                  src={imageSrc}
                  alt={uni.name ?? "University"}
                  className="h-32"
                  fallback={
                    <span className="text-xl font-bold text-primary">
                      {monogram(uni.name)}
                    </span>
                  }
                />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold">{uni.name}</h3>
                    {uni.ranking && (
                      <Tag className="gap-1">
                        <HugeiconsIcon icon={StarIcon} className="size-3" />
                        {uni.ranking}
                      </Tag>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{uni.city}</p>
                  {uni.tuition_min && (
                    <p className="mt-3 text-sm font-medium text-primary">
                      {t("fromPerYear", {
                        price: uni.tuition_min.toLocaleString(),
                      })}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </DecorativeBackground>
  );
}

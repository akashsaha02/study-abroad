import { DecorativeBackground } from "@/components/common/DecorativeBackground";
import { IconBadge } from "@/components/common/IconBadge";
import { SectionHeader } from "@/components/common/SectionHeader";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { Container } from "@/components/common/Container";
import {
  Calendar01Icon,
  FileValidationIcon,
  GraduationScrollIcon,
  PassportIcon,
  RocketIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { getTranslations } from "next-intl/server";

type Tone = "sky" | "violet" | "success" | "amber";

const stepConfig: {
  step: string;
  icon: IconSvgElement;
  tone: Tone;
  titleKey: "step1Title" | "step2Title" | "step3Title" | "step4Title";
  descKey: "step1Desc" | "step2Desc" | "step3Desc" | "step4Desc";
}[] = [
  { step: "01", icon: FileValidationIcon, tone: "sky", titleKey: "step1Title", descKey: "step1Desc" },
  { step: "02", icon: Calendar01Icon, tone: "violet", titleKey: "step2Title", descKey: "step2Desc" },
  { step: "03", icon: GraduationScrollIcon, tone: "success", titleKey: "step3Title", descKey: "step3Desc" },
  { step: "04", icon: PassportIcon, tone: "amber", titleKey: "step4Title", descKey: "step4Desc" },
];

export async function HowItWorks() {
  const t = await getTranslations("home.howItWorks");

  return (
    <DecorativeBackground variant="primary" className="py-16 md:py-24">
      <Container>
        <SectionHeader
          eyebrow={t("eyebrow")}
          eyebrowIcon={RocketIcon}
          title={t("title")}
          description={t("description")}
        />

        <div className="stagger-children grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stepConfig.map((item) => (
            <SurfaceCard key={item.step} hover={false} variant="glass" padding="lg">
              <div className="flex items-center justify-between">
                <IconBadge icon={item.icon} tone={item.tone} />
                <span className="text-2xl font-bold text-primary/15">{item.step}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{t(item.titleKey)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(item.descKey)}</p>
            </SurfaceCard>
          ))}
        </div>
      </Container>
    </DecorativeBackground>
  );
}

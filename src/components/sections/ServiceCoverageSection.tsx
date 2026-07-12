import { DecorativeBackground } from "@/components/common/DecorativeBackground";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ServiceCoverageMap } from "@/components/sections/ServiceCoverageMap";
import { Globe02Icon } from "@hugeicons/core-free-icons";
import { getTranslations } from "next-intl/server";

export async function ServiceCoverageSection() {
  const t = await getTranslations("home.serviceMap");

  return (
    <DecorativeBackground variant="default" className="py-16 md:py-24">
      <Container>
        <SectionHeader
          eyebrow={t("eyebrow")}
          eyebrowIcon={Globe02Icon}
          title={t("title")}
          description={t("description")}
        />
        <ServiceCoverageMap exploreLabel={t("explore")} />
      </Container>
    </DecorativeBackground>
  );
}

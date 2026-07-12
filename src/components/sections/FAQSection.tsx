import { DecorativeBackground } from "@/components/common/DecorativeBackground";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import type { Faq } from "@/types";
import { HelpCircleIcon } from "@hugeicons/core-free-icons";
import { Collapse } from "antd";
import { getTranslations } from "next-intl/server";

interface FAQSectionProps {
  faqs: Faq[];
}

export async function FAQSection({ faqs }: FAQSectionProps) {
  const t = await getTranslations("home.faq");

  return (
    <DecorativeBackground variant="muted" className="py-16 md:py-24">
      <Container>
        <SectionHeader
          eyebrow={t("eyebrow")}
          eyebrowIcon={HelpCircleIcon}
          title={t("title")}
          description={t("description")}
        />
        <div className="mx-auto max-w-3xl">
          <Collapse
            className="bg-card/90 ring-1 ring-foreground/5 backdrop-blur-sm"
            items={faqs.map((faq) => ({
              key: faq.id,
              label: <span className="font-medium">{faq.question}</span>,
              children: <p className="text-muted-foreground">{faq.answer}</p>,
            }))}
          />
        </div>
      </Container>
    </DecorativeBackground>
  );
}

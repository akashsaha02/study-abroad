import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeader } from "@/components/common/SectionHeader";
import type { Faq } from "@/types";
import { HelpCircleIcon } from "@hugeicons/core-free-icons";
import { Section } from "../common/Section";

interface FAQSectionProps {
  faqs: Faq[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  return (
    <Section>
      <SectionHeader
        eyebrow="FAQ"
        eyebrowIcon={HelpCircleIcon}
        title="Frequently asked questions"
        description="Everything you need to know about studying abroad with Abroadly."
      />
      <div className="mx-auto max-w-3xl">
        <Accordion type="single" collapsible className="bg-card ring-1 ring-foreground/5">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Faq } from "@/types";
import { Section } from "../common/Section";

interface FAQSectionProps {
  faqs: Faq[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  return (
    <Section>
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
        <p className="mt-2 text-muted-foreground">
          Everything you need to know about studying abroad
        </p>
      </div>
      <div className="mx-auto max-w-2xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}

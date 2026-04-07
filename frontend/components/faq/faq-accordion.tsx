"use client";

import type { FaqItem } from "@/lib/api/faq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <Accordion type="multiple" className="space-y-3">
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          value={String(item.id)}
          className="border-border-subtle bg-surface rounded-[24px] border px-6 last:border-b"
        >
          <AccordionTrigger className="py-5 text-base font-semibold hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-ink/72 text-sm leading-7">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

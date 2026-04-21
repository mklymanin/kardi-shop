import { LeadForm } from "@/components/lead/lead-form";
import { FadeInSection } from "@/components/motion/fade-in-section";

export default function ContactPage() {
  return (
    <FadeInSection className="mx-auto max-w-4xl px-6 py-12" amount={0.1}>
      <h1 className="text-4xl font-semibold">Контакты</h1>
      <p className="text-ink/70 mt-4">
        Оставьте заявку, и менеджер свяжется с вами в рабочее время.
      </p>
      <LeadForm source="contact-page" />
    </FadeInSection>
  );
}

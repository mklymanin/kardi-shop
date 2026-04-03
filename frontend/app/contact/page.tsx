import { LeadForm } from "@/components/lead/lead-form";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-4xl font-semibold">Контакты</h1>
      <p className="text-ink/70 mt-4">
        Оставьте заявку, и менеджер свяжется с вами в рабочее время.
      </p>
      <LeadForm source="contact-page" />
    </div>
  );
}
